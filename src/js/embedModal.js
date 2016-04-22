var EntityEmbed = EntityEmbed || {};

;(function(){
	// Creates an embed modal using the embedModalDefaults.js and any options that a user specifies
	$.embed_modal_create = function(options){
		var	defaults = {
			modalOptions: {},							//see modal.js to customize if embedModalDefaults.js is insufficient
			modalScope: {								// default scope to pass to the modal
				$embedTypeSelect: null,					// selector for the embed typoe dropdown (<select> element)
				$modalBody: null						// selector for the modal body container element
			},
			$modalEl: null,								// select for the entire modal (element that modal.js establishes a ctrl on)
			modalContainer: 'body',						// selector string for the element which will contain the modal
			modalHtmlLocation: 'modal/',				// file path to the modal HTML folder
			modalFileName: 'modal_main.html',			// file name of the modal HTML file
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

		defaultModalSelectors = function(ops){
			// we cant specify certain elements as default options
			// because they are not yet loaded into the DOM when this script runs
			// so if they are null, select them here

			if (!ops.modalScope.$embedTypeSelect || ops.$embedTypeSelect.length() == 0)
			{
				ops.modalScope.$embedTypeSelect = $('#select-embed-type');
			}

			if (!ops.modalScope.$modalBody || ops.$modalBody.length() == 0)
			{
				ops.modalScope.$modalBody = $('.embed-modal-body');
			}

			if (!ops.modalOptions.$abortEl || ops.$abortEl.length() == 0)
			{
				ops.modalOptions.$abortEl = $('#btn-abort-modal');
			}
		};

		options = $.extend(true, {}, defaults, options);
		if (!options.$modalEl || options.$modalEl.length() == 0)
		{
			options.$modalEl = $('#embed-modal');
		}
		$(options.modalContainer).append('<div id="embed-modal"></div>');

		var promise = $.Deferred();

		options.$modalEl.load(options.modalHtmlLocation + options.modalFileName, function(responseText, textStatus, xhr){
			defaultModalSelectors(options);
			
			console.log('embed modal load completed with status: ' + textStatus);
			if (textStatus === 'error')
			{
				return;
			}

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
			promise.resolve();
		});
		return promise;
	};

	function embedModalOpen(options){
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
		
		if (!EntityEmbed.$embedModal)
		{
			$.embed_modal_create({
				modalOptions: options
			}).then(function(){
				return embedModalOpen($.extend(true, {}, defaults, options));
			});
		}
	};
})();