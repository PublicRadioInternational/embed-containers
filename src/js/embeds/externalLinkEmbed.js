var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'externalLink',
		uiElements = {
			// myElm: '.select-my-elm'
			imageEditor: '.image_editor',
			imageEditorPreview: '.image_editor-preview',
			imageEditorPreviewImage: '.image_editor-preview_image',
			editImageFileBtn: '.js-upload',
			cancelUploadImageBtn: '.js-upload-cancel',
			removeUploadImageBtn: '.js-upload-remove',
			undoUploadImageBtn: '.js-upload-undo',
			uploadFileInputContainer: '.image_editor-intro',
			uploadFileInput: '.embed-modal-file-input',
			teaserTitleInput: '.js-input-displayTitle'
		},
		defaults = {
			viewPath: 'modal_externalLink.html',
			displayName: 'External Link',
			object_type: 'external-link',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required',
					linkText: 'required',
					teaser: {
						required: {
							depends: function(element) {
								return !!$(uiElements.teaserTitleInput, $(element).closest('form')).val();
							}
						}
					}
				},
				messages: {
					teaser: {
						required: 'Teaser required when Teaser Title is set.'
					}
				}
			},
			httpPaths:{
				uploadFile: 'admin/embed/file-upload'
			}
		};

	function getImageUrl(url)
	{
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

	function getModelFromData(data, file) {
		var model = {};
		var creditArray = [];

		// Alt Text
		// model.teaser_image_alt = data.headline;

		return model;
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

	function updateImagePreview(scope, file) {
		var $ui = scope.$ui;
		var image = new Image();
		var promise = $.Deferred();
		var imageUrl;

		function handleLoad() {
			showImagePreview(scope);
			promise.resolve();
			$(this).off('load', handleLoad);
		}

		$ui.imageEditorPreviewImage.on('load', handleLoad);

		if (file)
		{
			scope.model.upload = file;
		}

		imageUrl = scope.getImageUrl();

		$ui.imageEditorPreview.css('background-image', 'url("' + imageUrl + '")')
		$ui.imageEditorPreviewImage.attr('src', imageUrl);

		return promise;
	}

	function updateFormWithImageData(scope, file) {
		var $ui = scope.$ui;
		var promise = $.Deferred();

		scope.getModelFromFile(file)
			.done(function (model) {

				scope.populateFormWithModel(scope.$el)
					.done(function () {
						promise.resolve();
					});

			});

		return promise;
	}

	function removeUploadImage(scope) {
		var $ui = scope.$ui;

		// Remove
		scope.model.upload = null;
		scope.model.url_path = null;

		// Remove value from upload input
		resetFileInput($ui.uploadFileInput);
	}

	function resetFileInput($el) {
		$el.attr('type', '').attr('type', 'file');
	}

	function showImagePreview(scope) {
		var $ui = scope.$ui;

		// Hide file input and related toolbar btns
		$ui.uploadFileInputContainer.hide();
		$ui.cancelUploadImageBtn.hide();

		// Show Image Preview and related toolbar btns
		$ui.imageEditorPreview.show();
		$ui.editImageFileBtn.show();
		$ui.undoUploadImageBtn.toggle(!!scope.model.url_path && !!scope.model.upload);
		$ui.removeUploadImageBtn.toggle(!!scope.model.url_path || !!scope.model.upload);
	}

	function showFileInput(scope) {
		var $ui = scope.$ui;

		// Hide Image Preview and related toolbar btns
		$ui.imageEditorPreview.hide();
		$ui.editImageFileBtn.hide();
		$ui.removeUploadImageBtn.hide();

		// Show file input and related toolbar btns. Clean up after previous validation errors.
		$ui.uploadFileInput.removeClass('error')
			.parent().find('#upload-error').remove();
		$ui.uploadFileInputContainer.show();
		$ui.cancelUploadImageBtn.toggle(!!(scope.model.url_path || scope.model.upload));
		$ui.undoUploadImageBtn.toggle(!!scope.staleModel && !!scope.staleModel.url_path && !(scope.model.url_path || scope.model.upload));
	}

	// CONSTRUCTOR
	function externalLinkEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	externalLinkEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = externalLinkEmbed;

	// PUBLIC
	externalLinkEmbed.prototype.orderIndex = 9;

	externalLinkEmbed.prototype.cleanModel = function(){
		return {
			url_path: null, // URL to upload image file
			upload: null,	// form data for upload image file
			title: null,
			displayTitle: null,
			teaser: null,
			linkText: null,
			url: null,
			object_type: defaults.object_type
		};
	};

	externalLinkEmbed.prototype.getImageUrl = function() {
		return !!this.model.upload ? window.URL.createObjectURL(this.model.upload) :  getImageUrl(this.model.url_path);
	};

	externalLinkEmbed.prototype.initModal = function($el, modalCtrl){
		var self = this;
		var $ui;

		self.parent.initModal($el, modalCtrl, self);

		$ui = registerUiElements(self, $el);

		$ui.editImageFileBtn.on('click', 'a', function(){
			$ui.uploadFileInput.click();
		});

		$ui.cancelUploadImageBtn.on('click', 'a', function(){
			showImagePreview(modalCtrl.scope.currentEmbedType);
		});

		$ui.removeUploadImageBtn.on('click', 'a', function(){
			removeUploadImage(modalCtrl.scope.currentEmbedType);
			showFileInput(modalCtrl.scope.currentEmbedType);
		});

		$ui.undoUploadImageBtn.on('click', 'a', function() {
			var model = modalCtrl.scope.currentEmbedType.model

			// Remove upload from model and clear input
			delete modalCtrl.scope.currentEmbedType.model.upload;
			resetFileInput($ui.uploadFileInput);

			// Reset url_path to stale path if it was removed
			modalCtrl.scope.currentEmbedType.model.url_path = modalCtrl.scope.currentEmbedType.model.url_path || modalCtrl.scope.currentEmbedType.staleModel.url_path;

			updateImagePreview(modalCtrl.scope.currentEmbedType);
		});

		$ui.uploadFileInput.on('change', function(evt){
			var file = evt.target.files[0];
			updateFormWithImageData(modalCtrl.scope.currentEmbedType, file);
		});

		$(document).on('dragover drop', function(evt) {
			evt.preventDefault();
		});

		$ui.imageEditor
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

					if(file.type.indexOf('image') === -1)
					{
						return;
					}

					$this.addClass('js-dropped');

					setTimeout(function() {
						updateFormWithImageData(modalCtrl.scope.currentEmbedType, file)
							.done(function() {
								setTimeout(function() {
									$this.removeClass('js-dropped');
								}, 300);
							});

					}, 300);
				}
			});
	};

	externalLinkEmbed.prototype.saveEmbed = function(embedIsNew) {
		var self = this;
		var file = self.model.upload;

		delete self.model.upload;

		var promise = self.parent.saveEmbed(embedIsNew, self);

		if (!!file)
		{
			return promise.then(function(responseData){
				var imageFormData = new FormData();
				imageFormData.append('upload', file);

				return EntityEmbed.apiService.uploadFile({
					path: self.options.httpPaths.uploadFile,
					data: imageFormData,
					headers: {
						'x-object-id': responseData.response.object_id
					}
				});

			}).done(function(responseData){
				self.model.url_path = responseData.response.url_path;
			});
		}
		else
		{
			return promise;
		}
	};

	externalLinkEmbed.prototype.getModelFromForm = function($form){
		var self = this;
		var oldModel = $.extend(true, {}, self.model);

		self.parent.getModelFromForm($form, self);

		if(!!oldModel.upload && !self.model.upload)
		{
			self.model.upload = oldModel.upload;
		}
	}

	externalLinkEmbed.prototype.getModelFromFile = function(file){
		var self = this;
		var $ui = self.$ui;
		var promise = $.Deferred();

		if (!file)
		{
			file = self.model.upload;
		}

		EXIF.getData(file, function() {
			var imageData = this.iptcdata;
			var currentModel, tempModel, lcModel, prop, lc;

			// Get a model using the default mapping method
			tempModel = getModelFromData(imageData, this);

			// Update model with current form values
			self.getModelFromForm(self.$el);

			// Clone current model so we can manipulate it
			currentModel = $.extend(true, {}, self.model);

			// Remove null properties from currentModel so they don't overwrite
			// properties on tempModel.
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

	externalLinkEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		var promise = $.Deferred();

		// Translate legacy keys
		self.model.linkText = self.model.linkText || self.model.linkText;
		self.model.url = self.model.url || self.model.url;
		self.model.displayTitle = self.model.displayTitle || self.model.displayTitle;

		self.parent.populateFormWithModel($form, self);

		if (!!self.model.upload || !!self.model.url_path)
		{
			updateImagePreview(self)
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

	externalLinkEmbed.prototype.clearForm = function($el){
		var self = this;
		var $ui = self.$ui;

		self.parent.clearForm($el, self);

		$ui.imageEditorPreviewImage.removeAttr('src');

		showFileInput(self);
	};

	externalLinkEmbed.prototype.parseForEditor = function(){
		var self = this;
		var embed = [];
		var teaserBlock = [];
		var teaserText = [];

		// Add Image to Teaser Block
		if(self.model.url_path)
		{
			teaserBlock.push('<div class="external_link-teaser-image"><img src="' + getImageUrl(self.model.url_path) + '"></div>');
		}

		// Add Teaser to Teaser Block
		if(self.model.teaser)
		{
			if(self.model.displayTitle) {
				teaserText.push('<div class="external_link-teaser-title">' + self.model.displayTitle + '</div>');
			}

			teaserText.push('<div class="external_link-teaser-teaser">' + self.model.teaser + '</div>');

			teaserBlock.push('<div class="external_link-teaser-text">' + teaserText.join('') + '</div>');
		}

		// Add Teaser Block to Embed
		if(!!teaserBlock.length)
		{
			embed.push('<div class="external_link-teaser">' + teaserBlock.join('') + '</div>')
		}

		// Add Link to Embed
		embed.push('<a class="external_link-link" href="' + self.model.url + '">'  + self.model.linkText + '</a>');


		return 	'<div class="external_link">' + embed.join('') + '</div>';
	};

})();