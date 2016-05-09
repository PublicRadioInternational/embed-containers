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
	twitterEmbed.prototype.orderIndex = 7;

	twitterEmbed.prototype.getModelFromForm = function($el){
		var self = this;

		// TODO: Need to extract this block of code, and instead call parent function
		var formFields = $el.find('.embed-modal-form-control');
		for(var i = 0; i < formFields.length; i++)
		{
			var name = formFields[i].name;
			var value = formFields[i].value;
			if (!!name && !!value)
			{
				self.model[name] = value;
			}
		}

		var embedCodeName = 'embedCode';
		var code = '<blockquote class="twitter-tweet" data-lang="en" style="width:50%; margin:auto;">' +
						'<a href="' + self.model.url + '">' +
						'</a>' +
					'</blockquote>' +
					'<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
		self.model[embedCodeName] = code;
	};

	// PUBLIC
	twitterEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url: null
		};
	};

	twitterEmbed.prototype.parseForEditor = function(){
		var self = this;

		// TODO: Need to make user unable to interact with embed
		return '<div class="twitter-embed">' +
					'<div class="twitter-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' +
					'<div class="overlay">' +
						self.model.embedCode +
					'</div>' +
					'<div class="twitter-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' +
				'</div>';
	};

})();