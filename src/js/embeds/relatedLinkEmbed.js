var EntityEmbed = EntityEmbed || {};

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

	// This provides the functionality/styling for the type-ahead feature, allowing the user to only
	//  begin typing the title of a story and have a dropdown list of stories displayed to them
	//  based on their input.
	var initAutoComplete = function($el){
		var self = this;

		var contentMatchingUserInput = {
			// TODO: Should be using API that gets stories based on input provided by the user
			url: function() {
				return EntityEmbed.apiService.get(
					options.httpPaths.get,
					{object_id: '7dd6f53e-ea3d-4b78-b727-7ff169e50a64'},
					function(data){
						data: response.data;
					},
					function(data){
						console.log('failed to retrieve any stories!');
					}
				);
			},
			
			getValue: function(element) {
				return element.title;
			},

			listLocation: "Stories"
/*
			list: {
				maxNumberOfElements: 10,
				match: {
					enabled: true
				},
				sort: {
					enabled: true
				},

				// This function is for doing something to the data once it is clicked
				onSelectItemEvent: function() {
					var value = $("#completeInternalTitle").getSelectedItemData().GUID;

					// call save the object data to modal

				}
			},

			theme: "bootstrap",

			requestDelay: 100
*/			
		};

<<<<<<< a4b9acbd7cb68d38ad929f82b2fb7189aa03f769
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
=======
		return $( $el ).easyAutocomplete (contentMatchingUserInput);
>>>>>>> More Autocomplete work
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

		//self.initAutoComplete($('#completeInternalTitle'));

		$('#completeInternalTitle').keydown(function(e){
			EntityEmbed.apiService.get(
				self.options.httpPaths.get,
				//{object_id: "19b08ba567b64129b26ec0f1494a8abe"},
				//{object_id: "0fa1eca063a84cb4a093dd06141a12cf"},
				{object_id: "a405fd83f5f0409a93a868a876e3e620"},
				function(fetchedData){
					var content = {
						//data: fetchedData.response.stories,
						data: [{"title":"title1"}, {"title":"title2"}],
						getValue: "title"
					};

					$( '#completeInternalTitle' ).easyAutocomplete(content);
				},
				function(data){
					console.log('failed to retrieve any stories!');
				}
			);
		});
/*
		var contentMatchingUserInput = {
			// TODO: Should be using API that gets stories based on input provided by the user
			data: function() {
				    var responseData;
				    EntityEmbed.apiService.get(
						self.options.httpPaths.get,
						//{object_id: "19b08ba567b64129b26ec0f1494a8abe"},
						{object_id: "0fa1eca063a84cb4a093dd06141a12cf"},
						function(fetchedData){
							responseData = fetchedData.response;
						},
						function(data){
							console.log('failed to retrieve any stories!');
						}
					);
				},

			getValue: function(element){
							return element.title;
					  }
			*/
			//listLocation: "stories"
/*
			list: {
				maxNumberOfElements: 10,
				match: {
					enabled: true
				},
				sort: {
					enabled: true
				},

				// This function is for doing something to the data once it is clicked
				onSelectItemEvent: function() {
					var value = $("#completeInternalTitle").getSelectedItemData().GUID;

					// call save the object data to modal

				}
			},

			theme: "bootstrap",

			requestDelay: 100
*/			
		//};

		//$( '#completeInternalTitle' ).easyAutocomplete(contentMatchingUserInput);

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

			$('#' + pseudoGuid).keydown(function(e){
					EntityEmbed.apiService.get(
						self.options.httpPaths.get,
						//{object_id: "19b08ba567b64129b26ec0f1494a8abe"},
						//{object_id: "0fa1eca063a84cb4a093dd06141a12cf"},
						{object_id: "a405fd83f5f0409a93a868a876e3e620"},
						function(fetchedData){
							$( '#' + pseudoGuid ).easyAutocomplete({
								data: fetchedData.response,
								getValue: "Title"
							});
						},
						function(data){
							console.log('failed to retrieve any stories!');
						}
					);

			});
		});

		$el.on('click', '.' + removeLinkClass, function(){
			$(document.activeElement).closest('.' + linkClass).remove();
		});
	};

})('', EntityEmbedTypes);