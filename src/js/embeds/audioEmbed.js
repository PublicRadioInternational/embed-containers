(function(base, editorUtil){

	'use strict';

	// PRIVATE
	var embedName = 'audioEmbed',
		defaults = {
			viewPath: base + 'modal/modal_audio.html',
			displayName: 'Audio',
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
			creditText: null,
			creditLink: null
		};
	}


	function formatFileSize(bytes) {
		if (typeof bytes !== 'number')
		{
			return '';
		}

		if (bytes >= 100000000)
		{
			return (bytes / 1000000000).toFixed(2) + ' GB';
		}

		if (bytes >= 1000000)
		{
			return (bytes / 1000000).toFixed(2) + ' MB';
		}
		return (bytes / 1000).toFixed(2) + ' KB';
	};

	// CONSTRUCTOR
	function audioEmbed(options){
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

	audioEmbed.prototype.defaultStyle = 'entity-embed-center';


	// PUBLIC
	audioEmbed.prototype.init = function(){
		var self = this;
		self.model = cleanModel();
	};

	audioEmbed.prototype.initModal = function($el){
		var self = this;

		$el.find("input[name='audioFile']").fileupload({
			dataType: 'json',
			add: function(e, data){
				// TODO : better id (this one potentially has spaces)
				var listItem = $('<li id="' + data.files[0].name + '"><span></span></li>');
				
				listItem.find('span').html(data.files[0].name + ' - ' + 
					'<i>' + formatFileSize(data.files[0].size) + '</i>');

				data.context = listItem.appendTo($('#audioList'));
				
				data.submit().complete(function (result, textStatus, jqXHR) {
					if (!!result && !!result.responseJSON && !!result.responseJSON.path)
					{
						self.model.files.push(result.responseJSON.path);
					}
				});
			}
		});
	};

	audioEmbed.prototype.getModelFromForm = function($el){
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

	audioEmbed.prototype.clearForm = function($el){
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

	audioEmbed.prototype.editorEvents = function(){

	};

	audioEmbed.prototype.parseForEditor = function(){
		var self = this;

		return '<div class="audio-embed"><img src="' + self.model.files[0] +'" />' + 
			'<div class="audio-embed-caption">' + self.model.caption + '</div>' + 
			'<div class="audio-embed-credit">Credit: ' + self.model.credit + '</div></div>';	
	};


	// make the constructor accessible
	if (!editorUtil.embedTypeConstructors)
	{
		editorUtil.embedTypeConstructors = {};
	}
	editorUtil.embedTypeConstructors[embedName] = audioEmbed;

})('', MediumEditor.util);