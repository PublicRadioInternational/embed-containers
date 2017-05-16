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
				if($parent.is('.embed-modal-input-group, .input-group'))
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
	genericEmbed.prototype.initModal = function($el, modalCtrl, child){
		var self = child || this;
		self.modalCtrl = modalCtrl;
		self.$el = $el;
	};

	genericEmbed.prototype.getModelFromForm = function($el, child){
		var self = child || this;
		var $formFields = $el.find('.embed-modal-form-control, .embed-modal-file-input');
		var model = {};

		$formFields.each(function() {
			var $this = $(this);
			var name = $this.attr('name');
			var type = $this.attr('type');
			var value = null;
			var $inputGroup;

			if(!name)
			{
				console.warning('Form input missing "name" attribute. Value not added to model.', $this[0]);
				return; // No need to gather value since we don't know where to store it.
			}

			switch (type)
			{
				case 'file':
				value = $this[0].files[0];
				break;

				case 'radio':
				if(typeof model[name] !== 'undefined')
				{
					return; // We have already collected values for this group of radios. Skip to next input.
				}

				// Get all inputs for this checkbox group.
				$inputGroup = $formFields.filter('[type=radio][name=' + name +']');

				// Set value to value of checked input in group
				$inputGroup.each(function() {
					var $this = $(this);
					if($this.is(':checked'))
					{
						value = $this.val();
						return false; // Exit loop. Only one radio in a group should be checked anyway.
					}
				});
				break;

				case 'checkbox':
				if(typeof model[name] !== 'undefined')
				{
					return; // We have already collected values for this group of checkboxes. Skip to next input.
				}

				// Get all inputs for this checkbox group.
				$inputGroup = $formFields.filter('[type=checkbox][name=' + name +']');

				if($inputGroup.length > 1)
				{
					// Get checked values and ensure value is either an array or null
					value = [];
					$inputGroup.each(function() {
						var $this = $(this);
						if($this.is(':checked'))
						{
							value.push($this.val());
						}
					});

					if(!value.length)
					{
						value = null;
					}
				}
				else
				{
					// Treat single checkboxes as boolean input for binary integer.
					value = !!$inputGroup.is(':checked') ? 1 : 0;
				}
				break;

				default:
				value = $this.val() || null;
				break;
			}

			// Most input values will be strings, but we want to convert some values into useful types
			if(typeof value === 'string')
			{
				value = !value.length ? null : // Convert empty strings to null
					// Convert numeric values to numbers
					// To see why this works:
					// 		http://stackoverflow.com/questions/175739/is-there-a-built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
					(+value === +value) ? +value :
					// Otherwise, use original value
					value;
			}

			// Add value to new model
			model[name] = value;
		});

		// console.log('getModelFromForm', model);

		// Merge new model into working model
		$.extend(self.model, model);
	};

	genericEmbed.prototype.populateFormWithModel = function($form, child){
		var self = child || this;
		var $formFields = $form.find('.embed-modal-form-control');

		$formFields.each(function() {
			var $this = $(this);
			var name = $this.attr('name');
			var type = $this.attr('type');
			var value, $inputGroup;

			if(!name)
			{
				console.warning('Form input missing "name" attribute. Value not set to input.', $this[0]);
				return; // No need to set value since we don't know where to get it off the model.
			}

			value = self.model[name];

			switch(type)
			{
				case 'file':
				return; // Skip file inputs. Won't have a value to set, and you can't do that anyway for security reasons.

				case 'checkbox':
				case 'radio':
				// Concider all inputs for this input group as our element set.
				$this = $formFields.filter('[type=' + type + '][name=' + name +']');
				case 'select':
				// Make sure we will pass an array to the .val method.
				// Inputs/options with values found in the array will be checked.
				// See: http://api.jquery.com/val/#val-value
				if(typeof value !== 'undefined' && value.constructor !== Array)
				{
					value = [value];
				}
				break;
			}

			// Set the input's value
			$this.val(value);
		});
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

		if (!self.model.object_type)
		{
			// add the object_type onto the model
			self.model.object_type = self.options.object_type;
		}

		return EntityEmbed.apiService.set({
			path: self.options.httpPaths.set,
			data: self.model
		}).done(function(resp) {
			self.staleModel = $.extend(true, {}, self.model);
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
