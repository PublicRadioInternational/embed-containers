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
			httpPaths: {
				put: '',
				post: '',
				get: '',
				del: ''
			},
			object_type: 'slideshow',
			validationOptions: {
				rules: {
					slideshowTitle: 'required',
					displayTitle: 'required',
					imageFile: 'required',
					creditLink: 'required',
					credit: 'required',
					title: 'required',
					altText: 'required',
					caption: 'required'
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

		imageEmbed.loadLicenses(); // TODO : fix 

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

					var id = generateId();
					imageObjects[id] = imageEmbed.cleanModel();
					
					var imageNum = 0;
					for (var image in imageObjects)
					{
						imageNum += 1;
					}

					// TODO : better id (this one potentially has spaces)
					//			use ID from post to server?
					var listItem= $('<option id="' + id + '">' +
										'image ' + imageNum + 
									'</option>');

					data.context = listItem.appendTo($el.find(imageSelect));

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
			imageEmbed.model.order = i;
			var imageEmbedIsNew = !imageEmbed.model.object_id;
			deferreds.push(imageEmbed.saveEmbed(
				imageEmbedIsNew,
				function(data){
					if (data.status == 'ERROR')
					{
						console.log('failed to put/post a slideshow image');
					}

					self.model.images[data.response.order] = data.response.object_id;	
				},
				function(){
					console.log('failed to put/post a slideshow image');
				}
			));
			$.when.apply($, deferreds).done(function(){
				// TODO : this code is copied from generic embed - find a better way to do this (reduce duplicated code)
				//			why did we copy it? when we call self.parent.saveEmbed the options object is null///
				if (embedIsNew){
					self.model.object_type = self.options.object_type;

					return EntityEmbed.apiService.post({
						path: self.options.httpPaths.post, 
						data: self.model,
						success: successFunc,
						fail: failFunc
					});
				}
				else
				{
					return EntityEmbed.apiService.put({
						path: self.options.httpPaths.put, 
						data: self.model,
						success: successFunc,
						fail: failFunc
					});
				}
			});
		}
	}

	slideshowEmbed.prototype.getModelFromForm = function($form)
	{
		var self = this;
		saveChangesToImageModel();
		self.model.title = $form.find('input[name=slideshowTitle]').val();
		self.model.images = [];

		for (var image in imageObjects)
		{
			self.model.images.push(imageObjects[image]);
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