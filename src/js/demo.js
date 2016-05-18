$(document).ready(function(){

	var medEditor = new MediumEditor('.editable', {
    toolbar: {
      buttons: ['bold', 'italic', 'anchor', 'orderedlist', 'unorderedlist', 'h2', 'h3', 'quote']
    }
	});

	var $extractContentBtn = $('#extract-story-content');
	var $loadStoryBtn = $('#load-default-story');
	var $openAddSingleEmbedBtn = $('.demo-button-open-modal.open-add-single');
	var $openAddAnyEmbedBtn = $('.demo-button-open-modal.open-add-any');
	var $openEditEmbedBtn = $('.demo-button-open-modal.open-edit');

	var storyObject = {
		"html": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt, ex in porta commodo, elit metus fermentum ipsum, sit amet cursus augue felis sed libero. Integer faucibus, lorem vel porttitor ultricies, orci nisi laoreet purus, et faucibus nibh erat congue ante.&nbsp;<\/p><div class=\"entity-embed-container\">[[EntityEmbeds:0:b7c4aea5c4a54068841b8900b1e8c552]]<\/div><p>Nam sem ipsum, lobortis vel facilisis eget, pharetra ornare nisl. Phasellus at felis eget mi accumsan tempor non eget quam. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi suscipit ullamcorper urna, eget faucibus velit facilisis sed. Aliquam faucibus hendrerit blandit. Donec aliquam nec odio eget sodales. Maecenas mollis diam eget elit tempus cursus.<\/p><div class=\"entity-embed-container\">[[EntityEmbeds:1:11ba981b16624399b95a9b207b4dbe9d]]<\/div><p>Proin eleifend sem tristique turpis sollicitudin, nec viverra ligula fermentum. Aenean vitae mollis est. Sed id felis iaculis, pulvinar dolor vel, maximus ante. Cras risus dui, faucibus sit amet arcu id, varius malesuada arcu. Aliquam non eleifend magna.&nbsp;<\/p><div class=\"entity-embed-container entity-embed-left\">[[EntityEmbeds:2:a21d3676d1b14199a79f8159cc3ee01b]]<\/div><p>Sed hendrerit risus non mi ullamcorper, in commodo velit dapibus. Nullam finibus, sem ut tincidunt molestie, risus nibh hendrerit eros, id varius elit dui sit amet nulla. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.&nbsp;<\/p><div class=\"entity-embed-container\">[[EntityEmbeds:3:156d7e84f9d4415185985ed29a6ea459]]<\/div><p>Pellentesque at sagittis lectus, a faucibus dolor. Ut malesuada libero egestas lectus cursus tempor. Aliquam erat volutpat. Praesent ut nibh justo. Morbi eu ligula metus. Maecenas a justo nec neque placerat accumsan. Curabitur eget lobortis eros, sed suscipit eros. Duis dictum quam eget turpis varius molestie.<\/p><div class=\"entity-embed-container\">[[EntityEmbeds:4:f4ab4842129645ee8f7b729225fbdaa5]]<\/div><p>In augue enim, varius vitae molestie a, elementum interdum metus. Ut et pretium dolor. Duis lobortis orci et porta maximus. Donec dapibus vulputate accumsan. Integer ac finibus felis. Fusce mi tellus, semper id euismod id, maximus vitae tortor.&nbsp;<\/p><div class=\"entity-embed-container\">[[EntityEmbeds:5:93bdb5c11717441d8f159b0f2327b05d]]<\/div><p>Integer sed porttitor dui, in ultricies nibh. Aenean congue nibh quis ex convallis, nec facilisis odio blandit. In finibus felis et quam ornare vestibulum. Suspendisse potenti. Suspendisse potenti.&nbsp;<\/p><div class=\"entity-embed-container entity-embed-right clearfix\">[[EntityEmbeds:6:4e31237181b745b3a0bb35ebe12faf90]]<\/div><p>Nam feugiat felis nec facilisis volutpat. Morbi auctor, sapien vitae aliquet mollis, metus erat dignissim arcu, eu finibus mauris nulla vitae nunc.<\/p><p>Pellentesque nunc erat, fringilla eu cursus quis, congue mattis sapien. In id pharetra dolor. Quisque placerat nisl ex, a sollicitudin nisi tincidunt quis.&nbsp;<\/p><p>Ut condimentum venenatis ante, non tristique ligula hendrerit sed. Etiam ultricies dolor est, non fermentum orci dignissim at. Sed mattis scelerisque lorem, ut cursus augue iaculis sed. Cras sed massa porta, iaculis elit a, molestie dui.<\/p><p>Cras hendrerit sit amet quam non scelerisque. Maecenas sed maximus odio. Aenean eleifend laoreet augue, in tempus est interdum eu.&nbsp;<\/p><p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent tincidunt, nulla at porta dignissim, sapien est tincidunt augue, sed tristique risus nibh eget lorem.&nbsp;<\/p><div class=\"entity-embed-container entity-embed-left\">[[EntityEmbeds:7:4aab250ed6644027b71b0f33065ca8dd]]<\/div><p>Proin sed nibh eget arcu malesuada vehicula in at sem. Donec pharetra egestas elit, quis posuere turpis sodales non. In lobortis hendrerit fermentum.&nbsp;<\/p><p>Praesent placerat, dui tincidunt porttitor tristique, dolor arcu maximus neque, vitae venenatis dui lacus ac dolor. Etiam eget pharetra odio. Aliquam ultrices mollis odio et elementum.&nbsp;<\/p><div class=\"entity-embed-container\">[[EntityEmbeds:8:0ee25623e4b94eb18533504869fe240a]]<\/div><p>Phasellus tincidunt augue id sollicitudin venenatis. Mauris elementum sollicitudin est, quis dignissim eros euismod sit amet. Proin vehicula ligula ac est condimentum blandit.&nbsp;<\/p><div class=\"entity-embed-container\">[[EntityEmbeds:9:89120cec5e594ca28b4aa1b31d55b383]]<\/div><p>Aliquam turpis metus, luctus sit amet elit in, congue sollicitudin dolor. Pellentesque posuere magna id finibus blandit.<\/p><div class=\"entity-embed-container\">[[EntityEmbeds:10:fa5a5de984c6419cba88e09fe2a92f2d]]<\/div><div class=\"entity-embed-container entity-embed-right clearfix\">[[EntityEmbeds:11:93fec5d586184558bf69cd09d7d81ca9]]<\/div><p>Cras hendrerit sit amet quam non scelerisque. Maecenas sed maximus odio. Aenean eleifend laoreet augue, in tempus est interdum eu. <\/p><p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent tincidunt, nulla at porta dignissim, sapien est tincidunt augue, sed tristique risus nibh eget lorem. <\/p><p>Proin sed nibh eget arcu malesuada vehicula in at sem. Donec pharetra egestas elit, quis posuere turpis sodales non. In lobortis hendrerit fermentum. <\/p><p>Praesent placerat, dui tincidunt porttitor tristique, dolor arcu maximus neque, vitae venenatis dui lacus ac dolor. Etiam eget pharetra odio. Aliquam ultrices mollis odio et elementum. <\/p><p>Phasellus tincidunt augue id sollicitudin venenatis. Mauris elementum sollicitudin est, quis dignissim eros euismod sit amet. Proin vehicula ligula ac est condimentum blandit. <\/p><div class=\"entity-embed-container entity-embed-wide\">[[EntityEmbeds:12:af5b2cb4d52a48b9962414880fe1dc88]]<\/div><p>Aliquam turpis metus, luctus sit amet elit in, congue sollicitudin dolor. Pellentesque posuere magna id finibus blandit.<\/p><div class=\"entity-embed-container entity-embed-left\">[[EntityEmbeds:13:af5b2cb4d52a48b9962414880fe1dc88]]<\/div><p>Cras hendrerit sit amet quam non scelerisque. Maecenas sed maximus odio. Aenean eleifend laoreet augue, in tempus est interdum eu.&nbsp;<\/p><p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent tincidunt, nulla at porta dignissim, sapien est tincidunt augue, sed tristique risus nibh eget lorem. Proin sed nibh eget arcu malesuada vehicula in at sem.<\/p><p>Donec pharetra egestas elit, quis posuere turpis sodales non. In lobortis hendrerit fermentum. Praesent placerat, dui tincidunt porttitor tristique, dolor arcu maximus neque, vitae venenatis dui lacus ac dolor. Etiam eget pharetra odio. Aliquam ultrices mollis odio et elementum.&nbsp;<\/p><div class=\"entity-embed-container\">[[EntityEmbeds:14:b5f6b561ae54416c9edbeef816a8cd41]]<\/div><div class=\"entity-embed-container entity-embed-right clearfix\">[[EntityEmbeds:15:af5b2cb4d52a48b9962414880fe1dc88]]<\/div><p>Phasellus tincidunt augue id sollicitudin venenatis. Mauris elementum sollicitudin est, quis dignissim eros euismod sit amet. Proin vehicula ligula ac est condimentum blandit.&nbsp;<\/p><p>Aliquam turpis metus, luctus sit amet elit in, congue sollicitudin dolor. Pellentesque posuere magna id finibus blandit.<\/p><p class=\"entity-embed-new-line\"><br><\/p><div class=\"entity-embed-container entity-embed-center\">[[EntityEmbeds:16:af5b2cb4d52a48b9962414880fe1dc88]]<\/div><p class=\"entity-embed-new-line medium-insert-active\">The car, which was some fifty feet long, was very convenient for their purpose. The adversaries might march on each other in the aisle, and fire at their ease. Never was duel more easily arranged. Mr. Fogg and Colonel Proctor, each provided with two six-barrelled revolvers, entered the car. The seconds, remaining outside, shut them in. They were to begin firing at the first whistle of the locomotive. After an interval of two minutes, what remained of the two gentlemen would be taken from the car.<br><\/p><p class=\"entity-embed-new-line\"><br><\/p><p class=\"entity-embed-new-line\"><br><\/p><p class=\"entity-embed-new-line\"><br><\/p><p class=\"entity-embed-new-line\"><br><\/p>",
		"embeds": [
			{
				"index": 0,
				"id": "b7c4aea5c4a54068841b8900b1e8c552",
				"type": "video"
			},
			{
				"index": 1,
				"id": "11ba981b16624399b95a9b207b4dbe9d",
				"type": "video"
			},
			{
				"index": 2,
				"id": "a21d3676d1b14199a79f8159cc3ee01b",
				"type": "custom"
			},
			{
				"index": 3,
				"id": "156d7e84f9d4415185985ed29a6ea459",
				"type": "twitter"
			},
			{
				"index": 4,
				"id": "f4ab4842129645ee8f7b729225fbdaa5",
				"type": "facebook"
			},
			{
				"index": 5,
				"id": "93bdb5c11717441d8f159b0f2327b05d",
				"type": "instagram"
			},
			{
				"index": 6,
				"id": "4e31237181b745b3a0bb35ebe12faf90",
				"type": "external-link"
			},
			{
				"index": 7,
				"id": "4aab250ed6644027b71b0f33065ca8dd",
				"type": "related-link"
			},
			{
				"index": 8,
				"id": "0ee25623e4b94eb18533504869fe240a",
				"type": "iframe"
			},
			{
				"index": 9,
				"id": "89120cec5e594ca28b4aa1b31d55b383",
				"type": "newsletter"
			},
			{
				"index": 10,
				"id": "fa5a5de984c6419cba88e09fe2a92f2d",
				"type": "audio"
			},
			{
				"index": 11,
				"id": "93fec5d586184558bf69cd09d7d81ca9",
				"type": "global-buzz"
			},
			{
				"index": 12,
				"id": "af5b2cb4d52a48b9962414880fe1dc88",
				"type": "image"
			},
			{
				"index": 13,
				"id": "af5b2cb4d52a48b9962414880fe1dc88",
				"type": "image"
			},
			{
				"index": 14,
				"id": "b5f6b561ae54416c9edbeef816a8cd41",
				"type": "slideshow"
			},
			{
				"index": 15,
				"id": "af5b2cb4d52a48b9962414880fe1dc88",
				"type": "image"
			},
			{
				"index": 16,
				"id": "af5b2cb4d52a48b9962414880fe1dc88",
				"type": "image"
			}
		]
	};

	$('.editable').mediumInsert({
		editor: medEditor,
		enabled: true,
		buttonLabels: 'fontawesome',
		addons: {
			images: false,
			embeds: false,
			entityEmbeds: {
				authToken: 'abc123',
				domainName: 'https://test-services.pri.org'
			}
		}
	});

	$extractContentBtn.click(function(){
		var $storyDataWell = $('.story-content #data');
		storyObject = medEditor.get_content();
		$storyDataWell.text(JSON.stringify(storyObject, null, 4));
	});

	$loadStoryBtn.click(function(){
		medEditor.load_content(storyObject);
	});

	$openAddSingleEmbedBtn.click(function(){
		$.embed_modal_open({
				modalOptions:{
					embedTypeStr: 'related-link'
				}
			})
			.done(function(scope){
				console.log('Embed modal open (add single) successfully saved, server response to follow.');
				console.log(scope);
			})
			.fail(function(scope){
				console.log('Embed modal open (add single) aborted.');
			});
	});

	$openAddAnyEmbedBtn.click(function(){
		$.embed_modal_open({
				authToken: 'abc123',							// we dont necessarily need to pass these options here b/c
				domainName: 'https://test-services.pri.org'		// it is configured in the entity embed addon, but this is
			})													// a good example that configuration can be done like so
			.done(function(scope){
				console.log('Embed modal open (add any) successfully saved, server response to follow.');
				console.log(scope);
			})
			.fail(function(scope){
				console.log('Embed modal open (add any) aborted.');
			});
	});

	$openEditEmbedBtn.click(function(){
		$.embed_modal_open({
				modalOptions:{
					embedTypeStr: 'newsletter',
					id: '2607f8daf38342f28054b29a7c26b118'
				}
			})
			.done(function(scope){
				console.log('Embed modal open (edit) successfully saved, server response to follow.');
				console.log(scope);
			})
			.fail(function(scope){
				console.log('Embed modal open (edit) aborted.');
			});
	});
});
