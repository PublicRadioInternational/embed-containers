var EntityEmbed = EntityEmbed || {};

;(function ($, window, document, EntityEmbedTypes, undefined) {

	'use strict';

	/** Default values */
	var pluginName = 'mediumInsert',
		addonName = 'EntityEmbeds', // first char is uppercase
		activeEmbedClass = 'entity-embed-active',	// class name given to active (selected) embeds
		defaults = {
			modalOptions: {}, //see modal.js to customize if embedModalDefaults.js is insufficient
			modalScope: { // default scope to pass to the modal
				$embedTypeSelect: $(''),
				$modalBody: $('')
			},
			$modalEl: $(''),
			insertBtn: '.medium-insert-buttons', // selector for insert button
			fileUploadOptions: { // See https://github.com/blueimp/jQuery-File-Upload/wiki/Options
				url: 'upload.php',
				acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
			},
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
			},
			embedTypes: { // options for different embed types
				image:{},
				video:{},
				audio:{},
				twitter:{},
				instagram:{},
				facebook:{},
				relatedLink:{},
				externalLink:{},
				globalBuzz:{},
				newsletterSubscribe:{},
				iframe:{},
				customTexd:{}
			}
		};

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
		if (self.core.getEditor()) {
			self.core.getEditor()._serializePreEmbeds = self.core.getEditor().serialize;
			self.core.getEditor().serialize = self.editorSerialize;
			self.core.getEditor().loadStory = function(id, path){ // this is done like so in order to allow access the EntityEmbeds object
				self.loadStory(id, path);
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
		
		self.embedTypes = [];
		for (var embedName in EntityEmbedTypes)
		{
			if (!!self.options.embedTypes[embedName])
			{
				var embedObject = new EntityEmbedTypes[embedName](self.options.embedTypes[embedName]);
				self.embedTypes.push(embedObject);
				self.toolbarManager.createStyleToolbar($('body'), embedObject);
			}
		}

		self.embedTypes.sort(function(l, r){
			return l.orderIndex - r.orderIndex;
		});

		// TODO : only track these on global namespace, not on this addon
		EntityEmbed.embedTypes = self.embedTypes;

		self.finalModalOptions = {};
		var defaultModalOptions = new EntityEmbed.embedModalDefaults();
		if (!!self.options.modalOptions)
		{
			self.finalModalOptions = $.extend(true, {}, defaultModalOptions, self.options.modalOptions);
		}
		else
		{
			self.finalModalOptions = defaultModalOptions;
		}

		var modalScope = {
			embedTypes: self.embedTypes
		};

		modalScope = $.extend(true, {}, self.options.modalScope, modalScope);

		self.options.$modalEl.modal(self.finalModalOptions, modalScope);
	};

	/**
	 * Event listeners
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.events = function () {
		var self = this;

		$(document).ready(function()
		{
			$(self.options.insertBtn).click(function(e){
				e.stopPropagation();
				self.add();
				
			});
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
			})
			// toggle select embed when embed is clicked
			.on('click', '.entity-embed', function(e){
				self.toggleSelectEmbed($(this));
				e.stopPropagation(); // done allow the first onClick event to propagate
			})
			// prevent user from destroying modal functionality when deleting first element
			.on('keydown', '#editable-editor', function(e){
				if(e.which == 8 || e.which == 46)
				{
					var numChildren = $('#editable-editor p').length;
					if(numChildren <= 1)
					{
						var list = $('#editable-editor p:first-child').find('br');
						var visible = (list.length > 0 && !$('.medium-insert-buttons-show').is(':visible') ||
							list.length > 0 && $('.medium-insert-buttons-show').is(':visible'));
						if(visible)
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
	 * Extend editor's serialize function
     *
     * @return {object} Serialized data
     */

	EntityEmbeds.prototype.editorSerialize = function() {
		var self = this;
		var data = self._serializePreEmbeds();
		var cleanedData = {
			storyHtml: '',
			embeds: []
		};

		$.each(data, function(key){
			var $data = $('<div />').html(data[key].value);
			$data.find('.entity-embed-new-line').remove();

			var $embedContainers = $data.find('.entity-embed-container');

			for(var i = 0; i < $embedContainers.length; i++)
			{
				var $embed = $($embedContainers[i]).find('figure');
				if (!$embed)
				{
					continue;
				}
				var embed = {
					id: $embed.attr('id'),
					style: $embed.attr('class'),
					type: $embed.attr('data-embed-type')
				};

				cleanedData.embeds.push(embed)
				$($embedContainers[i]).html('[[' + (cleanedData.embeds.length - 1) + ']]');
			}

			cleanedData.storyHtml += $data.html();
		});

		return cleanedData;
	 };

 	/**
	 * Extend editor to allow dynamic loading of content
	 * 
	 * retrieves object by id and loads content into editor
     *
     * @return {void}
     */

	EntityEmbeds.prototype.loadStory = function(objectId, getApiUrlPath) {
		var self = this;

		EntityEmbed.apiService.get({
			path: getApiUrlPath,
			data: {
				object_id : objectId,
				auth_token: 'abc123'
			},
			success: function(data){
				var deferreds = [];
				for (var i = 0; i < data.response.embeds.length; i++)
				{
					data.response.embeds[i].embedType = $.grep(self.embedTypes, function(et){
						return et.options.object_type == data.response.embeds[i].type;
					})[0];
					data.response.embeds[i].embedType.model = data.response.embeds[i].embedType.cleanModel();

					deferreds.push(EntityEmbed.apiService.get({
						path: data.response.embeds[i].embedType.options.httpPaths.get,
						data: {
							object_id: data.response.embeds[i].id,
							auth_token: 'abc123'
						},
						success: function(request){
							if (request.status === 'ERROR')
							{
								console.log('failed to get embed object!');
							}
							
							// find the embed by id (cannot use local i variable because this is async)
							var embedInfo = $.grep(data.response.embeds, function(embed){
								return embed.id === request.response.object_id;
							})[0];
							var embedInfoIndex = data.response.embeds.indexOf(embedInfo);
							data.response.embeds[embedInfoIndex].embedType.model = request.response;
							data.response.embeds[embedInfoIndex].editorHtml = self.finalModalOptions.generateEmbedHtml(data.response.embeds[embedInfoIndex].embedType, false);
						}
					}));
				}

				// execute this function when all the AJAX calls to get embed types are done
				$.when.apply($, deferreds).done(function(){
					// regex string will match any any element with class entity-embed-container whose inner HTML is ONLY [[#]] where # is an any real number
					var regex = /<[^<^>.]*class[^<^>.]*=[ ]*"[^<^>^"^'.]*entity-embed-container[^<^>^"^'.]*"[^"^'.]*>\[\[[0-9]*\]\]<[ ]*\/[ ]*[a-zA-Z]*[ ]*>/gi,
						fullStoryHtml = data.response.storyHtml,
						result;
					while ( result = regex.exec(fullStoryHtml) ) {
						if (result.length < 1)
						{
							continue
						}
						var match = result[0];
						var delimitedIndex = /\[\[[0-9]*\]\]/gi.exec(result); // find the [[#]]
						if (!delimitedIndex || delimitedIndex.length < 1)
						{
							continue;
						}
						var embedIndex = parseInt(delimitedIndex[0].substr(2, delimitedIndex[0].length - 2)); // trim off the characters [[ and ]]
						var startIndex = fullStoryHtml.indexOf(match) + match.indexOf(delimitedIndex[0]);
						fullStoryHtml = fullStoryHtml.replace( 
							fullStoryHtml.substr(startIndex , delimitedIndex[0].length),
							data.response.embeds[embedIndex].editorHtml);
					}
					self.$el.html(fullStoryHtml);
				});
			},	
			fail: function(data){
				console.log('Failed to get story with id ' + objectId);
			}
		});
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
			$currentEditorLocation: $('.medium-insert-active'),
			modalType: EntityEmbed.embedModalTypes.add
		};
		self.options.$modalEl.openModal(addToScope);
	};

	/**
	 * Edit embed
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.editEmbed = function ($embed) {
		var self = this;
		
		var scope = {
			$currentEditorLocation: $('.medium-insert-active'),
			modalType: EntityEmbed.embedModalTypes.edit,
			embedId: $embed.find('figure').attr('id'),
			embedType: $embed.find('[data-embed-type]').attr('data-embed-type')
		};

		self.toolbarManager.hideToolbar();
		self.options.$modalEl.openModal(scope);
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

		$currentActiveEmbed.toggleClass(activeEmbedClass);
		$embed.toggleClass(activeEmbedClass);
		
		if (!!self.options.actions)
		{			
			if ($embed.hasClass(activeEmbedClass))
			{
				self.toolbarManager.showToolbars($embed);
			}
			else
			{
				self.toolbarManager.hideToolbar();
			}
		}
	};

	/** Addon initialization */

	$.fn[pluginName + addonName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName + addonName)) {
				$.data(this, 'plugin_' + pluginName + addonName, new EntityEmbeds(this, options));
			}
		});
	};

})(jQuery, window, document, EntityEmbedTypes);