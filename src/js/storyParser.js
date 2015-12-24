;(function(window){
	
	'use strict';

	// private data members

	var embeds = [];


	// private functions

	var parseImageForEditor = function(embedModel){
		return '<pre class="embedded-content">' + 
			JSON.stringify(embedModel, null, 4) + '</pre>';
	};

	var parseVideoForEditor = function(embedModel){
		return '<pre class="embedded-content">' + 
			JSON.stringify(embedModel, null, 4) + '</pre>';
	};

	var parseAudioForEditor = function(embedModel){
		return '<pre class="embedded-content">' + 
			JSON.stringify(embedModel, null, 4) + '</pre>';
	};

	var parseTwitterForEditor = function(embedModel){
		return '<pre class="embedded-content">' + 
			JSON.stringify(embedModel, null, 4) + '</pre>';
	};

	var parseInstagramForEditor = function(embedModel){
		return '<pre class="embedded-content">' + 
			JSON.stringify(embedModel, null, 4) + '</pre>';
	};

	var parseFacebookForEditor = function(embedModel){
		return '<pre class="embedded-content">' + 
			JSON.stringify(embedModel, null, 4) + '</pre>';
	};

	var parseRelatedLinkForEditor = function(embedModel){
		return '<pre class="embedded-content">' + 
			JSON.stringify(embedModel, null, 4) + '</pre>';
	};

	var parseExternalLinkForEditor = function(embedModel){
		return '<pre class="embedded-content">' + 
			JSON.stringify(embedModel, null, 4) + '</pre>';
	};

	var parseGlobalBuzzForEditor = function(embedModel){
		return '<pre class="embedded-content">' + 
			JSON.stringify(embedModel, null, 4) + '</pre>';
	};

	var parseNewsletterSubscribeForEditor = function(embedModel){
		return '<pre class="embedded-content">' + 
			JSON.stringify(embedModel, null, 4) + '</pre>';
	};

	var parseIframeForEditor = function(embedModel){
		return '<pre class="embedded-content">' + 
			JSON.stringify(embedModel, null, 4) + '</pre>';
	};

	var parseCustomTextForEditor = function(embedModel){
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
				return parseVideoForEditor(embedModel);
			case 'audio':
				return parseAudioForEditor(embedModel);
			case 'twitter':
				return parseTwitterForEditor(embedModel);
			case 'instagram':
				return parseInstagramForEditor(embedModel);
			case 'facebook':
				return parseFacebookForEditor(embedModel);
			case 'relatedLink':
				return parseRelatedLinkForEditor(embedModel);
			case 'externalLink':
				return parseExternalLinkForEditor(embedModel);
			case 'globalBuzz':
				return parseGlobalBuzzForEditor(embedModel);
			case 'newsletterSubscribe':
				return parseNewsletterSubscribeForEditor(embedModel);
			case 'iframe':
				return parseIframeForEditor(embedModel);
			case 'customText':
				return parseCustomTextForEditor(embedModel);
			default:
				console.log('unrecognized embed type!');
				return ''; // TODO : error message
		}
	};

	storyParser.prototype.fromEditorToModal = function(){

	};

	// TODO : parse function for editing embedded content (?)

	window.storyParser = storyParser;
})(window);