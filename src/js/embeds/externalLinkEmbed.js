var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// PRIVATE
	var embedName = 'externalLink',
		defaults = {
			viewPath: base + 'modal/modal_externalLink.html',
			displayName: 'External Link',
			object_type: 'external-link',
			imageLocation: 'https://test-services.pri.org',
			validationOptions: {
				rules: {
					upload: 'required',
					title: 'required',
					url: 'required',
					linkText: 'required'
				}
			},
			httpPaths:{
				uploadFile: 'https://test-services.pri.org/admin/embed/file-upload'
			}
		},
		uploadedImgDisplay = '.uploaded-image-file',
		cancelUploadImageBtn = '.cancel-upload-image-btn',
		editImageFileBtn = '.edit-chosen-file-btn',
		uploadImageFileBtn = ".embed-modal-file-input",
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
	function externalLinkEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};


	// TODO : inherit from imagesEmbed
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
		};
	};

	externalLinkEmbed.prototype.initModal = function($el){
		var self = this;

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
	};

	externalLinkEmbed.prototype.saveEmbed = function(embedIsNew)
	{
		var self = this;
		var file = self.model.upload;
		delete self.model.upload;

		var promise = self.parent.saveEmbed(embedIsNew, self);
		
		if (!!file)
		{
			promise.then(function(responseData){
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
			}).done(function(responseData){
				self.model.url_path = responseData.response.url_path;
			});
		}

		return promise;
	};

	externalLinkEmbed.prototype.populateFormWithModel = function($form){
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
	
	externalLinkEmbed.prototype.clearForm = function($el){
		var self = this;
		self.parent.clearForm($el, self);

		$el.find(uploadedImgDisplay).find('.' + self.imagePreviewClass).remove();
		$el.find(uploadedImgDisplay).hide();
		$el.find(cancelUploadImageBtn).hide();
		$el.find(editImageFileBtn).hide();
		self.$imageForm.show();
	};

	externalLinkEmbed.prototype.generateUploadedImgPreview = function() {
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

	externalLinkEmbed.prototype.parseForEditor = function(){
		var self = this;

		return 	'<div class="external-link-embed entity-embed-secondary-toolbar-locator">' +
					'<img src="' + getImageUrl(self.options.imageLocation, self.model.url_path) + '">' + 
					'<div class="text-container">' + 
						'<div class="display-title">' + self.model.displayTitle + '</div>' +
						'<div class="teaser">' + self.model.teaser + '</div>' +
					'</div>' + 
					'<a href="' + self.model.url + '">'  + self.model.linkText + '</a>' + 
				'</div>';
	};

})('');