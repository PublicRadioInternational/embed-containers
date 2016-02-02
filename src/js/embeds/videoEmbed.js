(function(base, EntityEmbedTypes){

	'use strict';

	// check for EntityEmbedTypes namespace
	if (!EntityEmbedTypes)
	{
		console.log('Could not find EntityEmbedTypes namespace. ' +
			'Please ensure that the genericEmbed has loaded before this one.');
		return;
	}

	// PRIVATE
	var embedName = 'videoEmbed',
		defaults = {
			viewPath: base + 'modal/modal_video.html',
			displayName: 'Video',
			httpPaths: {
				put: '',
				post: '',
				get: '',
				del: ''
			}
		};

	// CONSTRUCTOR
	function videoEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	videoEmbed.inherits(EntityEmbedTypes.genericEmbed);
	EntityEmbedTypes[embedName] = videoEmbed;

	// PUBLIC
	videoEmbed.prototype.cleanModel = function(){
		return {
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

		return  '<div class="video-embed">' +
					'<div class="video-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' + 
					'<div class="overlay"></div>' +

					self.model.videoHtmlString  +  
					
					'<div class="video-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' + 
				'</div>';
	};
})('', EntityEmbedTypes);