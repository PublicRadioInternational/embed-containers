$(document).ready(function(){

	var medEditor = new MediumEditor('.editable');

	var $extractContentBtn = $('#extract-story-content');
	var $loadStoryBtn = $('#load-default-story');
	var $openAddSingleEmbedBtn = $('.demo-button-open-modal.open-add-single');
	var $openAddAnyEmbedBtn = $('.demo-button-open-modal.open-add-any');
	var $openEditEmbedBtn = $('.demo-button-open-modal.open-edit');

	var storyObject = {
		"html": "<p>Some people think that koalas are hella lazy.</p><div class=\"entity-embed-container entity-embed-center entity-embed-editor-line\">[[EntityEmbeds:0:74b364de12584d5b85f0a9604776c3b3]]</div><p class=\"entity-embed-new-line\">&nbsp;While this very well may be true, they are also mad vicious.</p><div class=\"entity-embed-container entity-embed-center\">[[EntityEmbeds:2:663efccda9ad4065aefdff98da78ffb3]]</div><p class=\"entity-embed-new-line\">&nbsp;See that? That was super gnar. So gnar that, in fact, that it made even the most grizzled and hardcore of onlookers exclaim in horror.</p><div class=\"entity-embed-container entity-embed-new-line entity-embed-editor-line\">[[EntityEmbeds:3:2d1e19255db149c9905743144c05a753]]</div><p class=\"entity-embed-new-line\">&nbsp;<span style=\"line-height: 1.42857;\">&nbsp;</span></p><div class=\"entity-embed-container  entity-embed-new-line entity-embed-editor-line\">[[EntityEmbeds:4:eb272e2541b040f4b60daa174f788b72]]</div><p class=\"entity-embed-new-line\">&nbsp;<span style=\"line-height: 1.42857;\">Wow. Just wow. If you'd like to see more koala battles, check out the underground Koala fighting arena located underneath the Space Needle (you didn't hear that from me though)&nbsp;</span></p><p class=\"entity-embed-new-line entity-embed-editor-line\"></p><div class=\"entity-embed-container\">[[EntityEmbeds:5:4c6b068e684b44a29814c87bf1704cca]]</div><p class=\"entity-embed-new-line\">&nbsp;If you would like to learn more about koala battles, please subscribe to this newsletter</p><p class=\"entity-embed-new-line entity-embed-editor-line\"></p><div class=\"entity-embed-container\">[[EntityEmbeds:6:60954b32128440cea9ca66b14ede453f]]</div><p></p><p class=\"entity-embed-new-line\">If you have reacted to this story in any of the following ways, please listen to this bell to cal your nerves.</p><p class=\"entity-embed-new-line entity-embed-editor-line\"></p><p class=\"entity-embed-new-line\">&nbsp;</p><div class=\"entity-embed-container entity-embed-center\">[[EntityEmbeds:7:1e2346e4b767466693f84acf0e8326e7]]</div><p class=\"entity-embed-new-line entity-embed-editor-line\"></p><div class=\"entity-embed-container entity-embed-center entity-embed-active\">[[EntityEmbeds:8:b31c31aa7ae845fc8fd33c54c8846426]]</div><p></p><p class=\"entity-embed-new-line entity-embed-editor-line\"></p><p></p><p></p><p></p><p></p>",
		"embeds": [
			{
				"index": 0,
				"id": "74b364de12584d5b85f0a9604776c3b3",
				"type": "image"
			},
			{
				"index": 1,
				"id": "74b364de12584d5b85f0a9604776c3b3",
				"type": "image"
			},
			{
				"index": 2,
				"id": "663efccda9ad4065aefdff98da78ffb3",
				"type": "video"
			},
			{
				"index": 3,
				"id": "2d1e19255db149c9905743144c05a753",
				"type": "custom"
			},
			{
				"index": 4,
				"id": "eb272e2541b040f4b60daa174f788b72",
				"type": "global-buzz"
			},
			{
				"index": 5,
				"id": "4c6b068e684b44a29814c87bf1704cca",
				"type": "iframe"
			},
			{
				"index": 6,
				"id": "60954b32128440cea9ca66b14ede453f",
				"type": "newsletter"
			},
			{
				"index": 7,
				"id": "1e2346e4b767466693f84acf0e8326e7",
				"type": "slideshow"
			},
			{
				"index": 8,
				"id": "b31c31aa7ae845fc8fd33c54c8846426",
				"type": "audio"
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
			entityEmbeds: true
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
				embedTypeStr: 'slideshow'
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
				embedTypeStr: 'newsletter',
				id: '2607f8daf38342f28054b29a7c26b118',
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
