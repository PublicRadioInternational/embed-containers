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
			put: 'https://test-services.pri.org/admin/embed/edit',	// TODO : rename API path handle (put is now a misnomer)
			post: 'https://test-services.pri.org/admin/embed/edit',
			get: 'https://test-services.pri.org/admin/embed/fetch',
			getAll: 'https://test-services.pri.org/admin/embed/list'
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
	// TODO: Get rid of self paramater. See inherits function
	genericEmbed.prototype.clearForm = function($el, self){
		function resetForm(){
 			if(!self.$validator)
 			{
 				return;
 			}
 			self.$validator.resetForm();
 		};
		
		if (!self){
			self = this;
		}
		else{
			self = self;
		}
		resetForm(self);
		var formList = $el.find('form');
		for (var x = 0; x < formList.length; x++)
		{
			formList[x].reset();
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
		self.$validator = $form.validate(self.options.validationOptions);
		return self.$validator;
	};

	// ASSUMPTION - model is already populated
	genericEmbed.prototype.saveEmbed = function(embedIsNew, successFunc, failFunc,alwaysFunc){
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
				fail: failFunc,
				always: alwaysFunc
			});
		}
		else
		{
			return EntityEmbed.apiService.put({
				path: self.options.httpPaths.put, 
				data: self.model,
				success: successFunc,
				fail: failFunc,
				always: alwaysFunc
			});
		}
	}

	EntityEmbedTypes.genericEmbed = genericEmbed;

	// augment Function to enable simple inheritance, if not already done so
	if (!Function.prototype.inherits)
	{
		Function.prototype.inherits = function(parent){
			var self = this;
			self.prototype = new parent; // TODO: Better way to mock protected data members
			self.prototype.constructor = self;
			self.prototype.parent = parent.prototype;
			return self;
		};
	}
})();
