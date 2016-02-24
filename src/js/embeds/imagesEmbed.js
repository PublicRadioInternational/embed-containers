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
	var embedName = 'image',
		defaults = {
			viewPath: base + 'modal/modal_image.html',
			displayName: 'Image(s)',
			httpPaths: {
				put: '',
				post: '',
				get: '',
				del: ''
			},
			object_type: 'image'
		};

	var formatFileSize  = function(bytes) {
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




	var loadLicenses = function (getPath){
			EntityEmbed.apiService.get(
						getPath,
						//Current Guid value of the license list
						//TODO: change this from a hardcoded value
						{object_id: "f75bd456f84a40d0b5785f8cea4d5937" },
						function(data){
							//load object into license list
						
							if (!!data.response.list)
							{
								var licenseList = [];
								var i = 0;
								for(var licenseName in data.response.list)
								{
									if(!!licenseName){
										licenseList[i] = "<option>" + licenseName + "</option>";
									}
									i++;
								}
								$("#license").html(licenseList);
							}
						},
						function(data){
							console.log('failed to find object with that id');
						}
					);
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

		loadLicenses(this.options.httpPaths.get);

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

	imagesEmbed.prototype.clearForm = function($el){
		var self = this;
		self.parent.clearForm($el);

		$('#imagesList').children().remove();
	};

	imagesEmbed.prototype.parseForEditor = function(){
		// TODO : use handlebars for this
		var self = this;

		return '<div class="images-embed"><img class="entity-embed-secondary-toolbar-locator" src="' + self.model.files[0] +'" />' + 
			'<div class="images-embed-caption">' + self.model.caption + '</div>' + 
			'<div class="images-embed-credit">Credit: ' + self.model.credit + '</div></div>';
	};
})('', EntityEmbedTypes);