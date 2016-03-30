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
			object_type: 'external-link',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required',
					linkText: 'required'
				}
			}
		};

	// CONSTRUCTOR
	function externalLinkEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	externalLinkEmbed.inherits(EntityEmbedTypes.genericEmbed);
	EntityEmbedTypes[embedName] = externalLinkEmbed;

	// PUBLIC
	externalLinkEmbed.prototype.orderIndex = 9;

	externalLinkEmbed.prototype.cleanModel = function(){
		return {
			thumbnailFile: null,
			title: null,
			displayTitle: null,
			teaser: null,
			linkText: null,
			url: null,
		};
	};

	externalLinkEmbed.prototype.initModal = function($el){
		var self = this;
		$el.find("input[name='thumbnailFile']").fileupload({
			dataType: 'json',
    		replaceFileInput: false,
			add: function(e, data){				
				data.submit().complete(function (result, textStatus, jqXHR) {
					if (textStatus === 'success')
					{
						if (!!result && !!result.responseJSON && !!result.responseJSON.path)
						{
							self.model.thumbnailFile = result.responseJSON.path;
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