var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// PRIVATE
	var embedName = 'audio',
		defaults = {
			viewPath: base + 'modal/modal_audio.html',
			displayName: 'Audio',
			object_type: 'audio',
			validationOptions: {
				debug:true,
				rules: {
					title: 'required',
					url: 'required',
					mp3File: {
						required: true,
						extension: "mp3"
					},
					wavFile: {
						extension: "wav"
					}
				}
			}
		};

	function formatFileSize(bytes) {
		if (typeof bytes !== 'number')
		{
			return '';
		}

		if (bytes >= 100000000)
		{
			return (bytes / 1000000000).toFixed(2) + ' GB';
		}

		if (bytes >= 1000000)
		{
			return (bytes / 1000000).toFixed(2) + ' MB';
		}
		return (bytes / 1000).toFixed(2) + ' KB';
	};

	// CONSTRUCTOR
	function audioEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	}

	audioEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = audioEmbed;

	// PUBLIC
	audioEmbed.prototype.orderIndex = 3;

	audioEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			file: [],
			credit: null,
			creditLink: null
		};
	};

	audioEmbed.prototype.initModal = function($el){
		var self = this;	

		$el.find(".audio-file-group").fileupload({
			dataType: 'json',
    		replaceFileInput: false,
			add: function(e, data){
				data.submit().complete(function (result, textStatus, jqXHR) {
					if (textStatus === 'success')
					{
						if (!!result && !!result.responseJSON && !!result.responseJSON.path)
						{
							self.model.file = result.responseJSON.path;
						}
					}
					else
					{
						console.log('file upload completed with status "' + textStatus + '"');
						console.log(result);
					}
				});
			}
		});
	};

	audioEmbed.prototype.parseForEditor = function(){
		var self = this;
		
		var fileType = self.model.file.substring(self.model.file.lastIndexOf('.') + 1);

		return  '<div class="audio-embed">' + 
					'<audio controls>' +
						'<source src="' + self.model.file +'" type="audio/' + fileType + '">' + 
					'</audio>' +
					'<div class="credit">Credit: ' + self.model.credit + '</div>' +
					'<div class="link">Link: ' + self.model.creditLink + '</div>' + 
				'</div>';
	};

})('');