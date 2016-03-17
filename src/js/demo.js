$(document).ready(function(){

	var medEditor = new MediumEditor('.editable');

	var $extractContentBtn = $('#extract-story-content');
	var $loadDefaultStoryBtn = $('#load-default-story');
	var $loadStoryBtn = $('#load-story-content');

	var storyObject = {
		"storyHtml": "<p>This is a the defaullt story.</p><p class=\"entity-embed-editor-line\"></p><div class=\"entity-embed-container\">[[0]]</div><p>This is editable content. Try typing in here.</p><p class=\"entity-embed-editor-line\"></p>",
		"embeds": [
			{
				"index": 0,
				"id": "a8c3ff363d5844d0a93edc2f4364e535", // this ID is hardcoded only for demonstration purposes
				"style": "entity-embed entity-embed-center",
				"type": "custom"
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
						getAllObjectId: '6bfd4d96f06944489531e40050d3e2c9' // this is a hack for testing/ demoing
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

	$loadDefaultStoryBtn.click(function(){
		medEditor.loadStory(storyObject); // this ID is hardcoded only for demonstration purposes
	});

	$loadStoryBtn.click(function(){
		medEditor.loadStory('97381d1231a144038b79ab9a08e9fff3'); // this ID is hardcoded only for demonstration purposes
	});
});
