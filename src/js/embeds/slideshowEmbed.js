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
	var embedName = 'slideshow',
		defaults = {
			viewPath: base + 'modal/modal_slideshow.html',
			displayName: 'Slideshow',
			object_type: 'slideshow',
			validationOptions: {
				rules: {
					slideshowTitle: 'required',
					title: 'required',
					altText: 'required',
					license: 'required'
				}
			}
		},
		generateId = function () {
			var ret = '';
			for(var i = 0; i < 8; i++){
				ret += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
			return ret;
		},
		imageForm = '#embed-modal-slideshow-image',
		imageSelect = '.embed-modal-slideshow-image-select',
		imageEmbed,
		imageObjects = {}, // key = image ID; value = image object
		saveChangesToImageModel = function(){ // save changes on $(imageForm) to the respective model
			var currentImageId = $(imageForm).find('legend').attr('data-image-id');
			imageEmbed.getModelFromForm($(imageForm));
			imageObjects[currentImageId] = imageEmbed.model;
		},
		selectSlideshowImage = function(imageId){
			var $newImageSelectOption = $('#' + imageId); 
			var currentImageId = $(imageForm).find('legend').attr('data-image-id');

			if (!currentImageId || currentImageId === '') // this is the first image - show hidden UI items
			{
				$(imageForm).show();
				$(imageSelect).show();
			}
			else // this is not the first image - save current changes to respective model
			{
				saveChangesToImageModel();

				// set the form to show to the selected image's data
				imageEmbed.clearForm($(imageForm));
				imageEmbed.model = imageObjects[imageId];
				imageEmbed.populateFormWithModel($(imageForm))
			}

			$(imageForm).find('legend').attr('data-image-id', imageId);
			$(imageSelect).val($newImageSelectOption.val());
		},
		addImageToOptionList = function($el, id, imageNum){
			var listItem= $('<option id="' + id + '">' +
					'image ' + imageNum + 
				'</option>');

			return listItem.appendTo($el.find(imageSelect));
		};

	// CONSTRUCTOR
	function slideshowEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	slideshowEmbed.inherits(EntityEmbedTypes.genericEmbed);
	EntityEmbedTypes[embedName] = slideshowEmbed;

	// PUBLIC
	slideshowEmbed.prototype.orderIndex = 2;

	slideshowEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			images: []
		};
	};

	slideshowEmbed.prototype.initModal = function($el){
		var self = this;
		self.model =  self.cleanModel();

		imageEmbed = $.grep(EntityEmbed.embedTypes, function(et){
			return et.name == 'image';
		})[0];

		imageEmbed.loadLicenses($el);

		$el.find("input[name='imageFile']").fileupload({
			dataType: 'json',
    		replaceFileInput: false,
			add: function(e, data){
				data.submit().complete(function (result, textStatus, jqXHR) {
					if (textStatus !== 'success')
					{
						return;
					}
					if (!result || !result.responseJSON || !result.responseJSON.path)
					{
						console.log('file upload completed with status "' + textStatus + '"');
						console.log(result);
						return;
					}

					// TODO : use object_id for image
					var id = generateId();
					imageObjects[id] = imageEmbed.cleanModel();
					
					var imageNum = 0;
					for (var image in imageObjects)
					{
						imageNum += 1;
					}
					
					data.context = addImageToOptionList($el, id, imageNum);

					selectSlideshowImage(id);
				});
			}
		});

		$el.on('change', imageSelect, function(e){
			var $clickedOption = $(e.currentTarget.options[e.currentTarget.selectedIndex]);
			selectSlideshowImage($clickedOption.attr('id'));
		});

	};

	// TODO : this
/*
	slideshowEmbed.prototype.parseForEditor = function(){
		return  '<div class="slideshow-embed">' +
					// content
				'</div>';
	};

*/
	slideshowEmbed.prototype.saveEmbed = function(embedIsNew, successFunc, failFunc)
	{
		var self = this;
		var deferreds = [];

		for(var i = 0; i < self.model.images.length; i++)
		{
			imageEmbed.model = self.model.images[i];
			var imageEmbedIsNew = !imageEmbed.model.object_id;
			deferreds.push(imageEmbed.saveEmbed(
				imageEmbedIsNew,
				(function(imageOrder){
					return function(data){
						if (data.status == 'ERROR')
						{
							console.log('failed to put/post a slideshow image');
						}

						self.model.images[imageOrder] = {
							'object_id': data.response.object_id
						};	
					};
				})(i),
				function(){
					console.log('failed to put/post a slideshow image');
				}
			));
			return $.when.apply($, deferreds).done(function(){
				return self.parent.saveEmbed(embedIsNew, successFunc, failFunc, function(){}, self)
			});
		}
	}

	slideshowEmbed.prototype.getModelFromForm = function($form){
		var self = this;
		saveChangesToImageModel();
		self.model.title = $form.find('input[name=slideshowTitle]').val();
		self.model.displayTitle = $form.find('input[name=displayTitle]').val();
		self.model.images = [];

		for (var image in imageObjects)
		{
			self.model.images.push(imageObjects[image]);
		}
	};

	slideshowEmbed.prototype.populateFormWithModel = function($el){
		var self = this;
		$el.find('input[name=slideshowTitle]').val(self.model.title);
		$el.find('input[name=displayTitle]').val(self.model.displayTitle);
		var deferreds = [];

		for(var i = 0; i < self.model.images.length; i++)
		{
			EntityEmbed.apiService.get({
				path: imageEmbed.options.httpPaths.get,
				data:{
					object_id: self.model.images[i].object_id,
					auth_token: 'abc123'
				},
				success: (function(embedOrder){
					return function(data){
						if (typeof data.response === 'string')
						{
							console.log('Failed to get slideshow image #' + embedOrder);
							return;
						}

						self.model.images[embedOrder] = data.response;
						addImageToOptionList($el, data.response.object_id, embedOrder + 1);
						if (embedOrder === 0)
						{
							imageEmbed.model = data.response;
							imageEmbed.populateFormWithModel($el.find(imageForm), imageEmbed);
							selectSlideshowImage(data.response.object_id);
						}
					};											
				})(i),
				fail: function(data){
					console.log('failed to get image embed type!');
				}
			});
		}
	};

	slideshowEmbed.prototype.clearForm = function($el){
		var self = this;
		self.parent.clearForm($el);

		$el.find(imageSelect).children().remove();
		$(imageForm).hide();
		$(imageSelect).hide();
		$el.find('legend').attr('data-image-id', '');
	};

})('', EntityEmbedTypes);