var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// PRIVATE
	var embedName = 'audio',
		defaults = {
			viewPath: base + 'modal/modal_audio.html',
			displayName: 'Audio',
			object_type: 'audio',
			audioLocation: 'https://test-services.pri.org',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required',
					mp3File: {
						required: true,
						extension: "mp3"
					},
					wavFile: {
						extension: "wav"
					}
				}
			},
			httpPaths:{
				uploadFile: 'https://test-services.pri.org/admin/embed/file-upload'
			}
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

		self.$mp3Form = $el.find('input[name="mp3File"]');
		self.$wavForm = $el.find('input[name="wavFile"]');
	};

	audioEmbed.prototype.saveEmbed = function(embedIsNew, successFunc, failFunc, alwaysFunc)
	{
		var self = this;
		self.parent.saveEmbed(embedIsNew, function(data){
			function sendFile(formData)
			{
				return $.ajax({
					url: self.options.httpPaths.uploadFile,
					type: 'POST',
					data: formData,
					headers: {
						'x-auth-token': EntityEmbed.apiService.getAuthToken(),
						'x-object-id': data.response.object_id,
						'x-debug': '1'
					},
					processData: false,
					contentType: false
				});
			};

			var mp3File = self.$mp3Form[0].files[0],
				wavFile = self.$wavForm[0].files[0];
			
			var sendMp3 = !!mp3File || isAddModal,  // always send if isAddModal, otherwise only send if user specified
				sendWav = !!wavFile;				// only send wav file if user specified

			if (sendWav)
			{
				var wavFormData = new FormData();
				wavFormData.append('upload', wavFile);
				sendFile(wavFormData)
					.success(function(data){
							self.model.wavFile = self.options.audioLocation + data.response.url_path;
						});
			}
			if (sendMp3)
			{
				var mp3FormData = new FormData();
				mp3FormData.append('upload', mp3File);
				sendFile(mp3FormData)
					.success(function(data){
						self.model.url_path = data.response.url_path;
						successFunc(data);
					})
					.fail(failFunc)
					.always(alwaysFunc);
			}
			else
			{
				successFunc(data);
			}
		}, failFunc, alwaysFunc, self);
	};

	audioEmbed.prototype.validate = function($el, isAddModal){
		var self = this;

		self.options.validationOptions.rules.mp3File.required = isAddModal;
		return self.parent.validate($el, isAddModal, self);
	};

	audioEmbed.prototype.parseForEditor = function(){
		var self = this;
		
		var fileType = self.model.url_path.substring(self.model.url_path.lastIndexOf('.') + 1);

		return  '<div class="audio-embed">' + 
					'<audio controls>' +
						'<source src="' + self.options.audioLocation + self.model.url_path +'" type="audio/' + fileType + '">' + 
					'</audio>' +
					'<div class="credit">Credit: ' + self.model.credit + '</div>' +
					'<div class="link">Link: ' + self.model.creditLink + '</div>' + 
				'</div>';
	};

})('');