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
	var embedName = 'facebookEmbed',
		defaults = {
			viewPath: base + 'modal/modal_facebook.html',
			displayName: 'Facebook',
			httpPaths: {
				put: '',
				post: '',
				get: '',
				del: ''
			}
		};

	// CONSTRUCTOR
	function facebookEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	facebookEmbed.inherits(EntityEmbedTypes.genericEmbed);
	EntityEmbedTypes[embedName] = facebookEmbed;

	// PUBLIC
	facebookEmbed.prototype.orderIndex = 6;

	facebookEmbed.prototype.getModelFromForm = function($el){
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
		var code = 	'<script>' +
						'(function(d, s, id) {' +
						  'var js, fjs = d.getElementsByTagName(s)[0];' +  
						  'if (d.getElementById(id)) return;' + 
						  'js = d.createElement(s);' +
						  'js.id = id;' +
						  'js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3";' +
						  'fjs.parentNode.insertBefore(js, fjs);' +
						  '}' +
						  '(document, "script", "facebook-jssdk"));' +
				    '</script>' +
					'<div class="fb-post" data-href="'+ this.model.url + '" data-width="500">' +
					'</div>';
		self.model[embedCodeName] = code;
	
	};
	// PUBLIC
	facebookEmbed.prototype.cleanModel = function(){
		return {
			url: null
		};
	};

	facebookEmbed.prototype.parseForEditor = function(){
		var self = this;
		// TODO: Need to make user unable to interact with embed
		return '<div class="facebook-embed">' +
					'<div class="facebook-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' + 
					'<div class="overlay">' +

					self.model.embedCode + 
					
					'</div>' +
					'<div class="facebook-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' + 
				'</div>';
	};

})('', EntityEmbedTypes);