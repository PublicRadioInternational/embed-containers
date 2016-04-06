var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// PRIVATE
	var embedName = 'image',
		defaults = {
			viewPath: base + 'modal/modal_image.html',
			displayName: 'Image(s)',
			object_type: 'image',
			validationOptions: {
				rules: {
					title: 'required',
					altText: 'required',
					license: 'required',
					imageFile: {
						required: true,
						extension: "png|jpg|jpeg|gif"
					}
				}
			},
			httpPaths:{
				getLicenses: 'https://test-services.pri.org/admin/image-license/list',
				uploadFile: 'https://test-services.pri.org/admin/embed/file-upload'
			}
		};

	var formatFileSize = function(bytes) {
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

	// CONSTRUCTOR
	function imagesEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	imagesEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = imagesEmbed;

	// PUBLIC
	imagesEmbed.prototype.orderIndex = 1;

	imagesEmbed.prototype.cleanModel = function(){
		return {
			file: null,
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
			path: self.options.httpPaths.getLicenses,
			success: function(list){
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
			},
			fail: function(data){
				console.log('failed to find load image license options');
			}
		});
	};

	imagesEmbed.prototype.initModal = function($el){
		var self = this;

		self.loadLicenses($el);
		self.$imageForm = $el.find('input[name="upload"]');
	};

	imagesEmbed.prototype.saveEmbed = function(embedIsNew, successFunc, failFunc, alwaysFunc)
	{
		var self = this;
		self.parent.saveEmbed(embedIsNew, function(data){
			var imageFormData = new FormData();
			imageFormData.append('upload', self.$imageForm[0].files[0]);

			$.ajax({
				url: self.options.httpPaths.uploadFile,
				type: 'POST',
				data: imageFormData,
				headers: {
					'x-auth-token': 'abc123',
					'x-object-id': data.response.object_id,
					'x-debug': '1'
				},
				processData: false,
				contentType: false
			}).success(function(data){
				self.model.file = 'https://test-services.pri.org' + data.response.url_path;
				successFunc(data);
			});
		}, failFunc, alwaysFunc, self);
	}

	imagesEmbed.prototype.parseForEditor = function(){
		var self = this;

		return '<div class="images-embed"><img class="entity-embed-secondary-toolbar-locator" src="' + self.model.file +'" />' + 
			'<div class="images-embed-caption">' + self.model.caption + '</div>' + 
			'<div class="images-embed-credit">Credit: ' + self.model.credit + '</div></div>';
	};
})('');