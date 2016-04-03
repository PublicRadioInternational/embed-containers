var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// PRIVATE
	var embedName = 'relatedLink',
		defaults = {
			viewPath: base + 'modal/modal_relatedLink.html',
			displayName: 'Related Link',
			object_type: 'related-link',
			validationOptions: {
				rules: {
					title: "required",

				}
			},
			httpPaths:{
				getRelatedStories: 'https://test-services.pri.org/admin/content/list'
			}
		};
		
	var psuedoGuids = [];
	var linkTitlesAndIds = [];
	// This array is for indicating whether or not a user has selected a story from the list
	var storySelectionState = [];

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
 
	relatedLinkEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = relatedLinkEmbed;

	// PUBLIC
	relatedLinkEmbed.prototype.orderIndex = 10;

	relatedLinkEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			displayTitle: null,
			links: []
		};
	};

<<<<<<< 9544eebb5f68756d060bb5aa4e6e67835546a933
<<<<<<< 95b47008097324730d8fd6689d14e44ac903121f
<<<<<<< aeae75c3b8355114f55043dc4faefbf6915acf1d
	// This provides the functionality/styling for the type-ahead feature, allowing the user to only
	//  begin typing the title of a story and have a dropdown list of stories displayed to them
	//  based on their input.
	var initAutoComplete = function(htmlElementId, self){
		// TODO: Make function take in user input to pass to API

		EntityEmbed.apiService.get({
			path: self.options.httpPaths.get,
			// TODO: Object id is currently hard-coded, this needs to be changed.
			data: {
				object_id: 'dbbc5fc38d2e4d359572743d2c00d581'
			},
			success: function(fetchedData){
				var autocompleteSettingsAndData = {
					data: fetchedData.response.stories,
					getValue: 'Title',
					list: {
						maxNumberOfElements: 10,
						match: {
							enabled: true
						},
						sort: {
							enabled: true
						},		
					}
				};

				$( htmlElementId ).easyAutocomplete(autocompleteSettingsAndData);
				$( htmlElementId ).focus();
			},
			fail: function(data){
				console.log('failed to retrieve any stories!');
			}
		});
	};

=======
>>>>>>> Got typeahead working
=======
=======
/*
>>>>>>> ignore this commit
	relatedLinkEmbed.prototype.clearForm = function($el, self){
		var self = this;
		self.parent.clearForm($el, self);
		var formFields = $el.find('.embed-modal-form-control');
		for(var i = 0; i < formFields.length; i++)
		{
			if (!!formFields[i].type && formFields[i].type.indexOf('select') !== -1)
			{
				formFields[i].selectedIndex = 0;
			}
			else
			{
				formFields[i].value = null;
				formFields[i].innerHTML ="";
			}
		}
		self.model = self.cleanModel();
	}
	*/

	relatedLinkEmbed.prototype.clearForm = function($el, self){
 		//var self = this;
 		self.parent.clearForm($el);
 		var $linkList = $el.find('#related-link-list');
 		linkList.children().remove();
 	};

