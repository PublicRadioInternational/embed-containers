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

		self.model.embedCode =
			'<blockquote class="twitter-tweet" data-lang="en" style="width:50%; margin:auto;">' +
				'<a href="' + self.model.url + '">' +
				'</a>' +
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