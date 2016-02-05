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
	var embedName = 'instagramEmbed',
		defaults = {
			viewPath: base + 'modal/modal_instagram.html',
			displayName: 'Instagram',
			httpPaths: {
				put: '',
				post: '',
				get: '',
				del: ''
			}
		};

	// CONSTRUCTOR
	function instagramEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	instagramEmbed.inherits(EntityEmbedTypes.genericEmbed);
	EntityEmbedTypes[embedName] = instagramEmbed;

	instagramEmbed.prototype.getModelFromForm = function($el){
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
	instagramEmbed.prototype.cleanModel = function(){
		return {
			url: null
		};
	};

})('', EntityEmbedTypes);