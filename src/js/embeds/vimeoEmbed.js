var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'vimeo',
		defaults = {
			viewPath: 'modal_video_vimeo.html',
			displayName: 'Video - Vimeo',
			object_type: 'video',
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

	// Generate Vimeo embed URL (pattern 1)
	var makeVimeoEmbedUrl = function(videoId) {
		// TODO: embed opts should be configurable
		var opts = '?' + [
			'title=0',      // Hide video title
			'portrait=0',   // Hide creator portrait
			'byline=0',     // Hide creater byline
			'color=dc5555', // Set color to sites primary accent color. I ♥ Vimeo.
		].join('&');

		return '//player.vimeo.com/video/' + getVimeoVideoId(videoId) + opts;
	};

	// CONSTRUCTOR
	function videoEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	videoEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = videoEmbed;

	// PUBLIC
	videoEmbed.prototype.orderIndex = 5;

	videoEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url: null
		};
	};

	videoEmbed.prototype.init = function($el){
		var self = this;
		self.parent.init($el, self);

		$.validator.addMethod('domainIsVimeo', function(value, element, params) {
			var isValid = value.indexOf('vimeo.com') != -1;
			return this.optional(element) || isValid;
		}, 'The video must be from www.vimeo.com');
	};

	videoEmbed.prototype.parseForEditor = function(){
		var self = this;

		$.support.cors = true;

		$.ajax({
			crossDomain: true,
			cache: false,
			async: false,
			timeout: 15000,
			url: 'http://medium.iframe.ly/api/oembed?iframe=1',
			dataType: 'json',
			data: {
				url: self.model.url
			},
			success: function(data){
				self.model.videoHtmlString = $(data.html).find('iframe').attr("style", "").prop('outerHTML');
			},
			error: function(jqXHR, textStatus, error){
				// TODO
			}
		});

		return '<div class="video-embed">' +
					'<div class="overlay">' +
						self.model.videoHtmlString  +
					'</div>' + 
				'</div>';
	};

})();