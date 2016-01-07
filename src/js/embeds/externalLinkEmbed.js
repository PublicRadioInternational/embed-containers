(function(base, editorUtil){

	'use strict';

	// PRIVATE
	var embedName = 'externalLinkEmbed',
		defaults = {
			viewPath: base + 'modal/modal_externalLink.html',
			displayName: 'External Link',
			httpPaths: {
				put: '',
				post: '',
				get: '',
				del: ''
			}
		};

	function cleanModel(){
		return {
		};
	}

	// CONSTRUCTOR
	function externalLinkEmbed(options){
		var self = this;
		self.name = embedName;

		self.options = $.extend(true, {}, defaults, options);

		// from images.js (isert plugin source) - could be very useful
		//
		// Extend editor's functions 
		// if (this.core.getEditor()) {
		// 	this.core.getEditor()._serializePreImages = this.core.getEditor().serialize;
		// 	this.core.getEditor().serialize = this.editorSerialize;
		// }

		self.init();
	}

	// PUBLIC
	externalLinkEmbed.prototype.init = function(){
		var self = this;
		self.model = cleanModel();
	};

	externalLinkEmbed.prototype.initModal = function($el){
		var self = this;
	};

	externalLinkEmbed.prototype.getModelFromForm = function($el){
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
	};
	
	externalLinkEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		var formFields = $form.find('.form-control');
		for (var i = 0; i < formFields.length; i++)
		{
			if (formFields[i].type.indexOf('select') !== -1)
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
			}
		}
	};

	externalLinkEmbed.prototype.clearForm = function($el){
		var formFields = $el.find('.form-control');
		for(var i = 0; i < formFields.length; i++)
		{
			if (formFields[i].type.indexOf('select') !== -1)
			{
				formFields[i].selectedIndex = 0;
			}
			else
			{
				formFields[i].value = null;
			}
		}
		self.model = cleanModel();
	};

	externalLinkEmbed.prototype.editorEvents = function(){};

	externalLinkEmbed.prototype.parseForEditor = function(){
		var self = this;

		return '<div>' + self.model.internalTitle  
				+ '<div>' + self.model.displayTitle + '</div>' 
				+ '<div>' + self.model.teaser + '</div>' 
				//+ '<div><img src="' + self.model.files[0] + '" /></div>'
				+  '<a href="' + self.model.url + '">'  + self.model.linkText + '</a>' + '</div>';
				//+  '<div class= external-thumbnail><a href="' + self.model.thumbnail + '"><img src="' + self.model.thumbnail + '"/></a>' 
				// '</div>' +
				// '</div>';
	};


	// make the constructor accessible
	if (!editorUtil.embedTypeConstructors)
	{
		editorUtil.embedTypeConstructors = {};
	}
	editorUtil.embedTypeConstructors[embedName] = externalLinkEmbed;

})('', MediumEditor.util);