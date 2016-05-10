var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'youtube',
		defaults = {
			viewPath: 'modal_video_youtube.html',
			displayName: 'Video - Youtube',
			object_type: 'video',
			video_type: 'youtube', 
			validationOptions: {
				rules: {
					title: 'required',
					url: {
						required: true,
						domainIsYoutube: true
					}
				}
			}
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

	// Generate YouTube embed URL (pattern 1)
	var makeYoutubeEmbedUrl = function(videoId) {
		// TODO: embed opts should be configurable
		var opts = '?' + [
			'showinfo=0',		// Hide video title
			'modestbranding=1',	// Hide YouTube logo on controls
			'rel=0'				// Don't show related video grid after video has finished
		].join('&');

		return '//www.youtube.com/embed/' + getYoutubeVideoId(videoId) + opts;
	};

	// CONSTRUCTOR
	var videoEmbed = function(options){
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

		$.validator.addMethod('domainIsYoutube', function(value, element, params) {
			var isValid = value.indexOf('youtube.com') != -1;
			return this.optional(element) || isValid;
		}, 'The video must be from YouTube');
	};

	videoEmbed.prototype.parseForEditor = function(){
		var self = this;

		return '<div class="video-embed">' +
					'<div class="overlay">' +
						'<iframe src="' +
							makeYoutubeEmbedUrl(self.model.url) + '" >' +
						'</iframe>' + 
					'</div>' + 
				'</div>';
	};

})();