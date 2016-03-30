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
			object_type: 'related-link',
			validationOptions: {
				rules: {
					title: "required",
				}
			}
		};
		
	var psuedoGuids = [];

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
	relatedLinkEmbed.prototype.orderIndex = 10;

	relatedLinkEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			displayTitle: null,
			links: []
		};
	};

	// This provides the functionality/styling for the type-ahead feature, allowing the user to only
	//  begin typing the title of a story and have a dropdown list of stories displayed to them
	//  based on their input.
	var initAutoComplete = function(htmlElementId, self){
		// TODO: Make function take in user input to pass to API

		EntityEmbed.apiService.get({
			path: self.options.httpPaths.get,
			// TODO: Object id is currently hard-coded, this needs to be changed.
			data: {
				object_id: 'dbbc5fc38d2e4d359572743d2c00d581',
				auth_token: 'abc123'
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

		// Retrieve all urls from the form
		for(var i = 0; i < psuedoGuids.length; i++)
		{
			var urlForms = $el.find('#'+psuedoGuids[i]);
			self.model.links.push(urlForms[0].value);
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
			psuedoGuids.push(pseudoGuid);

			$linkList.append(
				'<div class="' + linkClass + '">' + 
					'<div class="embed-modal-form">' +
						'<input id="' + pseudoGuid + '" type="url" placeholder="link url" class="embed-modal-form-control" required>' +
					'</div>' + 
					'<button class="' + removeLinkClass + '">' + 
						'<i class="fa fa-minus"></i>' + 
					'</button>' + 
				'</div>'
			);

			// TODO: Call initAutoComplete only after the user has stopped typing for a period of time
			// This is smelly code
			$('#' + pseudoGuid).keydown(function(){
				$('#' + pseudoGuid).keydown(initAutoComplete('#' + pseudoGuid, self));
			});
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

})('', EntityEmbedTypes);