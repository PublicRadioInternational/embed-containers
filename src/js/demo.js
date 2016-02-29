$(document).ready(function(){
	
 	var medEditor = new MediumEditor('.editable');

 	var $getContentBtn = $('#get-story-content');

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

	$getContentBtn.click(function(){
		var $storyDataWell = $('.story-content #data');
		var storyObject = medEditor.serialize();
		$storyDataWell.text(JSON.stringify(storyObject, null, 4));
	});
});
