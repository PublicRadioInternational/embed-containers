;(function (window){
	
	'use strict';

	// private functions

	// TODO : get rid of this - make meaningful parse functions
	var defaultParse = function(embedModel){
		return '<pre class="embedded-content">' + 
			JSON.stringify(embedModel, null, 4) + '</pre>';
	}

	var parseImageForEditor = function(embedModel){
		return defaultParse(embedModel);
	};

	var parseVideoForEditor = function(embedModel){
		return defaultParse(embedModel);
	};

	var parseAudioForEditor = function(embedModel){
		return defaultParse(embedModel);
	};

	var parseTwitterForEditor = function(embedModel){
		return defaultParse(embedModel);
	};

	var parseInstagramForEditor = function(embedModel){
		return defaultParse(embedModel);
	};

	var parseFacebookForEditor = function(embedModel){
		return defaultParse(embedModel);
	};

	var parseRelatedLinkForEditor = function(embedModel){
		return defaultParse(embedModel);
	};

	var parseExternalLinkForEditor = function(embedModel){
		return defaultParse(embedModel);
	};

	var parseGlobalBuzzForEditor = function(embedModel){
		return defaultParse(embedModel);
	};

	var parseNewsletterSubscribeForEditor = function(embedModel){
		return defaultParse(embedModel);
	};

	var parseIframeForEditor = function(embedModel){
		return defaultParse(embedModel);
	};

	var parseCustomTextForEditor = function(embedModel){
		return defaultParse(embedModel);
	};

	// constructor

	function storyParser(){
		var self = this;
		this.embeds = [];
	};


	// public functions

	// IN:	JSON object representing story modal
	// OUT:	HTML string for medium editor
	storyParser.prototype.fromServerToEditor = function(storyModel) {
		var self = this;
		return '<pre>' + JSON.stringify(storyModel, null, 4) + '</pre>';
	};

	// IN:	HTML string from medium editor
	// OUT:	JSON object representing story modal
	storyParser.prototype.fromEditorToServer = function(editorContent) {
		var self = this;
		return {
			content: editorContent
		};
	};

	// IN:	JSON object from embed modal representing embed content
	// OUT:	HTML string for medium editor
	storyParser.prototype.fromModalToEditor = function(embedModel) {
		var self = this;

		// store embedModel for quicker parsing later
		self.embeds.push(embedModel);

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

	// this will need to be triggered from a click event on the embed visual
	storyParser.prototype.fromEditorToModal = function(){
	};

	// TODO : parse function for editing embedded content (?)

	window.storyParser = storyParser;
})(window);