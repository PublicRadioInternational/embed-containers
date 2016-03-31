var EntityEmbed = EntityEmbed || {};

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
	var embedName = 'newsletterSubscribe',
		defaults = {
			viewPath: base + 'modal/modal_newsletterSubscribe.html',
			displayName: 'Newsletter Subscribe',
			object_type: 'newsletter',
			validationOptions: {
				rules: {
					title: 'required',
					newsletter: 'required',					
				}
			},
			httpPaths:{
				getNewsletters: 'https://test-services.pri.org/admin/newsletter/list'
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
	newsletterSubscribeEmbed.prototype.orderIndex = 12;

	newsletterSubscribeEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			displayTitle: null,
			newsletterId: null,
			teaser: null
		};
	};
	
	newsletterSubscribeEmbed.prototype.initModal = function($el){
		var self = this;
		EntityEmbed.apiService.get({
			path: self.options.httpPaths.getNewsletters,
			data: {
				auth_token: 'abc123'
			},
			success: function(list){
				//load object into license list
				if (!list.response.data)
				{
					return;
				}
				var subscriptionList = [];
				for(var i = 0; i < list.response.data.length; i++)
				{
					subscriptionList[i] =
						'<option value="' + list.response.data[i].newsletter_id +'" >' + 
							list.response.data[i].title +
						'</option>';
				}
				$el.find('[name="newsletter"]').html(subscriptionList);
			},
			fail: function(){
				console.log('failed to load newsletter subscription options');
			}
		});
	}

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