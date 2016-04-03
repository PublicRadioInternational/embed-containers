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
		self.parent.populateFormWithModel($form);

		var linkClass = 'related-link-url';
		var $linkList = $form.find('#related-link-list');
		var $addLinkBtn = $form.find('#add-link-btn');

		for(var i = 0; i < self.model.links.length; i++)
		{
			$addLinkBtn.click();
			$form.find('.' + linkClass).last().val(self.model.links[i].title);
		}
	};

	var runAutoComplete = function (htmlElementID, linkNumber, self){
		var rgxDevEnv = /^[^.]*staging[^.]*\.|\.dev$/;
		var isDevEnv = rgxDevEnv.test(window.location.host);
		var debug = 0;
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
				onClickEvent: function(storyObject)
				{
					var objectId = $(htmlElementID).getSelectedItemData().object_id;
					var storyTitle = $(htmlElementID).getSelectedItemData().title;
					var linkLocation = linkNumber - 1;
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