var EntityEmbed = EntityEmbed || {};

(function(base, EntityEmbedTypes){

	'use strict';

	// check for EntityEmbedTypes namespace
	if (!EntityEmbedTypes)
	{
		console.log('Could not find EntityEmbedTypes namespace. ' +
			'Please ensure that the genericEmbed has loaded before this one.');
		return;
	}

	// PRIVATE
	var embedName = 'imagesEmbed',
		defaults = {
			viewPath: base + 'modal/modal_image.html',
			displayName: 'Image(s)',
			httpPaths: {
				put: '',
				post: '',
				get: '',
				del: ''
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

	// CONSTRUCTOR
	function imagesEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	imagesEmbed.inherits(EntityEmbedTypes.genericEmbed);
	EntityEmbedTypes[embedName] = imagesEmbed;

	// PUBLIC
	imagesEmbed.prototype.orderIndex = 1;

	imagesEmbed.prototype.cleanModel = function(){
		return {
			files: [],
			altText: null,
			titleText: null,
			credit: null,
			creditLink: null,
			caption: null,
			license: null
		};
	};

	imagesEmbed.prototype.defaultStyle = 'entity-embed-center';

	imagesEmbed.prototype.initModal = function($el){
		var self = this;
		imagesEmbed.loadLicenses(this.options.httpPaths.get);
		$el.find("input[name='imageFile']").fileupload({
			dataType: 'json',
			add: function(e, data){
				// TODO : better id (this one potentially has spaces)
				var listItem = $('<li id="' + data.files[0].name + '"><span></span></li>');
				
				listItem.find('span').html(data.files[0].name + ' - ' + 
					'<i>' + formatFileSize(data.files[0].size) + '</i>');
				
				data.context = listItem.appendTo($('#imagesList'));
				
				data.submit().complete(function (result, textStatus, jqXHR) {
					if (textStatus === 'success')
					{
						if (!!result && !!result.responseJSON && !!result.responseJSON.path)
						{
							self.model.files.push(result.responseJSON.path);
						}
					}
					else
					{
						console.log('file upload completed with status "' + textStatus + '"');
						console.log(result);
					}
				});
			}
		});
	};


	imagesEmbed.loadLicenses = function (getPath){
		//function(path, data, doneFunc, failFunc, alwaysFunc)
			EntityEmbed.apiService.get(
						//TODO: change this from a hardcoded value
						getPath,
						//'https://test-services.pri.org/admin/story/fetch',
						//Current Guid value of the license list
						{object_id: "f75bd456f84a40d0b5785f8cea4d5937" },
						function(data){
							//load object into license list
							var licenseList = data.response.list;

							var formattedLicenseList = [];
							for(var i =0; i < 10 ;i++)
							{
								var currentLicense = "license" + i;
								var currentValue =  licenseList[currentLicense]
								if(!!currentValue){
									formattedLicenseList[i] = "<option>" + currentValue + "</option>";
								}
							}
						
							console.log(formattedLicenseList);

							$("#license").html(formattedLicenseList);
						},
						function(data){
							console.log('failed to find object with that id');
						}
					);
	};

	
	imagesEmbed.prototype.parseForEditor = function(){
		// TODO : use handlebars for this
		var self = this;

		return '<div class="images-embed"><img class="entity-embed-secondary-toolbar-locator" src="' + self.model.files[0] +'" />' + 
			'<div class="images-embed-caption">' + self.model.caption + '</div>' + 
			'<div class="images-embed-credit">Credit: ' + self.model.credit + '</div></div>';
	};
})('', EntityEmbedTypes);