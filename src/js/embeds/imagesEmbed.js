var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// PRIVATE
	var embedName = 'image',
		defaults = {
			viewPath: base + 'modal/modal_image.html',
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
				getLicenses: 'https://test-services.pri.org/admin/image-license/list',
				uploadFile: 'https://test-services.pri.org/admin/embed/file-upload'
			}
		},
		uploadedImgDisplay = '.uploaded-image-file',
		cancelUploadImageBtn = '.cancel-upload-image-btn',
		editImageFileBtn = '.edit-chosen-file-btn',
		getImageUrl = function(imageLocation, imageUrl)
		{
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

	imagesEmbed.prototype.loadLicenses = function ($el){
		var self = this;
		var defaultLicenseOption = '<option disabled selected>-- select a license --</option>';
		EntityEmbed.apiService.get({
				path: self.options.httpPaths.getLicenses
			})
			.done(function(list){
				//load object into license list
				if (!list.response.data)
				{
					return;
				}
				var licenseList = [];
				licenseList.push(defaultLicenseOption);
				for(var i = 0; i < list.response.data.length;i++)
				{
					licenseList.push(
						'<option value="' + list.response.data[i].license + '">' +
							list.response.data[i].title +
						'</option>'
					);
				}
				$el.find('[name="license"]').html(licenseList);
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

		return self.parent.saveEmbed(embedIsNew, self)
			.then(function(responseData){
				if (!file)
				{
					// TODO : handle error?
					//			there shuold be a file here if this is an add modal!
					//			but how do we handle that here?
					return;
				}

				var imageFormData = new FormData();
				imageFormData.append('upload', file);

				return $.ajax({
					url: self.options.httpPaths.uploadFile,
					type: 'POST',
					data: imageFormData,
					headers: {
						'x-auth-token': EntityEmbed.apiService.getAuthToken(),
						'x-object-id': responseData.response.object_id,
						'x-debug': '1'
					},
					processData: false,
					contentType: false
				});
			})
			.done(function(responseData){
				self.model.url_path = responseData.response.url_path;
			});
	};

	imagesEmbed.prototype.generateUploadedImgPreview = function() {
		var self = this;
		if (!!self.model.object_id) // this is an edit modal - there must be an existing url_path to the image file
		{
			return '<img class="' + self.imagePreviewClass +
					'" src="' + getImageUrl(self.options.imageLocation, self.model.url_path) + '">';
		}
		else // this is an add modal - the image has been uploaded by the client but not pushed to the server
		{
			return	'<div class="' + self.imagePreviewClass + '">' +
				(self.model.url_path || self.model.upload.name) +
			'</div>';
		}
	};

	imagesEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		self.parent.populateFormWithModel($form, self);

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
})('');