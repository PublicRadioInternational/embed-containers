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
					title: 'required',
				}
			},
			httpPaths:{
				getRelatedStories: 'https://test-services.pri.org/admin/content/list'
			}
		},
		chosenLinks = [],
		linkListId = '#related-link-list',
		addLinkBtnId = '#add-link-btn',
		removeLinkClass = 'remove-link-btn',
		linkClass = 'related-link-url',
		numLinks = 0,
		generateId = function () {	// generates a pseudo guid (not guatanteed global uniqueness)
			var seg = function()
			{
				return Math.floor((1 + Math.random()) * 0x10000)
					.toString(16)
					.substring(1);
			}
			return seg() + seg() + '-' + seg() + '-' + seg() + '-' +
					seg() + '-' + seg() + seg() + seg();
		},
		generateLinkInputHtml = function(id, linkClass, removeLinkClass){
			return	'<div class="' + linkClass + '">' + 
						'<div class="embed-modal-form">' +
							'<input id="' + id + '" type="text" placeholder="Begin typing story title" class="embed-modal-form-control" required/>' +
						'</div>' + 
						'<button class="' + removeLinkClass + '">' + 
							'<i class="fa fa-minus"></i>' + 
						'</button>' + 
					'</div>';
		},
		//  This provides the functionality/styling for the type-ahead feature, allowing the user to only
		//  begin typing the title of a story and have a dropdown list of stories displayed to them
		//  based on their input. This function also takes into account validation of the modal form.
		initAutoComplete = function (inputId, self){
			var rgxDevEnv = /^[^.]*staging[^.]*\.|\.dev$/;
			var isDevEnv = rgxDevEnv.test(window.location.host);
			var debug = 0;
			if(isDevEnv)
			{
				debug = 1;
			}

			var options = {
				ajaxSettings: {
					dataType: 'json',
					method: 'POST',
					data: {
						auth_token: EntityEmbed.apiService.getAuthToken(),
						debug: debug
					}		
				},
				requestDelay: 600,
				url: function(phrase) {
					return self.options.httpPaths.getRelatedStories;
				},
				listLocation: function(listOfData){
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
				preparePostData: function(data) {
					data.title = $(inputId).val();
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
					onChooseEvent: function(){ // store the users story selection
						var objectId = $(inputId).getSelectedItemData().object_id;
						var storyTitle = $(inputId).getSelectedItemData().title;
						if (!!objectId)
						{
							chosenLinks[objectId] = storyTitle;
						}
					}
				}
			};

			$(inputId).easyAutocomplete(options);

			// dont allow user to enter text that is not a story
			$(inputId).on('blur', function(){
				if ($(inputId).getSelectedItemData() == -1)
				{
					$(inputId).val('');	
				}
			});
		};

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

		$el.find(linkListId).children().remove();

		chosenLinks = [];
	};

	relatedLinkEmbed.prototype.getModelFromForm = function($el){
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

		// Save all of the links ids
		for(var linkId in chosenLinks)
		{
			self.model.links.push(linkId);
		}
	};

	relatedLinkEmbed.prototype.populateFormWithModel = function($form){
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

		var $linkList = $form.find(linkListId);
		var $addLinkBtn = $form.find(addLinkBtnId);

		for(var linkId in self.model.links)
		{
			$linkList.append(generateLinkInputHtml(linkId, linkClass, removeLinkClass));
			$form.find('#' + linkId).val(self.model.links[linkId].title);

			initAutoComplete('#' + pseudoGuid, self);
		}
	};

	relatedLinkEmbed.prototype.initModal = function($el){
		var self = this;
		var $linkList = $el.find(linkListId);
		var $addLinkBtn = $el.find(addLinkBtnId);

		window.onbeforeunload = function(e) {
			var title = $el.find('input[name="title"]').val();
			if (e.currentTarget.location.search.indexOf(title) !== -1)
			{
				return 'HOLD UP, WAIT A MINUTE!\r\n' + 
					'\teasyAutoComplete is trying to reload the page for some reason\r\n' + 
					'\twe don\'t know why, but we are trying to fix this issue';
			}
		};

		$addLinkBtn.click(function(){
			var pseudoGuid = generateId();

			$linkList.append(generateLinkInputHtml(pseudoGuid, linkClass, removeLinkClass));

			initAutoComplete('#' + pseudoGuid, self);
		});

		$el.on('click', '.' + removeLinkClass, function(){
			$(this).closest('.' + linkClass).remove();
		});
	};

	// TODO : make this the default styling for genericEmbed
	relatedLinkEmbed.prototype.parseForEditor = function(){
		var self = this;

		return '<div class="relatedLink-embed">' +
					'<div class="relatedLink-embed-uiText"> <strong>Embed Type:</strong> Related Link </div>' +
					'<div class="relatedLink-embed-uiText"> <strong>Title:</strong> ' + self.model.title + '</div>' +
				'</div>';
	};

})('');