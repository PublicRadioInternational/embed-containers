var EntityEmbed = EntityEmbed || {};

;(function ($, window, document, undefined) {

	'use strict';

	/** Default values */
	var pluginName = 'mediumInsert',
		addonName = 'EntityEmbeds', // name of the Medium Editor Insert Plugin
		activeEmbedClass = 'entity-embed-active',	// class name given to active (selected) embeds
		mediumEditorActiveSelector = '.medium-insert-active', // selector for the medium editor active class
		activeEmbedClass = 'entity-embed-active',	// class name given to active (selected) embeds
		entityEmbedEditorLineClass = 'entity-embed-editor-line', // class name given to a line (<p> element) in the editor on which an entity is embedded
		entityEmbedContainerClass = 'entity-embed-container', // class name given to the objects which contain entity embeds
		defaults = {
			label: '<span class="fa fa-code"></span>',
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

		self.toolbarManager.createActionToolbar($('body'));

		self.events();

		if (!EntityEmbed.$embedModal)
		{
			$.embed_modal_create();
		}

		for (var i in EntityEmbed.currentEmbedTypes)
		{
			self.toolbarManager.createStyleToolbar($('body'), EntityEmbed.currentEmbedTypes[i]);
		}
	};

	/**
	 * Event listeners
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.events = function () {
		var self = this;

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
			})
			// toggle select embed when embed is clicked
			.on('click', '.' + entityEmbedContainerClass, function(e){
				self.toggleSelectEmbed($(this));
				e.stopPropagation(); // done allow the first onClick event to propagate
			})
			// prevent user from destroying modal functionality when deleting first element
			.on('keydown', '.editable.editor', function(e){
				if(e.which == 8 || e.which == 46) // backspace or delete
				{
					var numChildren = $('.editable.editor p').length;
					if(numChildren <= 1)
					{
						var editorText = $('.editable.editor p').text();
						if (!editorText || editorText === '')
						{
							e.preventDefault();
						}
					}
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
			})
			.on('entityEmbedAdded', '.' + entityEmbedContainerClass, function(e){
				self.addEmbed($(this), e.embedType);
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
			fullHtml;

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

			deferreds = [];

			// Iterate over returned embeds
			for (var i = 0; i < data.embeds.length; i++)
			{
				// Convert returned type name to a useful embedType object
				data.embeds[i].embedType = $.grep(EntityEmbed.currentEmbedTypes, function(et){
					return et.options.object_type == data.embeds[i].type;
				})[0];

				// Establish a clean model to work with
				data.embeds[i].embedType.model = data.embeds[i].embedType.cleanModel();

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
						// since we don't need to comunicate any changes to the embed object to the done callback
						// below. All logic need to insert embed HTML is contained in the async function.
						return function(request){
							var embedHtml, placeholder;

							if (request.status === 'ERROR')
							{
								console.log('failed to get embed object!');
							}
							// Update embed model with API data
							embed.embedType.model = request.response;

							// Generate the embed HTML
							embedHtml = EntityEmbed.embedModalDefaults.prototype.generateEmbedHtml(embed.embedType, false);

							// Construct placeholder string
							placeholder = generatePlaceholderString(embed);

							// Replace placeholder string in full story HTML with the embed HTML
							// A quick split and join should work since our placeholder is unique to:
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
				// Each of our deferreds should have updated the full story HTML with embed data,
				// so all we have to do now is add it to our editor element.
				setEditorHtml();
			});
		}

		function setEditorHtml() {
			self.core.getEditor().setContent(fullHtml);
		}

		if(!contentData)
		{
			console.log('Must provide either story id or serialived story data.');
			return;
		}

		fullHtml = !isString ? contentData.html : isHtml ? contentData : '';

		if(isString && !isHtml)
		{
			EntityEmbed.apiService.get({
					path: 'https://test-services.pri.org/admin/embed/edit',
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
			$currentEditorLocation: $(mediumEditorActiveSelector)
		};
		$.embed_modal_open(addToScope);
	};

	/**
	 * Edit embed
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.editEmbed = function ($embed) {
		var self = this;

		var scope = {
			$currentEditorLocation: $('.' + activeEmbedClass),
			id: $embed.find('figure').attr('id'),
			embedTypeStr: $embed.find('[data-embed-type]').attr('data-embed-type')
		};

		self.toolbarManager.hideToolbar();
		$.embed_modal_open(scope);
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
		var newline = '<p class="entity-embed-new-line">&nbsp</p>';
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
		var embedName = $.grep(EntityEmbed.currentEmbedTypes, function(et){
			return et.options.object_type === embedObjectType;
		})[0].name;

		// hide current toolbars and deactive any active embed
		self.toolbarManager.hideToolbar();
		$currentActiveEmbed.toggleClass(activeEmbedClass);

		// activate this embed
		$embed.toggleClass(activeEmbedClass);

		if (!!self.options.actions)
		{
			if ($embed.hasClass(activeEmbedClass))
			{
				self.toolbarManager.showToolbars($embed, embedName);
			}
			else
			{
				self.toolbarManager.hideToolbar();
			}
		}
	};

	/**
	 * Add custom content
	 *
	 * This function is called when a user completes the entity embed modal
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.addEmbed = function ($embedContainer, embed) {
		var self = this;

		// apply the default styling to the embed that was just added
		var buttonAction = embed.defaultStyle.replace('entity-embed-', '');
		self.toolbarManager.addStyle($embedContainer, embed.defaultStyle, buttonAction, false);

		self.core.triggerInput();
	};

	/** Addon initialization */

	$.fn[pluginName + addonName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName + addonName)) {
				$.data(this, 'plugin_' + pluginName + addonName, new EntityEmbeds(this, options));
			}
		});
	};

})(jQuery, window, document);