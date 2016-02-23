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

		var modalOptions;
		var defaultModalOptions = new EntityEmbed.embedModalDefaults();
		if (!!self.options.modalOptions)
		{
			modalOptions = $.extend(true, {}, defaultModalOptions, self.options.modalOptions);
		}
		else
		{
			modalOptions = defaultModalOptions;
		}

		var modalScope = {
			embedTypes: self.embedTypes
		};

		modalScope = $.extend(true, {}, self.options.modalScope, modalScope);

		self.options.$modalEl.modal(modalOptions, modalScope);
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
			$currentEditorLocation: $embed.parent(),
			modalType: EntityEmbed.embedModalTypes.edit,
			embedId: $embed.attr('id')
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
	 * Toggles embed selection
	 *
	 * Selected embeds have a toolbar over them
	 *
	 * @returns {void}
	 */

	EntityEmbeds.prototype.toggleSelectEmbed = function ($embed) {
		var self = this;
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