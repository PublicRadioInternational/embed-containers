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
	var embedName = 'customTextEmbed',
		defaults = {
			viewPath: base + 'modal/modal_customText.html',
			displayName: 'Custom Text',
			httpPaths: {
				put: '',
				post: '',
				get: '',
				del: ''
			}
		};

	// CONSTRUCTOR
	function customTextEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	customTextEmbed.inherits(EntityEmbedTypes.genericEmbed);
	EntityEmbedTypes[embedName] = customTextEmbed;

	// PUBLIC
	customTextEmbed.prototype.cleanModel = function(){
		return {
		};
	};

	customTextEmbed.prototype.parseForEditor = function(){
		var self = this;
		return  '<div class="custom-text-embed">' + 
					'<div class="display-title">' + self.model.displayTitle + '</div>' +
					'<div class="custom-text">' + self.model.customText + '</div>' +
				'</div>';
	};

})('', EntityEmbedTypes);