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
		makeVideoUrl = function(url){
			if (url.indexOf('vimeo.com') !== -1)
			{
				// TODO: embed opts should be configurable
				var opts = '?' + [
					'title=0',		// Hide video title
					'portrait=0',	// Hide creator portrait
					'byline=0',		// Hide creater byline
					'color=dc5555',	// Set color to sites primary accent color. I ♥ Vimeo.
				].join('&');

				return '//player.vimeo.com/video/' + getVimeoVideoId(url) + opts;
			}
			else if (url.indexOf('youtube.com') !== -1)
			{
				// TODO: embed opts should be configurable
				var opts = '?' + [
					'showinfo=0',		// Hide video title
					'modestbranding=1',	// Hide YouTube logo on controls
					'rel=0'				// Don't show related video grid after video has finished
				].join('&');

				return '//www.youtube.com/embed/' + getYoutubeVideoId(url) + opts;
			}
			else
			{
				return '';
			}

		};

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
			url: null
		};
	};

	videoEmbed.prototype.init = function($el){
		var self = this;
		self.parent.init($el, self);

		$.validator.addMethod('validDomain', function(value, element, params) {
			var isValid = value.indexOf('youtube.com') != -1 || value.indexOf('vimeo.com') != -1;
			return this.optional(element) || isValid;
		}, 'The video must be from YouTube or Vimeo');
	};

	videoEmbed.prototype.parseForEditor = function(){
		var self = this;
		return '<div class="video-embed">' +
					'<div class="overlay">' +
						'<iframe src="' + makeVideoUrl(self.model.url) + '"	frameborder="0"></iframe>' +
					'</div>' +
				'</div>';
	};

})();