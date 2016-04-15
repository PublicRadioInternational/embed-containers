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
					license: 'required'//,
					// radioOption: {
					// 	slideshowImage: true,
					// 	errorLabelContainer: '.slideshow-image-error'
					// }
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
					'<label class="slideshow-image-error"></label>' + 
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

		// get image embed type
		for (var et in EntityEmbed.embedTypes)
		{
			if (EntityEmbed.embedTypes[et].name === 'imagesEmbed')
			{
				imageEmbed = new EntityEmbed.embedTypes[et]();

				// initialize it with the correct form (remember there are two on this page)
				imageEmbed.initModal($(imageForm));

				// modify function to suit slideshow
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

		// configure validation for slideshow images
		$.validator.addMethod('slideshowImage', function(value, element, params) {
			var imgId = element.id;
			var isValid = true;
			if (!!imgId || !!imageObjects[imgId])
			{
				isValid = !!imageObjects[imgId].title &&
							!!imageObjects[imgId].license &&
							!!imageObjects[imgId].altText &&
							(!!imageObjects[imgId].upload || !!imageObjects[imgId].url_path);
			}
			return this.optional(element) || isValid;
		}, 'missing required fields');

		imageEmbed.loadLicenses($el);

		/*
		 * configure icons event handlers that enable a user to create a dynamic list of images
		 */

		// placeholder text - instructs user
		$(imageSelect).append('<i id="radio-option-placeholder">click the + to add an image</i>');

		// event handler for the add image icon
		$('.slideshow-image-add').on('click', function(){
			var imageNum = 1;
			for (var image in imageObjects)
			{
				imageNum += 1;
			}

			var id = newRadioOption('image ' + imageNum);
			imageObjects[id] = imageEmbed.cleanModel();
		});

		// event handler for changing the image object which populates the form (select radio option)
		$(imageSelect).on('click', function(e){
			var $clickedOption = $(imageSelect + ' :checked');
			if ($clickedOption.length == 0)
			{
				return;
			}
			selectSlideshowImage($clickedOption.attr('id'));
		});

		// event handler to change the radio option text to match the title of the image
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

	slideshowEmbed.prototype.saveEmbed = function(embedIsNew)
	{
		var self = this;
		var deferreds = [];

		for(var i = 0; i < self.model.images.length; i++)
		{
			imageEmbed.model = self.model.images[i];
			var imageEmbedIsNew = !imageEmbed.model.object_id;

			var promise = imageEmbed.saveEmbed(imageEmbedIsNew);
			
				promise.done((function(imageNum){
					return function(data){
						if (data.status == 'ERROR')
						{
							console.log('failed to put/post a slideshow image');
							return;
						}

						self.model.images[imageNum] = {
							'object_id': data.response.object_id
						};
					}	
				})(i))
				.fail((function(imageNum){
					return function(){
						console.log('failed to save a slideshow image number ' + imageNum);
					}
				})(i));
			deferreds.push(promise);
		}
		return $.when.apply($, deferreds).done(function(){
			return self.parent.saveEmbed(embedIsNew, self);
		});	
	};

	slideshowEmbed.prototype.validate = function($el, isAddModal){
		var self = this;

		
		// TODO : make this work
		imageEmbed.validate($(imageForm), isAddModal);


		return self.parent.validate($el.find('form').first(), isAddModal, self);
	};

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
		self.parent.clearForm($el, self	);

		$el.find(imageSelect).children().remove();
		$(imageForm).hide();
		imageEmbed.$imageForm.hide();
		$(imageSelect).hide();
	};

})('');