$(document).ready(function(){

	var medEditor = new MediumEditor('.editable');

	var $extractContentBtn = $('#extract-story-content');
	var $loadStoryBtn = $('#load-default-story');
	var storyObject = {
		"storyHtml": "<p>Some people think that koalas are just hella lazy.&nbsp;</p><p class=\"entity-embed-editor-line\"></p><div class=\"entity-embed-container\">[[EntityEmbeds:0:74b364de12584d5b85f0a9604776c3b3]]</div><div class=\"entity-embed-container\">[[EntityEmbeds:1:663efccda9ad4065aefdff98da78ffb3]]</div><p></p><p></p>",
		"embeds": [
			{
				"index": 0,
				"id": "74b364de12584d5b85f0a9604776c3b3",
				"style": "entity-embed entity-embed-center",
				"type": "image"
			},
			{
				"index": 1,
				"id": "663efccda9ad4065aefdff98da78ffb3",
				"style": "entity-embed entity-embed-center",
				"type": "video"
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
				$modalEl: $('#embed-modal'),
				modalScope: { // default scope to pass to the modal
					$embedTypeSelect: $('#select-embed-type'),
					$modalBody: $('.embed-modal-body')
				},
				modalOptions: {
					$abortEl: $('#btn-abort-modal')
				},
				embedTypes: {
					image:{
						httpPaths:{
							put: 'https://test-services.pri.org/admin/embed/edit',
							post: 'https://test-services.pri.org/admin/embed/edit',
							get: 'https://test-services.pri.org/admin/embed/fetch'
						}
					},
					slideshow:{
						httpPaths:{
							put: 'https://test-services.pri.org/admin/embed/edit',
							post: 'https://test-services.pri.org/admin/embed/edit',
							get: 'https://test-services.pri.org/admin/embed/fetch'
						}
					},
					video:{
						httpPaths:{
							put: 'https://test-services.pri.org/admin/embed/edit',
							post: 'https://test-services.pri.org/admin/embed/edit',
							get: 'https://test-services.pri.org/admin/embed/fetch',
						},
					},
					audio:{
						httpPaths:{
							put: 'https://test-services.pri.org/admin/embed/edit',
							post: 'https://test-services.pri.org/admin/embed/edit',
							get: 'https://test-services.pri.org/admin/embed/fetch'
						}
					},
					twitter:{
						httpPaths:{
							put: 'https://test-services.pri.org/admin/embed/edit',
							post: 'https://test-services.pri.org/admin/embed/edit',
							get: 'https://test-services.pri.org/admin/embed/fetch'
						}
					},
					instagram:{
						httpPaths:{
							put: 'https://test-services.pri.org/admin/embed/edit',
							post: 'https://test-services.pri.org/admin/embed/edit',
							get: 'https://test-services.pri.org/admin/embed/fetch'
						}
					},
					facebook:{
						httpPaths:{
							put: 'https://test-services.pri.org/admin/embed/edit',
							post: 'https://test-services.pri.org/admin/embed/edit',
							get: 'https://test-services.pri.org/admin/embed/fetch'
						}
					},
					relatedLink:{
						httpPaths:{
							put: 'https://test-services.pri.org/admin/embed/edit',
							post: 'https://test-services.pri.org/admin/embed/edit',
							get: 'https://test-services.pri.org/admin/embed/fetch'
						}
					},
					externalLink:{
						httpPaths:{
							put: 'https://test-services.pri.org/admin/embed/edit',
							post: 'https://test-services.pri.org/admin/embed/edit',
							get: 'https://test-services.pri.org/admin/embed/fetch'
						}
					},
					globalBuzz:{
						httpPaths:{
							put: 'https://test-services.pri.org/admin/embed/edit',
							post: 'https://test-services.pri.org/admin/embed/edit',
							get: 'https://test-services.pri.org/admin/embed/fetch'
						}
					},
					newsletterSubscribe:{
						httpPaths:{
							put: 'https://test-services.pri.org/admin/embed/edit',
							post: 'https://test-services.pri.org/admin/embed/edit',
							get: 'https://test-services.pri.org/admin/embed/fetch'
						}
					},
					iframe:{
						httpPaths:{
							put: 'https://test-services.pri.org/admin/embed/edit',
							post: 'https://test-services.pri.org/admin/embed/edit',
							get: 'https://test-services.pri.org/admin/embed/fetch'
						}
					},
					customText:{
						httpPaths:{
							put: 'https://test-services.pri.org/admin/embed/edit',
							post: 'https://test-services.pri.org/admin/embed/edit',
							get: 'https://test-services.pri.org/admin/embed/fetch'
						}
					}
				}
			}
		}
	});

	$extractContentBtn.click(function(){
		var $storyDataWell = $('.story-content #data');
		storyObject = medEditor.serialize();
		$storyDataWell.text(JSON.stringify(storyObject, null, 4));
	});

	$loadStoryBtn.click(function(){
		medEditor.loadStory(storyObject);
	});
});
