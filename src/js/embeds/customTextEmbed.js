(function(base, editorUtil){

	'use strict';

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

	function cleanModel(){
		return {
		};
	}

	// CONSTRUCTOR
	function customTextEmbed(options){
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
	customTextEmbed.prototype.init = function(){
		var self = this;
		self.model = cleanModel();
	};

	customTextEmbed.prototype.initModal = function($el){
		var self = this;
	};

	customTextEmbed.prototype.getModelFromForm = function($el){
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

	customTextEmbed.prototype.clearForm = function($el){
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

	customTextEmbed.prototype.editorEvents = function(){};

	customTextEmbed.prototype.parseForEditor = function(){
		return '<pre class="embedded-content">' + JSON.stringify(this.model, null, 4) +'</pre>';
	};


	// make the constructor accessible
	if (!editorUtil.embedTypeConstructors)
	{
		editorUtil.embedTypeConstructors = {};
	}
	editorUtil.embedTypeConstructors[embedName] = customTextEmbed;

})('', MediumEditor.util);