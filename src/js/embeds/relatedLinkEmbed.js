(function(base, EntityEmbedTypes){

	'use strict';

	// check for EntityEmbedTypes namespace
	if (!EntityEmbedTypes)
	{
		console.log('Could not find EntityEmbedTypes namespace. ' +
			'Please ensure that the genericEmbed has loaded before this one.');
		return;
	}

	// PRIVATE
	var embedName = 'relatedLink',
		defaults = {
			viewPath: base + 'modal/modal_relatedLink.html',
			displayName: 'Related Link',
			httpPaths: {
				put: '',
				post: '',
				get: '',
				del: ''
			},
			object_type: 'related-link'
		};
		
	// generates a pseudo guid (not guatanteed global uniqueness)
	var generateId = function () {
		var seg = function()
		{
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return seg() + seg() + '-' + seg() + '-' + seg() + '-' +
				seg() + '-' + seg() + seg() + seg();
	}

	// CONSTRUCTOR
	function relatedLinkEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	relatedLinkEmbed.inherits(EntityEmbedTypes.genericEmbed);
	EntityEmbedTypes[embedName] = relatedLinkEmbed;

	// PUBLIC
	relatedLinkEmbed.prototype.orderIndex = 9;

	relatedLinkEmbed.prototype.cleanModel = function(){
		return {
			internalTitle: null,
			displayTitle: null,
			links: []
		};
	};

	relatedLinkEmbed.prototype.initModal = function($el){
		var self = this;
		var availableTags = {
			// just declare data but dont put anything in it

			data: [
			"tag4",
			"tag3",
			"tag2",
			"tag1",
			"FancyCat",
			"FancyDog"
			],

			list: {
				maxNumberOfElements: 5,

				match: {
					enabled: true
				},

				sort: {
					enabled: true
				}
			}


		};
		//after 1 second hesitate call the following

		// Set availableTags.data = to api call with self.model.internalTitle
		$( "#completeInternalTitle" ).easyAutocomplete (availableTags);
		



<<<<<<< 1153edbc4560d1557095c96a971b25a872e91c2a
		var linkClass = 'related-link-url';
		var removeLinkClass = 'remove-link-btn';
		var $linkList = $el.find('#related-link-list');
		var $addLinkBtn = $el.find('#add-link-btn');

		$addLinkBtn.click(function(){
			var pseudoGuid = generateId();

			$linkList.append(
				'<div class="' + linkClass + '">' + 
					'<div class="embed-modal-form">' +
						'<input id="' + pseudoGuid + '" type="text" placeholder="link url" class="embed-modal-form-control">' +
					'</div>' + 
					'<button class="' + removeLinkClass + '">' + 
						'<i class="fa fa-minus"></i>' + 
					'</button>' + 
				'</div>'
			);

			//self.initiAutoComplete($('#' + pseudoGuid)
		});

		$el.on('click', '.' + removeLinkClass, function(){
			$(document.activeElement).closest('.' + linkClass).remove();
		});
=======


		//
		//window.modavailabletags = function(){
		//	availableTags.data = ["Cats", "Dogs"];
		//	$( "#completeInternalTitle" ).easyAutocomplete (availableTags);
		//};	

>>>>>>> Initial Work on Related Link autocomplete
	};





})('', EntityEmbedTypes);