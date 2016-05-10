var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'video',
		defaults = {
			displayName: 'Video',
			object_type: 'video',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required'
				}
			}
		};

	// CONSTRUCTOR
	function videoEmbed(options, defaultsOverride, embedNameOverride, child){
		var self = this;
		self.parent.constructor(options, defaultsOverride || defaults, embedNameOverride || embedName, child || self);
	};

	videoEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = videoEmbed;

	// PUBLIC
	videoEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url: null
		};
	};

	videoEmbed.prototype.parseForEditor = function(){
		var self = this;

		return '<div class="video-embed">' +
					'<div class="overlay">' +
						self.makeEmbedUrl()
					'</div>' + 
				'</div>';
	};
})();

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'vimeo',
		defaults = {
			viewPath: 'modal_video_vimeo.html',
			object_type: 'video',
			displayName: 'Video - Vimeo',
			video_type: 'vimeo', 
			validationOptions: {
				rules: {
					title: 'required',
					url: {
						required: true,
						domainIsVimeo: true
					}
				}
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

	// CONSTRUCTOR
	function vimeoEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	vimeoEmbed.inherits(EntityEmbed.embedTypes.video);
	EntityEmbed.embedTypes[embedName] = vimeoEmbed;

	// PUBLIC
	vimeoEmbed.prototype.orderIndex = 5;

	vimeoEmbed.prototype.init = function($el){
		var self = this;
		self.parent.init($el, self);

		$.validator.addMethod('domainIsVimeo', function(value, element, params) {
			var isValid = value.indexOf('vimeo.com') != -1;
			return this.optional(element) || isValid;
		}, 'The video must be from Vimeo');
	};

	// Generate Vimeo embed URL (pattern 1)
	vimeoEmbed.prototype.makeEmbedUrl = function(videoId) {
		// TODO: embed opts should be configurable
		var opts = '?' + [
			'title=0',		// Hide video title
			'portrait=0',	// Hide creator portrait
			'byline=0',		// Hide creater byline
			'color=dc5555',	// Set color to sites primary accent color. I ♥ Vimeo.
		].join('&');

		return '//player.vimeo.com/video/' + getVimeoVideoId(videoId) + opts;
	};
})();

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'youtube',
		defaults = {
			viewPath: 'modal_video_youtube.html',
			object_type: 'video',
			displayName: 'Video - Youtube',
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

	// CONSTRUCTOR
	var youtubeEmbed = function(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	youtubeEmbed.inherits(EntityEmbed.embedTypes.video);
	EntityEmbed.embedTypes[embedName] = youtubeEmbed;

	// PUBLIC
	youtubeEmbed.prototype.orderIndex = 4;

	youtubeEmbed.prototype.init = function($el){
		var self = this;
		self.parent.init($el, self);

		$.validator.addMethod('domainIsYoutube', function(value, element, params) {
			var isValid = value.indexOf('youtube.com') != -1;
			return this.optional(element) || isValid;
		}, 'The video must be from YouTube');
	};

	// Generate YouTube embed URL (pattern 1)
	youtubeEmbed.prototype.makeEmbedUrl = function(videoId) {
		// TODO: embed opts should be configurable
		var opts = '?' + [
			'showinfo=0',		// Hide video title
			'modestbranding=1',	// Hide YouTube logo on controls
			'rel=0'				// Don't show related video grid after video has finished
		].join('&');

		return '//www.youtube.com/embed/' + getYoutubeVideoId(videoId) + opts;
	};
})();