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
		uploadedImgDisplay = '.uploaded-image-file',
		cancelUploadImageBtn = '.cancel-upload-image-btn',
		editImageFileBtn = '.edit-chosen-file-btn',
		uploadImageFileBtn = ".embed-modal-file-input",
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
		var imageUrl;

		if (file)
		{
			scope.model.upload = file;
		}

		imageUrl = scope.getImageUrl()

		$ui.imageEditorPreview.css('background-image', 'url("' + imageUrl + '")')
		$ui.imageEditorPreviewImage.attr('src', imageUrl);

		showImagePreview(scope)
	}

	function updateFormWithImageData(scope, file) {
		var $ui = scope.$ui;

		if (file)
		{
			scope.model.upload = file;
		}

		EXIF.getData(file, function() {
			var imageData = this.iptcdata;
			var currentModel, tempModel, lcModel, i, m, lc;

			console.log('Updating Form with metadata:', this.iptcdata);

			if (scope.licenses && !!scope.licenses.length)
			{
				// Try to identify Licence with data
				for (i = 0, m = scope.licenses.length; i < m; i++)
				{
					lc = licenseConfigs[ scope.licenses[i].license ];
					if(lc && lc.claimData && lc.claimData(imageData))
					{
						lcModel = lc.getModelFromData && lc.getModelFromData(imageData, this) || {};
						lcModel.license = scope.licenses[i].license;
					}
				}
			}

			tempModel = getModelFromData(imageData, this);

			scope.getModelFromForm($ui.form);

			currentModel = $.extend(true, {}, scope.model);

			for (var prop in currentModel)
			{
				if(currentModel.hasOwnProperty(prop) && currentModel[prop] === null)
				{
					delete currentModel[prop];
				}
			}

			console.log('updateFormWithImageData', tempModel, currentModel);

			scope.model = $.extend(true, {}, tempModel, lcModel || {}, currentModel);

			console.log('updateFormWithImageData:scope.model', $.extend(true, {}, scope.model));

			scope.populateFormWithModel($ui.form);
		})
	}

	function showImagePreview(scope) {
		var $ui = scope.$ui;

		console.log('showImagePreview:scope.model', $.extend(true, {}, scope.model));

		$ui.uploadFileInput.removeClass('error').hide()
			.parent().find('#upload-error').remove();
		$ui.cancelUploadImageBtn.hide();

		$ui.imageEditorPreview.show();
		$ui.editImageFileBtn.show();
		$ui.undoUploadImageBtn.toggle(!!scope.model.url_path && !!scope.model.upload);
	}

	function showFileInput(scope) {
		var $ui = scope.$ui;

		console.log('showFileInput:scope.model', $.extend(true, {}, scope.model));

		// Hide Image Preview
		$ui.imageEditorPreview.hide();
		$ui.editImageFileBtn.hide();
		$ui.undoUploadImageBtn.hide();

		$ui.uploadFileInput.show();
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

				console.log('Recieved licenses. Adding options...', list);

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

				console.log('Setting license value: ', self.model.license);

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

		console.log('imagesEmbed::initModal', self, modalCtrl);

		self.loadLicenses($el);

		$ui.editImageFileBtn.on('click', 'a', function(){
			// showFileInput(modalCtrl.scope.currentEmbedType);
			$ui.uploadFileInput.click();
		});

		$ui.cancelUploadImageBtn.on('click', 'a', function(){
			showImagePreview(modalCtrl.scope.currentEmbedType);
		});

		$ui.undoUploadImageBtn.on('click', 'a', function() {
			delete modalCtrl.scope.currentEmbedType.model.upload;
			updateImagePreview(modalCtrl.scope.currentEmbedType);
		});

		$ui.uploadFileInput.on('change', function(event){
			var file = event.target.files[0];

			console.log('imagesEmbed::change::event', event);

			// updateImagePreview(self, file);

			updateFormWithImageData(modalCtrl.scope.currentEmbedType, file);
		});

		$(document).on('dragover drop', function(event) {
			event.preventDefault();
		});

		$el.on('drop', function(event) {
			event.preventDefault();

			var files = event.originalEvent.dataTransfer.files;
			var file;

			console.log('imagesEmbed::drop::files', files);

			if (!!files && !!files.length)
			{
				file = files[0];

				if(file.type.indexOf('image') === -1)
				{
					return;
				}

				// updateImagePreview(self, file);

				updateFormWithImageData(modalCtrl.scope.currentEmbedType, file);
			}
		})
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

		console.log('imagesEmbed::getModelFromForm', imageFormVisible, oldModel, self.model);

		if(!!oldModel.upload && !self.model.upload)
		{
			self.model.upload = oldModel.upload;
		}
	}


	imagesEmbed.prototype.populateFormWithModel = function($form){
		var self = this;

		self.parent.populateFormWithModel($form, self);

		self.loadLicenses($form);

		if (!!self.model.upload || !!self.model.url_path)
		{
			updateImagePreview(self);
		}
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