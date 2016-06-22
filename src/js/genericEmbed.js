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
			set: 'admin/embed/edit',	// TODO : rename API path handle (put is now a misnomer)
			get: 'admin/embed/fetch',
			getAll: 'admin/embed/list'
		},
		styles: {
			left: true,
			right: true,
			center: true,
			wide: true
		},
		validationOptions: {
			focusCleanup: true,
			errorPlacement: function(error, element) {
				var $parent = element.parent();
				if($parent.is('.embed-modal-input-group'))
				{
					error.insertAfter( $parent );
				}
				else
				{
					error.insertAfter( element );
				}
			}
		}
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

	genericEmbed.prototype.getModelFromForm = function($el, child){
		var self = child || this;
		var formFields = $el.find('.embed-modal-form-control, .embed-modal-file-input');
		for(var i = 0; i < formFields.length; i++)
		{
			var name = formFields[i].name;
			var type = formFields[i].type;
			var value = null;
			if (type === 'file')
			{
				value = formFields[i].files[0];
			}
			else
			{
				value = formFields[i].value;
			}
			if (!!name)
			{
				self.model[name] = value;
			}
		}

    console.log('genericEmbed::getModelFromForm::self', $.extend(true, {}, self));

		self.model.html_rendered = null;
	};

	genericEmbed.prototype.populateFormWithModel = function($form, child){
		var self = child || this;
		var formFields = $form.find('.embed-modal-form-control');
		for (var i = 0; i < formFields.length; i++)
		{
			if (!!formFields[i].type && formFields[i].type.indexOf('file') !== -1)
			{
				continue;
			}
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
	genericEmbed.prototype.clearForm = function($el, child){
		var self = child || this;

		var $form = $el;
		if (!$form.is('form'))
		{
			$form = $el.find('form');
		}
		$form.each(function(){
			$(this).validate(self.options.validationOptions).resetForm();
		});

		var formList = $el.find('form');
		for (var i = 0; i < formList.length; i++)
		{
			formList[i].reset();
		}
	 	self.model = self.cleanModel();
	};

	genericEmbed.prototype.parseForEditor = function(){
		var self = this;
		return	'<div class="embedded-content">' +
					'<div class="ui-text"> <strong>Embed Type: </strong>' 	+ self.options.object_type + '</div>' +
					'<div class="ui-text"> <strong>Title: </strong> ' 		+ self.model.title + '</div>' +
				'</div>';
	};

	// returns validator object
	genericEmbed.prototype.validate = function($el, isAddModal, child){
		var self = child || this;
		var $form = $el;
		if (!$form.is('form'))
		{
			$form = $el.find('form');
		}
		self.$validator = $form.each(function(){
			$(this).validate(self.options.validationOptions);
		});
		return self.$validator;
	};

	// ASSUMPTION - model is already populated
	// TODO : embedIsNew can be determined programatically (check if model has object_id)
	genericEmbed.prototype.saveEmbed = function(embedIsNew, child){
		var self = child || this;

    console.log('genericEmbed::saveEmbed::self', $.extend(true, {}, self));

		if (embedIsNew)
		{
			// add the object_type onto the model
			self.model.object_type = self.options.object_type;
		}

		return EntityEmbed.apiService.set({
			path: self.options.httpPaths.set,
			data: self.model
		});
	};

	EntityEmbed.embedTypes = {
		genericEmbed: genericEmbed
	};

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
