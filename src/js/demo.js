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
				$modalEl: $('#em-modal'),
				modalScope: { // default scope to pass to the modal
					$embedTypeSelect: $('#select-embed-type'),
					$modalBody: $('.modal-body')
				},
				modalOptions: {
					$completeEl: $('#btn-complete-modal')
				},
				embedTypes: {
					imagesEmbed:{
						httpPaths:{	
							put: 'https://test-services.pri.org/admin/story/edit',
							post: 'https://test-services.pri.org/admin/story/edit',
							get: 'https://test-services.pri.org/admin/story/fetch'
						}
					},
					videoEmbed:{
						httpPaths:{	
							put: 'https://test-services.pri.org/admin/story/edit',
							post: 'https://test-services.pri.org/admin/story/edit',
							get: 'https://test-services.pri.org/admin/story/fetch'
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


	// NOTE : this is only for testing the parser
	// 			all interactions with the parser should happen within
	//			the entityEmbedAddon in the final solution
	// var parser = $('.editable').data('parser');
	// parser.fromEditorToModal();

	// $('#dump-from-editor').click(function(){
	// 	var allContents = medEditor.serialize();
	// 	var elContent = allContents['element-0'].value;

	// 	var serverObj = parser.fromEditorToServer(elContent);

	// 	$('#from-editor').text(JSON.stringify(serverObj, null, 4));
	// });

	// $('#dump-from-server').click(function(){
	// 	var contents = $('#from-editor').text();

	// 	// this is simulating data from a server, so convert contents to a JSON object

	// 	var contentsObj = JSON.parse(contents);

	// 	$('#from-server').html(parser.fromServerToEditor(contentsObj));
	// });
});




