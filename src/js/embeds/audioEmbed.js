var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'audio',
		defaults = {
			viewPath: 'modal_audio.html',
			displayName: 'Audio',
			object_type: 'audio',
			audioLocation: 'https://test-services.pri.org',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required',
					upload: {
						required: true,
						extension: "mp3"
					},
					wavFile: {
						extension: "wav"
					}
				}
			},
			httpPaths:{
				uploadFile: 'admin/embed/file-upload'
			}
		},
		uploadedAudioDisplay = '.uploaded-audio-file',
		cancelUploadAudioBtn = '.cancel-upload-file-btn',
		editAudioFileBtn = '.edit-chosen-file-btn',
		uploadMp3FileBtn = ".embed-modal-file-input",
		getAudioUrl = function(audioLocation, audioUrl)
		{
			if (!audioUrl || audioUrl === '')
			{
				return '';
			}
			if (audioUrl.indexOf(audioLocation) >= 0)
			{
				return audioUrl;
			}

			// ensure that there isn't an unintended '//' in final URL
			if (audioLocation.endsWith('/'))
			{
				audioLocation = audioLocation.substring(0, audioLocation.length - 1);
			}
			if (!audioUrl.startsWith('/'))
			{
				audioLocation = '/' + audioUrl;
			}

			return audioLocation + audioUrl;
		};

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
		self.parent.constructor(options, defaults, embedName, self);
	}

	audioEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = audioEmbed;

	// PUBLIC
	audioEmbed.prototype.orderIndex = 3;

	audioEmbed.prototype.audioPreviewClass = 'audio-preview';

	audioEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url_path: null,
			credit: null,
			creditLink: null
		};
	};

	audioEmbed.prototype.initModal = function($el){
		var self = this;	

		self.$mp3Form = $el.find('input[name="upload"]');
		//self.$wavForm = $el.find('input[name="wavFile"]');

		$el.find(editAudioFileBtn).on('click', function(){
			$el.find(uploadedAudioDisplay).hide();
			$el.find(editAudioFileBtn).hide();

			self.$mp3Form.css('display', 'inline-block');
			$el.find(cancelUploadAudioBtn).show();
		});

		$el.find(cancelUploadAudioBtn).on('click', function(){
			self.$mp3Form.hide();
			$el.find(cancelUploadAudioBtn).hide();
			if (self.$mp3Form.parent().find('#upload-error').is(':visible'))
			{
				self.$mp3Form.parent().find('#upload-error').hide();	
			}

			$el.find(editAudioFileBtn).show();
			$el.find(uploadedAudioDisplay).show();
		});

		$el.find(uploadMp3FileBtn).on('change', function(){
			var fileName =  $el.find(uploadMp3FileBtn)[0].files[0].name;
			$el.find("[name=title]").val(fileName);
		});
	};

	audioEmbed.prototype.clearForm = function($el){
		var self = this;
		self.parent.clearForm($el, self);

		$el.find(uploadedAudioDisplay).find('.' + self.audioPreviewClass).remove();
		$el.find(uploadedAudioDisplay).hide();
		$el.find(cancelUploadAudioBtn).hide();
		$el.find(editAudioFileBtn).hide();
		self.$mp3Form.show();
	};

	audioEmbed.prototype.saveEmbed = function(embedIsNew)
	{
		var self = this;
		var file = self.model.upload;
		delete self.model.upload;

		var promise = self.parent.saveEmbed(embedIsNew, self);
		
		if (!!file)
		{
			return promise.then(function(responseData){
				//var wavFile = self.$wavForm[0].files[0];
				// if (!!wavFile)				// only send wav file if user specified
				// {
				// 	var wavFormData = new FormData();
				// 	wavFormData.append('upload', wavFile);
				// 	sendFile(wavFormData)
				// 		.then(function(responseData){
				// 			self.model.wavFile = self.options.audioLocation + responseData.response.url_path;
				// 		});
				// }

				var mp3FormData = new FormData();
				mp3FormData.append('upload', file);

				return EntityEmbed.apiService.uploadFile({
					path: self.options.httpPaths.uploadFile,
					data: mp3FormData,
					headers: {
						'x-object-id': responseData.response.object_id
					}
				});
			})
			.done(function(responseData){
				self.model.url_path = responseData.response.url_path;
			});
		}
		else
		{
			return promise;
		}
	};

	audioEmbed.prototype.generateUploadedPreview = function() {
		var self = this;
		if (!!self.model.object_id) // this is an edit modal - there must be an existing url_path to the audio file
		{
			var fileType = self.model.url_path.substring(self.model.url_path.lastIndexOf('.') + 1);

			return '<audio controls class="' + self.audioPreviewClass + '">' +
						'<source src="' + getAudioUrl(self.options.audioLocation, self.model.url_path) + '" type="audio/' + fileType + '">' + 
					'</audio>';
		}
		else // this is an add modal - the audio has been uploaded by the client but not pushed to the server
		{
			return	'<div class="' + self.audioPreviewClass + '">' +
				(self.model.url_path || self.model.upload.name) +
			'</div>';
		}
	};

	audioEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		self.parent.populateFormWithModel($form, self);

		if (!self.model.upload && !self.model.url_path)
		{	
			return;
		}

		self.$mp3Form.hide();

		$form.find(uploadedAudioDisplay).show();
		$form.find(editAudioFileBtn).show();
		$form.find(uploadedAudioDisplay).append(self.generateUploadedPreview());
	};

	audioEmbed.prototype.parseForEditor = function(){
		var self = this;
		var fileType = 'mp3';

		if (!!self.model.url_path && self.model.url_path !== '')
		{
			fileType = self.model.url_path.substring(self.model.url_path.lastIndexOf('.') + 1);
		}
		
		return  '<div class="audio-embed">' + 
					'<audio controls>' +
						'<source src="' + getAudioUrl(self.options.audioLocation, self.model.url_path) + '" type="audio/' + fileType + '">' + 
					'</audio>' +
					'<div class="credit">Credit: ' + self.model.credit + '</div>' +
					'<div class="link">Link: ' + self.model.creditLink + '</div>' + 
				'</div>';
	};

})();