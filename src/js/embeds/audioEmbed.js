var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'audio',
		uploadedAudioDisplay = '.uploaded-audio-file',
		cancelUploadAudioBtn = '.cancel-upload-file-btn',
		editAudioFileBtn = '.edit-chosen-file-btn',
		uploadMp3FileBtn = '.embed-modal-file-input',
		uiElements = {
			// myElm: '.select-my-elm'
			audioEditor: '.audio_editor',
			previewContainer: '.audio_editor-preview',
			previewAudio: '.audio_editor-preview_audio',
			editFileBtn: '.js-edit-file',
			cancelUploadBtn: '.js-upload-cancel',
			undoUploadBtn: '.js-upload-undo',
			uploadFileInputContainer: '.audio_editor-intro',
			uploadFileInput: '.embed-modal-file-input',
			urlExternalInput: '.embed-modal-url-external',
			setUrlBtn: '.js-set-url'
		},
		defaults = {
			viewPath: 'modal_audio.html',
			displayName: 'Audio',
			object_type: 'audio',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required',
					upload: {
						required: {
							depends: function(element) {
								return !$(uiElements.urlExternalInput, $(element).closest('form')).val();
							}
						},
						extension: 'mp3'
					},
					url_external: {
						required: {
							depends: function(element) {
								return !$(uiElements.uploadFileInput, $(element).closest('form')).val();
							}
						}
					},
					wavFile: {
						extension: 'wav'
					}
				}
			},
			httpPaths:{
				uploadFile: 'admin/embed/file-upload'
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

	function getModelFromData(data, file) {
		var model = {};

		// Title
		model.title = file.name;

		// Credit
		model.credit = data.artist;

		return model;
	}

	function getAudioUrl(url) {
		var apiDomain = EntityEmbed.apiService.getDomainName();

		if (!url || url === '')
		{
			return '';
		}

		if (url.indexOf(apiDomain) >= 0)
		{
			return url;
		}

		// ensure that there isn't an unintended '//' in final URL
		if (apiDomain.endsWith('/'))
		{
			apiDomain = apiDomain.substring(0, apiDomain.length - 1);
		}
		if (!url.startsWith('/'))
		{
			url = '/' + url;
		}

		return apiDomain + url;
	}

	function registerUiElements(scope, $el) {
		scope.$ui = scope.$ui || {
			form: $el
		};

		for(key in uiElements)
		{
			if(uiElements.hasOwnProperty(key))
			{
				scope.$ui[key] = $(uiElements[key], $el);
			}
		}

		return scope.$ui;
	}

	function updateAudioPreview(scope) {
		var $ui = scope.$ui;
		var promise = $.Deferred();
		var src_url = scope.getAudioUrl();

		$ui.previewAudio
			.attr('src', src_url);

		promise.resolve();

		return promise;
	}

	function updateFormWithFileData(scope, file) {
		var $ui = scope.$ui;
		var promise = $.Deferred();

		scope.getModelFromFile(file)
			.done(function (model) {

				scope.populateFormWithModel($ui.form)
					.done(function () {
						promise.resolve();
					});

			});

		return promise;
	}

	function showAudioPreview(scope) {
		var $ui = scope.$ui;

		return updateAudioPreview(scope)
			.done(function(){
				// Hide file input and related toolbar btns
				$ui.uploadFileInputContainer.hide();
				$ui.cancelUploadBtn.hide();

				// Show Image Preview and related toolbar btns
				$ui.previewContainer.show();
				$ui.editFileBtn.show();
				$ui.undoUploadBtn.toggle(!!scope.model.url_path && !!scope.model.upload);
			});
	}

	function showFileInput(scope) {
		var $ui = scope.$ui;

		// Hide Image Preview and related toolbar btns
		$ui.uploadFileInput.val('');
		$ui.previewContainer.hide();
		$ui.editFileBtn.hide();
		$ui.undoUploadBtn.hide();

		// Show file input and related toolbar btns. Clean up after previous validation errors.
		$ui.uploadFileInput.removeClass('error')
			.parent().find('#upload-error').remove();
		$ui.uploadFileInputContainer.show();
		$ui.cancelUploadBtn.toggle(!!(scope.model.url_path || scope.model.upload || scope.model.url_external));
	}

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
			duration: null,
			url_path: null,
			url_external: null,
			credit: null,
			creditLink: null,
			object_type: defaults.object_type
		};
	};

	audioEmbed.prototype.getAudioUrl = function() {
		return !!this.model.upload ? window.URL.createObjectURL(this.model.upload) :
			!!this.model.url_external ? this.model.url_external :
			getAudioUrl(this.model.url_path);
	};

	audioEmbed.prototype.initModal = function($el, modalCtrl){
		var self = this;
		var $ui;

		self.parent.initModal($el, modalCtrl, self);

		$ui = registerUiElements(self, $el);

		$ui.editFileBtn.on('click', 'a', function(){
			showFileInput(modalCtrl.scope.currentEmbedType);
		});

		$ui.cancelUploadBtn.on('click', 'a', function(){
			showAudioPreview(modalCtrl.scope.currentEmbedType);
		});

		$ui.undoUploadBtn.on('click', 'a', function() {
			delete modalCtrl.scope.currentEmbedType.model.upload;
			$ui.uploadFileInput.val('');
			showAudioPreview(modalCtrl.scope.currentEmbedType);
		});

		$ui.uploadFileInput.on('change', function(evt){
			var file = evt.target.files[0];
			$ui.urlExternalInput.val('');
			updateFormWithFileData(modalCtrl.scope.currentEmbedType, file);
		});

		$(document).on('dragover drop', function(evt) {
			evt.preventDefault();
		});

		$ui.audioEditor
			.on('dragenter dragover', function() {
				$(this).addClass('js-dragover');
			})
			.on('dragleave drop', function() {
				$(this).removeClass('js-dragover');
			})
			.on('drop', function(evt) {
				evt.preventDefault();

				var $this = $(this);
				var files = evt.originalEvent.dataTransfer.files;
				var file;

				if (!!files && !!files.length)
				{
					file = files[0];

					console.log('dropped file', file);

					if(!/(?:mpeg|mp3)/.test(file.type))
					{
						return;
					}

					$this.addClass('js-dropped');

					setTimeout(function() {

						updateFormWithFileData(modalCtrl.scope.currentEmbedType, file)
							.done(function() {
								setTimeout(function() {
									$this.removeClass('js-dropped');
								}, 300);
							});

					}, 300);
				}
			});

		$ui.setUrlBtn.on('click', function(evt) {
			var $this = $(this);
			var btnInnerHtml = $this.html();

			evt.preventDefault();

			// Get model from form
			modalCtrl.scope.currentEmbedType.getModelFromForm($ui.form);

			console.log('Set URL', modalCtrl.scope.currentEmbedType.model);

			if(!!modalCtrl.scope.currentEmbedType.model.url_external) {
				// Make sure local file data is removed
				$ui.uploadFileInput.val('');
				delete modalCtrl.scope.currentEmbedType.model.upload;
				delete modalCtrl.scope.currentEmbedType.model.url_path;

				$this.html('Loading...');

				showAudioPreview(modalCtrl.scope.currentEmbedType)
					.done(function() {
						$this.html(btnInnerHtml);
					});
			}
		});
	};

	audioEmbed.prototype.clearForm = function($el){
		var self = this;
		self.parent.clearForm($el, self);

		self.$ui.previewAudio
			.removeAttr('src')
			.removeAttr('type');

		showFileInput(self);
	};

	audioEmbed.prototype.saveEmbed = function(embedIsNew)
	{
		var self = this;
		var file = self.model.upload;
		delete self.model.upload;

		var promise = self.parent.saveEmbed(embedIsNew, self);

		if (!!file)
		{
			promise.then(function(responseData){
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

		return promise;
	};

	audioEmbed.prototype.getModelFromForm = function($form){
		var self = this;
		var $ui = self.$ui;
		var duration = $ui.previewAudio[0].duration;
		var oldModel = $.extend(true, {}, self.model);
		var promise = $.Deferred();

		function onLoadedMetadata() {
			$ui.previewAudio.off('loadedmetadata', onLoadedMetadata);
			self.model.duration = this.duration;
			promise.resolve();
		}

		self.parent.getModelFromForm($form, self);

		if(!!self.model.url_external) {
			// Make sure local file data is removed when external URL is provided.
			// Need to do this here since the modal can be completed without the "Listen" btn being clicked.
			self.$ui.uploadFileInput.val('');
			delete self.model.upload;
			delete self.model.url_path;
		}

		if(!!oldModel.upload && !self.model.upload)
		{
			self.model.upload = oldModel.upload;
		}

		if(!duration)
		{
			$ui.previewAudio.on('loadedmetadata', onLoadedMetadata);
			updateAudioPreview(self);
		}
		else
		{
			self.model.duration = duration;
			promise.resolve();
		}

		return promise;
	}

	audioEmbed.prototype.getModelFromFile = function(file){
		var self = this;
		var $ui = self.$ui;
		var promise = $.Deferred();
		var musicmetadata = (typeof define === 'function' && define.amd) ? require('musicmetadata') : window.musicmetadata;

		console.log('musicmetadata: ', musicmetadata);

		function extendCurrentModel(model) {
			var currentModel, prop;
			// Clone current model so we can manipulate it
			currentModel = $.extend(true, {}, self.model);

			// Remove null properties from currentModel so they don't overwrite
			// properties on model during merge.
			for (prop in currentModel)
			{
				if(currentModel.hasOwnProperty(prop) && currentModel[prop] === null)
				{
					delete currentModel[prop];
				}
			}

			// Merge models together.
			// 		currentModel > model
			self.model = $.extend(true, {}, model, currentModel);

			// Current model may contain old upload file, make sure it is set to the new file
			self.model.upload = file;

			promise.resolve(self.model);
		}

		if (!file)
		{
			file = self.model.upload;
		}

		// Update model with current form values
		if($ui)
		{
			self.getModelFromForm($ui.form);
		}

		if(musicmetadata)
		{
			musicmetadata(file, function(err, tags) {

				console.log('file tags', tags);

				extendCurrentModel( getModelFromData(tags, file) );
			});
		}
		else
		{
			extendCurrentModel( getModelFromData({}, file) );
		}

		return promise;
	}

	audioEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		var promise = $.Deferred();

		self.parent.populateFormWithModel($form, self);

		if (!!self.model.upload || !!self.model.url_path || !!self.model.url_external)
		{
			showAudioPreview(self)
				.done(function() {
					promise.resolve();
				});
		}
		else
		{
			promise.resolve();
		}

		return promise;
	};

	audioEmbed.prototype.parseForEditor = function(){
		var self = this;
		var audioSrc = self.model.url_external || getAudioUrl(self.model.url_path);
		var embedHtml = [
			'<audio controls class="entity-embed-secondary-toolbar-locator" src="' + audioSrc + '"></audio>'
		];

		if(!!self.model.credit)
		{
			embedHtml.push('<div class="credit">Credit: ' + self.model.credit + '</div>');
		}

		if(!!self.model.creditLink)
		{
			embedHtml.push('<div class="link">Link: ' + self.model.creditLink + '</div>');
		}

		return '<div class="audio-embed">' + embedHtml.join('') +'</div>';
	};

})();