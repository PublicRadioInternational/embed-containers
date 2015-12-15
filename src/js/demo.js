$(document).ready(function(){
	var medEditor = new MediumEditor('.editable');
	$('.editable').mediumInsert({
		editor: medEditor,
		enabled: true,
		buttonLabels: 'fontawesome',
		addons: {
			images: false,
			embeds: false,
			priEntityEmbed: {
				
			}
		}
	});

	$('#dump-content').click(function()
	{
		var allContents = medEditor.serialize();
		var elContent = allContents['element-0'].value;

		$('#elContents').text(elContent);
	});

	$('#modal').modal({
		openTriggers:[{
			element: $('#open-modal'),
			openEvent: 'click'
		}]
	});
});