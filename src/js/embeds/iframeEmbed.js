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

	iframeEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url: null,
			allowsScroll: false
		};
	};

	iframeEmbed.prototype.parseForEditor = function(){
		return  '<div class="iframe-embed">' +
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
	};

})('');