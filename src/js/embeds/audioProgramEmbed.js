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
			object_type: 'audio-program',
			audioLocation: 'https://test-services.pri.org',
			validationOptions: {
				onfocusout: function(elm, evt) {
					if($(elm).attr(name) === 'organization_program')
					{
						return false;
					}

					return true;
				},
				onkeyup: function(elm, evt) {
					if($(elm).attr(name) === 'organization_program')
					{
						return false;
					}

					return true;
				},
				rules: {
					title: 'required',
					organization_program: 'hasProgramData',
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
				getOrganizationFetch: 'admin/organization/fetch',
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

		return model;
	}

	function getAudioUrl(url) {
		var apiDomain = EntityEmbed.apiService.getFilesDomainName();

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
				onChooseEvent: function(){ // store the users program selection
					var itemData = $input.getSelectedItemData();
					var organization_program;

					if (!!itemData.object_id)
					{
						organization_program = {
							object_id: itemData.object_id,
							object_type: itemData.object_type
						};

						$input.data('organization_program', organization_program);
					}
					else
					{
						$input.removeData('organization_program');
					}

					scope.model.organization_program = $input.data('organization_program') || null;

					$input.focus();

					console.log('Program Change: ', $input.data('organization_program'), $input.val());
				}
			}
		};

		$input.easyAutocomplete(options);

		$input.on('keypress keydown', function(){
			var $this = $(this);
			var value = $this.val();
			if(!value.replace(/^\s+|\s+$/,''))
			{
				scope.model.organization_program = null;
				$this.removeData('organization_program');
				console.log('Program Removed: ', $this.data('organization_program'), value);
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
			organization_program: null,
			audio_type: null,
			object_type: defaults.object_type,
			explicit_content: 0
		};
	};

	audioProgramEmbed.prototype.getAudioUrl = function() {
		return !!this.model.upload ? window.URL.createObjectURL(this.model.upload) :
			!!this.model.url_external ? this.model.url_external :
			getAudioUrl(this.model.url_path);
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

		$.validator.addMethod('hasProgramData', function(value, element){
			return !!$(element).data('organization_program');
		}, $.validator.format('Valid Program must be selected.'));
	};

	audioProgramEmbed.prototype.clearForm = function($el){
		var self = this;
		self.parent.clearForm($el, self);

		self.$ui.previewAudio
			.removeAttr('src')
			.removeAttr('type');

		self.$ui.programInput
			.removeData('organization_program')
			.val('');

		showFileInput(self);
	};

	audioProgramEmbed.prototype.saveEmbed = function(embedIsNew)
	{
		var self = this;
		var file = self.model.upload;
		var promise = $.Deferred();

		delete self.model.upload;

		var embedPromise = self.parent.saveEmbed(embedIsNew, self);

		if (!!file)
		{
			embedPromise.then(function(responseData){
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
				promise.resolve(responseData);
			})
			.fail(function(xhr, textStatus, err) {
				console.error(textStatus, err);
				promise.reject(textStatus);
			});
		}
		else
		{
			embedPromise.then(function(responseData) {
				promise.resolve(responseData);
			});
		}

		return promise;
	};

	audioProgramEmbed.prototype.getModelFromForm = function($form){
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

		self.model.organization_program = self.$ui.programInput.data('organization_program');

		if(!!oldModel.upload && !self.model.upload)
		{
			self.model.upload = oldModel.upload;
		}

		if(!!self.model.url_external) {
			// Make sure local file data is removed when external URL is provided.
			// Need to do this here since the modal can be completed without the "Listen" btn being clicked.
			self.$ui.uploadFileInput.val('');
			delete self.model.upload;
			delete self.model.url_path;
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
		var deferreds = [];
		var programPromise, previewPromise;

		self.parent.populateFormWithModel($form, self);

		if(!!self.model.organization_program)
		{
			self.$ui.programInput.data('organization_program', self.model.organization_program);

			// Get program data from API
			programPromise = EntityEmbed.apiService.get({
				path: self.options.httpPaths.getOrganizationFetch,
				data: {
					object_id: self.model.organization_program.object_id
				}
			});

			programPromise.done(function(respData) {
				self.$ui.programInput.val(respData.response.title);
			});

			deferreds.push(programPromise);
		}
		else
		{
			self.$ui.programInput.data('organization_program', null);
		}

		if (!!self.model.upload || !!self.model.url_path || !!self.model.url_external)
		{
			previewPromise = updateAudioPreview(self)
				.done(function() {
					promise.resolve();
				});

			deferreds.push(previewPromise);
		}

		if(!!deferreds.length)
		{
			$.when.apply($, deferreds).always(function(){
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
		var programTitleId = ['program_title', self.model.organization_program.object_id, (new Date()).getTime()].join('_');
		var audioSrc = self.model.url_external || getAudioUrl(self.model.url_path);
		var embedHtml = [
			'<audio controls class="entity-embed-secondary-toolbar-locator" src="' + audioSrc + '"></audio>',
			'<div class="program">Program: <span id="' + programTitleId + '"></span></div>',
			'<div class="link">Type: ' + self.model.audio_type + '</div>'
		];

		EntityEmbed.apiService.get({
			path: self.options.httpPaths.getOrganizationFetch,
			data: {
				object_id: self.model.organization_program.object_id
			}
		})
		.done(function(data) {
			var programData = data.response;
			var $programTitle = $('#' + programTitleId);

			$programTitle.text(programData.title);
		});

		return '<div class="audio-embed">' + embedHtml.join('') +'</div>';
	};

})();