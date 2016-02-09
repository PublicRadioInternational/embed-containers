(function(base, EntityEmbedTypes){

	'use strict';

	// check for EntityEmbedTypes namespace
	if (!EntityEmbedTypes)
	{
		console.log('Could not find EntityEmbedTypes namespace. ' +
			'Please ensure that the genericEmbed has loaded before this one.');
		return;
	}

	// PRIVATE
	var embedName = 'instagramEmbed',
		defaults = {
			viewPath: base + 'modal/modal_instagram.html',
			displayName: 'Instagram',
			httpPaths: {
				put: '',
				post: '',
				get: '',
				del: ''
			}
		};

	// CONSTRUCTOR
	function instagramEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	instagramEmbed.inherits(EntityEmbedTypes.genericEmbed);
	EntityEmbedTypes[embedName] = instagramEmbed;

	instagramEmbed.prototype.getModelFromForm = function($el){
		var self = this;

		self.parent.getModelFromForm($el);

		var embedCodeName = 'EmbedCode';
		var code = '<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: auto; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px); ">' +
						'<a href="' + 
						this.model.url + 
						'" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">' +
						'</a>' +
					'</blockquote>' +
					'<script async defer src="//platform.instagram.com/en_US/embeds.js"></script>';
		self.model[embedCodeName] = code;
	};	

	// PUBLIC
	instagramEmbed.prototype.cleanModel = function(){
		return {
			url: null
		};
	};

	instagramEmbed.prototype.parseForEditor = function(){
		var self = this;
		
		var code= '<div class="instagram-embed">' +
					'<div class="instagram-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' + 
					'<div class="overlay" disable="true">' +
					self.model.EmbedCode + 
					'</div>' +
					'<div class="instagram-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' + 
				'</div>';

		return code;
	};

})('', EntityEmbedTypes);