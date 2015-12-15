$(document).ready(function(){
	// var medEditor = new MediumEditor('.editable');
	// $('.editable').mediumInsert({
	// 	editor: medEditor,
	// 	enabled: true,
	// 	buttonLabels: 'fontawesome',
	// 	addons: {
	// 		images: false,
	// 		embeds: false,
	// 		priEntityEmbed: true
	// 	}
	// });

	// $('#dump-content').click(function()
	// {
	// 	var allContents = medEditor.serialize();
	// 	var elContent = allContents['element-0'].value;

	// 	$('#elContents').text(elContent);
	// });

	$('#open-modal').opensModal($('#modal').makeModal());
});