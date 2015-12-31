(function(base, editorUtil){

	'use strict';

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

	function cleanModel(){
		return {
		};
	}


	// CONSTRUCTOR
	function instagramEmbed(options){
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
	instagramEmbed.prototype.init = function(){
		var self = this;
		self.model = cleanModel();
	};

	instagramEmbed.prototype.initModal = function($el){
		var self = this;
	};

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
	};

	instagramEmbed.prototype.clearForm = function($el){
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

	instagramEmbed.prototype.editorEvents = function(){};

	instagramEmbed.prototype.parseForEditor = function(){
		return '<pre class="embedded-content">' + JSON.stringify(this.model, null, 4) +'</pre>';
	};


	// make the constructor accessible
	if (!editorUtil.embedTypeConstructors)
	{
		editorUtil.embedTypeConstructors = {};
	}
	editorUtil.embedTypeConstructors[embedName] = instagramEmbed;

})('', MediumEditor.util);