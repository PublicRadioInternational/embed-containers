$(document).ready(function(){

	var medEditor = new MediumEditor('.editable');

	var $extractContentBtn = $('#extract-story-content');
	var $loadStoryBtn = $('#load-default-story');
	var $openAddSingleEmbedBtn = $('.demo-button-open-modal.open-add-single');
	var $openAddAnyEmbedBtn = $('.demo-button-open-modal.open-add-any');
	var $openEditEmbedBtn = $('.demo-button-open-modal.open-edit');

	var storyObject = {
		"html": "<p>Some people think that koalas are hella lazy.</p><div class=\"entity-embed-container entity-embed-center entity-embed-editor-line\">[[EntityEmbeds:0:74b364de12584d5b85f0a9604776c3b3]]</div><p class=\"entity-embed-new-line\">&nbsp;While this very well may be true, they are also mad vicious.</p><div class=\"entity-embed-container entity-embed-center\">[[EntityEmbeds:1:663efccda9ad4065aefdff98da78ffb3]]</div><p class=\"entity-embed-new-line\">&nbsp;See that? That was super gnar. So gnar that, in fact, that it made even the most grizzled and hardcore of onlookers exclaim in horror.</p><div class=\"entity-embed-container entity-embed-new-line entity-embed-editor-line\">[[EntityEmbeds:2:2d1e19255db149c9905743144c05a753]]</div><p class=\"entity-embed-new-line\">&nbsp;<span style=\"line-height: 1.42857;\">&nbsp;</span></p><div class=\"entity-embed-container  entity-embed-new-line entity-embed-editor-line\">[[EntityEmbeds:3:eb272e2541b040f4b60daa174f788b72]]</div><p class=\"entity-embed-new-line\">&nbsp;<span style=\"line-height: 1.42857;\">Wow. Just wow. If you'd like to see more koala battles, check out the underground Koala fighting arena located underneath the Space Needle (you didn't hear that from me though)&nbsp;</span></p><p class=\"entity-embed-new-line entity-embed-editor-line\"></p><div class=\"entity-embed-container\">[[EntityEmbeds:4:4c6b068e684b44a29814c87bf1704cca]]</div><p class=\"entity-embed-new-line\">&nbsp;If you would like to learn more about koala battles, please subscribe to this newsletter</p><p class=\"entity-embed-new-line entity-embed-editor-line\"></p><div class=\"entity-embed-container\">[[EntityEmbeds:5:60954b32128440cea9ca66b14ede453f]]</div><p></p><p class=\"entity-embed-new-line\">If you have reacted to this story in any of the following ways, please listen to this bell to cal your nerves.</p><div class=\"entity-embed-container entity-embed-center\">[[EntityEmbeds:6:1e2346e4b767466693f84acf0e8326e7]]</div><p class=\"entity-embed-new-line entity-embed-editor-line\"></p><p class=\"entity-embed-new-line\"><br></p><div class=\"entity-embed-container entity-embed-center\">[[EntityEmbeds:7:b31c31aa7ae845fc8fd33c54c8846426]]</div><p class=\"entity-embed-new-line\">Don't forget to keep reading!</p><p class=\"entity-embed-new-line entity-embed-editor-line\"></p><p class=\"entity-embed-new-line\">&nbsp;</p><div class=\"entity-embed-container entity-embed-center\">[[EntityEmbeds:8:d2a1516c14744a3e91862d9bbce1a79e]]</div><p class=\"entity-embed-new-line medium-insert-active entity-embed-editor-line\"></p><div class=\"entity-embed-container entity-embed-center\">[[EntityEmbeds:9:1160d4e2a0f447e0a73280aec582e055]]</div><p></p><p></p><p class=\"entity-embed-new-line entity-embed-editor-line\"></p><p></p><p class=\"entity-embed-new-line entity-embed-editor-line\"></p><p></p><p></p><p></p><p></p>",
		"embeds": [
			{
				"index": 0,
				"id": "74b364de12584d5b85f0a9604776c3b3",
				"type": "image"
			},
			{
				"index": 1,
				"id": "663efccda9ad4065aefdff98da78ffb3",
				"type": "video"
			},
			{
				"index": 2,
				"id": "2d1e19255db149c9905743144c05a753",
				"type": "custom"
			},
			{
				"index": 3,
				"id": "eb272e2541b040f4b60daa174f788b72",
				"type": "global-buzz"
			},
			{
				"index": 4,
				"id": "4c6b068e684b44a29814c87bf1704cca",
				"type": "iframe"
			},
			{
				"index": 5,
				"id": "60954b32128440cea9ca66b14ede453f",
				"type": "newsletter"
			},
			{
				"index": 6,
				"id": "1e2346e4b767466693f84acf0e8326e7",
				"type": "slideshow"
			},
			{
				"index": 7,
				"id": "b31c31aa7ae845fc8fd33c54c8846426",
				"type": "audio"
			},
			{
				"index": 8,
				"id": "d2a1516c14744a3e91862d9bbce1a79e",
				"type": "related-link"
			},
			{
				"index": 9,
				"id": "1160d4e2a0f447e0a73280aec582e055",
				"type": "external-link"
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
		$.embed_modal_open()
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
