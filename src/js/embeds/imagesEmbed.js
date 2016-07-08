var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'image',
		defaults = {
			viewPath: 'modal_image.html',
			displayName: 'Image(s)',
			object_type: 'image',
			imageLocation: 'https://test-services.pri.org',
			validationOptions: {
				rules: {
					title: 'required',
					altText: 'required',
					license: 'required',
					upload: {
						required: true,
						extension: "png|jpg|jpeg|gif"
					}
				}
			},
			httpPaths:{
				getLicenses: 'admin/image-license/list',
				uploadFile: 'admin/embed/file-upload'
			}
		},
		uiElements = {
			// myElm: '.select-my-elm'
			imageEditorPreview: '.image_editor-preview',
			imageEditorPreviewImage: '.image_editor-preview_image',
			editImageFileBtn: '.js-upload',
			cancelUploadImageBtn: '.js-upload-cancel',
			undoUploadImageBtn: '.js-upload-undo',
			uploadFileInputContainer: '.image_editor-intro',
			uploadFileInput: '.embed-modal-file-input',
			imageEditor: '.image_editor'
		},
		licenseConfigs = {
			'ap': {
				claimData: function(data) {
					var rgx = /(AP Images|Associated Press)/ig;
					return !!data.credit && rgx.test(data.credit) ||
						!!data.copyright && rgx.test(data.copyright);
				}
			},
			'getty': {
				claimData: function(data) {
					var rgx = /(Getty ?Images)/ig;
					return !!data.credit && rgx.test(data.credit) ||
						!!data.copyright && rgx.test(data.copyright);
				}
			},
			'reuters': {
				claimData: function(data) {
					return !!data.credit && data.credit.toLowerCase() === 'reuters';
				},
				getModelFromData: function(data, file) {
					var model = {};
					var creditArray = [];

					// Credit
					if(data.byline)
					{
						creditArray.push( data.byline.replace(/^\W*\u00A9\s*/, '') )
					}

					if(data.copyright)
					{
						creditArray.push(data.copyright)
					}

					model.credit = !!creditArray.length ? creditArray.join(' / ') : undefined;;

					// Caption
					model.caption = data.caption.replace(/\s+REUTERS\/.+$/mg, '');

					return model;
				}
			}
		};

	function getModelFromData(data, file) {
		var model = {};
		var creditArray = [];

		// Title
		model.title = file.name;

		// Credit
		if(data.byline)
		{
			creditArray.push(data.byline)
		}

		if(data.credit)
		{
			creditArray.push(data.credit)
		}

		if(data.copyright)
		{
			creditArray.push(data.copyright)
		}

		model.credit = creditArray.join(' / ');

		// Caption
		model.caption = data.caption && data.caption.replace(/\s*\([^\)]+\)\s*$/, '');

		// Alt Text
		model.altText = data.headline;

		// License
		// Defalut to not defining a license

		return model;
	}

	function getImageUrl(imageLocation, imageUrl)
	{
		if (!imageUrl || imageUrl === '')
		{
			return '';
		}

		if (imageUrl.indexOf(imageLocation) >= 0)
		{
			return imageUrl;
		}

		// ensure that there isn't an unintended '//' in final URL
		if (imageLocation.endsWith('/'))
		{
			imageLocation = imageLocation.substring(0, imageLocation.length - 1);
		}
		if (!imageUrl.startsWith('/'))
		{
			imageUrl = '/' + imageUrl;
		}

		return imageLocation + imageUrl;
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

		if (!file)
		{
			file = scope.model.upload;
		}

		EXIF.getData(file, function() {
			var imageData = this.iptcdata;
			var currentModel, tempModel, lcModel, prop, i, m, lc;

			if (scope.licenses && !!scope.licenses.length)
			{
				// Try to identify Licence by giving license configs a chance to claim the data. First come, first serve.
				for (i = 0, m = scope.licenses.length; i < m; i++)
				{
					lc = licenseConfigs[ scope.licenses[i].license ];
					// Check if config can and does claim data
					if(lc && typeof lc.claimData === 'function' && lc.claimData(imageData))
					{
						// Attempt to get model object from congifs getModelFromData method, fallback to empty object
						lcModel = typeof lc.getModelFromData === 'function' && lc.getModelFromData(imageData, this) || {};
						// Set license prop to the claiming license
						lcModel.license = scope.licenses[i].license;
					}
				}
			}

			// Get a model using the default mapping method
			tempModel = getModelFromData(imageData, this);

			// Update the scope's model with current form values
			scope.getModelFromForm($ui.form);

			// Clone current model so we can manipulate it
			currentModel = $.extend(true, {}, scope.model);

			// Remove null properties from currentModel so they don't overwrite
			// properties on tempModel or lcModel during merge.
			for (prop in currentModel)
			{
				if(currentModel.hasOwnProperty(prop) && currentModel[prop] === null)
				{
					delete currentModel[prop];
				}
			}

			// Merge models together.
			// 		currentModel > lcModel > tempModel
			scope.model = $.extend(true, {}, tempModel, lcModel || {}, currentModel);

			// Current model may contain old upload file, make sure it is set to the new file
			scope.model.upload = file;

			scope.populateFormWithModel($ui.form)
				.done(function () {
					promise.resolve();
				});
		});

		return promise;
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
	}

	function showFileInput(scope) {
		var $ui = scope.$ui;

		// Hide Image Preview and related toolbar btns
		$ui.imageEditorPreview.hide();
		$ui.editImageFileBtn.hide();
		$ui.undoUploadImageBtn.hide();

		// Show file input and related toolbar btns. Clean up after previous validation errors.
		$ui.uploadFileInput.removeClass('error')
			.parent().find('#upload-error').remove();
		$ui.uploadFileInputContainer.show();
		$ui.cancelUploadImageBtn.toggle(!!(scope.model.url_path || scope.model.upload));
	}

	// CONSTRUCTOR
	function imagesEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	imagesEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = imagesEmbed;

	// PUBLIC
	imagesEmbed.prototype.orderIndex = 1;

	imagesEmbed.prototype.imageEditorPreviewImageClass = 'image-preview';

	imagesEmbed.prototype.cleanModel = function(){
		return {
			url_path: null, // URL to image file
			upload: null,	// form data for image file
			title: null,
			altText: null,
			credit: null,
			creditLink: null,
			caption: null,
			license: null
		};
	};

	imagesEmbed.prototype.getImageUrl = function() {
		return !!this.model.upload ? window.URL.createObjectURL(this.model.upload) : getImageUrl(this.options.imageLocation, this.model.url_path);
	};

	imagesEmbed.prototype.loadLicenses = function ($el){
		var self = this;
		var $licenseField = $el.find('[name="license"]');

		if($licenseField.children().length > 1)
		{
			$licenseField.val(self.model.license);
			return;
		}

		EntityEmbed.apiService.get({
				path: self.options.httpPaths.getLicenses
			})
			.done(function(list){
				var $option;

				//load object into license list
				if (!list.response.data)
				{
					return;
				}

				if($licenseField.children().length > 1)
				{
					$licenseField.val(self.model.license);
					return;
				}

				self.licenses = list.response.data;

				for(var i = 0; i < list.response.data.length;i++)
				{
					$option = $('<option>');
					$option.attr('value', list.response.data[i].license)
						.text(list.response.data[i].title);
					$licenseField.append($option);
				}

				$licenseField.val(self.model.license);
			})
			.fail(function(data){
				console.log('failed to find load image license options');
			});
	};

	imagesEmbed.prototype.updateFormWithFileMetadata = function($el, file) {
		var self = this;
		var tempModel;

		if (file)
		{
			self.model.upload = file;
		}
		else
		{
			file = self.model.upload;
		}
	}

	imagesEmbed.prototype.initModal = function($el, modalCtrl){
		var self = this;
		var $ui = registerUiElements(self, $el);

		self.loadLicenses($el);

		$ui.editImageFileBtn.on('click', 'a', function(){
			$ui.uploadFileInput.click();
		});

		$ui.cancelUploadImageBtn.on('click', 'a', function(){
			showImagePreview(modalCtrl.scope.currentEmbedType);
		});

		$ui.undoUploadImageBtn.on('click', 'a', function() {
			delete modalCtrl.scope.currentEmbedType.model.upload;
			$ui.uploadFileInput.val('');
			updateImagePreview(modalCtrl.scope.currentEmbedType);
		});

		$ui.uploadFileInput.on('change', function(event){
			var file = event.target.files[0];
			updateFormWithImageData(modalCtrl.scope.currentEmbedType, file);
		});

		$(document).on('dragover drop', function(event) {
			event.preventDefault();
		});

		$ui.imageEditor
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

					if(file.type.indexOf('image') === -1)
					{
						return;
					}

					$this.addClass('js-dropped');

					setTimeout(function() {

						updateFormWithImageData(modalCtrl.scope.currentEmbedType, file)
							.then(function() {
								setTimeout(function() {
									$this.removeClass('js-dropped');
								}, 300);
							});

					}, 300);
				}
			});
	};

	imagesEmbed.prototype.clearForm = function($el){
		var self = this;
		var $ui = self.$ui;

		self.parent.clearForm($el, self);

		$ui.imageEditorPreviewImage.removeAttr('src');

		showFileInput(self);
	};

	imagesEmbed.prototype.saveEmbed = function(embedIsNew)
	{
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

	imagesEmbed.prototype.generateUploadedImgPreview = function() {
		var self = this;

		return '<img class="' + self.imageEditorPreviewImageClass +
				'" src="' + self.getImageUrl() + '">';
	};


	imagesEmbed.prototype.getModelFromForm = function($form){
		var self = this;
		var oldModel = $.extend(true, {}, self.model);
		var imageFormVisible = !!self.$ui.uploadFileInput.is(':visible');

		self.parent.getModelFromForm($form, self);

		if(!!oldModel.upload && !self.model.upload)
		{
			self.model.upload = oldModel.upload;
		}
	}


	imagesEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		var promise = $.Deferred();

		self.parent.populateFormWithModel($form, self);

		self.loadLicenses($form);

		if (!!self.model.upload || !!self.model.url_path)
		{
			updateImagePreview(self)
				.then(function() {
					promise.resolve();
				});
		}
		else
		{
			promise.resolve();
		}

		return promise;
	};

	imagesEmbed.prototype.parseForEditor = function(){
		var self = this;

		return	'<div class="images-embed">' +
					'<img class="entity-embed-secondary-toolbar-locator"' +
						' src="' + getImageUrl(self.options.imageLocation, self.model.url_path) + '" />' +
					'<div class="images-embed-caption">' +
						self.model.caption +
					'</div>' +
					'<div class="images-embed-credit">' +
						'Credit: ' + self.model.credit +
					'</div>' +
				'</div>';
	};
})();