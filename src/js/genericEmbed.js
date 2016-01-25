var EntityEmbedTypes = EntityEmbedTypes || {};

(function(namespace){

	'use strict';

	// CONSTRUCTOR
	function genericEmbed(options, defaults, embedName, ref){
		var self = ref || this;
		self.name = embedName;
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
			get: ''	
		}
	};

	genericEmbed.prototype.get = function(id){
		var self = this;

		if (!!self.options.httpRequests.get.path &&
			self.options.httpRequests.get.path !== ''){

			$.support.cors = true;

			return $.ajax({
				timeout: 15000,
				crossDomain: true,
				type: httpMethodType,
				dataType: 'application/json',
				url: self.options.httpPaths.get + id
			});
		}
		console.log('No path specified to GET embed type.');
	};

	genericEmbed.prototype.put = function(id){
		var self = this;

		if (!!self.options.httpRequests.put.path &&
			self.options.httpRequests.put.path !== ''){

			$.support.cors = true;

			return $.ajax({
				timeout: 15000,
				crossDomain: true,
				type: httpMethodType,
				dataType: 'application/json',
				url: self.options.httpPaths.put + id,
				data: self.model
			});
		}
		console.log('No path specified to PUT embed type.');
	};

	genericEmbed.prototype.post = function(){
		var self = this;

		if (!!self.options.httpRequests.post.path && self.options.httpRequests.post.path !== ''){

			$.support.cors = true;

			return $.ajax({
				timeout: 15000,
				crossDomain: true,
				type: httpMethodType,
				dataType: 'application/json',
				url: self.options.httpPaths.post,
				data: self.model
			});
		}
		console.log('No path specified to POST embed type.');
	};

	genericEmbed.prototype.cleanModel = function(){
		return {
		};
	};

	genericEmbed.prototype.defaultStyle = ''; 

	genericEmbed.prototype.init = function(){
		var self = this;
		self.model = self.cleanModel();
	};

	genericEmbed.prototype.initModal = function($el){
		var self = this;
	};

	genericEmbed.prototype.getModelFromForm = function($el){
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

	genericEmbed.prototype.populateFormWithModel = function($form){
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

	genericEmbed.prototype.clearForm = function($el){
		var self = this;
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
		self.model = self.cleanModel();
	};

	genericEmbed.prototype.editorEvents = function(){};

	genericEmbed.prototype.parseForEditor = function(){
		return '<pre class="embedded-content">' + JSON.stringify(this.model, null, 4) +'</pre>';
	};

	namespace.genericEmbed = genericEmbed;

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
})(EntityEmbedTypes);