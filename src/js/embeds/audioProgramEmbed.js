var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'audioProgram',
		uploadedAudioDisplay = '.uploaded-audio-file',
		cancelUploadAudioBtn = '.cancel-upload-file-btn',
		editAudioFileBtn = '.edit-chosen-file-btn',
		uploadMp3FileBtn = '.embed-modal-file-input',
		uiElements = {
			// myElm: '.select-my-elm'
			programInput: '.js-program',
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
			viewPath: 'modal_audioProgram.html',
			displayName: 'Program Audio',
			object_type: 'audio_program',
			audioLocation: 'https://test-services.pri.org',
			validationOptions: {
				rules: {
					title: 'required',
					program: 'required',
					audio_type: 'required',
					upload: {
						required: {
							depends: function(element) {
								return !$(uiElements.urlExternalInput).val();
							}
						},
						extension: 'mp3'
					},
					url_external: {
						required: {
							depends: function(element) {
								return !$(uiElements.uploadFileInput).val();
							}
						}
					},
					wavFile: {
						extension: 'wav'
					}
				}
			},
			httpPaths:{
				getOrganizationList: 'admin/organization/list',
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

	function getAudioUrl(audioLocation, audioUrl) {
		if (!audioUrl || audioUrl === '')
		{
			return audioLocation || '';
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
	}


	//	This provides the functionality/styling for the type-ahead feature, allowing the user to only
	//	begin typing the title of a story and have a dropdown list of stories displayed to them
	//	based on their input. This function also takes into account validation of the modal form.
	function initAutoComplete(scope, $el){
		var rgxDevEnv = /^[^.]*staging[^.]*\.|\.dev$/;
		var isDevEnv = rgxDevEnv.test(window.location.host);
		var debug = 0;
		var ajaxData = {
			auth_token: EntityEmbed.apiService.getAuthToken(),
			organization_type: 'program',
			published: true
		};
		var $input = scope.$ui.programInput;

		if(isDevEnv)
		{
			ajaxData.debug = 1;
		}

		var options = {
			ajaxSettings: {
				dataType: 'json',
				method: 'POST',
				data: ajaxData
			},
			requestDelay: 600,
			url: function(phrase) {
				ajaxData.title = phrase;
				return EntityEmbed.apiService.getDomainName() + scope.options.httpPaths.getOrganizationList;
			},
			listLocation: function(listOfData){
				return listOfData.response.data;
			},
			getValue: function(data) {
				if(data.pub_state == 1)
				{
					return data.title;
				}
				else
				{
					return '';
				}
			},
			preparePostData: function(data) {
				data.title = $input.val();
				return JSON.stringify(data);
			},
			list: {
				maxNumberOfElements: 10,
				match: {
					enabled: true
				},
				sort: {
					enabled: true
				},
				onChooseEvent: function(){ // store the users story selection
					var itemData = $input.getSelectedItemData();

					if (!!itemData.object_id)
					{
						scope.model.program = {
							object_id: itemData.object_id,
							object_type: itemData.object_type
						};
					}
					else
					{
						scope.model.program = null;
					}

					console.log('Program Change: ', scope.model.program, $input.val());
				}
			}
		};

		$input.easyAutocomplete(options);

		$input.on('keypress keydown', function(){
			var $this = $(this);
			var value = $this.val();
			if(!value.replace(/^\s+|\s+$/,''))
			{
				scope.model.program = null;
				console.log('Program Removed: ', scope.model.program, value);
			}
		});

		$input.closest('.easy-autocomplete').removeAttr('style');
	};

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

		showAudioPreview(scope);

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

		// Hide file input and related toolbar btns
		$ui.uploadFileInputContainer.hide();
		$ui.cancelUploadBtn.hide();

		// Show Image Preview and related toolbar btns
		$ui.previewContainer.show();
		$ui.editFileBtn.show();
		$ui.undoUploadBtn.toggle(!!scope.model.url_path && !!scope.model.upload);
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
	function audioProgramEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	}

	audioProgramEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = audioProgramEmbed;

	// PUBLIC
	audioProgramEmbed.prototype.orderIndex = 3;

	audioProgramEmbed.prototype.audioPreviewClass = 'audio-preview';

	audioProgramEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url_path: null,
			url_external: null,
			program: null,
			audio_type: null
		};
	};

	audioProgramEmbed.prototype.getAudioUrl = function() {
		return !!this.model.upload ? window.URL.createObjectURL(this.model.upload) :
			!!this.model.url_external ? this.model.url_external :
			getAudioUrl(this.options.audioLocation, this.model.url_path);
	};

	audioProgramEmbed.prototype.initModal = function($el, modalCtrl){
		var self = this;
		var $ui = registerUiElements(self, $el);

		$ui.editFileBtn.on('click', 'a', function(){
			showFileInput(modalCtrl.scope.currentEmbedType);
		});

		$ui.cancelUploadBtn.on('click', 'a', function(){
			showAudioPreview(modalCtrl.scope.currentEmbedType);
		});

		$ui.undoUploadBtn.on('click', 'a', function() {
			delete modalCtrl.scope.currentEmbedType.model.upload;
			$ui.uploadFileInput.val('');
			updateAudioPreview(modalCtrl.scope.currentEmbedType);
		});

		$ui.uploadFileInput.on('change', function(event){
			var file = event.target.files[0];
			$ui.urlExternalInput.val('');
			updateFormWithFileData(modalCtrl.scope.currentEmbedType, file);
		});

		$(document).on('dragover drop', function(event) {
			event.preventDefault();
		});

		$ui.audioEditor
			.on('dragenter dragover', function() {
				$(this).addClass('js-dragover');
			})
			.on('dragleave drop', function() {
				$(this).removeClass('js-dragover');
			})
			.on('drop', function(event) {
				event.preventDefault();

				var $this = $(this);
				var files = event.originalEvent.dataTransfer.files;
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

		$ui.setUrlBtn.on('click', function(event) {
			var $this = $(this);
			var btnInnerHtml = $this.html();

			event.preventDefault();

			// Get model from form
			modalCtrl.scope.currentEmbedType.getModelFromForm($ui.form);

			console.log('Set URL', modalCtrl.scope.currentEmbedType.model);

			if(!!modalCtrl.scope.currentEmbedType.model.url_external) {
				// Make sure local file data is removed
				$ui.uploadFileInput.val('');
				delete modalCtrl.scope.currentEmbedType.model.upload;
				delete modalCtrl.scope.currentEmbedType.model.url_path;

				$this.html('Loading...');

				updateAudioPreview(modalCtrl.scope.currentEmbedType)
					.done(function() {
						$this.html(btnInnerHtml);
					});
			}
		});

		initAutoComplete(self, $el);
	};

	audioProgramEmbed.prototype.clearForm = function($el){
		var self = this;
		self.parent.clearForm($el, self);

		self.$ui.previewAudio
			.removeAttr('src')
			.removeAttr('type');

		showFileInput(self);
	};

	audioProgramEmbed.prototype.saveEmbed = function(embedIsNew)
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

	audioProgramEmbed.prototype.getModelFromForm = function($form){
		var self = this;
		var oldModel = $.extend(true, {}, self.model);

		self.parent.getModelFromForm($form, self);

		if(!!oldModel.upload && !self.model.upload)
		{
			self.model.upload = oldModel.upload;
		}
	}

	audioProgramEmbed.prototype.getModelFromFile = function(file){
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

	audioProgramEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		var promise = $.Deferred();

		self.parent.populateFormWithModel($form, self);

		if (!!self.model.upload || !!self.model.url_path || !!self.model.url_external)
		{
			updateAudioPreview(self)
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

	audioProgramEmbed.prototype.parseForEditor = function(){
		var self = this;
		var audioSrc = self.model.url_external || getAudioUrl(self.options.audioLocation, self.model.url_path);
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