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
		getImageUrl = function(imageLocation, imageUrl)
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

	// CONSTRUCTOR
	function imagesEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	imagesEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = imagesEmbed;

	// PUBLIC
	imagesEmbed.prototype.orderIndex = 1;

	imagesEmbed.prototype.imagePreviewClass = 'image-preview';

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
		var defaultLicenseOption = '<option disabled selected>-- select a license --</option>';
		var $licenseField = $el.find('[name="license"]');

		if($licenseField.children().length)
		{
			$licenseField.val(self.model.license);
			return;
		}

		EntityEmbed.apiService.get({
				path: self.options.httpPaths.getLicenses
			})
			.done(function(list){
				var $option;

				if($licenseField.children().length)
				{
					$licenseField.val(self.model.license);
					return;
				}

				console.log('Recieved licences. Adding options...');
				//load object into license list
				if (!list.response.data)
				{
					return;
				}

				$option = $(defaultLicenseOption);
				$licenseField.append($option);

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

	imagesEmbed.prototype.initModal = function($el){
		var self = this;

		self.loadLicenses($el);

		self.$imageForm = $el.find('input[name="upload"]');

		$el.find(editImageFileBtn).on('click', function(){
			$el.find(uploadedImgDisplay).hide();
			$el.find(editImageFileBtn).hide();

			self.$imageForm.css('display', 'inline-block');
			$el.find(cancelUploadImageBtn).show();
		});

		$el.find(cancelUploadImageBtn).on('click', function(){
			self.$imageForm.hide();
			$el.find(cancelUploadImageBtn).hide();
			if (self.$imageForm.parent().find('#upload-error').is(':visible'))
			{
				self.$imageForm.parent().find('#upload-error').hide();
			}

			$el.find(uploadedImgDisplay).show();
			$el.find(editImageFileBtn).show();
		});

		$el.find(uploadImageFileBtn).on('change', function(){
			var fileName =  $el.find(uploadImageFileBtn)[0].files[0].name;
			$el.find("[name=title]").val(fileName);
		});

		$(document).on('dragover drop', function(event) {
			event.preventDefault();
		});

		$el.on('drop', function(event) {
			event.preventDefault();

			var files = event.originalEvent.dataTransfer.files;
			var file, $uploadImageDisplay, $editImageFileBtn, $preview;

			console.log('imagesEmbed::drop::files', files);

			if (!!files && !!files.length)
			{
				file = files[0];

				if(file.type.indexOf('image') === -1)
				{
					return;
				}

				console.log('Updating image preview...', file);

				self.model.upload = file;

				$uploadImageDisplay = $el.find(uploadedImgDisplay);
				$editImageFileBtn = $el.find(editImageFileBtn);
				$preview = $uploadImageDisplay.find('.' + self.imagePreviewClass);

				if (!$preview.length)
				{
					$preview = $(self.generateUploadedImgPreview());
					$uploadImageDisplay.append($preview);
				}
				else
				{
					$preview.attr('src', self.getImageUrl());
				}

				self.$imageForm.hide();

				$uploadImageDisplay.show();
				$editImageFileBtn.show();

				$el.find("[name=title]").val(file.name);
			}
		})
	};

	imagesEmbed.prototype.clearForm = function($el){
		var self = this;
		self.parent.clearForm($el, self);

		$el.find(uploadedImgDisplay).find('.' + self.imagePreviewClass).remove();
		$el.find(uploadedImgDisplay).hide();
		$el.find(cancelUploadImageBtn).hide();
		$el.find(editImageFileBtn).hide();
		self.$imageForm.show();
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

		return '<img class="' + self.imagePreviewClass +
				'" src="' + self.getImageUrl() + '">';
	};


	imagesEmbed.prototype.getModelFromForm = function($form){
		var self = this;
		var oldModel = $.extend(true, {}, self.model);
		var imagaFormVisible = !!self.$imageForm.is(':visible');

		self.parent.getModelFromForm($form, self);

		console.log('imagesEmbed::getModelFromForm', imagaFormVisible, oldModel, self.model);

		if(!imagaFormVisible && !!oldModel.upload && !self.model.upload)
		{
			self.model.upload = oldModel.upload;
		}
	}


	imagesEmbed.prototype.populateFormWithModel = function($form){
		var self = this;

		self.parent.populateFormWithModel($form, self);

		self.loadLicenses($form);

		if (!self.model.upload && !self.model.url_path)
		{
			return;
		}

		self.$imageForm.hide();

		$form.find(uploadedImgDisplay).show();
		$form.find(editImageFileBtn).show();
		$form.find(uploadedImgDisplay).append(self.generateUploadedImgPreview());
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