var EntityEmbed = EntityEmbed || {};

(function(window) {

	'use strict';

	// PRIVATE
	var embedName = 'facebook',
		defaults = {
			viewPath: 'modal_facebook.html',
			displayName: 'Facebook',
			object_type: 'facebook',
			actionToolbarLocatorClass: '.fb-post, .fb-video',
			validationOptions: {
				rules: {
					title: 'required',
					url: {
						required: true,
						validFacebookUrl: true
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

	function bootstrapFacebookSdk() {
		var fbRootId = 'fb-root';
		var sdkScriptId = 'facebook-jssdk';
		var sdkScriptUrl = '//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3';
		var $body = $('body');
		var $fbRoot = $('#' + fbRootId);
		var $sdkScript = $('#' + sdkScriptId);
		var $scripts = $('script');

		if(!$fbRoot.length)
		{
			$fbRoot = $('<div>').attr('id', fbRootId);
			$body.prepend($fbRoot);
		}

		if(!$sdkScript.length)
		{
			$sdkScript = $('<script>')
				.attr('id', sdkScriptId)
				.attr('src', sdkScriptUrl);

			$scripts.eq(0).before($sdkScript);
		}
	}

	function getOembedData(url) {
		var promise = $.Deferred();
		var apiUrl = getPostType(url) === 'video' ?
			'https://www.facebook.com/plugins/video/oembed.json/' :
			'https://www.facebook.com/plugins/post/oembed.json/';
		var ajaxOptions = {
			timeout: 2000,
			crossDomain: true,
			type: 'GET',
			dataType: 'jsonp',
			url: apiUrl,
			data: {
				url: url
			}
		};

		return $.ajax(ajaxOptions)
			.done(function(data) {
				console.log('facebookEmbed > getOembedData', data);
			});
	}

	function getOembedTitle(oembed) {
		var isVideo = getPostType(oembed.url) === 'video';
		var dateSelector = isVideo ? 'blockquote' : 'a[href="' + oembed.url + '"]';
		var titleSelector = isVideo ? 'a[href="' + oembed.url + '"]' : 'blockquote';
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
			$embed = $('<div>').html(oembed.html);
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

	/**
	 * Get only the post markup from embed code.
	 *
	 * @param   {String}  embedCode  Embed code markup to parse.
	 *
	 * @return  {String}             HTML markup of post.
	 */
	function getPostHtml(embedCode) {
		var $post = $('<div>').html(embedCode).find('.fb-post, .fb-video');
		var $embed = $('<div>').html($post);

		return $embed.html();
	}

	function getPostType(url) {
		return (/\/video(?:s\/|\.php)/i).test(url) ? 'video' : 'post';
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
		var $embed = $('<div>').html(scope.model.embedCode).find('.fb-post, .fb-video');

		// Append embed html code
		// For rendering puposes, we want only the embed markup, not the bootstrap script or fb-root element. We'll handle that later as needed.
		$ui.previewPost.html(getPostHtml(scope.model.embedCode));

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
		// Facebook SDK script only run once, so we need to kick off a parse ourselves.
		scope.activateEmbed();

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
		var rgxFacebookPost = /^(?:https:)?\/\/www\.facebook\.com\/(?:[^\/]+\/)?(?:activity|media|notes|permalink|photos?|posts|questions|videos?)/i;
		return rgxFacebookPost.test(url);
	}

	// CONSTRUCTOR
	function facebookEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	facebookEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = facebookEmbed;

	// PUBLIC
	facebookEmbed.prototype.orderIndex = 7;

	// function to initialize the modal view
	// called after the modal view has loaded
	// $el: a jQuery element for the modal view
	facebookEmbed.prototype.initModal = function($el, modalCtrl) {
		var self = this;
		var $ui;

		self.modalCtrl = modalCtrl;

		$ui = registerUiElements(self, $el);

		$.validator.addMethod('validFacebookUrl', function(value, element, params) {
			var isValid = isValidUrl(value);
			return this.optional(element) || isValid;
		}, 'The URL must be to a valid Facebook post or video.');

		$ui.previewBtn.on('click', function(evt) {

			evt.preventDefault();

			self.getModelFromForm($el)
				.done(function() {
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

	facebookEmbed.prototype.cleanModel = function() {
		return {
			title: null,
			url: null,
			oembed: null,
			embedCode: null
		};
	};

	facebookEmbed.prototype.clearForm = function($el) {
		var self = this;

		self.parent.clearForm($el, self);

		showIntro(self);

		self.$ui.previewPost.empty();
	};

	facebookEmbed.prototype.getModelFromForm = function($form) {
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

						if(!!items.length)
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

	facebookEmbed.prototype.populateFormWithModel = function($form) {
		var self = this;
		var $ui = self.$ui;

		function setupUi() {
			// Show video player and title
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

	facebookEmbed.prototype.parseForEditor = function() {
		var self = this;

		return '<div class="facebook-embed">' +
					getPostHtml(self.model.embedCode) +
				'</div>';
	};

	facebookEmbed.prototype.activateEmbed = function() {
		// Check to see if FB scripts have already been loaded
		if(window.FB)
		{
			// Tell FB to parse widgets again
			window.FB.XFBML.parse();
		}
		else
		{
			bootstrapFacebookSdk();
		}
	}

})(window);