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
	$(document).ready(function(){
		$(".editable").click(function(){
		   		var customTextEditor = new MediumEditor('#customTextEditor');
			});
	});

	// PUBLIC
	customTextEmbed.prototype.cleanModel = function(){
		return {
		};
	};

	customTextEmbed.prototype.getModelFromForm = function($el){
		var self = this;
		var formFields = $el.find('.form-control');
		for(var i = 0; i < formFields.length; i++)
		{
			var name = formFields[i].name;
			var value = formFields[i].value;

			if(formFields[i].id == "customTextEditor")
			{
				name = formFields[i].attributes.name.nodeValue
				value = formFields[i].innerHTML;
			}

			if (!!name && !!value)
			{
				self.model[name] = value;
			}
			
		}
	};


	customTextEmbed.prototype.clearForm = function($el){
		var self = this;
		var formFields = $el.find('.form-control');
		for(var i = 0; i < formFields.length; i++)
		{
			if (!!formFields[i].type && formFields[i].type.indexOf('select') !== -1)
			{
				formFields[i].selectedIndex = 0;
			}
			else
			{
				formFields[i].value = null;
				formFields[i].innerHTML ="";
			}
		}
		self.model = self.cleanModel();
	};

	customTextEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		var formFields = $form.find('.form-control');
		for (var i = 0; i < formFields.length; i++)
		{
			if (!!formFields.type && formFields[i].type.indexOf('select') !== -1)
			{
				var options = $(formFields[i]).find('option');
				var selectedOption = self.model[formFields[i].name];
				var optionIndex = 0;
				options.each(function(index){
					if (this.value === selectedOption)
					{
						optionIndex = index;
					}
				});
				formFields[i].selectedIndex = optionIndex;
			}
			else
			{
				
				formFields[i].value = self.model[formFields[i].name];

				if(formFields[i].id == "customTextEditor")
				{

					//formFields[i].innerHTML = self.model.customText;
					formFields[i].innerHTML = self.model[formFields[i].attributes.name.nodeValue];
				}
			}
		}
	};

	customTextEmbed.prototype.parseForEditor = function(){
		var self = this;
		return  '<div class="custom-text-embed">' + 
					'<div class="display-title">' + self.model.displayTitle + '</div>' +
					'<div class="custom-text">' + self.model.customText + '</div>' +
				'</div>';
	};

})('', EntityEmbedTypes);