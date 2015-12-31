(function(base, editorUtil){

	'use strict';

	// PRIVATE
	var embedName = 'imagesEmbed',
		defaults = {
			viewPath: base + 'modal/modal_image.html',
			displayName: 'Image(s)',
			httpPaths: {
				put: '',
				post: '',
				get: '',
				del: ''
			}
		};

	function cleanModel(){
		return {
			files: [],
			altText: null,
			titleText: null,
			credit: null,
			creditLink: null,
			caption: null,
			license: null
		};
	}

	function formatFileSize(bytes) {
		if (typeof bytes !== 'number') {
			return '';
		}

		if (bytes >= 100000000) {
			return (bytes / 1000000000).toFixed(2) + ' GB';
		}

		if (bytes >= 1000000) {
			return (bytes / 1000000).toFixed(2) + ' MB';
		}
		return (bytes / 1000).toFixed(2) + ' KB';
	};

	// CONSTRUCTOR
	function imagesEmbed(options){
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
	imagesEmbed.prototype.init = function(){
		var self = this;
		self.model = cleanModel();
	};

	imagesEmbed.prototype.initModal = function($el){
		var self = this;

		$el.find("input[name='imageFile']").fileupload({
			dataType: 'json',
			add: function(e, data){
				// TODO : better id (this one potentially has spaces)
				var listItem = $('<li id="' + data.files[0].name + '"><span></span></li>');
				
				listItem.find('span').html(data.files[0].name + ' - ' + 
					'<i>' + formatFileSize(data.files[0].size) + '</i>');
				
				data.context = listItem.appendTo($('#imagesList'));
				
				data.submit().complete(function (result, textStatus, jqXHR) {
					if (!!result && !!result.responseJSON && !!result.responseJSON.path)
					{
						self.model.files.push(result.responseJSON.path);
					}
				});
			}
		});
	};

	imagesEmbed.prototype.getModelFromForm = function($el){
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

	imagesEmbed.prototype.clearForm = function($el){
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

	imagesEmbed.prototype.editorEvents = function(){};

	imagesEmbed.prototype.parseForEditor = function(){
		return '<img class="entity-embed" src="' + this.model.files[0] +'" />';
	};


	// make the constructor accessible
	if (!editorUtil.embedTypeConstructors)
	{
		editorUtil.embedTypeConstructors = {};
	}
	editorUtil.embedTypeConstructors[embedName] = imagesEmbed;

})('', MediumEditor.util);