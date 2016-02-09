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

	// Create description
	var initAutoComplete = function($el){
		var self = this;
		var availableTags = {
			url: function(phrase) {
					return $el.currentEmbedType.options.httpPaths.get + phrase + "&format=json";
			}, // Get API Goes Here

			//getValue: "title", // Should only match to 
			
			requestDelay: 500,
			
			data: [],

			  getValue: function(element) {
				return element.title;
			  },

			  ajaxSettings: {
				dataType: "json",
				method: "POST",
				data: {
				  dataType: "json"
				}
			  },

			  preparePostData: function(data) {
				data.phrase = $("#" + psuedoGuid).val();
				return data;
			  },




			list: {
				maxNumberOfElements: 10,
				match: {
					enabled: true
				},
				sort: {
					enabled: true
				}
			}
		};

		$( "#completeInternalTitle" ).easyAutocomplete (availableTags);
<<<<<<< f3ac318f42b0882bf5c20e308aee19c28a788bfd
<<<<<<< afa856471a1d5578db3f3769a10534279d10b369
		



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
=======

		// TODO: Store the selected story data (ID or something) & put in JSON object
>>>>>>> more work on autocomplete
=======
>>>>>>> Moved RelatedLink autocomplete functionality into new function
	};

	relatedLinkEmbed.prototype.getModelFromForm = function($el)
	{
		var self = this;
		self.parent.getModelFromForm($el);

		var urlForms = $el.find('.related-link-url');
		for(var i = 0; i < urlForms.length; i++)
		{
			self.model.links.push(formFields[i].value);
		}
	};

	relatedLinkEmbed.prototype.populateFormWithModel = function($form)
	{
		var self = this;
		self.parent.populateFormWithModel($form);

		var linkClass = 'related-link-url';
		var $linkList = $el.find('#related-link-list');
		var $addLinkBtn = $el.find('#add-link-btn');

		for(var i = 0; i < self.model.links.length; i++)
		{
			$addLinkBtn.click();	
			$form.find('.' + linkClass).last().val(self.model.links[i]);
		}
	};

	relatedLinkEmbed.prototype.initModal = function($el){
		var self = this;

		var linkClass = 'related-link-url';
		var removeLinkClass = 'remove-link-btn';
		var $linkList = $el.find('#related-link-list');
		var $addLinkBtn = $el.find('#add-link-btn');

		$addLinkBtn.click(function(){
			var pseudoGuid = generateId();

			$linkList.append(
				'<div class="' + linkClass + '">' + 
					'<div class="embed-modal-form">' +
						'<input id="' + pseudoGuid' + " type="text" placeholder="link url" class="embed-modal-form-control">' +
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
	};

})('', EntityEmbedTypes);