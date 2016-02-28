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
	var embedName = 'externalLink',
		defaults = {
			viewPath: base + 'modal/modal_externalLink.html',
			displayName: 'External Link',
			httpPaths: {
				put: '',
				post: '',
				get: '',
				del: ''
			},
			object_type: 'external-link',
			validationOptions: {
				rules: {
					internalTitle: 'required',
					displayTitle: 'required',
					url: 'required',
					linkText: 'required',
					teaser: 'required'
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
	function externalLinkEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	externalLinkEmbed.inherits(EntityEmbedTypes.genericEmbed);
	EntityEmbedTypes[embedName] = externalLinkEmbed;

	// PUBLIC
	externalLinkEmbed.prototype.orderIndex = 8;

	externalLinkEmbed.prototype.cleanModel = function(){
		return {
			files: [],
			displayTitle: null,
			internalTitle: null,
			teaser: null,
			linkText: null,
			url: null,
		};
	};

	externalLinkEmbed.prototype.initModal = function($el){
		var self = this;
		$el.find("input[name='thumbnailFile']").fileupload({
			dataType: 'json',
			add: function(e, data){
				// TODO : better id (this one potentially has spaces)
				var listItem = $('<li id="' + data.files[0].name + '"><span></span></li>');
				
				listItem.find('span').html(data.files[0].name + ' - ' + 
					'<i>' + formatFileSize(data.files[0].size) + '</i>');
				
				data.context = listItem.appendTo($('#thumbnailList'));
				
				data.submit().complete(function (result, textStatus, jqXHR) {
					if (textStatus === 'success')
					{
						if (!!result && !!result.responseJSON && !!result.responseJSON.path)
						{
							self.model.files.push(result.responseJSON.path);
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

	externalLinkEmbed.prototype.parseForEditor = function(){
		var self = this;

		return 	'<div class="external-link-embed entity-embed-secondary-toolbar-locator">' +
					'<div class="display-title">' + self.model.displayTitle + '</div>' +
					'<div class="teaser">' + self.model.teaser + '</div>' +
					'<a class="btn btn-primary external-link" href="' + self.model.url + '">'  + self.model.linkText + '</a>' + '</div>';
				'</div>';
	};

})('', EntityEmbedTypes);