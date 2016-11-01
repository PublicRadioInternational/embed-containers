var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'video',
		defaults = {
			viewPath: 'modal_video.html',
			displayName: 'Video',
			object_type: 'video',
			validationOptions: {
				rules: {
					title: 'required',
					url: {
						required: true,
						validDomain: true
					}
				}
			}
		},
		uiElements = {
			intro: '.video_editor-intro',
			previewBtn: '.js-btn-preview',
			preview: '.video_editor-preview',
			previewIframe: '.js-preview-iframe',
			previewTitle: '.video_editor-preview_title',
			previewAuthor: '.video_editor-preview_author',
			previewProvider: '.video_editor-preview_provider',
			previewWrapper: '.js-preview-wrapper',
			urlInput: '.js-input-url',
			editBtn: '.js-btn-edit',
			cancelBtn: '.js-btn-cancel',
			videoDropTarget: '.video_editor-intro_inner'
		},
		youtubeOptions = {
			showinfo: 0,				// Hide video title
			modestbranding: 1,	// Hide YouTube logo on controls
			rel: 0							// Don't show related video grid after video has finished
		},
		vimeoOptions = {
			title: 0,					// Hide video title
			portrait: 0,			// Hide creator portrait
			byline: 0,				// Hide creater byline
			color: 'dc5555'		// Set color to sites primary accent color. I ♥ Vimeo.
		};

		function makeUrlParams(obj) {
			var ret = [];
			for(var key in obj)
			{
				if(obj.hasOwnProperty(key))
				{
					ret.push([key, obj[key]].join('='));
				}
			}

			return ret.join('&');
		}

		function makeEmbedUrl(url){
			var ret = '';

			if (url.indexOf('vimeo.com') !== -1)
			{
				// TODO: embed opts should be configurable
				var opts = '?' + makeUrlParams(vimeoOptions);

				ret = '//player.vimeo.com/video/' + getVimeoVideoId(url) + opts;
			}
			else if (url.indexOf('youtube.com') !== -1)
			{
				// TODO: embed opts should be configurable
				var opts = '?' + makeUrlParams(youtubeOptions);

				ret = '//www.youtube.com/embed/' + getYoutubeVideoId(url) + opts;
			}

			return ret;
		}

		function makeWatchUrl(url){
			var ret = '';

			if (url.indexOf('vimeo.com') !== -1)
			{
				ret = 'https://vimeo.com/' + getVimeoVideoId(url);
			}
			else if (url.indexOf('youtube.com') !== -1)
			{
				ret = 'https://www.youtube.com/watch?v=' + getYoutubeVideoId(url);
			}

			return ret;
		}

	// Vimeo URL Patterns:
	// 1. [http://]player.vimeo.com/video/VIDEOID : IFrame embed. Can have querystring options
	// 2. [http://]vimeo.com/VIDEOID : URL in address bar when watching on website

	// Extracts the id based on Vimeo URL patterns.
	var getVimeoVideoId = function(videoId) {
		var result = (videoId.indexOf('/') > -1) ?
		// Vimeo's urls all have the video id at the end of the path segment,
		// after the last '/' up to the end of the string (or '?' if pressent)
		videoId.match(/\/([^?\/]+)(?:\?|$)/i)[1] :
		// Not URL. Assume original value is the Id
		videoId;

		return result;
	};

	// YouTube URL Patterns:
	// 1. [http://]www.youtube.com/embed/VIDEOID : IFrame embed. Can have querystring options
	// 2. [http://]www.youtube.com/v/VIDEOID : AS3 embed. Can have querystring options
	// 3. [http://]www.youtube.com/watch?v=VIDEOID : URL in address bar when watching on website
	// 4. [http://]youtu.be/VIDEOID : Sharing URL. Can have querystring options

	// Extracts the id based on YouTube URL patterns.
	var getYoutubeVideoId = function(videoId) {
		var result = (videoId.indexOf('/') > -1) ?

		// This is a url
		(videoId.indexOf('/watch') > -1) ?

		// URL is pattern 3
		videoId.match(/v=([^&]+)(?:&|$)/i)[1] :

		// All other URL patterns have the video id at the end of the path segment,
		// after the last '/' up to the end of the string (or '?' if pressent)
		videoId.match(/\/([^?\/]+)(?:\?|$)/i)[1] :

		// Not URL. Assume original value is the id
		videoId;

		return result;
	};

	var getOembedData = function(url) {
		var promise = $.Deferred();
		var apiUrl, dataOptions;

		switch(true)
		{
			case url.indexOf('vimeo.com') !== -1 :
			apiUrl = 'https://vimeo.com/api/oembed.json';
			dataOptions = $.extend(true, {}, vimeoOptions);
			break;

			case url.indexOf('youtube.com') !== -1 :
			apiUrl = 'https://noembed.com/embed'; // Use Noembed until YouTube supports jsonp or we create our own oEmbed API
			dataOptions = {};
			break;
		}

		dataOptions.url = url;

		var ajaxOptions = {
			timeout: 2000,
			crossDomain: true,
			type: 'GET',
			dataType: 'jsonp',
			url: apiUrl,
			data: dataOptions,
			success: function(data) {
				console.log(data);
			}
		};

		return $.ajax(ajaxOptions);
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
		var iframeScale = scope.model.oembed.height / scope.model.oembed.width * 100;
		var embedUrl = makeEmbedUrl(scope.model.url);

		// Scale video wrapper to video aspect ratio
		$ui.previewWrapper.css({ paddingTop: iframeScale + '%' });
		// Set video iframe src, if it has changed
		if($ui.previewIframe.attr('src') !== embedUrl)
		{
			$ui.previewIframe.attr('src', embedUrl);
		}

		// Set title text
		$ui.previewTitle.text(scope.model.title);

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

		// Hide intro related elements
		$ui.intro.hide();
		$ui.cancelBtn.hide();
	}

	function applyOembedToModel(scope, oembed) {
		// Set title to oEmbed title
		scope.model.title = oembed.title;

		// Set embedCode
		scope.model.embedCode = oembed.html;

		// Store oEmbed data on model
		scope.model.oembed = oembed;
	}

	// CONSTRUCTOR
	function videoEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	videoEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = videoEmbed;

	// PUBLIC
	videoEmbed.prototype.orderIndex = 4;

	videoEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url: null,
			oembed: null
		};
	};

	videoEmbed.prototype.clearForm = function($el){
		var self = this;
		var $ui = self.$ui;

		self.parent.clearForm($el, self);

		showIntro(self);

		$ui.previewIframe.removeAttr('src');
		$ui.previewTitle.empty();
		$ui.previewAuthor.removeAttr('href').empty();
		$ui.previewProvider.removeAttr('href').empty();
	};

	// function to initialize the modal view
	// called after the modal view has loaded
	// $el: a jQuery element for the modal view
	videoEmbed.prototype.initModal = function($el, modalCtrl){
		var self = this;
		var $ui;

		self.modalCtrl = modalCtrl;

		$ui = registerUiElements(self, $el);

		$.validator.addMethod('validDomain', function(value, element, params) {
			var isValid = value.indexOf('youtube.com') != -1 || value.indexOf('vimeo.com') != -1;
			return this.optional(element) || isValid;
		}, 'The video must be from YouTube or Vimeo');

		$ui.previewBtn.on('click', function(e) {

			e.preventDefault();

			self.getModelFromForm($el)
				.done(function() {
					showPreview(self);
				});
		});

		$ui.editBtn.on('click', function(e) {
			e.preventDefault();
			showIntro(self);
		});

		$ui.cancelBtn.on('click', function(e) {
			e.preventDefault();
			showPreview(self);
		});

		$ui.videoDropTarget
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

				if(!!$droppedElm.length)
				{
					$context.append($droppedElm);
					droppedUrl = $context.find('[href]').attr('href');
				}

				if(!!droppedUrl)
				{
					$ui.urlInput.val(droppedUrl);
					$ui.previewBtn.click();
				}
			});

		$(document).on('dragover drop', function(event) {
			event.preventDefault();
		});
	};

	videoEmbed.prototype.parseForEditor = function(){
		var self = this;
		return '<div class="video-embed">' +
					'<div class="overlay">' +
						'<iframe src="' + makeEmbedUrl(self.model.url) + '"	frameborder="0"></iframe>' +
					'</div>' +
				'</div>';
	};

	videoEmbed.prototype.getModelFromForm = function($form){
		var self = this;
		var promise = $.Deferred();

		// Gather fields data
		self.parent.getModelFromForm($form.find('form').first(), self);

		// Normalize URL to a watch URL
		self.model.url = makeWatchUrl(self.model.url);

		// Get oEmbed data for URL
		getOembedData(self.model.url)
			.done(function(data) {
				if(!!data.error)
				{
					// Error getting oembed data.
					// TODO: Find a way to validate URL doing validation.
					promise.resolve();
				}
				else
				{
					applyOembedToModel(self, data);

					if(!!self.model.object_id)
					{
						// Not a new embed. Don't need to check for duplication when editing.
						promise.resolve();
					}
					else
					{
						// Get Video embeds that have matching titles
						EntityEmbed.apiService.get({
							path: self.options.httpPaths.getAll,
							data: {
								title: self.model.title,
								object_type: self.options.object_type
							}
						})
						.done(function(resp) {
							var items = resp.response && resp.response.data || [];
							var deferreds = [];
							var i, m, p;

							if(!items.length)
							{
								// No matches found. We can resolve right away.
								promise.resolve();
							}
							else
							{
								// One or more matches were found.
								// Check each one for matching URL.
								for(i = 0, m = items.length; i < m; i++)
								{
									// The embed/list endpoint does not return 'url' key.
									// We will have to request data for each returned object to compare URL's.
									p = EntityEmbed.apiService.get({
										path: self.options.httpPaths.get,
										data: {
											object_id: items[i].object_id
										}
									})
									.done(function(respItem) {
										if(!self.model.object_id && respItem.response.url === self.model.url)
										{
											self.model.object_id = respItem.response.object_id;
										}
									});

									// Add http promise to array of deferreds
									deferreds.push(p);
								}
							}

							// Resolve promise after each http promise has had a chance to compare URL's
							$.when.apply($, deferreds).always(function() {
								promise.resolve();
							});
						})
						.fail(function() {
							// Problem communicating with API. Resolve to keep things moving.
							promise.resolve();
						});
					}
				}
			});

		return promise;
	}

	videoEmbed.prototype.populateFormWithModel = function($form){
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

		if(self.model.url && !self.model.oembed)
		{
			// Get oEmbed data
			getOembedData(self.model.url)
				.done(function(data) {
					if(!data.error)
					{
						self.model.oembed = data;
						//
						if(data.title !== self.model.title)
						{
							self.model.title = data.title;
							return self.saveEmbed();
						}
					}
				})
				.always(function() {
					setupUi();
				});
		}
		else
		{
			setupUi();
		}
	}

})();