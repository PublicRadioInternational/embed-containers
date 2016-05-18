var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'twitter',
		defaults = {
			viewPath: 'modal_twitter.html',
			displayName: 'Twitter',
			object_type: 'twitter',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required'
				}
			}
		};

	// CONSTRUCTOR
	function twitterEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	twitterEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = twitterEmbed;

	// PUBLIC
	twitterEmbed.prototype.orderIndex = 6;

	twitterEmbed.prototype.getModelFromForm = function($el){
		var self = this;

		self.parent.getModelFromForm($el, self);

		if (self.model.url.endsWith('/'))
		{
			self.model.url.substr(0, self.model.url.length - 1);
		}
		self.model.tweetId = self.model.url.substr(self.model.url.lastIndexOf('/') + 1);

		self.model.embedCode =
			'<blockquote class="twitter-tweet" data-lang="en">' +
				'<a href="' + self.model.url + '"></a>' +
			'</blockquote>' +
			'<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
	};

	// PUBLIC
	twitterEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url: null,
			embedCode: null
		};
	};

	twitterEmbed.prototype.parseForEditor = function(){
		var self = this;

		return '<div class="twitter-embed">' +
					'<div class="overlay">' +
						self.model.embedCode +
					'</div>' +
				'</div>';
	};
})();