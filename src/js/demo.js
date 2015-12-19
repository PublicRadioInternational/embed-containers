$(document).ready(function(){
	var modal = $('#em-modal').modal({
		$completeEl: $('#btn-close-modal'),
		completeFunc: function(){
			console.log('custom complete function called!');
		}
	});

	var medEditor = new MediumEditor('.editable');
	$('.editable').mediumInsert({
		editor: medEditor,
		enabled: true,
		buttonLabels: 'fontawesome',
		addons: {
			images: false,
			embeds: false,
			priEntityEmbed: {
				modalTrigger: function()
				{
					modal.openModal();
				}
			}
		}
	});

	$('#dump-content').click(function(){
		var allContents = medEditor.serialize();
		var elContent = allContents['element-0'].value;

		$('#elContents').text(elContent);
	});
});