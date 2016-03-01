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
			object_type: 'newsletter',
			validationOptions: {
				rules: {
					title: 'required',
					displayTitle: 'required',
					teaser: 'required',	
				}
			}
		},
		loadSubscription = function (getPath){
			EntityEmbed.apiService.get(
				getPath,
				//Current Guid value of the license list
				//TODO: change this from a hardcoded value

				{object_id: "2e7d8341d92a499dae3a19019550d518" },
				function(data){
					//load object into license list
					if (!!data.response.list)
					{
						var subscriptionList = [];
						for(var i = 0; i < data.response.list.length;i++ )
						{
							subscriptionList[i] = "<option value=" + data.response.list[i].licenseCode +">" + data.response.list[i].licenseName + "</option>";
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
			title: null,
			displayTitle: null,
			newsletterId: null,
			teaser: null
		};
	};

	newsletterSubscribeEmbed.prototype.initModal = function($el){
		var self = this;
		loadSubscription(this.options.httpPaths.get);
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