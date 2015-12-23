;(function(window){
	
	'use strict';

	// private data members

	var embeds = [];


	// private functions

	var parseImageForEditor = function(embedModel){
		return '<pre class="embedded-content">' + 
			JSON.stringify(embedModel, null, 4) + '</pre>';
	};

	// constructor

	function storyParser(){
	};


	// public functions

	storyParser.prototype.fromServerToEditor = function(storyModel) {
		
	};

	storyParser.prototype.fromEditorToServer = function(editorContent) {
		
	};

	storyParser.prototype.fromModalToEditor = function(embedModel) {
		// store embedModel for quicker parsing later
		embeds.push(embedModel);

		// parse the embedModel object into html for medium editor
		switch(embedModel.embedType)
		{
			case 'image':
				return parseImageForEditor(embedModel);
			case 'video':
				return parseImageForEditor(embedModel);
			case 'audio':
				return parseImageForEditor(embedModel);
			case 'twitter':
				return parseImageForEditor(embedModel);
			case 'instagram':
				return parseImageForEditor(embedModel);
			case 'facebook':
				return parseImageForEditor(embedModel);
			case 'relatedLink':
				return parseImageForEditor(embedModel);
			case 'externalLink':
				return parseImageForEditor(embedModel);
			case 'globalBuzz':
				return parseImageForEditor(embedModel);
			case 'newsletterSubscribe':
				return parseImageForEditor(embedModel);
			case 'iframe':
				return parseImageForEditor(embedModel);
			case 'customText':
				return parseImageForEditor(embedModel);
			default:
				console.log('unrecognized embed type!');
				return ''; // TODO : error message
		}
	};

	// TODO : parse function for editing embedded content (?)

	window.storyParser = storyParser;
})(window);