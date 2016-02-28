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
			httpPaths: {
				put: '',
				post: '',
				get: '',
				del: ''
			},
			object_type: 'newsletter'
		};

	var loadSubscription = function (getPath){
			EntityEmbed.apiService.get(
						getPath,
						//Current Guid value of the Subscription list
						//TODO: change this from a hardcoded value to one pointing at a newsletter subscription list
						{object_id: "f75bd456f84a40d0b5785f8cea4d5937" },
						function(data){
							//load object into license list
						
							if (!!data.response.list)
							{
								var subscriptionList = [];
								var i = 0;
								for(var subscriptionName in data.response.list)
								{
									if(!!subscriptionName){
										subscriptionList[i] = "<option value=" + data.response.list[subscriptionName] + 
										">" + subscriptionName + "</option>";
									}
									i++;
								}
								$("#subscription").html(subscriptionList);
							}
						},
						function(data){
							console.log('failed to find object with that id');
						}
					);
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
			internalTitle: null,
			displayTitle: null,
			newsletterId: null,
			teaser: null
		};
	};

	newsletterSubscribeEmbed.prototype.initModal = function($el){
		var self = this;
		loadSubscription(this.options.httpPaths.get);
	}

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