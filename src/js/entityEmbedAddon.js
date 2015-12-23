;(function ($, window, document, undefined) {

	'use strict';

	/** Default values */
	var pluginName = 'mediumInsert',
		addonName = 'EntityEmbed', // first char is uppercase
		defaults = {
			$modalEl: $(''),
			modalOptions: {	
				// $openEl: $(''),
				// $abortEl: $(''),
				// $completeEl: $('')
				functions: {
					init:{
						before: function(scope){
							var options = $('#select-embed-type').children('option');
							var firstOption = $('');
							if (!!options[0])
							{
								firstOption = $('#' + options[0].value);
							}
							scope.contents = {
								selectedEmbedType: firstOption
							};

							for(var i = 1; i < options.length; i++)
							{
								if (!!options[i].value)
								{
									$('#' + options[i].value).hide();
								}
							}
						},
						after: function(scope){
							$('#select-embed-type').change(function(e){
								if (!!scope.contents.selectedEmbedType)
								{
									scope.contents.selectedEmbedType.hide();
								}

								var selected = e.currentTarget.options[e.currentTarget.selectedIndex];
								scope.contents.selectedEmbedType = $('#' + selected.value);							
								scope.contents.selectedEmbedType.show();
							});
						}
					},
					complete: {
						before: function(scope){
							// TODO : form validation
							// TODO : embed objects with serializers
							scope.contents.embed = {
								embedType: scope.contents.selectedEmbedType.text()
								
							};
							return true;
						},
						after: function(scope){
							$('.medium-insert-active').html('<pre>' + 
								JSON.stringify(scope.contents.embed) + '</pre>');
						}
					}
					// open:{
					// 	before: function(scope){},
					// 	after: function(scope){}
					// },
					// abort: {
					// 	before: function(scope){},
					// 	after: function(scope){}
					// },
				}
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
					label: '<span class="fa fa-align-justify"></span>'
					// added: function ($el) {},
					// removed: function ($el) {}
				},
				left: {
					label: '<span class="fa fa-align-left"></span>'
					// added: function ($el) {},
					// removed: function ($el) {}
				},
				right: {
					label: '<span class="fa fa-align-right"></span>'
					// added: function ($el) {},
					// removed: function ($el) {}
				},
				grid: {
					label: '<span class="fa fa-th"></span>'
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

		self.options.$modalEl.modal(self.options.modalOptions);
		//self.modalCtrl = $.data(self.options.$modalEl, 'ctrl');
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
			// somewhat of a hack - this activates the entity embed add-on immediately
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

	EntityEmbed.prototype.getCore = function () {
		return this.core;
	};

	/**
	 * Add custom content
	 *
	 * This function is called when user click on the addon's icon
	 *
	 * @return {void}
	 */

	EntityEmbed.prototype.add = function () {
		var self = this;

		self.options.$modalEl.openModal();
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