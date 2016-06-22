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
					title: 'required'
				}
			}
		},
		imageModalOptions = {
			modalElId: 'embed-modal-slideshow-image',
			embedTypes: {
				image: {}
			},
			modalOptions: {
				embedTypeStr: 'image'
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
		uiElements = {
			// myElm: '.select-my-elm'
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

	slideshowEmbed.prototype.initModal = function($el, modalCtrl){
		var self = this;

		self.model = self.cleanModel();

		self.$el = imageModalOptions.modalContainer = $el;

		imageModalOptions.modalOptions.parentModal = modalCtrl;

		// Set up ui interaction events

	};

	slideshowEmbed.prototype.saveEmbed = function(embedIsNew){
		var self = this;
		var deferreds = [];
		var imageEmbed = new EntityEmbed.embedTypes.image();

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

							delete self.model.images[imageNum];

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

	slideshowEmbed.prototype.getModelFromForm = function($form){
		var self = this;

		// Gather slideshow fields data
		self.model.title = $form.find('input[name=slideshowTitle]').val();
		self.model.displayTitle = $form.find('input[name=displayTitle]').val();

		// Gather image data
		self.model.images = [];
		// Query slide elements and extract data.model
		// Image data on model shoul only contain these keys:
		// 	- object_id
		// 	- order
	};

	slideshowEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		var imageEmbed = new EntityEmbed.embedTypes.image();
		var images = [];
		var deferreds = [];

		self.parent.populateFormWithModel($form.find('form').first(), self);

		// make sure images array is sorted on order
		// self.model.images.sort(function(l, r){
		// 	return l.order - r.order;
		// });

		for(var i = 0; i < self.model.images.length; i++)
		{
			// Skip empty items in case a past bug left a gap in the data.
			if(!self.model.images[i])
			{
				continue;
			}

			// Request image emebed data from API
			var promise = EntityEmbed.apiService.get({
				path: imageEmbed.options.httpPaths.get,
				data: {
					object_id: self.model.images[i].object_id + 'err',
					auth_token: EntityEmbed.apiService.getAuthToken
				}
			});

			// Handle response
			promise.done((function(image){
				return function(data){
					if (data.status === 'ERROR' || typeof data.response === 'string')
					{
						console.log('Could not load slideshow image number ' + image.order, image, data);
						// TODO: Remove invalid item from images array... Maybe?
						return;
					}

					// Extend image with returned data
					$.extend(true, image, data);

				};
			})(self.model.images[i]))
			.fail((function(image){
				return function(jqXhr, status, err){
					console.log('Could not load slideshow image number ' + image.order, image, err);
						// TODO: Remove invalid item from images array... Maybe?
				};
			})(self.model.images[i]));

			// Add request promise to our deferreds
			deferreds.push(promise);
		}

		//
		$.when.apply($, deferreds).done(function(){
			// Generte and attach slides
			// View first slide
		});
	};

	slideshowEmbed.prototype.clearForm = function($el){
		var self = this;

		self.parent.clearForm($el, self);

		// Remove slide elements

	};

})();