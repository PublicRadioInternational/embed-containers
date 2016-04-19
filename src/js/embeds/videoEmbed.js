var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// PRIVATE
	var embedName = 'video',
		defaults = {
			viewPath: base + 'modal/modal_video.html',
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
					'<div class="video-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' +
					'<div class="overlay">' +
						self.model.videoHtmlString  +
					'</div>' +
					'<div class="video-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' +
				'</div>';
	};

})('');