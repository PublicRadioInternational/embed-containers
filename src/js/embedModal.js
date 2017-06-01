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
			completeEl: '#btn-save-modal',
			embedTypeSelect: '#select-embed-type',
			authToken: null,							// auth_token for the apiService
			domainName: null,							// domainName for the apiService
			embedTypes:{								// specify all embed types and their options here
				image:{},								// TODO : allow global specification of embed types without hardcoding defaults
				slideshow: {},
				video:{},
				audio:{},
				audioProgram: {},
				twitter:{},
				instagram:{},
				facebook:{},
				relatedLink:{},
				externalLink:{},
				newsletterSubscribe:{},
				iframe:{},
				customText:{}
			}
		};
		var embedTypes = [];
		var promise = $.Deferred();
		var modalScope, $modalContainer, $modalEl, $modalElTemp, templatePath, opts, parentModalEmbedType;

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

			// Modal Complete Button
			if (!options.modalOptions.$completeEl || !options.modalOptions.$completeEl.length)
			{
				options.modalOptions.$completeEl = $modalEl.find(options.completeEl);
			}

			embedModalDefaults = new EntityEmbed.embedModalDefaults();

			options.modalOptions = $.extend(true, {}, embedModalDefaults, options.modalOptions);

			// Setup modal on $modalEl with updated modalOptions and modalScope
			$modalEl.modal(options.modalOptions, modalScope);

			$modalEl.hide();

			// Modal elements is ready
			promise.resolve($modalEl);
		};

		// Extend default options with passed options
		opts = $.extend(true, {}, defaults, options);

		// Get parent modals current embed type
		if(opts.modalOptions && opts.modalOptions.parentModal)
		{
			parentModalEmbedType = opts.modalOptions.parentModal.scope.currentEmbedType;
		}

		// Make sure to only use embedTypes configed on options, if applicable.
		// Don't want to include all defaults in case this is a submodal, to prevent infinit init loop.
		opts.embedTypes = !!options && options.embedTypes;

		// if no options were configured, use the default types
		if(!opts.embedTypes)
		{
			opts.embedTypes = defaults.embedTypes;
		}

		// Remove parent modals embed type from local embed types to prevent modal-seption.
		if(!!parentModalEmbedType)
		{
			delete opts.embedTypes[parentModalEmbedType.name];
		}

		options = opts;

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

		modalScope = $modalEl.data('scope');

		// Check our modalExists flag
		if(modalScope)
		{
			// Already created modal.
			// Resolve and return promise.
			promise.resolve($modalEl);
			return promise;
		}

		modalScope = {
			$modalEl: $modalEl
		};

		//// [1] Init embed types
		// Init each embed type and add to local embedTypes array
		for (var embedName in EntityEmbed.embedTypes)
		{
			if (!!options.embedTypes[embedName])
			{
				var embedObject = new EntityEmbed.embedTypes[embedName](options.embedTypes[embedName]);
				embedTypes.push(embedObject);

				if(options.modalOptions.embedTypeStr && options.modalOptions.embedTypeStr === embedName)
				{
					modalScope.currentEmbedType = embedObject;
				}
			}
		}

		// Sort mebed types by their orderIndex
		embedTypes.sort(function(l, r){
			return l.orderIndex - r.orderIndex;
		});

		// Attach embedTypes array to our various configs for use later on
		modalScope.embedTypes = embedTypes;
		//// END [1]

		//// [2] Establish modal containers
		// Extend options modalScope with local modalScope
		modalScope = $.extend(true, {}, options.modalScope, modalScope);
		modalScope.modalHtmlLocation = options.modalHtmlLocation;

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

	function embedModalOpenInternal($embedModal, options){
		var mType;

		if (!!options.id || options.embedData)
		{
			mType = EntityEmbed.embedModalTypes.edit;
		}
		else if (!!options.embedTypeStr && (typeof options.embedTypeStr === 'string' || options.embedTypeStr.length === 1))
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
			addOnly: options.addOnly,
			embedId: options.id,
			embedType: options.embedTypeStr,
			parentModal: options.parentModal,
			buffered: options.bufferData,
			embedData: options.embedData,
			headerText: options.headerText
		};

		return $embedModal.openModal(scope);
	};

	$.embed_modal_open = function(options){
		var defaults = {
			$currentEditorLocation: $(''),		// selector for the current editor location (can be null or empty)
			embedTypeStr: null,					// string or array of strings for the embed type (match object_type field) (can be null)
												//		null - add any
												//		string - add single or edit (if id is also specified)
												//		array - add any of supplied embed types
			id: null,
			selectExisting: false,
			addOnly: false,
			embedTypeSelectOptions: null
		};
		var promise = $.Deferred();

		$.embed_modal_create(options)
			.done(function($embedModal){
				embedModalOpenInternal($embedModal, $.extend(true, {}, defaults, options.modalOptions || {}))
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