>>>>>>> initial work on validation and editing rl
	relatedLinkEmbed.prototype.getModelFromForm = function($el)
	{
		var self = this;
		var formFields = $el.find('.embed-modal-form-control');

		// TODO: Need to extract this block of code, and instead call parent function
		for(var i = 0; i < 2; i++)
		{
			var name = formFields[i].name;
			var value = formFields[i].value;
			if (!!name && !!value)
			{
				self.model[name] = value;
			}
		}

		// Save all of the links
		for(var i = 0; i < linkTitlesAndIds.length; i++)
		{
			self.model.links.push(linkTitlesAndIds[i]);
		}
	};

	relatedLinkEmbed.prototype.populateFormWithModel = function($form)
	{
		var self = this;
		var formFields = $form.find('.embed-modal-form-control');
		for (var i = 0; i < formFields.length; i++)
		{
			if (!!formFields[i].type && formFields[i].type.indexOf('select') !== -1)
			{
				var options = $(formFields[i]).find('option');
				var selectedOption = self.model[formFields[i].name];
				var optionIndex = 0;
				options.each(function(index){
					if (this.value === selectedOption)
					{
						optionIndex = index;
					}
				});
				formFields[i].selectedIndex = optionIndex;
			}
			else if (!!self.model[formFields[i].name])
			{
				formFields[i].value = self.model[formFields[i].name];
			}
		}

		var linkClass = 'related-link-url';
		var $linkList = $form.find('#related-link-list');
		var $addLinkBtn = $form.find('#add-link-btn');

		for(var i = 0; i < self.model.links.length; i++)
		{
			$addLinkBtn.click();
			$form.find('.' + linkClass).last().val(self.model.links[i].value);
		}
	};

	// This provides the functionality/styling for the type-ahead feature, allowing the user to only
	//  begin typing the title of a story and have a dropdown list of stories displayed to them
	//  based on their input. This function also takes into account validation of the modal form.
	var runAutoComplete = function (htmlElementID, linkNumber, self){
		var rgxDevEnv = /^[^.]*staging[^.]*\.|\.dev$/;
		var isDevEnv = rgxDevEnv.test(window.location.host);
		var debug = 0;
		var linkLocation = linkNumber - 1;
		if(storySelectionState[linkLocation] === undefined)
		{
			storySelectionState.push(false);
		}
		else
		{
			storySelectionState[linkLocation] = false;
		}

		if(isDevEnv)
		{
			debug = 1;
		}
		var options = {
			url: function(phrase) {
			   return self.options.httpPaths.getRelatedStories;
			},

			listLocation: function(listOfData)
			{
				return listOfData.response.data;
			},

			getValue: function(data) {
				if(data.pub_state == 1)
				{
			   		return data.title;
			   	}
			   	else 
			   	{
			   		return '';
			   	}
			},

			ajaxSettings: {
				dataType: 'json',
				method: 'POST',
				data: {
					auth_token: 'abc123',
					debug: debug
				}		
			},

			preparePostData: function(data) {
				data.title = $(htmlElementID).val();
				return JSON.stringify(data);
			},

			list: {
				maxNumberOfElements: 10,
				match: {
					enabled: true
				},
				sort: {
					enabled: true
				},		
				// This function stores the users story selection
				onClickEvent: function(storyObject)
				{
					var objectId = $(htmlElementID).getSelectedItemData().object_id;
					var storyTitle = $(htmlElementID).getSelectedItemData().title;
					storySelectionState[linkLocation] = true;
					if(linkTitlesAndIds[linkLocation] === undefined)
					{
						linkTitlesAndIds.push({key: objectId, value: storyTitle});
					}
					else
					{
						linkTitlesAndIds[linkLocation].key = objectId;
						linkTitlesAndIds[linkLocation].value = storyTitle;
					}
				}
			},

			requestDelay: 600
		};

		$(htmlElementID).easyAutocomplete(options);
		// If the selectionState of the element is false, show a validation error
	}

	relatedLinkEmbed.prototype.initModal = function($el){
		var self = this;
		var linkClass = 'related-link-url';
		var removeLinkClass = 'remove-link-btn';
		var $linkList = $el.find('#related-link-list');
		var $addLinkBtn = $el.find('#add-link-btn');
		var numberOfLinks = 0;

		$addLinkBtn.click(function(){
			var pseudoGuid = generateId();
			psuedoGuids.push(pseudoGuid);
			numberOfLinks++;

			$linkList.append(
				'<div class="' + linkClass + '">' + 
					'<div class="embed-modal-form">' +
						'<input id="' + pseudoGuid + '" type="text" placeholder="Begin typing story title" class="embed-modal-form-control" required/>' +
					'</div>' + 
					'<button class="' + removeLinkClass + '">' + 
						'<i class="fa fa-minus"></i>' + 
					'</button>' + 
				'</div>'
			);

			runAutoComplete('#' + pseudoGuid, numberOfLinks, self);
		});
			

		$el.on('click', '.' + removeLinkClass, function(){
			$(document.activeElement).closest('.' + linkClass).remove();
		});
	};

	relatedLinkEmbed.prototype.parseForEditor = function(){
		var self = this;

		return '<div class="relatedLink-embed">' +
					'<p class="relatedLink-embed-uiText"> <strong>Embed Type:</strong> Related Link </p>' +
					'<p  class="relatedLink-embed-uiText"> <strong>Title:</strong> ' + self.model.title + '</p>' +
				'</div>';
	};

})('');