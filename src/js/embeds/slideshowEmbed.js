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
				embedTypeStr: 'image',
				bufferData: true
			}
		},
		generateId = function () {
			var ret = '';
			for(var i = 0; i < 8; i++){
				ret += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
			return ret;
		},
		slideClass = 'slideshow_editor-nav_item',
		slideActiveClass = 'active',
		slideHanleClass = 'slideshow_editor-nav_handle',
		slideIndicatorClass = 'slideshow_editor-nav_ind',
		slideAddedClass = 'fa-circle-o',
		slideNewClass = 'fa-star',
		slideChangedClass = 'fa-star-o',
		slideSavingClass = 'fa-circle-o-notch fa-spin',
		slideCompleteClass = 'fa-check',
		slideErrorClass = 'fa-exclamation',
		slidePlaceholderClass = 'slideshow_editor-slide_placholder',
		uiElements = {
			// myElm: '.select-my-elm'
			addSlide: '.js-add_slide',
			intro: '.slideshow_intro',
			editor: '.slideshow_editor',
			slideImage: '.js-slide_image',
			slideCaption: '.js-slide_caption',
			slideCreditBlock: '.slideshow_editor-slide_credit-container',
			slideCredit: '.js-slide_credit',
			slideText: '.js-slide_text',
			slides: '.js-slides',
			slideTemplate: '.js-slide_template',
			removeSlide: '.js-remove_slide',
			editSlide: '.js-edit_slide',
			dropFiles: '.slideshow_drop_files'
		};

	function activateSlide($slide, scope) {
		var $ui = scope.$ui;

		scope.$currentSlide = $slide;

		$ui.slides.find('.' + slideActiveClass).removeClass(slideActiveClass);
		$slide.addClass(slideActiveClass);

		$ui.slides.sortable('refresh');

		viewCurrentSlide(scope);

		showEditor(scope);
	}

	function viewCurrentSlide(scope) {
		var imageEmbed = new EntityEmbed.embedTypes.image();
		var $ui = scope.$ui;
		var model = scope.$currentSlide.data('model');
		var creditFilter = !!model.creditLink ? 'a' : 'span';
		var hasCaption = !!model.caption;
		var hasCredit = !!model.credit;
		var hasText = hasCaption || hasCredit;
		var imageUrl;

		imageEmbed.model = model;

		imageUrl = imageEmbed.getImageUrl();

		$ui.slideText.toggle(hasText);

		// Render image
		$ui.slideImage.css('background-image', 'url("' + imageUrl + '")')
			.find('img').attr('src', imageUrl);

		// Render Caption
		$ui.slideCaption.toggle(hasCaption).text(model.caption);

		// Render Credit
		$ui.slideCreditBlock.toggle(hasCredit);
		$ui.slideCredit.text(model.credit).hide().filter(creditFilter).show();
		$ui.slideCreditBlock.find('a:visible').attr('href', model.creditLink);
	}

	function hideEditor(scope) {
		var $ui = scope.$ui;

		$ui.intro.show();
		$ui.editor.hide();

		// Remove slide elements
		$ui.slides.empty();

		// Clear preview
		$ui.slideImage.css('background-image', 'none')
			.find('img').removeAttr('src');
		$ui.slideText.hide();
		$ui.slideCaption.empty();
		$ui.slideCreditBlock.hide();
		$ui.slideCredit.empty().filter('a').removeAttr('href');
	}

	function showEditor(scope) {
		var $ui = scope.$ui;

		$ui.intro.hide();
		$ui.editor.show();
	}

	function registerUiElements(scope, $el) {
		scope.$ui = scope.$ui || {};

		for(var key in uiElements)
		{
			if(uiElements.hasOwnProperty(key))
			{
				scope.$ui[key] = $(uiElements[key], $el);
			}
		}

		return scope.$ui;
	}

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
		var $ui;

		self.parent.initModal($el, modalCtrl, self);

		self.model = self.cleanModel();

		imageModalOptions.modalContainer = $el;

		imageModalOptions.modalOptions.parentModal = modalCtrl;

		// Set up ui interaction events

		$ui = registerUiElements(self, $el);

		$ui.slideTemplate.removeClass('js-slide_template').detach();
		$ui.slideTemplate.on('click', 'a', function() {
			var $this = $(this);
			var $slide = $this.closest('.' + slideClass);
			activateSlide($slide, self);
		});

		$ui.slides.sortable({
			axis: 'x',
			handle: '.' + slideHanleClass,
			placeholder: slidePlaceholderClass
		});

		$ui.addSlide.on('click', function() {
			delete imageModalOptions.modalOptions.id;
			delete imageModalOptions.modalOptions.embedData;

			$.embed_modal_open(imageModalOptions)
				.done(function(response) {
					var $slide = $ui.slideTemplate.clone(true);
					var slideClass = !!response.data.object_id ? slideAddedClass : slideNewClass;

					// Add data to slide
					$slide.data('model', response.data);
					$slide.find('.' + slideIndicatorClass).addClass(slideClass);

					// Append slide
					$ui.slides.append($slide);

					// Activate slide
					activateSlide($slide, self);

					showEditor(self);
				});
		});

		$ui.editSlide.on('click', function() {
			var $slide = self.$ui.slides.find('.' + slideActiveClass);
			var model = $slide.data('model');

			self.$currentSlide = $slide;

			imageModalOptions.modalOptions.id = model.object_id;
			imageModalOptions.modalOptions.embedData = model;

			$.embed_modal_open(imageModalOptions)
				.done(function(response) {
					// Update data on slide
					$slide.data('model', response.data);
					// Added changed indicator if not a new slide
					if(model.object_id)
					{
						$slide.find('.' + slideIndicatorClass)
							.removeClass(slideAddedClass)
							.addClass(slideChangedClass);
					}
					// Show changes to slide
					viewCurrentSlide(self);
				});
		});

		$ui.removeSlide.on('click', function() {
			var $slide = self.$ui.slides.find('.' + slideActiveClass);
			var $prev = $slide.prev();
			var $next = $slide.next();
			var $sibling;

			$slide.remove();

			switch(true)
			{
				case !!$next.length :
					$sibling = $next;
					break;

				case !!$prev.length :
					$sibling = $prev;
					break;
			}

			if($sibling)
			{
				activateSlide($sibling, self);
			}
			else
			{
				self.$currentSlide = undefined;
				hideEditor(self);
			}
		});

		$ui.dropFiles
			.on('dragenter dragover', function() {
				$(this).addClass('js-dragover');
			})
			.on('dragleave drop', function() {
				$(this).removeClass('js-dragover');
			})
			.on('drop', function(evt) {
				var filesList = evt.originalEvent.dataTransfer.files;
				var files = [];
				var slides = [];
				var i, m;

				evt.preventDefault();

				if(!filesList.length)
				{
					return;
				}

				for (i = 0, m = filesList.length; i < m; i++)
				{
					files[i] = filesList[i];
				}

				function processFile(file) {
					var fileNumber = filesList.length - files.length;
					var imageEmbed, $slide;

					if(file.type.indexOf('image') === -1)
					{
						return;
					}

					imageEmbed = new EntityEmbed.embedTypes.image();

					imageEmbed.getModelFromFile(file)
						.done(function(model) {

							delete imageModalOptions.modalOptions.id;

							imageModalOptions.modalOptions.headerText = ['Add Image', fileNumber, 'of', filesList.length].join(' ');
							imageModalOptions.modalOptions.embedData = model;

							$.embed_modal_open(imageModalOptions)
								.done(function(response) {
									var $slide = $ui.slideTemplate.clone(true);
									var slideClass = !!response.data.object_id ? slideAddedClass : slideNewClass;

									// Add data to slide
									$slide.data('model', response.data);
									$slide.find('.' + slideIndicatorClass).addClass(slideClass);

									// Append slide
									slides.push($slide);
								})
								.always(function() {

									delete imageModalOptions.modalOptions.headerText;

									if(!!files.length)
									{
										processFile(files.shift());
									}
									else
									{
										for (i = 0, m = slides.length; i < m; i++)
										{
											$ui.slides.append(slides[i]);
											if(i === 0)
											{
												activateSlide(slides[i], self);
											}
										}
									}
								});

						});
				}

				processFile(files.shift());
			});

	};

	slideshowEmbed.prototype.saveEmbed = function(embedIsNew){
		var self = this;
		var deferreds = [];
		var imageEmbed = new EntityEmbed.embedTypes.image();
		var $slides = self.$ui.slides.children();

		self.model.images = [];

		$slides.removeClass(slideActiveClass).each(function(index) {
			var $this = $(this);
			var model = $this.data('model');
			var isNew = !model.object_id;
			var promise;

			$this.addClass('saving').find('.' + slideIndicatorClass)
				.removeClass([slideNewClass, slideAddedClass].join(' '))
				.addClass(slideSavingClass);

			imageEmbed.model = model;
			promise = imageEmbed.saveEmbed(isNew);
			promise.done( (function(_index_, _$this_){
					return function(data){
						if (data.status == 'ERROR')
						{
							console.log('failed to put/post a slideshow image');
							return;
						}

						_$this_.removeClass('saving').addClass('complete')
							.find('.' + slideIndicatorClass).removeClass(slideSavingClass).addClass(slideCompleteClass);

						self.model.images[_index_] = {
							'object_id' : data.response.object_id,
							'order'		: _index_
						};
					};
				})(index, $this))
				.fail((function(_index_, _$this_){
					return function(jqXhr, status, err){
						console.log('failed to save a slideshow image number ' + _index_, err);

						_$this_.removeClass('saving').addClass('error')
							.find('.' + slideIndicatorClass).removeClass(slideSavingClass).addClass(slideErrorClass);
					};
				})(index, $this));

			deferreds.push(promise);
		});

		return $.when.apply($, deferreds).then(function(){

			console.log('all images saved.', self.model.images);

			return self.parent.saveEmbed(embedIsNew, self);
		});
	};

	slideshowEmbed.prototype.getModelFromForm = function($form){
		var self = this;
		var $slides = self.$ui.slides.children();

		// Gather slideshow fields data
		self.parent.getModelFromForm($form.find('form').first(), self);

		self.model.images = [];

		$slides.each(function(index) {
			var $this = $(this);
			var model = $this.data('model');

			self.model.images[index] = {
				object_id: model.object_id,
				order: index
			}
		});
	};

	slideshowEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		var $ui = self.$ui;
		var imageEmbed = new EntityEmbed.embedTypes.image();
		var deferreds = [];

		self.parent.populateFormWithModel($form.find('form').first(), self);

		if(!self.model.images.length)
		{
			hideEditor(self);
			return;
		}

		// make sure images array is sorted on order
		self.model.images.sort(function(l, r){
			return !!l && !!r && l.order - r.order;
		});

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
					object_id: self.model.images[i].object_id
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
					$.extend(true, image, data.response);

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
			var i, m, $slide, $first;

			// Generte and attach slides
			for (i = 0, m = self.model.images.length; i < m; i++)
			{
				$slide = $ui.slideTemplate.clone(true);
				$slide.data('model', self.model.images[i]);
				$ui.slides.append($slide);

				if(i === 0)
				{
					$first = $slide;
				}
			}

			activateSlide($first, self);

			showEditor(self);
		});
	};

	slideshowEmbed.prototype.clearForm = function($el){
		var self = this;

		self.parent.clearForm($el, self);

		hideEditor(self);
	};

	slideshowEmbed.prototype.parseForEditor = function(){
		var imageEmbed = new EntityEmbed.embedTypes.image();
		var self = this;
		var imgId = ['img', self.model.images[0].object_id, (new Date()).getTime()].join('_');
		var imgHtml = [
			'<img id="' + imgId + '" />'
		];
		var dotsHtml = [];
		var slideHtml, i, m;

		EntityEmbed.apiService.get({
			path: imageEmbed.options.httpPaths.get,
			data: {
				object_id: self.model.images[0].object_id
			}
		})
		.done(function(data) {
			var imgData = data.response;
			var $img = $('#' + imgId);
			var $slide = $img.parent();

			imageEmbed.model = imgData;

			$img.attr('src', imageEmbed.getImageUrl(imgData.url_path));

			if(!!imgData.caption)
			{
				$slide.append('<div class="slideshow-embed-caption">' + imgData.caption + '</div>');
			}

			if(!!imgData.credit)
			{
				$slide.append('<div class="slideshow-embed-credit">Credit :' + imgData.credit + '</div>');
			}
		});

		slideHtml = '<div class="slideshow-embed-slides"><div class="slideshow-embed-slide">' + imgHtml.join('') + '</div></div>';

		// Add a dot for each slide
		for(i = 0, m = self.model.images.length; i < m; i++)
		{
			dotsHtml.push('<li class="slideshow-embed-dot"></li>');
		}

		return	'<div class="slideshow-embed">' + slideHtml + '<ul class="slideshow-embed-dots">' + dotsHtml.join('') + '</ul></div>';
	};

})();