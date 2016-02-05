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

	facebookEmbed.prototype.getModelFromForm = function($el){
		var self = this;
		var formFields = $el.find('.form-control');
		for(var i = 0; i < formFields.length; i++)
		{
			var name = formFields[i].name;
			var value = formFields[i].value;
			if (!!name && !!value)
			{
				self.model[name] = value;
			}
		}
		
		var name = 'EmbedCode';
		var code = this.model.url;
		self.model[name] = code;
	};
	// PUBLIC
	facebookEmbed.prototype.cleanModel = function(){
		return {
			url: null
		};
	};


})('', EntityEmbedTypes);