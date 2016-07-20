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
		uiElements = {
			// myElm: '.select-my-elm'
			audioEditor: '.audio_editor',
			previewContainer: '.audio_editor-preview',
			previewAudio: '.audio_editor-preview_audio',
			editFileBtn: '.js-upload',
			cancelUploadBtn: '.js-upload-cancel',
			undoUploadBtn: '.js-upload-undo',
			uploadFileInputContainer: '.audio_editor-intro',
			uploadFileInput: '.embed-modal-file-input'
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

	function updateAudioPreview(scope, file) {
		var $ui = scope.$ui;
		var promise = $.Deferred();
		var src_url = scope.getAudioUrl();
		var src_type = 'audio/mp3';

		$ui.previewAudio
			.attr('src', src_url)
			.attr('type', src_type);

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
		$ui.previewContainer.hide();
		$ui.editFileBtn.hide();
		$ui.undoUploadBtn.hide();

		// Show file input and related toolbar btns. Clean up after previous validation errors.
		$ui.uploadFileInput.removeClass('error')
			.parent().find('#upload-error').remove();
		$ui.uploadFileInputContainer.show();
		$ui.cancelUploadBtn.toggle(!!(scope.model.url_path || scope.model.upload));
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
			url_path: null,
			credit: null,
			creditLink: null
		};
	};

  audioEmbed.prototype.getAudioUrl = function() {
    return !!this.model.upload ? window.URL.createObjectURL(this.model.upload) : getAudioUrl(this.options.audioLocation, this.model.url_path);
  };

  audioEmbed.prototype.initModal = function($el, modalCtrl){
    var self = this;
    var $ui = registerUiElements(self, $el);

    $ui.editFileBtn.on('click', 'a', function(){
      $ui.uploadFileInput.click();
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
      updateFormWithFileData(modalCtrl.scope.currentEmbedType, file);
    });

    $(document).on('dragover drop', function(event) {
      event.preventDefault();
    });

    $ui.audioEditor
      .on('dragenter', function() {
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

	audioEmbed.prototype.getModelFromForm = function($form){
		var self = this;
		var oldModel = $.extend(true, {}, self.model);

		self.parent.getModelFromForm($form, self);

		if(!!oldModel.upload && !self.model.upload)
		{
			self.model.upload = oldModel.upload;
		}
	}

	audioEmbed.prototype.getModelFromFile = function(file){
		var self = this;
		var $ui = self.$ui;
		var promise = $.Deferred();

		if (!file)
		{
			file = self.model.upload;
		}

		musicmetadata(file, function(err, tags) {
			var currentModel, tempModel, prop;

			console.log('file tags', tags);

			// Get a model using the default mapping method
			tempModel = getModelFromData(tags, file);

			// Update model with current form values
			if($ui)
			{
				self.getModelFromForm($ui.form);
			}

			// Clone current model so we can manipulate it
			currentModel = $.extend(true, {}, self.model);

			// Remove null properties from currentModel so they don't overwrite
			// properties on tempModel during merge.
			for (prop in currentModel)
			{
				if(currentModel.hasOwnProperty(prop) && currentModel[prop] === null)
				{
					delete currentModel[prop];
				}
			}

			// Merge models together.
			// 		currentModel > tempModel
			self.model = $.extend(true, {}, tempModel, currentModel);

			// Current model may contain old upload file, make sure it is set to the new file
			self.model.upload = file;

			promise.resolve(self.model);
		});

		return promise;
	}

	audioEmbed.prototype.populateFormWithModel = function($form){
    var self = this;
    var promise = $.Deferred();

    self.parent.populateFormWithModel($form, self);

    if (!!self.model.upload || !!self.model.url_path)
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

	audioEmbed.prototype.parseForEditor = function(){
		var self = this;
		var embedHtml = [
			'<audio controls class="entity-embed-secondary-toolbar-locator" src="' + getAudioUrl(self.options.audioLocation, self.model.url_path) + '" type="audio/mp3"></audio>'
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