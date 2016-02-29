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
	var embedName = 'iframe',
		defaults = {
			viewPath: base + 'modal/modal_iframe.html',
			displayName: 'iFrame',
			httpPaths: {
				put: '',
				post: '',
				get: '',
				del: ''
			},
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

	iframeEmbed.inherits(EntityEmbedTypes.genericEmbed);
	EntityEmbedTypes[embedName] = iframeEmbed;

	// PUBLIC
	iframeEmbed.prototype.orderIndex = 11;

	iframeEmbed.prototype.defaultStyle = 'entity-embed-center';

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

})('', EntityEmbedTypes);