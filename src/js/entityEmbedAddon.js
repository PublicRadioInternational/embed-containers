;(function ($, window, document, undefined) {

	'use strict';

	/** Default values */
	var pluginName = 'mediumInsert',
		addonName = 'EntityEmbed', // first char is uppercase
		activeEmbedClass = 'entity-embed-active',	// class name given to active (selected) embeds
		activeToolbarBtnClass = 'medium-editor-button-active', // class name given to the active toolbar button
		entityEmbedEditorLineClass = 'entity-embed-editor-line', // class name given to a line (<p> element) in the editor on which an entity is embedded
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
					label: '<span class="fa fa-align-left"></span>'
					// added: function ($el) {},
					// removed: function ($el) {}
				},
				center: {
					label: '<span class="fa fa-align-center"></span>'
					// added: function ($el) {},
					// removed: function ($el) {	
				},
				right: {
					label: '<span class="fa fa-align-right"></span>'
					// added: function ($el) {},
					// removed: function ($el) {}
				}
			},
			actions: {
				remove: {
					label: '<span class="fa fa-times"></span>',
					clicked: function () {
						var $event = $.Event('keydown');

						$event.which = 8;
						$(document).trigger($event);
					}
				}
			},
			embedTypes: { // options for different embed types
				imagesEmbed:{},
				videoEmbed:{},
				audioEmbed:{},
				twitterEmbed:{},
				instagramEmbed:{},
				facebookEmbed:{},
				relatedLinkEmbed:{},
				externalLinkEmbed:{},
				globalBuzzEmbed:{},
				newletterSubscribeEmbed:{},
				iframeEmbed:{},
				customTextEmbed:{}
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

	function EntityEmbed (el, options) {
		var self = this;

		self.el = el;
		self.$el = $(el);
		self.templates = window.MediumInsert.Templates;
		self.core = self.$el.data('plugin_'+ pluginName);

		self.options = $.extend(true, {}, defaults, options);

		self._defaults = defaults;
		self._name = pluginName;

		self.init();
	}

	/**
	 * initialization
	 *
	 * @return {void}
	 */

	EntityEmbed.prototype.init = function () {
		var self = this;
		self.events();
		
		self.embedTypes = {};
		for (var embedName in MediumEditor.util.embedTypeConstructors)
		{
			if (!!self.options.embedTypes[embedName])
			{
				self.embedTypes[embedName] =
					new MediumEditor.util.embedTypeConstructors[embedName](self.options.embedTypes[embedName]);
			}
		}
		
		var modalOptions;
		var defaultModalOptions = new window.embedModalDefaults();
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

		self.createToolbar();
	};

	/**
	 * Event listeners
	 *
	 * @return {void}
	 */

	EntityEmbed.prototype.events = function () {
		var self = this;

		$(document).ready(function()
		{
			// TODO : make compatible with multiple editors on one page
			$(self.options.insertBtn).click(function(){
				self.add();
			});
		});

		$(document)
			.on('click', function(	){
				if (self.$el.find('.' + activeEmbedClass).length != 0)
				{
					self.hideToolbar();
				}
			})
			.on('click', '.entity-embed', function(e){
				self.toggleSelectEmbed($(this));
				e.stopPropagation();
			})
			.on('click', '.medium-insert-images-toolbar .medium-editor-action', function(){
				self.toolbarAction($(this));
			})
			.on('keydown', function(e){
				self.removeEmbed(e);
			});

	};

	/**
	 * Get the Core object
	 *
	 * @return {object} Core object
	 */

	EntityEmbed.prototype.getCore = function () {
		return this.core;
	};

	/**
	 * Add custom content
	 *
	 * This function is called when a user click on the + icon
	 *
	 * @return {void}
	 */

	EntityEmbed.prototype.add = function () {
		var self = this;

		self.options.$modalEl.openModal();
	};

	/**
	 * Remove custom content
	 *
	 * This function is called when a user removed an entity embed
	 *
	 * @return {void}
	 */

	EntityEmbed.prototype.removeEmbed = function (e) {
		var self = this;

		// TODO : this will not be fired if the user highlights content and begins typing

		if (e.which == 8 || e.which == 46) // backspace or delete
		{
			// TODO : this could hide toolbar on another selected embed
			if (self.$el.find('.' + activeEmbedClass).length != 0)
			{
				self.hideToolbar();
			}
		}
	};



	/**
	 * Toggles embed selection
	 *
	 * Selected embeds have a toolbar over them
	 *
	 * @returns {void}
	 */

	EntityEmbed.prototype.toggleSelectEmbed = function ($embed) {
		var self = this;
		$embed.toggleClass(activeEmbedClass);
		
		if (!!self.options.actions)
		{			
			if ($embed.hasClass(activeEmbedClass))
			{
				self.showToolbar($embed);
			}
			else
			{
				self.hideToolbar();
			}
		}
	};

	/**
	 * Creates toolbar for future use
	 *
	 * @returns {void}
	 */

	EntityEmbed.prototype.createToolbar = function() {
		var self = this;

		$('body').append(self.templates['src/js/templates/images-toolbar.hbs']({
			styles: self.options.styles,
			actions: self.options.actions
		}).trim());

		self.$toolbar = $('.medium-insert-images-toolbar');
		self.$toolbar2 = $('.medium-insert-images-toolbar2');

		self.$toolbar.hide();
		self.$toolbar2.hide();
	};

	/**
	 * Shows the toolbar over an embed
	 *
	 * @param {DOM} $embed - DOM element to show the embed over
	 *
	 * @returns {void}
	 */

	EntityEmbed.prototype.showToolbar = function($embed) {
		var self = this;
		var $activeLine = self.$el.find('.medium-insert-active');

		var optionSelected = false;
		self.$toolbar.find('button').each(function () {
			if($activeLine.hasClass('entity-embed-'+ $(this).data('action')))
			{
				$(this).addClass(activeToolbarBtnClass);
				optionSelected = true;
			}
		});

		if (!optionSelected)
		{
			self.$toolbar.find('button').first().addClass(activeToolbarBtnClass);
		}

		self.positionToolbar($embed);

		self.$toolbar.show();
		//self.$toolbar2.show();
	};

	/**
	 * Positions the toolbar over an embed
	 *
	 * @param {DOM} $embed - DOM element to show the embed over
	 *
	 * @returns {void}
	 */

	EntityEmbed.prototype.positionToolbar = function($embed) {
		var self = this;

		var top = $embed.offset().top - self.$toolbar.height() - 8 - 2 - 5; // 8px - hight of an arrow under toolbar, 2px - height of an image outset, 5px - distance from an image
		if (top < 0)
		{
			top = 0;
		}

		self.$toolbar
			.css({
				top: top,
				left: $embed.offset().left + $embed.width() / 2 - self.$toolbar.width() / 2
			});

		// self.$toolbar2
		// 	.css({
		// 		top: $embed.offset().top + 2, // 2px - distance from a border
		// 		left: $embed.offset().left + $embed.width() - $toolbar2.width() - 4 // 4px - distance from a border
		// 	});
	};

	/**
	 * Hides the toolbar
	 *
	 * @returns {void}
	 */

	EntityEmbed.prototype.hideToolbar = function(){
		var self = this;

		self.$toolbar.hide();		
		self.$toolbar.find('button').removeClass(activeToolbarBtnClass);

		self.$toolbar2.hide();
		self.$toolbar2.find('button').removeClass(activeToolbarBtnClass);
	}

	/**
	 * Links toolbar buttons and theior respective actions
	 *
	 * @param {DOM} $thisButton - toolbar button that was clicked
	 *
	 * @returns {void}
	 */

	EntityEmbed.prototype.toolbarAction = function ($thisButton) {
		var self = this;
		var $buttonList = $thisButton.closest('li').closest('ul');
		var $activeLine = $('.' + activeEmbedClass).closest('.' + entityEmbedEditorLineClass);

		// change the active button to this one
		// there should only be one active button
		$buttonList
			.find('.' + activeToolbarBtnClass)
			.removeClass(activeToolbarBtnClass);
		$thisButton.addClass(activeToolbarBtnClass);

		$buttonList.find('button').each(function(){
			var $curButton = $(this);
			var className = 'entity-embed-' + $curButton.data('action');

			if ($curButton.hasClass(activeToolbarBtnClass))
			{
				$activeLine.addClass(className);
				if (!!self.options.styles[$curButton.data('action')].added)
				{
					self.options.styles[$curButton.data('action')].added($activeLine)
				}
				setTimeout(function(){
					self.positionToolbar($('.' + activeEmbedClass));
				}, 50);
			}
			else
			{
				$activeLine.removeClass(className);	
				if (!!self.options.styles[$curButton.data('action')].removed)
				{
					self.options.styles[$curButton.data('action')].removed($activeLine)
				}
			}
		});


	};

	/** Addon initialization */

	$.fn[pluginName + addonName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName + addonName)) {
				$.data(this, 'plugin_' + pluginName + addonName, new EntityEmbed(this, options));
			}
		});
	};

})(jQuery, window, document);