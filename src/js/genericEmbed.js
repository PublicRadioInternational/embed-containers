var EntityEmbedTypes = EntityEmbedTypes || {};
var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// CONSTRUCTOR
	function genericEmbed(options, defaults, embedName, ref){
		var self = ref || this;
		self.name = embedName;
		defaults = $.extend(true, {}, self.defaultOptions, defaults);
		self.options = $.extend(true, {}, defaults, options);
		self.init();
	};

	// PUBLIC
	genericEmbed.prototype.defaultOptions = {
		viewPath: '',
		displayName: 'Generic',
		httpPaths:{
			put: '',
			post: '',
			get: '',
			del: ''
		},
		styles: {
			left: true,
			right: true,
			center: true,
			wide: true
		},
		validationOptions: {}
	};

	genericEmbed.prototype.cleanModel = function(){
		return {};
	};

	genericEmbed.prototype.defaultStyle = 'entity-embed-center'; 

	genericEmbed.prototype.init = function(){
		var self = this;
		self.model = self.cleanModel();
	};

	// function to initialize the modal view
	// called after the modal view has loaded
	// $el: a jQuery element for the modal view
	genericEmbed.prototype.initModal = function($el){
		var self = this;
	};

	genericEmbed.prototype.getModelFromForm = function($el){
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
	};

	genericEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		var formFields = $form.find('.embed-modal-form-control');
		for (var i = 0; i < formFields.length; i++)
		{
			if (!!formFields[i].type && formFields[i].type.indexOf('select') !== -1)
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
			else if (!!self.model[formFields[i].name])
			{
				formFields[i].value = self.model[formFields[i].name];
			}
		}
	};
 
	genericEmbed.prototype.clearForm = function($el){
		var self = this;
		var formFields = $el.find('.embed-modal-form-control');
		for(var i = 0; i < formFields.length; i++)
		{
			if (!!formFields[i].type && formFields[i].type.indexOf('select') !== -1)
			{
				formFields[i].selectedIndex = 0;
			}
			else
			{
				formFields[i].value = null;
			}
		}
		self.model = self.cleanModel();
	};

	genericEmbed.prototype.editorEvents = function(){};

	genericEmbed.prototype.parseForEditor = function(){
		return '<pre class="embedded-content">' + JSON.stringify(this.model, null, 4) +'</pre>';
	};

	// returns validator object
	genericEmbed.prototype.validate = function($el){
		var self = this;
		var $form = $el.find('form');
		return $form.validate(self.options.validationOptions);
	};

	// ASSUMPTION - model is already populated
	genericEmbed.prototype.saveEmbed = function(embedIsNew, successFunc, failFunc){
		var self = this;

		self.model.auth_token = 'abc123';

		if (embedIsNew){
			// add the object_type onto the model
			//		this code smells, do something better here... maybe put in cleanModel?
			self.model.object_type = self.options.object_type;

			return EntityEmbed.apiService.post({
				path: self.options.httpPaths.post, 
				data: self.model,
				success: successFunc,
				fail: failFunc
			});
		}
		else
		{
			return EntityEmbed.apiService.put({
				path: self.options.httpPaths.put, 
				data: self.model,
				success: successFunc,
				fail: failFunc
			});
		}
	}

	EntityEmbedTypes.genericEmbed = genericEmbed;

	// augment Function to enable simple inheritance, if not already done so
	if (!Function.prototype.inherits)
	{
		Function.prototype.inherits = function(parent){
			var self = this;
			self.prototype = new parent;
			self.prototype.constructor = self;
			self.prototype.parent = parent.prototype;
			return self;
		};
	}
})();
