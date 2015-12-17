;(function ($, window, document, undefined) {

	'use strict';

	/** Default values */
	var pluginName = 'mediumInsert',
		addonName = 'PriEntityEmbed', // first char is uppercase
		defaults = {
			modalTrigger: function(){ // function to open modal
				console.log('modalTrigger function called');
			}, 
			insertBtn: '.medium-insert-buttons', // selector for insert button
			deleteMethod: 'POST',
			deleteScript: 'delete.php',
			preview: true,
			captions: true,
			fileUploadOptions: { // See https://github.com/blueimp/jQuery-File-Upload/wiki/Options
				url: 'upload.php',
				acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
			},
			styles: {
				wide: {
					label: '<span class="fa fa-align-justify"></span>',
					// added: function ($el) {},
					// removed: function ($el) {}
				},
				left: {
					label: '<span class="fa fa-align-left"></span>',
					// added: function ($el) {},
					// removed: function ($el) {}
				},
				right: {
					label: '<span class="fa fa-align-right"></span>',
					// added: function ($el) {},
					// removed: function ($el) {}
				},
				grid: {
					label: '<span class="fa fa-th"></span>',
					// added: function ($el) {},
					// removed: function ($el) {}
				}
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

	function PriEntityEmbed (el, options) {
		this.el = el;
		this.$el = $(el);
		this.templates = window.MediumInsert.Templates;
		this.core = this.$el.data('plugin_'+ pluginName);

		this.options = $.extend(true, {}, defaults, options);

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	/**
	 * initialization
	 *
	 * @return {void}
	 */

	PriEntityEmbed.prototype.init = function () {
		var self = this;
		self.events();
	};

	/**
	 * Event listeners
	 *
	 * @return {void}
	 */

	PriEntityEmbed.prototype.events = function () {
		var self = this;

		$(document).ready(function()
		{
			$(self.options.insertBtn).click(function(){
				self.add();
			});
		});
	};

	/**
	 * Get the Core object
	 *
	 * @return {object} Core object
	 */
	PriEntityEmbed.prototype.getCore = function () {
		return this.core;
	};

	/**
	 * Add custom content
	 *
	 * This function is called when user click on the addon's icon
	 *
	 * @return {void}
	 */

	PriEntityEmbed.prototype.add = function () {
		var self = this;

		self.options.modalTrigger();
	};


	/** Addon initialization */

	$.fn[pluginName + addonName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName + addonName)) {
				$.data(this, 'plugin_' + pluginName + addonName, new PriEntityEmbed(this, options));
			}
		});
	};

})(jQuery, window, document);