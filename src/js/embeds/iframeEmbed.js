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
	var embedName = 'iframeEmbed',
		defaults = {
			viewPath: base + 'modal/modal_iframe.html',
			displayName: 'iFrame',
			httpPaths: {
				put: '',
				post: '',
				get: '',
				del: ''
			}
		};

	// CONSTRUCTOR
	function iframeEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	iframeEmbed.inherits(EntityEmbedTypes.genericEmbed);
	EntityEmbedTypes[embedName] = iframeEmbed;

	// PUBLIC
	iframeEmbed.prototype.defaultStyle = 'entity-embed-center';

	iframeEmbed.prototype.cleanModel = function(){
		return {
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
						'"frameborder="0" scrolling="' + this.model.allowsScroll + '">' + 
					'</iframe>' + 
					'<div class="iframe-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' + 
				'</div>';
	};

})('', EntityEmbedTypes);