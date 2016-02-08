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
	var embedName = 'twitterEmbed',
		defaults = {
			viewPath: base + 'modal/modal_twitter.html',
			displayName: 'Twitter',
			httpPaths: {
				put: '',
				post: '',
				get: '',
				del: ''
			}
		};

	// CONSTRUCTOR
	function twitterEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	twitterEmbed.inherits(EntityEmbedTypes.genericEmbed);
	EntityEmbedTypes[embedName] = twitterEmbed;

	twitterEmbed.prototype.getModelFromForm = function($el){
		var self = this;
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
		
		var embedCodeName = 'EmbedCode';
		var code = '<blockquote class="twitter-tweet" data-lang="en" style="width:50%; margin:auto;">' +
						'<a href="' + this.model.tweetUrl + '">' +
						'</a>' +
					'</blockquote>' +
					'<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
		self.model[embedCodeName] = code;
	};

	// PUBLIC
	twitterEmbed.prototype.cleanModel = function(){
		return {
			url: null
		};
	};
	
	twitterEmbed.prototype.parseForEditor = function(){
		var self = this;
		
		return '<div class="twitter-embed" style="background-color:gray">' +
					'<div class="twitter-info">' +
						'<span style="color:white">click here to show the toolbars</span>' +
					'</div>' + 
					'<div class="overlay" style="text-align:center;">' +

					self.model.EmbedCode + 

					'</div>' +
					'<div class="twitter-info">' +
						'<span style="color:white">click here to show the toolbars</span>' +
					'</div>' + 
				'</div>';
	};

})('', EntityEmbedTypes);