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
				getContentList: 'https://test-services.pri.org/admin/content/list',
				getContentItem: {
					story: 'https://test-services.pri.org/admin/story/fetch',
					episode: 'https://test-services.pri.org/admin/episode/fetch'
				}
			}
		},
		chosenLinks = [],
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

			$linkItem.data('link-data', linkData);

			$linkItem.find('.' + removeLinkClass).on('click', function() {
				var $this = $(this);
				var $li = $this.closest('.' + linkClass);

				$li.remove();
			});

			return $linkItem;
		},
		generateLinkInputHtml = function(linkData){
			var linkIndex = typeof index === 'undefined' ? $('.' + linkClass).length : index;

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
					return self.options.httpPaths.getContentList;
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
							console.log('Adding link...');
							$linkItem = generateLinkItem(itemData);
							$linkList.append($linkItem);
						}

						$input.val('');
					}
				}
			};

			$input.easyAutocomplete(options);

			$input.closest('.easy-autocomplete').removeAttr('style');
		},
		renderChosenLinks = function() {
			for(var i = 0, m = chosenLinks.length; i < m; i++)
			{
				console.log('Create link:', chosenLinks[i]);

				// $linkItem = generateLinkInputHtml(self.model.links[i], linkClass, removeLinkClass)
				// $linkList.append();

				// initAutoComplete('#' + self.model.links[i].storyId, self);
			}
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
		var adjustment, placeholderHeight;

		initAutoComplete(addLinkInputId, self, $el);

		$linkList.sortable({
			group: 'links',
			itemSelector: '.' + linkClass,
			draggedClass: 'related-link-dragged',
			placeholderClass: dragPlaceholderClass,
			placeholder: '<div class="' + dragPlaceholderClass + '"></div>',
			nested: false,
			onDragStart: function ($item, container, _super) {
				var offset = $item.offset(),
						pointer = container.rootGroup.pointer;

				adjustment = {
					left: pointer.left - offset.left,
					top: pointer.top - offset.top
				};

				placeholderHeight = $item.outerHeight();

				_super($item, container);
			},
			onDrag: function ($item, position) {
				$item.css({
					left: position.left - adjustment.left,
					top: position.top - adjustment.top
				});
			},
			afterMove: function($placeholder) {
				$placeholder.height(placeholderHeight);
			}
		});
	};

	relatedLinkEmbed.prototype.clearForm = function($el){
		var self = this;
		self.parent.clearForm($el, self);

		$el.find(linkListId).empty();
	};

	relatedLinkEmbed.prototype.getModelFromForm = function($el){
		var self = this;
		self.parent.getModelFromForm($el, self);
		self.model.links = [];

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

		$progress.width(0);
		$progress.parent().slideDown(0);

		console.log('populateFormWithModel::self', self);

		for(i = 0, m = self.model.links.length; i < m; i++)
		{

			console.log('populateFormWithModel::link', self.model.links[i]);

			if(self.model.links[i])
			{
				totalLinks++;

				promise = EntityEmbed.apiService.get({
					path: self.options.httpPaths.getContentItem[self.model.links[i].object_type],
					data: {
						object_id: self.model.links[i].object_id
					}
				});

				promise.done((function(index) {
					return function(respData) {
						totalLoaded++;

						percentLoaded = totalLoaded / totalLinks * 100;

						console.log('percentLoaded', percentLoaded);

						$progress.css({
							width: percentLoaded + '%'
						});

						if(respData.status === 'OK')
						{
							linksData[index] = respData.response;
						}
					};
				})(i));

				deferreds.push(promise);
			}
		}

		$.when.apply($, deferreds).done(function(){
			var $linkItem;

			$progress.parent().delay(400).slideUp(500);

			for(var i = 0, m = linksData.length; i < m; i++)
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

})('');