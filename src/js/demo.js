$(document).ready(function(){
	var medEditor = new MediumEditor('.editable');
	$('.editable').mediumInsert({
		editor: medEditor,
		enabled: true,
		buttonLabels: 'fontawesome',
		addons: {
			images: false,
			embeds: false,
			entityEmbed: {
				$modalEl: $('#em-modal'),
				modalScope: { // default scope to pass to the modal
					$embedTypeSelect: $('#select-embed-type'),
					$modalBody: $('.modal-body')
				},
				modalOptions: {
					$completeEl: $('#btn-complete-modal')
				},
				actions: { // (object) Actions for an optional second toolbar
					remove: { // (object) Remove action configuration
						label: '<span class="fa fa-bicycle"></span>', // (string) Label for an action
						clicked: function ($el) { // (function) Callback function called when an action is selected
							console.log('custom action');
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