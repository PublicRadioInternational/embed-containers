var EntityEmbed = EntityEmbed || {};

;(function(){
	// Creates an embed modal using the embedModalDefaults.js and any options that a user specifies
	$.embed_modal_create = function(options){
		var	defaults = {
			modalOptions: {
			},							//see modal.js to customize if embedModalDefaults.js is insufficient
			modalScope: {								// default scope to pass to the modal
				$embedTypeSelect: null,					// jQuery element for the embed type dropdown (<select> element)
				$modalBody: null,						// jQuery element for the modal body container element
				$abortEl: null							// jQuery element for the modal abort button
			},
			$modalEl: null,								// element that modal.js establishes a ctrl on
			modalHtmlLocation: 'modal/',				// file path to the modal HTML folder
			modalContainer: 'body',						// selector string for the element which will contain the modal
			modalFileName: 'modal_main.html',			// file name of the modal HTML file
			modalElId: 'embed-modal',
			modalBody: '.embed-modal-body',
			abortEl: '#btn-abort-modal',
			embedTypeSelect: '#select-embed-type',
			authToken: null,							// auth_token for the apiService
			domainName: null,							// domainName for the apiService
			embedTypes:{								// specify all embed types and their options here
				image:{},								// TODO : allow global specification of embed types without hardcoding defaults
				slideshow: {},
				video:{},
				audio:{},
				twitter:{},
				instagram:{},
				facebook:{},
				relatedLink:{},
				externalLink:{},
				globalBuzz:{},
				newsletterSubscribe:{},
				iframe:{},
				customText:{}
			}
		};
		var embedTypes = [];
		var modalScope = {};
		var promise = $.Deferred();
		var $modalContainer, $modalEl, $modalElTemp, templatePath;

		function setUpModal(){
			var embedModalDefaults;

			// we cant specify certain elements as default options
			// because they may not be loaded until after the configured main tmeplate files is loaded
			// so if they are null, select them here

			// Embed Type Select Input
			if (!modalScope.$embedTypeSelect || !modalScope.$embedTypeSelect.length)
			{
				modalScope.$embedTypeSelect = $modalEl.find(options.embedTypeSelect);
			}

			// Modal Body Container
			if (!modalScope.$modalBody || !modalScope.$modalBody.length)
			{
				modalScope.$modalBody = $modalEl.find(options.modalBody);
			}

			// Modal Abort Button
			if (!options.modalOptions.$abortEl || !options.modalOptions.$abortEl.length)
			{
				options.modalOptions.$abortEl = $modalEl.find(options.abortEl);
			}

			embedModalDefaults = new EntityEmbed.embedModalDefaults();

			options.modalOptions = $.extend(true, {}, embedModalDefaults, options.modalOptions);

			// Setup modal on $modalEl with updated modalOptions and modalScope
			$modalEl.modal(options.modalOptions, modalScope);

			$modalEl.hide();

			// Modal elements is ready
			promise.resolve();
		};

		// Check our modalExists flag
		if(EntityEmbed.modalExists)
		{
			// Already created modal.
			// Resolve and return promise.
			promise.resolve();
			return promise;
		}

		// Extend default options with passed options
		options = $.extend(true, {}, defaults, options);

		//// [1] Init embed types
		// Init each embed type and add to local embedTypes array
		for (var embedName in EntityEmbed.embedTypes)
		{
			if (!!options.embedTypes[embedName])
			{
				var embedObject = new EntityEmbed.embedTypes[embedName](options.embedTypes[embedName]);
				embedTypes.push(embedObject);
			}
		}

		// Sort mebed types by their orderIndex
		embedTypes.sort(function(l, r){
			return l.orderIndex - r.orderIndex;
		});

		// Attach embedTypes array to our various configs for use later on
		modalScope.embedTypes = embedTypes;
		EntityEmbed.currentEmbedTypes = embedTypes;
		//// END [1]

		//// [2] Establish modal containers
		// Extend options modalScope with local modalScope
		modalScope = $.extend(true, {}, options.modalScope, modalScope);
		modalScope.modalHtmlLocation = options.modalHtmlLocation;

		// Establish modal container element
		$modalContainer = $(options.modalContainer);

		// Get modal element from:
		// 	1. options object
		// 	2. Query modal container for element with configured id
		$modalEl = options.$modalEl && options.$modalEl.length ? options.$modalEl : $modalContainer.find('#' + options.modalElId);

		if(!$modalEl.length)
		{
			// Generate a modal element when one was not found
			$modalEl = $('<div class="embed-modal" id="' + options.modalElId +'"></div>');
			// Append modal element to modal container
			$modalContainer.append($modalEl);
		}

		// Add reference to $modalEl to global EntityEmbed
		EntityEmbed.$embedModal = $modalEl;
		EntityEmbed.modalExists = true;

		if (!!options.authToken)
		{
			EntityEmbed.apiService.setAuthToken(options.authToken);
		}
		if (!!options.domainName)
		{
			EntityEmbed.apiService.setDomainName(options.domainName);
		}

		// Check to see if we need to load anything into $modalEl
		if(options.modalFileName)
		{
			templatePath = options.modalHtmlLocation + options.modalFileName;

			// Check to if there is a cached template for this template path
			if(EntityEmbed.templateCache && EntityEmbed.templateCache[templatePath])
			{
				// Set $modalEl html to the value of the template cache
				$modalEl.html( EntityEmbed.templateCache[templatePath] );

				setUpModal();
			}
			else
			{
				$modalEl.load(templatePath, function(responseText, textStatus, xhr){

					console.log('embed modal load completed with status: ' + textStatus);

					if (textStatus === 'error')
					{
						promise.reject();
						return;
					}

					// Add template to template cache
					EntityEmbed.templateCache = EntityEmbed.templateCache || {};
					EntityEmbed.templateCache[templatePath] = $(this).html();

					setUpModal();
				});
			}
		}
		else
		{
			setUpModal();
		}
		// END [2]

		return promise;
	};

	function embedModalOpenInternal(options){
		var mType;
		if (!!options.id)
		{
			mType = EntityEmbed.embedModalTypes.edit;
		}
		else if (!!options.embedTypeStr)
		{
			if (options.selectExisting)
			{
				mType = EntityEmbed.embedModalTypes.selectExistingSingle;
			}
			else
			{
				mType = EntityEmbed.embedModalTypes.addSingle;
			}
		}
		else
		{
			if (options.selectExisting)
			{
				mType = EntityEmbed.embedModalTypes.selectExisting;
			}
			else
			{
				mType = EntityEmbed.embedModalTypes.add;
			}
		}

		var scope = {
			$currentEditorLocation: options.$currentEditorLocation,
			modalType: mType,
			embedId: options.id,
			embedType: options.embedTypeStr
		};

		return EntityEmbed.$embedModal.openModal(scope);
	};

	$.embed_modal_open = function(options){
		var defaults = {
			$currentEditorLocation: $(''),		// selector for the current editor location (can be null or empty)
			embedTypeStr: null,					// string for the embed type (match object_type field) (can be null)
												//		null - add any
												//		not null - add single or edit (if id is also specified)
			id: null,
			selectExisting: false
		};
		var promise = $.Deferred();

		$.embed_modal_create(options)
			.always(function(){
				embedModalOpenInternal($.extend(true, {}, defaults, options.modalOptions || {}))
					.done(function(data) {
						promise.resolve(data);
					})
					.fail(function() {
						promise.reject();
					});
			});

		return promise;
	};
})();