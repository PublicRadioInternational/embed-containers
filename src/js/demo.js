$(document).ready(function(){
	var modal = $('#em-modal').modal();

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
					modal.toggleModal();
				}
			}
		}
	});

	$('#dump-content').click(function()
	{
		var allContents = medEditor.serialize();
		var elContent = allContents['element-0'].value;

		$('#elContents').text(elContent);
	});
});