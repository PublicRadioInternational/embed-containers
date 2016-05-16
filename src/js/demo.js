$(document).ready(function(){

	var medEditor = new MediumEditor('.editable');

	var $extractContentBtn = $('#extract-story-content');
	var $loadStoryBtn = $('#load-default-story');
	var $openAddSingleEmbedBtn = $('.demo-button-open-modal.open-add-single');
	var $openAddAnyEmbedBtn = $('.demo-button-open-modal.open-add-any');
	var $openEditEmbedBtn = $('.demo-button-open-modal.open-edit');

	var storyObject = {
		"html": "<p>This is editable content. Try typing in here!</p><h2>gdfgdfg</h2><div class=\"entity-embed-container\">[[EntityEmbeds:0:23599a8c140a4a11a68c1afe28f9b907]]</div>",
		"embeds": [
			{
				"index": 0,
				"id": "23599a8c140a4a11a68c1afe28f9b907",
				"type": "image"
			}
		]
	};

	$('.editable').mediumInsert({
		editor: medEditor,
		enabled: true,
		buttonLabels: 'fontawesome',
		addons: {
			images: false,
			embeds: false,
			entityEmbeds: {
				authToken: 'abc123',
				domainName: 'https://test-services.pri.org'
			}
		}
	});

	$extractContentBtn.click(function(){
		var $storyDataWell = $('.story-content #data');
		storyObject = medEditor.get_content();
		$storyDataWell.text(JSON.stringify(storyObject, null, 4));
	});

	$loadStoryBtn.click(function(){
		medEditor.load_content(storyObject);
	});

	$openAddSingleEmbedBtn.click(function(){
		$.embed_modal_open({
				modalOptions:{
					embedTypeStr: 'related-link'
				}
			})
			.done(function(scope){
				console.log('Embed modal open (add single) successfully saved, server response to follow.');
				console.log(scope);
			})
			.fail(function(scope){
				console.log('Embed modal open (add single) aborted.');
			});
	});

	$openAddAnyEmbedBtn.click(function(){
		$.embed_modal_open({
				authToken: 'abc123',
				domainName: 'https://test-services.pri.org'
			})
			.done(function(scope){
				console.log('Embed modal open (add any) successfully saved, server response to follow.');
				console.log(scope);
			})
			.fail(function(scope){
				console.log('Embed modal open (add any) aborted.');
			});
	});

	$openEditEmbedBtn.click(function(){
		$.embed_modal_open({
				modalOptions:{
					embedTypeStr: 'newsletter',
					id: '2607f8daf38342f28054b29a7c26b118'
				}
			})
			.done(function(scope){
				console.log('Embed modal open (edit) successfully saved, server response to follow.');
				console.log(scope);
			})
			.fail(function(scope){
				console.log('Embed modal open (edit) aborted.');
			});
	});
});
