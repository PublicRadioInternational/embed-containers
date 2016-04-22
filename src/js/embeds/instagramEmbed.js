var EntityEmbed = EntityEmbed || {};

(function(window, base){

	'use strict';

	// PRIVATE
	var embedName = 'instagram',
		defaults = {
			viewPath: base + 'modal/modal_instagram.html',
			displayName: 'Instagram',
			object_type: 'instagram',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required'
				}
			}
		};

	// CONSTRUCTOR
	function instagramEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	instagramEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = instagramEmbed;

	// PUBLIC
	instagramEmbed.prototype.orderIndex = 8;

	instagramEmbed.prototype.getModelFromForm = function($el){
		var self = this;
		self.parent.getModelFromForm($el, self);

		var html_rendered_name = 'html_rendered';
		var code = '<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: auto; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px); ">' +
						'<a href="' + self.model.url +
						'" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">' +
						'</a>' +
					'</blockquote>' +
					'<script async defer src="//platform.instagram.com/en_US/embeds.js"></script>';
		self.model[html_rendered_name] = code;
	};

	// PUBLIC
	instagramEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url: null
		};
	};

	instagramEmbed.prototype.parseForEditor = function(){
		var self = this;

		// TODO: Need to make user unable to interact with embed
		return '<div class="instagram-embed">' +
					'<div class="instagram-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' +
					'<div class="overlay">' +
						self.model.html_rendered +
					'</div>' +
					'<div class="instagram-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' +
				'</div>';
	};

  instagramEmbed.prototype.activateEmbed = function(){
    // Check to see if Instagram scripts have already been loaded
    if(window.instgrm)
    {
      // Tell instegram to process embeds again
      window.instgrm.Embeds.process();
    }
  }
})(window, '');