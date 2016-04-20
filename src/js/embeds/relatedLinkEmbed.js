var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// check for EntityEmbedTypes namespace
	if (!EntityEmbed.embedTypes)
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

	relatedLinkEmbed.prototype.clearForm = function($el){
 		var self = this;
 		self.parent.clearForm($el, self);
 		var $linkList = $el.find('#related-link-list');
 		$linkList.children().remove();
 	};

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

		var linkClass = 'embed-modal-form-control';
		var $linkList = $form.find('#related-link-list');
		var $addLinkBtn = $form.find('#add-link-btn');

		for(var i = 0; i < self.model.links.length; i++)
		{
			$addLinkBtn.click();
			$form.find('.' + linkClass).last().val(self.model.links[i].value);
			storySelectionState[i] = true;
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
				onChooseEvent: function(storyObject)
				{
					storySelectionState[linkLocation] = true;
					var objectId = $(htmlElementID).getSelectedItemData().object_id;
					var storyTitle = $(htmlElementID).getSelectedItemData().title;
					if(linkTitlesAndIds[linkLocation] === undefined)
					{
						linkTitlesAndIds.push({key: objectId, value: storyTitle});
					}
					else
					{
						linkTitlesAndIds[linkLocation].key = objectId;
						linkTitlesAndIds[linkLocation].value = storyTitle;
					}
				},
				onHideListEvent: function()
				{
					if(storySelectionState[linkLocation] === false && !$(htmlElementID).is(':focus'))
					{
						$(htmlElementID).val('');
					}

					$(htmlElementID).focusout(function()
					{
						if(linkTitlesAndIds[linkLocation] && linkTitlesAndIds[linkLocation].value != $(htmlElementID).val())
						{
							$(htmlElementID).val(linkTitlesAndIds[linkLocation].value);
						}
					});
				}
			},

			requestDelay: 600
		};

		var saveButton = '#btn-save-modal'
		$(htmlElementID).easyAutocomplete(options);
		$(htmlElementID).focus(function()
		{
			$(saveButton).prop('disabled', true);
		});
		$(htmlElementID).focusout(function()
		{
			$(saveButton).prop('disabled', false);
		});
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
})('');