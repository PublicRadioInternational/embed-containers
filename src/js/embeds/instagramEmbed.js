var EntityEmbed = EntityEmbed || {};

(function(window) {

	'use strict';

	// PRIVATE
	var embedName = 'instagram',
		defaults = {
			viewPath: 'modal_instagram.html',
			displayName: 'Instagram',
			object_type: 'instagram',
			actionToolbarLocatorClass: '.instagram-media',
			validationOptions: {
				rules: {
					title: 'required',
					url: {
						required: true,
						validInstagramUrl: true
					}
				}
			}
		},
		uiElements = {
			intro: '.social_editor-intro',
			previewBtn: '.js-btn-preview',
			preview: '.social_editor-preview',
			previewPost: '.social_editor-preview_post',
			previewTitle: '.social_editor-preview_title',
			previewAuthor: '.social_editor-preview_author',
			previewProvider: '.social_editor-preview_provider',
			titleInput: '.js-input-title',
			urlInput: '.js-input-url',
			editBtn: '.js-btn-edit',
			cancelBtn: '.js-btn-cancel',
			dropTarget: '.social_editor-intro_inner'
		};

	function getOembedData(url) {
		var promise = $.Deferred();
		var ajaxOptions = {
			timeout: 2000,
			crossDomain: true,
			type: 'GET',
			dataType: 'jsonp',
			url: 'https://api.instagram.com/oembed',
			data: {
				url: url
			}
		};

		return $.ajax(ajaxOptions)
			.done(function(data) {

				console.log('instagramEmbed > getOembedData', data);

				data.url = data.url || url;

				return data;
			});
	}

	function getOembedTitle(oembed) {
		var dateSelector = 'time';
		var titleSelector = 'a[href="' + oembed.url + '"]';
		var rgxDate = /\w+\s\d{1,2},\s\d{4}/;
		var $embed, $title, $date, date, title, titleTemp, titleTrunc;

		$embed = $('<div>').html(oembed.html);

		$date = $embed.find(dateSelector);
		date = $date.text().match(rgxDate)[0];

		// Set title to oEmbed title
		titleTemp = oembed.title;

		if(!titleTemp)
		{
			// Parse embed html for title element
			$title = $embed.find(titleSelector);
			titleTemp = $title.text();
		}

		// Limit title length to 10 words
		titleTrunc = titleTemp.split(' ').slice(0,10).join(' ');

		// Append ellipsis if title was shortened
		if (titleTrunc !== titleTemp)
		{
			titleTrunc += '...';
		}

		// Build final title
		title = [
			oembed.author_name,
			date,
			titleTrunc
		].join(' - ');

		return title;
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

	function showIntro(scope) {
		var $ui = scope.$ui;

		// Show cancel button as needed
		$ui.cancelBtn.toggle(!!(scope.modalCtrl.isAdd && scope.model.oembed));

		// Show intro
		$ui.intro.show();

		// Hide preview related elements
		$ui.preview.hide();
		$ui.editBtn.hide();
	}

	function showPreview(scope) {
		var $ui = scope.$ui;
		var $embed;

		// Append embed html code
		$ui.previewPost.html(scope.model.embedCode);

		// Set title text
		$ui.titleInput.val(scope.model.title);

		// Set author text and href
		$ui.previewAuthor
			.attr('href', scope.model.oembed.author_url)
			.text(scope.model.oembed.author_name);

		// Set provider text and href
		$ui.previewProvider
			.attr('href', scope.model.oembed.provider_url)
			.text(scope.model.oembed.provider_name);

		// Show edit btn as needed
		$ui.editBtn.toggle(!!scope.modalCtrl.isAdd);

		// Show preview container
		$ui.preview.show();
		// Instagram SDK script only run once, so we need to kick off a parse ourselves.
		scope.activateEmbed();

		// Set a max width on embed container
		// $embed = $ui.previewPost.find('.instagram-media').css('max-width', scope.model.oembed.width);

		// Hide intro related elements
		$ui.intro.hide();
		$ui.cancelBtn.hide();
	}

	function applyOembedToModel(scope, oembed) {
		// Set title to oEmbed title
		scope.model.title = scope.model.title || scope.$ui.titleInput.val();
		if(!scope.model.title)
		{
			scope.model.title = getOembedTitle(oembed);
		}

		// Set embedCode
		scope.model.embedCode = oembed.html;

		// Store oEmbed data on model
		scope.model.oembed = oembed;
	}

	function isValidUrl(url) {
		var rgxInstagramPost = /^(?:https?:)?\/\/(?:www\.)?(?:instagr\.am|instagram\.com)\/p\/([^\/]+)\/?/i;
		return rgxInstagramPost.test(url);
	}

	// CONSTRUCTOR
	function instagramEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	instagramEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = instagramEmbed;

	// PUBLIC
	instagramEmbed.prototype.orderIndex = 8;

	// function to initialize the modal view
	// called after the modal view has loaded
	// $el: a jQuery element for the modal view
	instagramEmbed.prototype.initModal = function($el, modalCtrl) {
		var self = this;
		var $ui;

		self.parent.initModal($el, modalCtrl, self);

		$ui = registerUiElements(self, $el);

		$.validator.addMethod('validInstagramUrl', function(value, element, params) {
			var isValid = isValidUrl(value);
			return this.optional(element) || isValid;
		}, 'The URL must be to a valid Facebook post or video.');

		$ui.previewBtn.on('click', function(evt) {

			evt.preventDefault();

			self.getModelFromForm(self.$el)
				.done(function() {

					console.log('Instagram Embed Model:', self.model);

					if(isValidUrl(self.model.url))
					{
						showPreview(self);
					}
				});
		});

		$ui.editBtn.on('click', function(evt) {
			evt.preventDefault();
			showIntro(self);
		});

		$ui.cancelBtn.on('click', function(evt) {
			evt.preventDefault();
			showPreview(self);
		});

		$ui.dropTarget
			.on('dragenter dragover', function() {
				$(this).addClass('js-dragover');
			})
			.on('dragleave drop', function() {
				$(this).removeClass('js-dragover');
			})
			.on('drop', function(evt) {

				evt.stopPropagation();
				evt.preventDefault();

				var droppedString = evt.originalEvent.dataTransfer.getData('text/plain');
				var droppedHtml = evt.originalEvent.dataTransfer.getData('text/html');
				var $droppedElm = $( droppedHtml );
				var $context = $('<div>');
				var droppedUrl;

				if(!!droppedString)
				{
					droppedUrl = droppedString;
				}
				else if(!!$droppedElm.length)
				{
					$context.append($droppedElm);
					droppedUrl = $context.find('[href]').attr('href');
				}

				console.log('dropped', droppedUrl, droppedString, droppedHtml);

				if(!!droppedUrl && isValidUrl(droppedUrl))
				{
					$ui.urlInput.val(droppedUrl);
					$ui.previewBtn.click();
				}
			});

		$(document).on('dragover drop', function(event) {
			event.preventDefault();
		});
	};

	instagramEmbed.prototype.cleanModel = function() {
		return {
			title: null,
			url: null,
			oembed: null,
			embedCode: null,
			object_type: defaults.object_type
		};
	};

	instagramEmbed.prototype.clearForm = function($el) {
		var self = this;

		self.parent.clearForm($el, self);

		showIntro(self);

		self.$ui.previewPost.empty();
	};

	instagramEmbed.prototype.getModelFromForm = function($form) {
		var self = this;
		var promise = $.Deferred();

		// Gather fields data
		self.parent.getModelFromForm($form.find('form').first(), self);

		// Get oEmbed data for URL
		getOembedData(self.model.url)
			.done(function(data) {

				applyOembedToModel(self, data);

				if(!!self.model.object_id)
				{
					// Not a new embed. Don't need to check for duplication when editing.
					promise.resolve(self.model);
				}
				else
				{
					// Get Video embeds that have matching URL
					EntityEmbed.apiService.get({
						path: self.options.httpPaths.getAll,
						data: {
							url: self.model.url,
							object_type: self.options.object_type
						}
					})
					.done(function(resp) {
						var items = resp.response && resp.response.data || [];

						if(!!items.length && items[0].url === self.model.url)
						{
							// Use object_id from first item
							self.model.object_id = items[0].object_id;
							// Make sure original title is used
							self.model.title = items[0].title;
							self.$ui.titleInput.val(self.model.title);
						}
					})
					.always(function() {
						// Always resolve to keep things moving.
						promise.resolve(self.model);
					});
				}
			})
			.fail(function() {
				// Problem communicating with API. Resolve to keep things moving.
				promise.resolve(self.model);
			});

		return promise;
	};

	instagramEmbed.prototype.populateFormWithModel = function($form) {
		var self = this;
		var $ui = self.$ui;

		function setupUi() {
			// Show Intro or Preview
			if(!self.model.object_id)
			{
				showIntro(self);
			}
			else
			{
				showPreview(self);
			}
		}

		self.parent.populateFormWithModel($form.find('form').first(), self);

		if(self.model.object_id && !self.model.oembed)
		{
			// Get oEmbed data
			getOembedData(self.model.url)
				.done(function(data) {
					applyOembedToModel(self, data);

					return self.saveEmbed();
				})
				.always(function() {
					setupUi();
				});
		}
		else
		{
			setupUi();
		}
	};

	instagramEmbed.prototype.parseForEditor = function() {
		var self = this;
		return '<div class="instagram-embed">' +
						self.model.embedCode +
				'</div>';
	};

	instagramEmbed.prototype.activateEmbed = function() {
		// Check to see if Instagram scripts have already been loaded
		if(window.instgrm)
		{
			// Tell instegram to process embeds again
			window.instgrm.Embeds.process();
		}
	}

})(window);