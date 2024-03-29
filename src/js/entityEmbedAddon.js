var EntityEmbed = EntityEmbed || {};

;(function ($, window, document, undefined) {

	'use strict';

	/** Default values */
	var pluginName = 'mediumInsert',
		addonName = 'EntityEmbeds', // name of the Medium Editor Insert Plugin
		activeEmbedClass = 'entity-embed-active',	// class name given to active (selected) embeds
		embedClassPrefix = 'entity-embed-',
		mediumEditorActiveSelector = '.medium-insert-active', // selector for the medium editor active class
		entityEmbedEditorLineClass = 'entity-embed-editor-line', // class name given to a line (<p> element) in the editor on which an entity is embedded
		entityEmbedContainerClass = 'entity-embed-container', // class name given to the objects which contain entity embeds
		defaults = {
			label: '<span class="fa fa-code"></span>',
			authToken: null,	// for the apiService
			domainName: null,	// for the apiService
			filesDomainName: null,	// for the apiService
			styles: {
				left: {
					label: '<span class="fa fa-align-left"></span>',
					added: function ($el) {
						$el.addClass('clearfix');
					},
					removed: function ($el) {
						$el.removeClass('clearfix');
					}
				},
				center: {
					label: '<span class="fa fa-align-center"></span>'
					// added: function ($el) {},
					// removed: function ($el) {}
				},
				right: {
					label: '<span class="fa fa-align-right"></span>',
					added: function ($el) {
						$el.addClass('clearfix');
					},
					removed: function ($el) {
						$el.removeClass('clearfix');
					}
				},
				wide: {
					label: '<span class="fa fa-align-justify"></span>'
					// added: function ($el) {},
					// removed: function ($el) {}
				}
			},
			actions: {
				remove: {
					label: '<span class="fa fa-times"></span>',
					clicked: function (entityEmbed, $embed) {
						entityEmbed.removeEmbed($embed);
					}
				},
				edit:{
					label: '<span class="fa fa-cog"></span>',
					clicked: function(entityEmbed, $embed){
						entityEmbed.editEmbed($embed);
					}
				},
				newline:{
					label: '<span class="fa fa-i-cursor"></span>',
					clicked: function(entityEmbed, $embed){
						entityEmbed.addNewline($embed);
					}
				}
			}
		};

	/**
	 * Private method to generate unique placeholder string for serialization.
	 *  This string should:
	 *  		- be recreate able during deserialization using models in the embeds array.
	 *  		- be unique to the point that users would not accidentally enter content that could be interpreted as a placeholder.
	 *  		- namespace to our addon to not conflict with others that may have had the same idea.
	 *  		- provide an explicite identifier for the embed to be inserted.
	 *  		- provide index pointer so styling data can be preserved in cases where the same embed is place multiple times but styled differently.
	 * @param  {Object} embed Embed model data. Should contain keys:
	 *                        id - Embed's API object_id
	 *                        index: Nth position it was found in the content
	 * @return {String}       Placeholder string unique the the embed being serialized/inserted
	 */
	function generatePlaceholderString(embed) {
		var placeholder, placeholderKey,
			placeholderPrefix = '[[',
			placeholderSuffix = ']]';

		// Construct our placeholder key string
		placeholderKey = [
			addonName,
			embed.index,
			embed.id
		].join(':');

		// Construct placeholder by wrapping with prefix and suffix
		placeholder = [
			placeholderPrefix,
			placeholderKey,
			placeholderSuffix
		].join('');

		return placeholder;
	}

	/**
	 * Private function to get a clopy of an embed type object by object_type value.
	 * @param  {String} objectType API object_type name
	 * @return {Object}            Initialized embed type object from EntityEmbed.currentEmbedTypes or undefined if not found.
	 */
	function getEmbedTypeByObjectType(objectType, embedTypes) {
		var embedType = $.grep(embedTypes, function(et){
			return et.options.object_type == objectType;
		})[0];

		return embedType && $.extend(true, {}, embedType);
	}

	function getSelection() {
		var selection;

		if (window.getSelection)
		{
			selection = window.getSelection();
		}
		else if (document.getSelection)
		{
			selection = document.getSelection();
		}
		else if (document.selection)
		{
			selection = document.selection.createRange();
		}

		return selection;
	}

	function moveCaretToEdge(el, atStart) {
		var range, sel;

		el.focus();

		if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
			range = document.createRange();
			sel = window.getSelection();

			range.selectNodeContents(el);
			range.collapse(atStart);

			sel.removeAllRanges();
			sel.addRange(range);
		} else if (typeof document.body.createTextRange != "undefined") {
			range = document.body.createTextRange();

			range.moveToElementText(el);
			range.collapse(atStart);
			range.select();
		}
	}

	/**
	 * Custom Addon object
	 *
	 * Sets options, variables and calls init() function
	 *
	 * @constructor
	 * @param {DOM} el - DOM element to init the plugin on
	 * @param {object} options - Options to override defaults
	 * @return {void}
	 */

	function EntityEmbeds (el, options) {
		var self = this;

		self.el = el;
		self.$el = $(el);
		self.templates = window.MediumInsert.Templates;

		self.core = self.$el.data('plugin_'+ pluginName);

		self.options = $.extend(true, {}, defaults, options);

		self._defaults = defaults;
		self._name = pluginName;

		if(self.$el.attr('readonly') !== undefined)
		{
			self.options.readonly = true;
		}

		self.toolbarManager = new EntityEmbed.toolbarManager(self, self.options.styles, self.options.actions, activeEmbedClass);

		// Extend editor's functions
		if (self.core.getEditor())
		{
			// allow access the EntityEmbeds object by keeping the object on this prototype
			self.core.getEditor().get_content = function(){
				return self.getContent();
			};
			self.core.getEditor().load_content = function(contentData){
				self.loadContent(contentData);
			};
		}

		self.init();
	}

	/**
	 * initialization
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.init = function () {
		var self = this;

		console.log('self.options', self.options);

		if (!!self.options.authToken)
		{
			EntityEmbed.apiService.setAuthToken(self.options.authToken);
		}
		if (!!self.options.domainName)
		{
			EntityEmbed.apiService.setDomainName(self.options.domainName);
		}
		if (!!self.options.filesDomainName)
		{
			EntityEmbed.apiService.setFilesDomainName(self.options.filesDomainName);
		}

		self.toolbarManager.createActionToolbar($('body'));

		if(!self.options.readonly)
		{
			self.$el.sortable({
				handle: '.entity-embed-blocker',
				placeholder: 'entity-embed-placeholder',
				distance: 5,
				start: function (event, ui) {
					var placeholderClasses = [
						ui.placeholder.attr('class'),
						ui.helper.attr('class')
					].join(' ');

					// Update placeholder styling and size to match dragged embed
					ui.placeholder.attr('class', placeholderClasses);
					ui.placeholder.height(ui.helper.outerHeight());
					ui.placeholder.width(ui.helper.width());

					// Hide embed toolbars
					self.toolbarManager.hideToolbar();
				},
				stop: function(event, ui) {
					// Lock item height to placeholder height
					ui.item.height(ui.placeholder.height());

					// Rerender embed
					self.renderEmbed(ui.item, true);

					// Let listeners know content has changed
					self.core.triggerInput();

					// Unlock item height after giving embed time to render
					window.setTimeout(function() {
						ui.item.removeAttr('style');
					}, 2000);
				},
				change: function() {
					// Update position of active MEIP toolbar
					self.core.positionButtons();
					// Updated postion of active ME toolbar
					self.core.getEditor().checkSelection();
				}
			});
		}
		else
		{
			self.core.getEditor().stopSelectionUpdates();
			self.$el.attr('contenteditable', false).attr('readonly', '');
		}

		self.events();

		$.embed_modal_create().done(function($embedModal){
			var modalScope = $embedModal.data('scope');

			self.$embedModal = $embedModal;
			self.embedTypes = modalScope.embedTypes;

			for (var i = 0, m = self.embedTypes.length; i < m; i++)
			{
				self.toolbarManager.createStyleToolbar($('body'), self.embedTypes[i]);
			}
		});
	};

	/**
	 * Event listeners
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.events = function () {
		var self = this;
		var editor = editor = self.core.getEditor();

		function findTopParent($elm) {
			var $parent = $elm.parent();
			if($parent[0] !== self.el)
			{
				return findTopParent($parent);
			}

			return $elm;
		}

		editor.subscribe('editableInput', function(data, editableElm) {
			var badMarkup = [
				'p > ol',
				'p > ul',
				'p > p',
				'p > div'
			].join(',');
			var badStyleSttr = [
				'li > span[style]'
			].join(',');
			var emptyP = '<p><br></p>';
			var $elm = $(editableElm);
			var $badMarkup = $elm.find(badMarkup);
			var $hasStyleAttr = $elm.find(badStyleSttr);

			$badMarkup.each(function() {
				var $this = $(this);
				$this.unwrap();
				editor.selectElement(this);
			});

			$hasStyleAttr.removeAttr('style');

			$elm.find('div > br:only-child').parent().replaceWith(emptyP);

			if( !$elm.children().not('.medium-insert-buttons').length )
			{
				$elm.prepend(emptyP);
			}
		});

		$(window).on('resize', function() {
			var $currentActiveEmbed = $('.' + activeEmbedClass);
			if(!!$currentActiveEmbed.length)
			{
				self.toolbarManager.positionToolbars($currentActiveEmbed);
			}
		});

		$(document)
			// hide toolbar (if active) when clicking anywhere except for toolbar elements
			.on('click', function(e){
				if (!$(e.target).is('.medium-editor-action') &&
					!$(e.target.parentElement).is('.medium-editor-action') &&
					self.$el.find('.' + activeEmbedClass).length != 0)
				{
					$('.' + activeEmbedClass).removeClass(activeEmbedClass);
					self.toolbarManager.hideToolbar();
				}
			});

		self.$el
			// toggle select embed when embed is clicked
			.on('click', '.' + entityEmbedContainerClass, function(e){
				if(!self.options.readonly)
				{
					self.toggleSelectEmbed($(this));
				}
				e.stopPropagation(); // done allow the first onClick event to propagate
			})
			// prevent user from destroying modal functionality when deleting first element
			.on('keydown', function(e){
				var selection, range, textLength, selectionLength, numChildren, isEmptyAnchor, siblingIsEmbed, $anchor, $sibling, $base;
				var protectedElms = ['.entity-embed-container', '[contenteditable]'].join(',');
				var notProtectedElms = ':not(' + protectedElms + ')';

				// Don't do anything if key is not backspace (8) or delete (46)
				// or if caret is in a ext node of editor.
				if(e.which !== 8 && e.which !== 46)
				{
					return;
				}

				selection = getSelection(); // Get current selection

				if(!selection.rangeCount)
				{
					return;
				}

				range = selection.getRangeAt(0); // Get current selected range
				selectionLength = range.endOffset - range.startOffset; // Get length of current selection
				$anchor = $(selection.anchorNode); // Get the element the selection is currently originating from
				textLength = $anchor.text().length;
				numChildren = self.$el.children().not('.medium-insert-buttons').length; // Get number of editors children that are not UI for MEIP
				isEmptyAnchor = false;
				siblingIsEmbed = false;

				if (selectionLength > 0)
				{
					// When removing a range of charcters, the caret doesn't move positions.
					// We don't have to worry about removing a sibling embed now.
					return;
				}

				// If anchor is a text node, query for closest usable parent
				if($anchor[0].nodeType === 3)
				{
					$anchor = $anchor.closest(notProtectedElms);
				}

				$anchor = findTopParent($anchor);

				// Check to see if our anchor element is a p tag with no text
				isEmptyAnchor = $anchor.is(notProtectedElms) && !$anchor.text().length;

				// Get the previous sibling when
				// 	- Backspace is pressed
				// 	- Caret is at the begining of text
				// Get the next sibling when
				// 	- Delete is pressed
				// 	- Caret is at the end of text
				if (e.which === 8 && selection.anchorOffset === 0)
				{
					$sibling = $anchor.prev();
				}
				else if (e.which === 46 && selection.anchorOffset === textLength)
				{
					$sibling = $anchor.next();
				}

				// If we found a sibling, check to see if it is an embed wrapper
				if(!!$sibling)
				{
					siblingIsEmbed = $sibling.is('.' + entityEmbedContainerClass);
					// Make sure sibling has content. MeduimEditor will remove any empty elements up to and including
					if(!$sibling.children().length && !$sibling.text().length)
					{
						$sibling.append('<br>');
					}
				}

				// Prevent default when:
				// 	- Anchor is the last empty p tag
				// 	- A sipling element was found and is and embed
				if ( (isEmptyAnchor && numChildren <= 1) || siblingIsEmbed)
				{
					e.preventDefault();
				}

				//
				if(isEmptyAnchor && numChildren > 1)
				{
					e.preventDefault();

					if(e.which === 8)
					{
						$base = $anchor.prevAll(notProtectedElms).first();
					}
					else if(e.which === 46)
					{
						$base = $anchor.nextAll(notProtectedElms).first();
					}

					// Make sure base element has content so selection process works.
					if(!$base.children().length && !$base.text().length)
					{
						$base.append('<br>');
					}

					// Select the prev/next p's content
					editor.selectElement($base[0]);
					// Move caret to selection edge opision of caret movement from keypress
					moveCaretToEdge($base[0], e.which === 46);
					// Updated editors toolbar state
					editor.checkSelection();

					// Remove empty anchor element
					$anchor.remove();

					// Trigger input event
					self.core.triggerInput();
				}

			})
			// conditionally remove embed
			.on('keydown', function(e){
				// TODO : this will not be fired if the user highlights content and begins typing
				//			could use JQuery UI 'remove' event
				//			or we could just hide the toolbar on any key press
				if (e.which == 8 || e.which == 46) // backspace or delete
				{
					// TODO : this could hide toolbar on another selected embed
					if (self.$el.find('.' + activeEmbedClass).length != 0)
					{
						self.toolbarManager.hideToolbar();
					}
				}
			});
	};

	/**
	 * Get the Core object
	 *
	 * @return {object} Core object
	 */

	EntityEmbeds.prototype.getCore = function () {
		return this.core;
	};


	/**
	 * Get the story data from the editor and serialize it
     *
     * @return {object} Serialized data
     */

	EntityEmbeds.prototype.getContent = function() {
		var self = this;
		var data = self.core.getEditor().serialize();
		var cleanedData = {
			html: '',
			embeds: []
		};

		$.each(data, function(key){
			var $data, $embedContainers;

			$data = $('<div />').html(data[key].value);

			$embedContainers = $data.find('.entity-embed-container', $data);

			// Make sure active class from embed containers before serialization.
			$embedContainers.removeClass(activeEmbedClass);

			// jQuery has a builtin method to iterate over all match elements.
			// Callback is fired in the context of the current element, so the
			// keyword 'this' refers to the element, in this case our embed container.
			$embedContainers.each(function(index) {
				var $this, $embed, embed, placeholder;

				$this = $(this);

				// Find child figure element, which should hold embed's data attributes
				$embed = $this.find('figure');

				// jQuery.each() iteration loop can be stop by returning false. There is no continue equivelant,
				// so we nest our found embed logic in a truthy condition.
				if(!!$embed)
				{
					// Establish embed model
					embed = {
						// Include index expclicitly so reordering of the embeds array doesn't affect insertion.
						index: index,
						// API object_id used to look up complete data for the embed
						id: $embed.attr('id'),
						// Inlcude embed type name so embed can be rendered correctly during deserialization
						type: $embed.attr('data-embed-type')
					};

					// Add embed model to embeds list to be returned
					cleanedData.embeds.push(embed);

					// Construct our placeholder
					placeholder = generatePlaceholderString(embed);

					// Repace container's HTML with placeholder
					$this.html(placeholder);
				} else {
					// This container is missing a figure element and no longer has data to store.
					// Probably occured when a script error prevented proper serialization of embed.
					// Remove from data HTML to clean up DOM and save serilization steps and/or
					// errors later on.
					$this.remove();
				}
			});

			// Append resulting HTML to our returned model
			cleanedData.html += $data.html();
		});

		return cleanedData;
	 };

 	/**
	 * Extend editor to allow dynamic loading of content
	 *
	 * retrieves story by id and loads content into editor
     *
     * @return {void}
     */

	EntityEmbeds.prototype.loadContent = function(contentData) {
		var self = this,
			isString = (typeof contentData === 'string'),
			isHtml = isString && (/<[^>]>/g).test(contentData),
			fullHtml, embedType, usableEmbeds;

		function updateHtml(data) {
			var deferreds;

			if(!data)
			{
				setEditorHtml();
				return;
			}

			fullHtml = data.html || '';

			if(!data.embeds)
			{
				setEditorHtml();
				return;
			}

			usableEmbeds = [];
			deferreds = [];

			// Iterate over returned embeds
			for (var i = 0; i < data.embeds.length; i++)
			{
				// Convert returned type name to a useful embedType object
				embedType = getEmbedTypeByObjectType(data.embeds[i].type, self.embedTypes);

				if(!embedType)
				{
					// An embedType could not be found for this embed.
					// Skip this embed since it is unusable.
					continue;
				}

				embedType.model = embedType.cleanModel();

				data.embeds[i].embedType = embedType;

				// Send request for complete emebed data
				var promise = EntityEmbed.apiService.get({
					path: data.embeds[i].embedType.options.httpPaths.get,
					data: {
						object_id: data.embeds[i].id
					}
				});

				// associate callback to promise
				promise.done((function(embed) {
						// Encapsulate embed data by passing data.embeds[i] into self invoking function (See **EMBED** below).
						// The embed parameter should retain it's reference when the returned async function is fired.
						// Changes made to embed should bind out of the async function, but that is not required
						// since we append the modified embed object to our list of usable embeds to render once the
						// editors inner DOM has been created later on.
						return function(request){
							var embedHtml, placeholder;

							if (request.status === 'ERROR')
							{
								console.log('failed to get embed object!');
								return request;
							}

							// Update embed model with API data
							embed.embedType.model = request.response;

							// Add embed to our list of usable embeds
							usableEmbeds.push(embed);

							// Construct placeholder string
							placeholder = generatePlaceholderString(embed);

							// Generate the embed HTML
							embedHtml = self.generateEmbedHtml(embed.embedType);

							// Replace placeholder string in full story HTML with the embed HTML
							// A quick split and join should work since our placeholder string is unique to:
							// 		- our addon (eg. addonName)
							// 		- the embed being inserted (eg. embed.id)
							// 		- the position the embed is inserted (embed.index)
							fullHtml = fullHtml.split(placeholder).join(embedHtml);
						};
					})(data.embeds[i])); // **EMBED**

				// add the promise to our deferreds list.
				deferreds.push(promise);
			}

			// execute this function when all the AJAX calls to get embed types are done
			$.when.apply($, deferreds).done(function(){
				var embed, $embed, innerHtml;
				var done = {};

				// Each of our deferreds should have updated the full story HTML with embed HTML.
				// Set editor content to establish a DOM tree to work with.
				setEditorHtml();

				// Fix for Issue #164: Reattach embed HTML to an existing DOM, similar to adding/editing an embed while editing.
				// Iterate over usable embeds
				for (var i = 0; i < usableEmbeds.length; i++)
				{
					// Get reference to embed at this index
					embed = usableEmbeds[i];

					// We only need to do reattach HTML once for embed id. Make sure an embed with this id
					// hasn't already been reattached.
					if(!done[embed.id])
					{
						// Set a flag to skip id's that have already been reattached.
						done[embed.id] = true;

						// Find all embed wrapper elements with this ID.
						$embed = self.$el.find('[id="' + embed.id + '"]');

						innerHtml = $embed.html();

						// Find embeds placeholder element and replcae it with embed HTML
						$embed.html(innerHtml);

						// Fire embedType's activateEmbed method
						self.addEmbed($embed, embed.embedType, true);
					}
				}
			});
		}

		function setEditorHtml() {
			self.core.getEditor().setContent(fullHtml);
			if(!self.options.readonly)
			{
				self.$el.sortable('refresh');
			}
		}

		if(!contentData)
		{
			console.log('Must provide either story id or serialized story data.');
			return;
		}

		fullHtml = !isString ? contentData.html : isHtml ? contentData : '';

		if(isString && !isHtml)
		{
			EntityEmbed.apiService.get({
					path: 'admin/embed/edit', // TODO : not hardcode
					data: {
						object_id : contentData
					}
				})
				.done(function(data){
					if (data.status === 'ERROR')
					{
						console.log('Failed to get story with id ' + contentData);
						return;
					}

					updateHtml(data.repsonse);
				})
				.fail(function(data){
					console.log('Failed to get story with id ' + contentData);
				});
		}
		else
		{
			updateHtml(contentData);
		}
	};


	/**
	 * Add embed
	 *
	 * This function is called when a user click on the + icon
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.add = function () {
		var self = this;
		var addToScope = {
			modalOptions: {
			}
		};
		$.embed_modal_open(addToScope)
			.done(function(respData) {
				self.addEmbed(null, respData.embedType);
			});
	};

	/**
	 * Edit embed
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.editEmbed = function ($embed) {
		var self = this;
		var $figure = $embed.find('figure');
		var embed = $figure.data('embed');

		var scope = {
			modalOptions: {
				id: embed.model.object_id,
				embedTypeStr: $embed.find('[data-embed-type]').attr('data-embed-type')
			}
		};

		self.toolbarManager.hideToolbar();

		$.embed_modal_open(scope)
			.done(function(respData) {
				var embedType = $.extend(true, {}, respData.embedType);
				var $embeds = $('[id=' + embedType.model.object_id + ']', self.$el);

				$embeds.each(function() {
					var $this = $(this);

					$this.data('embed', embedType);

					self.renderEmbed($this.closest('.' + entityEmbedContainerClass));
				});

				self.activateEmbed(embedType);

				self.core.triggerInput();
			});
	};

	EntityEmbeds.prototype.renderEmbed = function($embed, doActivateEmbed) {
		var self = this;
		var $figure = $embed.find('> figure');
		var embed = $figure.data('embed');
		var embedHtml = self.generateEmbedHtml(embed);
		var $embedTemp = $(embedHtml);

		$embed.addClass(embedClassPrefix + embed.options.object_type);

		// Replace figure's inner HTML with new embed's inner Html.
		$figure.html( $embedTemp.html() );

		if(doActivateEmbed)
		{
			self.activateEmbed(embed);
		}
	};

	/**
	 * Remove custom content
	 *
	 * This function is called when a user removes an entity embed
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.removeEmbed = function ($embed) {
		var self = this;
		self.toolbarManager.hideToolbar();
		$embed.remove();
		self.core.triggerInput();
	};

	/**
	 * Add a new line before and after an embed
	 *
	 * Sometimes this cannot be done with the cursor, so this toolbar button is important
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.addNewline = function ($embed) {
		var self = this;
		var newline = '<p><br></p>';
		// TODO : check if there is already a newline before / after
		$embed.before(newline);
		$embed.after(newline);
		self.toolbarManager.positionToolbars($embed);
	};

	/**
	 * Toggles embed selection
	 *
	 * Selected embeds have a toolbar over them
	 *
	 * @returns {void}
	 */

	EntityEmbeds.prototype.toggleSelectEmbed = function ($embed) {
		var self = this;
		var $currentActiveEmbed = $('.' + activeEmbedClass);
		var embedObjectType = $embed.find('[data-embed-type]').attr('data-embed-type');
		var embedType = getEmbedTypeByObjectType(embedObjectType, self.embedTypes);

		// hide current toolbars and deactive any active embed
		self.toolbarManager.hideToolbar();
		$currentActiveEmbed.toggleClass(activeEmbedClass);

		// activate this embed
		$embed.toggleClass(activeEmbedClass);

		if (!!self.options.actions)
		{
			if ($embed.hasClass(activeEmbedClass))
			{
				self.toolbarManager.showToolbars($embed, embedType.name);
			}
			else
			{
				self.toolbarManager.hideToolbar();
			}
		}
	};

	EntityEmbeds.prototype.generateEmbedHtml = function(embedType){
		var $embed = $('<div>').html(embedType.parseForEditor());

		$embed.children().first().addClass('entity-embed');

		var ret = '<figure contenteditable="false" ' +
						'id="' + embedType.model.object_id	+ '" ' +
						'data-embed-type="' + embedType.options.object_type + '" >' +
						$embed.html() +
						'<div class="entity-embed-blocker"></div>' +
					'</figure>';

		return ret;
	};

	/**
	 * Add custom content
	 *
	 * This function is called when a user completes the entity embed modal
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.addEmbed = function ($embedContainer, embed, skipInputEvent) {
		var self = this;
		var buttonAction = embed.defaultStyle.replace('entity-embed-', '');
		var $embed, $figure, $activeElement;

		if(!$embedContainer)
		{
			// Find currently acive element
			$activeElement = $(mediumEditorActiveSelector, self.$el);

			// Generate embed HTML
			$embedContainer = $('<div>').addClass(entityEmbedContainerClass);
			$embedContainer.html(self.generateEmbedHtml(embed));

			// Replace active element with embed elment
			$activeElement.replaceWith($embedContainer);
		}

		if($embedContainer.is('figure'))
		{
			$embedContainer = $embedContainer.closest('.' + entityEmbedContainerClass);
		}

		$embedContainer.addClass(embedClassPrefix + embed.options.object_type);

		// apply the default styling to the embed that was just added
		self.toolbarManager.addStyle($embedContainer, embed.defaultStyle, buttonAction, false);

		$figure = $embedContainer.find('figure');
		$figure.data('embed', $.extend(true, {}, embed));

		self.renderEmbed($embedContainer, true);

		if(!self.options.readonly)
		{
			self.$el.sortable('refresh');
		}

		self.core.hideButtons();

		if(!skipInputEvent)
		{
			self.core.triggerInput();
		}
	};

	/**
	 * Run an embed's acticateEMbed method if it has one.
	 *
	 * This function should be called after embed HTML has been inserted into the editor content.
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.activateEmbed = function(embed) {
		var embedType = embed.embedType || embed;

		// Make sure activeEmbed is a function
		if(typeof embedType.activateEmbed === 'function')
		{
			embedType.activateEmbed();
		}
	}

	/** Addon initialization */

	$.fn[pluginName + addonName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName + addonName)) {
				$.data(this, 'plugin_' + pluginName + addonName, new EntityEmbeds(this, options));
			}
		});
	};

})(jQuery, window, document);