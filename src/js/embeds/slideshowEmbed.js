var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

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
		imageSelect = '.embed-modal-slideshow-image-list',
		imageEmbed,
		imageObjects = {}, // key = image ID; value = image object
		currentImageId = null,
		labelTextClass = 'slideshow-radio-label-text',
		newRadioOption = function(label){
			if ($('#radio-option-placeholder').length > 0)
			{
				$('#radio-option-placeholder').remove();	
			}

			var id = generateId();
			var newHtml = 
				'<label class="slideshow-radio">' + 
					'<input type="radio" id="' + id + '" name="radioOption">' + 
					'<span class="' + labelTextClass + '">' +
						label +
					'</span>' +
				'</label>';

			$(imageSelect).append(newHtml);
			return id;
		},
		saveChangesToImageModel = function(){ // save changes made to $(imageForm) to the respective model
			imageEmbed.getModelFromForm($(imageForm));
			imageObjects[currentImageId] = imageEmbed.model;
		},
		selectSlideshowImage = function(imageId){
			var $newImageSelectOption = $('#' + imageId); 

			if (!currentImageId || currentImageId === '') // this is the first image - show hidden UI items
			{
				$(imageForm).show();
				imageEmbed.$imageForm.show();
			}
			else if (currentImageId === imageId)
			{
				return;
			}
			else // this is not the first image - save current changes to respective model
			{
				saveChangesToImageModel();

				// set the form to show to the selected image's data
				imageEmbed.clearForm($(imageForm));				
				// imageEmbed.$imageForm.wrap('<form>');
				// imageEmbed.$imageForm.closest('form').get(0).reset();
				// imageEmbed.$imageForm.unwrap('<form>');
				imageEmbed.model = imageObjects[imageId];
				imageEmbed.populateFormWithModel($(imageForm));
			}

			currentImageId = imageId;
		};

	// CONSTRUCTOR
	function slideshowEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	slideshowEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = slideshowEmbed;

	// PUBLIC
	slideshowEmbed.prototype.orderIndex = 2;

	slideshowEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			displayTitle: null,
			images: []
		};
	};

	slideshowEmbed.prototype.initModal = function($el){
		var self = this;
		self.model =  self.cleanModel();

		for (var et in EntityEmbed.embedTypes)
		{
			if (EntityEmbed.embedTypes[et].name === 'imagesEmbed')
			{
				imageEmbed = new EntityEmbed.embedTypes[et]();
				imageEmbed.initModal($(imageForm));
				imageEmbed.generateUploadedImgPreview = function(){
					return '<div class="' + this.imagePreviewClass + '">' + this.model.upload.name + '</div>';
				};
				$(imageForm).hide();
				break;
			}
		}
		if (!imageEmbed)
		{
			console.log('could not find image embed for use in slideshow embed');
			return;
		}

		imageEmbed.loadLicenses($el);

		$(imageSelect).append('<i id="radio-option-placeholder">click the + to add an image</i>');
		$('.slideshow-image-add').on('click', function(){
			var imageNum = 1;
			for (var image in imageObjects)
			{
				imageNum += 1;
			}

			var id = newRadioOption('image ' + imageNum);
			imageObjects[id] = imageEmbed.cleanModel();
		});

		$(imageSelect).on('click', function(e){
			var $clickedOption = $(imageSelect + ' :checked');
			if ($clickedOption.length == 0)
			{
				return;
			}
			selectSlideshowImage($clickedOption.attr('id'));
		});

		$(imageForm).find('input[name="title"]').on('blur', function(){
			var titleVal = $(this).val();
			if (titleVal === '')
			{
				return;
			}

			var $currentRadio = $('#' + currentImageId).parent();
			$currentRadio.find('.' + labelTextClass).text(titleVal);
		});
	};

	
	/*  // TODO : this
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

					self.model.images[data.response.order] = {
						'object_id': data.response.object_id
					};	
				},
				function(){
					console.log('failed to save a slideshow image');
				}
			));
			$.when.apply($, deferreds).done(function(){
				// TODO : this code is copied from generic embed - find a better way to do this (reduce duplicated code)
				//			why did we copy it? because when we call self.parent.saveEmbed the options object is null (private member issue)
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
		self.model.displayTitle = $form.find('input[name=displayTitle]').val();
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
		imageEmbed.$imageForm.hide();
		$(imageSelect).hide();
	};

})('');