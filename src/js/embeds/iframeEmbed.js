var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// PRIVATE
	var embedName = 'iframe',
		defaults = {
			viewPath: base + 'modal/modal_iframe.html',
			displayName: 'iFrame',
			object_type: 'iframe',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required'
				}
			}
		};

	// CONSTRUCTOR
	function iframeEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	iframeEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = iframeEmbed;

	// PUBLIC
	iframeEmbed.prototype.orderIndex = 11;

	iframeEmbed.prototype.getModelFromForm = function($el){
		var self = this;
		self.parent.getModelFromForm($el, self);

		var html_rendered_name = 'html_rendered';
		var code = '<div class="iframe-embed">' +
						'<div class="iframe-info">' +
							'<span>click here to show the toolbars</span>' +
						'</div>' + 
						'<iframe src="' + this.model.url + '" ' + 
							'frameborder="0" scrolling="' + this.model.allowsScroll + '">' + 
						'</iframe>' + 
						'<div class="iframe-info">' +
							'<span>click here to show the toolbars</span>' +
						'</div>' + 
					'</div>';
		self.model[html_rendered_name] = code;
	};

	iframeEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url: null,
			allowsScroll: false
		};
	};
})('');