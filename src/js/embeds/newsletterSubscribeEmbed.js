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
	var embedName = 'newsletterSubscribeEmbed',
		defaults = {
			viewPath: base + 'modal/modal_newsletterSubscribe.html',
			displayName: 'Newsletter Subscribe',
			httpPaths: {
				put: '',
				post: '',
				get: '',
				del: ''
			}
		};

	// CONSTRUCTOR
	function newsletterSubscribeEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	newsletterSubscribeEmbed.inherits(EntityEmbedTypes.genericEmbed);
	EntityEmbedTypes[embedName] = newsletterSubscribeEmbed;

	// PUBLIC
	newsletterSubscribeEmbed.prototype.orderIndex = 11;

	newsletterSubscribeEmbed.prototype.cleanModel = function(){
		return {
			internalTitle: null,
			displayTitle: null,
			newsletterId: null,
			teaser: null
		};
	};

	newsletterSubscribeEmbed.prototype.defaultStyle = 'entity-embed-center';

	newsletterSubscribeEmbed.prototype.parseForEditor = function(){
		var self = this;
		return '<div class="newsletter-subscribe-embed entity-embed-secondary-toolbar-locator">' +
					'<div class="display-title">' + self.model.displayTitle + '</div>' +
					'<div class="subscribe-form">' +			
						'<div class="teaser">' + self.model.teaser + '</div>' +
						'<div class="embed-modal-form">' +
							'<input name="email" type="text" placeholder="user@domain.com" class="embed-modal-form-control">' + 
						'</div>' + 
						'<button class="btn btn-primary subscribe-btn">Subscribe</button>'
					'</div>' + 
				'</div>';
	};

})('', EntityEmbedTypes);