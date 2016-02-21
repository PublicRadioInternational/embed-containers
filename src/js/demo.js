$(document).ready(function(){
	
 	var medEditor = new MediumEditor('.editable');

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
					imagesEmbed:{
						httpPaths:{	
							put: 'https://test-services.pri.org/admin/story/edit',
							post: 'https://test-services.pri.org/admin/story/edit',
							get: 'https://test-services.pri.org/admin/story/fetch',
							getAllObjectId: {object_id: '902947a05cec492eae123c7aa1144c86'}
						}
					},
					videoEmbed:{
						httpPaths:{	
							put: 'https://test-services.pri.org/admin/story/edit',
							post: 'https://test-services.pri.org/admin/story/edit',
							get: 'https://test-services.pri.org/admin/story/fetch',
							getAllObjectId: {object_id: 'a6e882c0c5f644f8a4fa32bd31f3f978'}
						}
					},
					audioEmbed:{
						httpPaths:{	
							put: 'https://test-services.pri.org/admin/story/edit',
							post: 'https://test-services.pri.org/admin/story/edit',
							get: 'https://test-services.pri.org/admin/story/fetch'
						}
					},
					twitterEmbed:{
						httpPaths:{	
							put: 'https://test-services.pri.org/admin/story/edit',
							post: 'https://test-services.pri.org/admin/story/edit',
							get: 'https://test-services.pri.org/admin/story/fetch'
						}
					},
					instagramEmbed:{
						httpPaths:{	
							put: 'https://test-services.pri.org/admin/story/edit',
							post: 'https://test-services.pri.org/admin/story/edit',
							get: 'https://test-services.pri.org/admin/story/fetch'
						}
					},
					facebookEmbed:{
						httpPaths:{	
							put: 'https://test-services.pri.org/admin/story/edit',
							post: 'https://test-services.pri.org/admin/story/edit',
							get: 'https://test-services.pri.org/admin/story/fetch'
						}
					},
					relatedLinkEmbed:{
						httpPaths:{	
							put: 'https://test-services.pri.org/admin/story/edit',
							post: 'https://test-services.pri.org/admin/story/edit',
							get: 'https://test-services.pri.org/admin/story/fetch'
						}
					},
					externalLinkEmbed:{
						httpPaths:{	
							put: 'https://test-services.pri.org/admin/story/edit',
							post: 'https://test-services.pri.org/admin/story/edit',
							get: 'https://test-services.pri.org/admin/story/fetch'
						}
					},
					globalBuzzEmbed:{
						httpPaths:{	
							put: 'https://test-services.pri.org/admin/story/edit',
							post: 'https://test-services.pri.org/admin/story/edit',
							get: 'https://test-services.pri.org/admin/story/fetch'
						}
					},
					newsletterSubscribeEmbed:{
						httpPaths:{	
							put: 'https://test-services.pri.org/admin/story/edit',
							post: 'https://test-services.pri.org/admin/story/edit',
							get: 'https://test-services.pri.org/admin/story/fetch'
						}
					},
					iframeEmbed:{
						httpPaths:{	
							put: 'https://test-services.pri.org/admin/story/edit',
							post: 'https://test-services.pri.org/admin/story/edit',
							get: 'https://test-services.pri.org/admin/story/fetch'
						}
					},
					customTextEmbed:{
						httpPaths:{	
							put: 'https://test-services.pri.org/admin/story/edit',
							post: 'https://test-services.pri.org/admin/story/edit',
							get: 'https://test-services.pri.org/admin/story/fetch'
						}
					}
				}
			}
		}
	});
});




