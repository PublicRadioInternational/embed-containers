var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'newsletterSubscribe',
		defaults = {
			viewPath: 'modal_newsletterSubscribe.html',
			displayName: 'Newsletter Subscribe',
			object_type: 'newsletter',
			validationOptions: {
				rules: {
					title: 'required',
					newsletter: 'required',
				}
			},
			httpPaths:{
				getNewsletters: 'admin/newsletter/list'
			}
		};

	// CONSTRUCTOR
	function newsletterSubscribeEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	newsletterSubscribeEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = newsletterSubscribeEmbed;

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

	newsletterSubscribeEmbed.prototype.initModal = function($el, modalCtrl){
		var self = this;
		var defaultSubscriptionOption = '<option disabled selected>-- select a newsletter --</option>';

		self.parent.initModal($el, modalCtrl, self);

		EntityEmbed.apiService.get({
				path: self.options.httpPaths.getNewsletters,
			})
			.done(function(list){
				//load object into license list
				if (!list.response.data)
				{
					return;
				}
				var subscriptionList = [];
				subscriptionList.push(defaultSubscriptionOption);

				for(var i = 0; i < list.response.data.length; i++)
				{
					subscriptionList.push(
						'<option value="' + list.response.data[i].newsletter_id +'" >' +
							list.response.data[i].title +
						'</option>'
					);
				}
				$el.find('[name="newsletter"]').html(subscriptionList);
			})
			.fail(function(){
				console.log('failed to load newsletter subscription options');
			});
	};

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

})();