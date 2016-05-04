var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'slideshow',
		defaults = {
			viewPath: 'modal_slideshow.html',
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
		// TODO : organize these into object (see embedModalDefaults.js)
		imageForm = '#embed-modal-slideshow-image',
		selectExistingImageContainer = '#embed-modal-slideshow-image-select-existing',
		selectExistingBtnContainer = '#slideshow-image-select-btns',
		cancelSelectExistingImageBtn = '#btn-cancel-select-existing-simg',
		imageSelect = '.embed-modal-slideshow-image-list',
		labelTextClass = 'slideshow-radio-label-text',
		instructionalText = '.radio-option-placeholder',
		slideshowImageQueryContainer = '.simg-query-container',
		imageEmbed,
		imageObjects = {}, // key = image ID; value = image object
		currentImageId = null,
		newRadioOption = function(label, guid){
			if ($(instructionalText).is(':visible'))
			{
				$(instructionalText).hide();
			}

			var id = guid || generateId();
			var newHtml =
				'<div class="slideshow-radio-container">' +
					'<label class="slideshow-radio">' +
						'<input type="radio" id="' + id + '" name="radioOption">' +
						'<span class="' + labelTextClass + '">' +
							label +
						'</span>' +
						'<label class="slideshow-image-error"></label>' +
					'</label>' +
					'<div class="remove-slideshow-image">' +
						'<i class="fa fa-times"></i>' +
					'</div>' +
				'</div>';

			$(imageSelect).append(newHtml);
			var $op = $(imageSelect).children().last();

			$op.find('.remove-slideshow-image').on('click', (function(){
				return function(embedId, $radioOp){
					delete imageObjects[id];
					$op.remove();
				}
			})(id, $op));

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
		},
		showSelectExistingImage = function(){
			$(imageForm).hide();
			$(selectExistingImageContainer).show();
		},
		hideSelectExistingImage = function(){
			$(imageForm).show();
			$(selectExistingImageContainer).hide();
		},
		initAutoComplete = function (){
			var rgxDevEnv = /^[^.]*staging[^.]*\.|\.dev$/;
			var isDevEnv = rgxDevEnv.test(window.location.host);
			var debug = 0;
			var ajaxData = {
				auth_token: EntityEmbed.apiService.getAuthToken(),
				object_type: imageEmbed.options.object_type
			};


			if(isDevEnv)
			{
				ajaxData.debug = 1;
			}

			var options = {
				ajaxSettings: {
					dataType: 'json',
					method: 'POST',
					data: ajaxData
				},
				requestDelay: 600,
				url: function(phrase) {
					ajaxData.title = phrase;
					return imageEmbed.options.httpPaths.getAll;
				},
				listLocation: function(listOfData){
					return listOfData.response.data;
				},
				getValue: function(data) {
					return data.title;
				},
				preparePostData: function(data) {
					data.title = $('input[name="simg-query"]').val();
					return JSON.stringify(data);
				},
				list: {
					maxNumberOfElements: 20,
					match: {
						enabled: true
					},
					sort: {
						enabled: true
					},
					onChooseEvent: function(){
						var itemData = $('input[name="simg-query"]').getSelectedItemData();
						var objectId = itemData.object_id;
						$('input[name="simg-query"]').val('');

						EntityEmbed.apiService.get({
							path: imageEmbed.options.httpPaths.get,
							data: {
								object_id: objectId
							}
						})
						.done(function(respData){
							if (typeof respData.response === 'string')
							{
								console.log('Failed to get list of current embed types for the Select Existing page: ' + respData.response);
								return;
							}

							// create an event to be raised
							var addEvent = jQuery.Event('existingImageSelected');
							// add data to it so the handler knows what to do
							addEvent.imageModel = respData.response;
							$('input[name="simg-query"]').trigger(addEvent);

						})
						.fail(function(respData){
							// TODO: show error UI
							console.log('failed to get embed type!');
						});
					}
				}
			};

			$('input[name="simg-query"]').easyAutocomplete(options);
			$('input[name="simg-query"]').closest('.easy-autocomplete').removeAttr('style');
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

		// Make sure image embed type has been defined
		if(typeof EntityEmbed.embedTypes.image === 'function')
		{
			imageEmbed = new EntityEmbed.embedTypes.image();

			// initialize it with the correct form (remember there are two on this page)
			imageEmbed.initModal($(imageForm));

			$(imageForm).hide();
		}
		else
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
				isValid = 	!!imageObjects[imgId].title &&
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

		 // event handler for the select existing image icon
		$('.slideshow-image-select-existing').on('click', function(){
			showSelectExistingImage();
		});

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

		// initialize auto complete for the simg (slideshow image) query input
		initAutoComplete();

		// event handler for the select button within the select existing view
		$el.find('input[name="simg-query"]').on('existingImageSelected', function(e){

				var imageNum = 1;
				for (var image in imageObjects)
				{
					imageNum += 1;
				}

				// track image object
				imageObjects[e.imageModel.object_id] = e.imageModel;

				// make radio option for image and select it
				newRadioOption(e.imageModel.title, e.imageModel.object_id);
				$('#' + e.imageModel.object_id).attr('checked', '');

				// clear image form and save data
				if (!!currentImageId && currentImageId !== '')
				{
					saveChangesToImageModel();
					imageEmbed.clearForm($(imageForm));
					currentImageId = e.imageModel.object_id;
				}

				// populate image form
				imageEmbed.model = e.imageModel;
				imageEmbed.populateFormWithModel($(imageForm));
				hideSelectExistingImage();
		});

		$(cancelSelectExistingImageBtn).on('click', function(){
			hideSelectExistingImage();
			$('input[name="simg-query"]').val('')
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

	slideshowEmbed.prototype.saveEmbed = function(embedIsNew){
		var self = this;
		var deferreds = [];

		// if this is an edit modal, slideshowTitle will be on model and thats just no good!
		if (!!self.model.slideshowTitle)
		{
			delete self.model.slideshowTitle;
		}

		for(var i = 0; i < self.model.images.length; i++)
		{
			imageEmbed.model = self.model.images[i];
			var imageEmbedIsNew = !imageEmbed.model.object_id;

			var promise = imageEmbed.saveEmbed(imageEmbedIsNew);

			promise.done( (function(imageNum){
					return function(data){
						if (data.status == 'ERROR')
						{
							console.log('failed to put/post a slideshow image');
							return;
						}

						self.model.images[imageNum] = {
							'object_id' : data.response.object_id,
							'order'		: imageNum
						};
					};
				})(i))
				.fail((function(imageNum){
					return function(){
						console.log('failed to save a slideshow image number ' + imageNum);
					};
				})(i));

			deferreds.push(promise);
		}
		return $.when.apply($, deferreds).then(function(){
			return self.parent.saveEmbed(embedIsNew, self);
		});
	};

	slideshowEmbed.prototype.validate = function($el, isAddModal){
		var self = this;


		// TODO : make this work
		imageEmbed.validate($(imageForm), isAddModal);


		return self.parent.validate($el.find('form').first(), isAddModal, self);
	};

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

	slideshowEmbed.prototype.populateFormWithModel = function($form){
		var self = this,
			deferreds = [];

		self.model.slideshowTitle = self.model.title;
		self.parent.populateFormWithModel($form.find('form').first(), self);

		// hide this while we are loading the image embeds
		$(imageSelect).hide();

		$(instructionalText).hide();

		// make sure images array is sorted on order
		self.model.images.sort(function(l, r){
			return l.order - r.order;
		});

		for(var i = 0; i < self.model.images.length; i++)
		{
			newRadioOption('image ' + (i+1), self.model.images[i].object_id);

			if (i === 0)
			{
				$('#' + self.model.images[i].object_id).attr('checked', '');
				currentImageId = self.model.images[i].object_id;
			}
		}

		for(var i = 0; i < self.model.images.length; i++)
		{
			var promise = EntityEmbed.apiService.get({
				path: imageEmbed.options.httpPaths.get,
				data: {
					object_id: self.model.images[i].object_id,
					auth_token: EntityEmbed.apiService.getAuthToken
				}
			});

			promise.done((function(imageOrder){
				return function(data){
					if (data.status === 'ERROR' || typeof data.response === 'string')
					{
						console.log('could not load slideshow image number ' + imageOrder);
						return;
					}

					imageObjects[data.response.object_id] = data.response;

					var $radioOp = $('#' + data.response.object_id).parent();
					$radioOp.find('.' + labelTextClass).text(data.response.title);

					if (imageOrder == 0)
					{
						imageEmbed.model = data.response;
					}
				};
			})(self.model.images[i].order))
			.fail((function(imageOrder){
				return function(){
					console.log('could not load slideshow image number ' + imageOrder)
				};
			})(self.model.images[i].order));

			deferreds.push(promise);
		}

		$.when.apply($, deferreds).done(function(){
			$(imageSelect).show();
			$(imageForm).show();

			imageEmbed.populateFormWithModel($(imageForm));
		});
	};

	slideshowEmbed.prototype.clearForm = function($el){
		var self = this;
		self.parent.clearForm($el, self);
		if (!!imageEmbed)
		{
			imageEmbed.clearForm($(imageForm));
		}

		imageObjects = {};
		currentImageId = '';

		$el.find('.slideshow-radio-container').remove();
		$(imageForm).hide();

		$(instructionalText).show();
	};

})();