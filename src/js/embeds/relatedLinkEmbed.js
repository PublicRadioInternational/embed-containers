var EntityEmbed = EntityEmbed || {};

(function(){

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
			viewPath: 'modal_relatedLink.html',
			displayName: 'Related Link',
			object_type: 'related-link',
			validationOptions: {
				rules: {
					title: 'required',
					linkInput: 'atLeastOne'
				}
			},
			httpPaths:{
				getContentList: 'admin/content/list',
				getContentItem: {
					story: 'admin/story/fetch',
					episode: 'admin/episode/fetch'
				}
			}
		},
		linkListId = '#related-link-list',
		addLinkInputId = '#add-link-eac',
		dragLinkClass = 'drag-link-btn',
		dragPlaceholderClass = 'related-link-placeholder',
		progressBarId = '#related-links-progress',
		removeLinkClass = 'remove-link-btn',
		linkClass = 'related-link-url',
		generateLinkItem = function(linkData, index) {
			var linkHtml = generateLinkInputHtml(linkData);
			var $linkItem = $(linkHtml);

			// Attach data to element
			$linkItem.data('link-data', linkData);

			// Add click hanlder to remove btn
			$linkItem.find('.' + removeLinkClass).on('click', function() {
				var $this = $(this);
				var $li = $this.closest('.' + linkClass);

				$li.remove();
			});

			return $linkItem;
		},
		generateLinkInputHtml = function(linkData){
			return	'<div class="' + linkClass + '">' +
						'<div class="related-link-control">' +
							'<span class="' + dragLinkClass + '">' +
								'<i class="fa fa-bars"></i>' +
							'</span>' +
						'</div>' +
						'<div class="related-link-title">' +
							linkData.title +
						'</div>' +
						'<div class="related-link-control">' +
							'<button class="' + removeLinkClass + '">' +
								'<i class="fa fa-minus"></i>' +
							'</button>' +
						'</div>' +
					'</div>';
		},
		//	This provides the functionality/styling for the type-ahead feature, allowing the user to only
		//	begin typing the title of a story and have a dropdown list of stories displayed to them
		//	based on their input. This function also takes into account validation of the modal form.
		initAutoComplete = function (inputId, self, $el){
			var rgxDevEnv = /^[^.]*staging[^.]*\.|\.dev$/;
			var isDevEnv = rgxDevEnv.test(window.location.host);
			var debug = 0;
			var ajaxData = {
				auth_token: EntityEmbed.apiService.getAuthToken(),
			};
			var $input = $el.find(inputId);


			if(isDevEnv)
			{
				ajaxData.debug = 1;
			}

			var options = {
				ajaxSettings: {
					dataType: 'json',
					method: 'POST',
					data: ajaxData
				},
				requestDelay: 600,
				url: function(phrase) {
					ajaxData.title = phrase;
					return EntityEmbed.apiService.getDomainName() + self.options.httpPaths.getContentList;
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
					data.title = $input.val();
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
						var itemData = $input.getSelectedItemData();
						var objectId = itemData.object_id;
						var $linkList = $el.find(linkListId);
						var $linkItem;

						if (!!itemData.object_id)
						{
							$linkItem = generateLinkItem(itemData);
							$linkList.append($linkItem);
						}

						$input.val('');
					}
				}
			};

			$input.easyAutocomplete(options);

			$input.closest('.easy-autocomplete').removeAttr('style');
		};

	/**
	 * Private function to get a clopy of an embed type object by object_type value.
	 * @param	{String} objectType API object_type name
	 * @return {Object}						Initialized embed type object from EntityEmbed.currentEmbedTypes.
	 */
	function getEmbedTypeByObjectType(objectType) {
		var embedType = $.grep(EntityEmbed.currentEmbedTypes, function(et){
			return et.options.object_type == objectType;
		})[0];

		return embedType && $.extend(true, {}, embedType);
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

	relatedLinkEmbed.prototype.initModal = function($el){
		var self = this;
		var $linkList = $el.find(linkListId);
		var $progress = $el.find(progressBarId);
		var adjustment, placeholderHeight;

		// Make sure any links show for previous related links modal are rmoved
		$linkList.empty();

		// Don't need to show progress on new or cleared forms
		$progress.parent().hide();

		// Initialize Add Link field's Auto Complete functionality
		initAutoComplete(addLinkInputId, self, $el);

		// Make link list sortabel
		$linkList.sortable({
			axis: 'y',
			handle: '.' + dragLinkClass,
			items: '.' + linkClass,
			placeholder: dragPlaceholderClass,
			start: function (event, ui) {
				ui.placeholder.height(ui.helper.outerHeight());
			}
		});

		$.validator.addMethod('atLeastOne', function(value, element){
			return $('.related-link-url').length > 0;
		}, $.validator.format('One link is required.'));
	};

	relatedLinkEmbed.prototype.clearForm = function($el){
		var self = this;
		self.parent.clearForm($el, self);

		// Remove children from link list
		$el.find(linkListId).empty();
	};

	relatedLinkEmbed.prototype.getModelFromForm = function($el){
		var self = this;
		self.parent.getModelFromForm($el, self);
		delete self.model.linkInput;
		self.model.links = [];

		// Pull data from all link elements and add to model just the properties need to look it up again
		$el.find('.' + linkClass).each(function() {
			var $this = $(this);
			var linkData = $this.data('link-data');

			self.model.links.push({
				object_id: linkData.object_id,
				object_type: linkData.object_type
			});
		});
	};

	relatedLinkEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		var $linkList = $form.find(linkListId);
		var $progress = $form.find(progressBarId);
		var $linkItem, i, m, promise, fetchPath;
		var deferreds = [];
		var linksData = [];
		var totalLinks = 0;
		var totalLoaded = 0;
		var percentLoaded = 0;

		self.parent.populateFormWithModel($form, self);

		// Check to see if model has links
		if (!self.model.links.length)
		{
			// exit now. don't need to load anything
			return;
		}

		// Reset progress elements size and visiblity
		$progress.width(0);
		$progress.parent().slideDown(0);

		for(i = 0, m = self.model.links.length; i < m; i++)
		{
			// Make sure link data at this index exists
			if(self.model.links[i])
			{
				// Increment our counter for links we are loading data for
				totalLinks++;

				// Get links data from API
				promise = EntityEmbed.apiService.get({
					path: self.options.httpPaths.getContentItem[self.model.links[i].object_type],
					data: {
						object_id: self.model.links[i].object_id
					}
				});

				// Handle API resonse
				promise.done((function(index) {
					return function(respData) {
						// Increment count of finished link loads, no matter the status of the request
						totalLoaded++;

						// Update progress bar
						percentLoaded = totalLoaded / totalLinks * 100;
						$progress.css({
							width: percentLoaded + '%'
						});

						if(respData.status === 'OK')
						{
							// Request returned data. Add to model at the correct index
							linksData[index] = respData.response;
						}
					};
				})(i));

				deferreds.push(promise);
			}
		}

		$.when.apply($, deferreds).done(function(){
			var $linkItem, i, m;

			$progress.parent().delay(400).slideUp(500);

			// Compact linksData array
			for (i = 0, m = linksData.length; i < m; i++)
			{
				if(!linksData[i])
				{
					linksData.splice(i,1);
				}
			}

			// Create link elements in link list
			for(i = 0, m = linksData.length; i < m; i++)
			{
				$linkItem = generateLinkItem(linksData[i]);
				$linkList.append($linkItem);
				$linkItem.hide().delay(1000).slideDown(150);
			}
		});
	};

	// TODO : make this the default styling for genericEmbed
	relatedLinkEmbed.prototype.parseForEditor = function(){
		var self = this;

		return '<div class="relatedLink-embed">' +
					'<div class="relatedLink-embed-uiText"> <strong>Embed Type:</strong> Related Link </div>' +
					'<div class="relatedLink-embed-uiText"> <strong>Title:</strong> ' + self.model.title + '</div>' +
					'<div class="relatedLink-embed-uiText"> <strong>Links:</strong> ' + self.model.links.length + '</div>' +
				'</div>';
	};

})();