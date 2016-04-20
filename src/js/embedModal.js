var EntityEmbed = EntityEmbed || {};

;(function(){
	// Creates an embed modal using the embedModalDefaults.js and any options that a user specifies
	$.embed_modal_create = function(options){
		var	defaults = {
			modalOptions: {},			//see modal.js to customize if embedModalDefaults.js is insufficient
			modalScope: {				// default scope to pass to the modal
				$embedTypeSelect: null,	// selector for the embed typoe dropdown (<select> element)
				$modalBody: null		// selector for the modal body container element
			},
			$modalEl: null,				// select for the entire modal (element that modal.js establishes a ctrl on)
			embedTypes:{				// specify all embed types and their options here
				image:{},				//		TODO : allow global specification without hardcoding defaults
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

		defaultModalSelectors = function(){
			// we cant specify certain elements as default options
			// because they are not yet loaded into the DOM when this script runs
			// so if they are null, select them here

			if (!defaults.$modalEl)
			{
				defaults.$modalEl = $('#embed-modal');
			}

			if (!defaults.modalScope.$embedTypeSelect)
			{
				defaults.modalScope.$embedTypeSelect = $('#select-embed-type');
			}

			if (!defaults.modalScope.$modalBody)
			{
				defaults.modalScope.$modalBody = $('.embed-modal-body');
			}

			if (!defaults.modalOptions.$abortEl)
			{
				defaults.modalOptions.$abortEl = $('#btn-abort-modal');
			}
		};

		defaultModalSelectors();
		options = $.extend(true, {}, defaults, options);

		var embedTypes = [];
		for (var embedName in EntityEmbed.embedTypes)
		{
			if (!!options.embedTypes[embedName])
			{
				var embedObject = new EntityEmbed.embedTypes[embedName](options.embedTypes[embedName]);
				embedTypes.push(embedObject);
			}
		}

		embedTypes.sort(function(l, r){
			return l.orderIndex - r.orderIndex;
		});

		var finalModalOptions = {};
		var defaultModalOptions = new EntityEmbed.embedModalDefaults();
		if (!!options.modalOptions)
		{
			finalModalOptions = $.extend(true, {}, defaultModalOptions, options.modalOptions);
		}
		else
		{
			finalModalOptions = defaultModalOptions;
		}

		var modalScope = {
			embedTypes: embedTypes
		};

		modalScope = $.extend(true, {}, options.modalScope, modalScope);

		options.$modalEl.modal(finalModalOptions, modalScope);

		EntityEmbed.$embedModal = options.$modalEl;
		EntityEmbed.currentEmbedTypes = embedTypes;
		return EntityEmbed.$embedModal;
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
		

		if (!EntityEmbed.$embedModal)
		{
			$.embed_modal_create({
				modalOptions: options
			});
		}

		options = $.extend(true, {}, defaults, options);

		var self = this;
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
})();