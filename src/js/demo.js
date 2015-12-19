$(document).ready(function(){
	var modal = $('#em-modal').modal({
		$completeEl: $('#btn-complete-modal'),
		completeFunc: function(){
			console.log('custom complete function called!');
			var $id = $('#example-input');
			if(!!$id.val() && $id.val() !== '')
			{

				return true;
			}
			return false;
		},
		$abortEl: $('#btn-abort-modal'),
		abortFunc: function(){
			console.log('custom abort function called!');
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

	window.medEditor = medEditor;


	$('#dump-content').click(function(){
		var allContents = medEditor.serialize();
		var elContent = allContents['element-0'].value;

		$('#elContents').text(elContent);
	});
});