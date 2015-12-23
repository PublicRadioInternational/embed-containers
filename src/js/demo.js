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
				modalOptions: {
					$abortEl: $('#btn-abort-modal'),
					$completeEl: $('#btn-complete-modal')
				}
			}
		}
	});

	// TODO : parse story content into story object
	$('#dump-content').click(function(){
		var allContents = medEditor.serialize();
		var elContent = allContents['element-0'].value;
		
		 var storyParser = $('.editable').storyParser({
		  }); 	 	
		
		var finalContent = storyParser.parse(elContent);
		
		$('#elContents').text(elContent);
		
		$('#finalContents').text(finalContent);
	});
});