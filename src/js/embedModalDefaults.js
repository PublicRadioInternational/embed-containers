var EntityEmbed = EntityEmbed || {};

;(function(){

	// MODAL TYPE ENUM
	EntityEmbed.embedModalTypes = {
		add: 0,
		addSingle: 1,				// this is for adding a specific embed type
		edit: 2,
		selectExisting: 3,
		selectExistingSingle: 4		// this is for selecting a specific embed type
	};

	// PRIVATE
	var embedTypes_stale = undefined; // this is for the jquery plugin embedModalOpen_edit func (see bottom)
	var isSaving = false; //this determines when a modal is being saved
	var embedModalSelectors = {
			buttons: {
				saveEmbed: '#btn-save-modal', // saves the modal
				abortModal: '#btn-abort-modal', // aborts (cancels) the modal
				showSelectExisting: '#btn-show-select-existing', // shows the select-existing-embed view
				cancelSelectExisting: '#btn-cancel-select-existing' // cancels selection of existing embed
			},
			containers: {
				createNewEmbed: '#embed-modal-create-new', // contains all the views for creating a new embed
				selectExistingEmbed: '#embed-modal-select-existing', // contains views for selecting an existing embed
				createButtons: '#embed-modal-buttons-create', // contains buttons shown in the create new embed view
				selectButtons: '#embed-modal-buttons-select' // contains buttons shown in the select existing embed view
			},
			elements: {
				saveSpinner: '#embed-modal-spinner',
				headerText: '.header-title'
			}
		},
		gatherModalElements = function(scope, $el) {
			function gather(groupKey) {
				scope[groupKey] = scope[groupKey] || {};
				for (key in embedModalSelectors[groupKey])
				{
					if(embedModalSelectors[groupKey].hasOwnProperty(key))
					{
						scope[groupKey][key] = $(embedModalSelectors[groupKey][key], $el);
					}
				}
			}

			for (groupKey in embedModalSelectors)
			{
				if(embedModalSelectors.hasOwnProperty(groupKey))
				{
					gather(groupKey);
				}
			}
		},
		toggleEditorTyping = function(scope, toggleCmd){
			// enable/disable typing in the editor by finding the first class
			// TODO : find a more generic solution to this
			$('.editable').attr('contenteditable', toggleCmd);
		},
		isFormDirty = function($form){
			var isDirty = false;

			$form.find(':input:not(:button):not([type=hidden])').each(function () {
				var formField = this;

				// check text and textarea forms
				if ((formField.type == 'text' || formField.type == 'textarea' || formField.type == 'hidden') && formField.defaultValue != formField.value) {
					isDirty = true;
					return false;
				}

				// check radio and checkbox forms
				if ((formField.type == 'radio' || formField.type == 'checkbox') && formField.defaultChecked != formField.checked)
				{
					isDirty = true;
					return false;
				}

				// check select one and select multiple forms
				if ((this.type == 'select-one' || this.type == 'select-multiple')) {
					for (var x = 0; x < this.length; x++) {
						if (this.options[x].selected != this.options[x].defaultSelected) {
							hasChanges = true;
							return false;
						}
					}
				}

			});
			return isDirty;
		},
		setModalView = function(scope, embedType){
			var headerText, et, i, m;
			var limitEmbedOptions = typeof embedType !== 'string';
			var currentEmbedTypeName = limitEmbedOptions ? embedType[0] : embedType;

			function addEmbedTypeOption(et) {
				scope.$embedTypeSelect.append('<option value="' + et.options.object_type + '">' + et.options.displayName + '</option>');
			}

			if (!embedType)
			{
				return;
			}

			scope.isAdd = scope.modalCtrl.isAdd = scope.modalType === EntityEmbed.embedModalTypes.add ||
						 scope.modalType === EntityEmbed.embedModalTypes.addSingle;

			scope.isSingle = scope.modalCtrl.isSingle = scope.modalType === EntityEmbed.embedModalTypes.addSingle ||
											scope.modalType === EntityEmbed.embedModalTypes.selectExistingSingle;

			if (!!scope.currentEmbedType)
			{
				delete scope.currentEmbedType.model;
				scope.currentEmbedType.$view.hide();
				scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
			}

			// Empty embedTypesSelect options
			scope.$embedTypeSelect.empty();
			// Rebuild $embedTypeSelect options
			for(i = 0, m = scope.embedTypes.length; i < m; i++)
			{
				et = scope.embedTypes[i];

				// Only add embed types in scope.embedTypeSelectOptions
				if(scope.selectableEMbedTypes)
				{
					if(scope.selectableEMbedTypes.indexOf(et.options.object_type) !== -1)
					{
						addEmbedTypeOption(et);
					}
				}
				else
				{
					addEmbedTypeOption(et);
				}
			}

			scope.currentEmbedType = scope.modalCtrl.scope.currentEmbedType = getEmbedTypeByObjectType(currentEmbedTypeName, scope.embedTypes);
			scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
			scope.currentEmbedType.$view.show();
			scope.$embedTypeSelect.val(currentEmbedTypeName);

			headerText = scope.headerText;

			if(!headerText)
			{
				// set the header text
				headerText = 'Add ';
				if (scope.modalType === EntityEmbed.embedModalTypes.edit)
				{
					headerText = 'Edit ';
				}
				if (!scope.embedId)
				{
					headerText += 'New ';
				}
				headerText += scope.currentEmbedType.options.displayName;
			}

			scope.elements.headerText.text(headerText);
		},
		resetModalView = function(scope){
			var embedName = scope.embedTypes[0].options.object_type;
			setModalView(scope, embedName);
			scope.$embedTypeSelect.show();
		},
		saveEmbed = function(scope){
			var isAddModal = scope.modalType == EntityEmbed.embedModalTypes.add ||
							 scope.modalType == EntityEmbed.embedModalTypes.addSingle;
			var $validator = scope.currentEmbedType.validate(scope.currentEmbedType.$view, isAddModal);
			var isValid = true;
			var promise = $.Deferred();
			var respData = {};
			var modelPromise;

			function doSave() {
				if(!scope.buffered)
				{

					scope.currentEmbedType.saveEmbed(isAddModal, scope.currentEmbedType)
						.done(successFunction)
						.fail(failFunction)
						.always(alwaysFunction);

				}
				else
				{
					respData.response = $.extend(true, {} ,scope.currentEmbedType.model)
					successFunction(respData);
					alwaysFunction(respData);
				}
			}

			for(var i = 0; i < $validator.length; i++)
			{
				isValid = $(scope.currentEmbedType.$validator[i]).valid() && isValid;
			}

			if (isSaving || !isValid)
			{
				promise.reject()
				return promise;
			}

			isSaving = true;

			scope.elements.saveSpinner.show();

			modelPromise = scope.currentEmbedType.getModelFromForm(scope.currentEmbedType.$view);

			if(typeof modelPromise === 'object' && typeof modelPromise.then === 'function')
			{
				modelPromise.always(function() {
					doSave();
				});
			}
			else
			{
				doSave();
			}

			////

			function successFunction(data) {
				if (data.status === 'ERROR')
				{
					console.log('POST failed (API)');
					promise.reject();
					return;
				}

				if (typeof data.response === 'string')
				{
					console.log('Failed to POST embed type: ' + data.response);
					promise.reject();
					return;
				}

				scope.currentEmbedType.model = data.response;

				if(isAddModal)
				{
					scope.currentEmbedType.model.object_id = data.response.object_id;
				}

				console.log('POST succeeded', data);

				if (!!scope.successCallback)
				{
					// TODO : call this function on select existing (if appropriate)
					scope.successCallback(data.response);
				}

				promise.resolve(data.response);
			}

			function failFunction(jqXhr, status, err){
				// TODO : UI failure message
				console.log('POST failed (XHR)', err);

				if (!!scope.failCallback)
				{
					// TODO : call this function on select existing (if appropriate)
					scope.failCallback();
				}

				promise.reject()
			}

			function alwaysFunction(data){
				isSaving = false;
				scope.elements.saveSpinner.hide();

				if (!!scope.alwaysCallback)
				{
					scope.alwaysCallback();
				}
			};

			////

			return promise;
		},
		showCreateNewEmbedView = function(scope){
			scope.skipSave = false;

			scope.buttons.showSelectExisting.toggle(!scope.addOnly);

			if(scope.isSingle)
			{
				scope.modalType = EntityEmbed.embedModalTypes.addSingle;
			}
			else
			{
				scope.modalType = EntityEmbed.embedModalTypes.add;
				scope.$embedTypeSelect.show();
			}

			scope.containers.selectExistingEmbed.slideUp();
			scope.containers.createNewEmbed.slideDown();

			scope.containers.selectButtons.hide();
			scope.containers.createButtons.show();

			scope.containers.selectExistingEmbed.find('.query-container').hide();
		},
		showEditEmbedView = function(scope){
			scope.skipSave = false;

			scope.buttons.showSelectExisting.hide();
			scope.$embedTypeSelect.hide();

			if (scope.containers.selectExistingEmbed.is(':visible'))
			{
				scope.containers.selectExistingEmbed.slideUp();
				scope.containers.createNewEmbed.slideDown();
			}

			scope.containers.selectButtons.hide();
			scope.containers.createButtons.show();

			scope.buttons.showSelectExisting.hide();
		},
		showSelectExistingView = function(scope){
			scope.skipSave = true;

			scope.containers.createNewEmbed.slideUp();
			scope.containers.selectExistingEmbed.slideDown();

			scope.containers.createButtons.hide();
			scope.containers.selectButtons.show();

			scope.containers.selectExistingEmbed
				.find('.' + scope.currentEmbedType.options.object_type + '-query-container').show();

			if (scope.isSingle)
			{
				scope.modalType = EntityEmbed.embedModalTypes.selectExistingSingle;
				scope.$embedTypeSelect.hide();
			}
			else
			{
				scope.modalType = EntityEmbed.embedModalTypes.selectExisting;
				scope.$embedTypeSelect.show();
			}
		},
		getEmbedTypeByObjectType = function(objectType, embedTypes){
			var embedType = $.grep(embedTypes, function(et){
				return et.options.object_type == objectType;
			})[0];

			return embedType && $.extend(true, {}, embedType);
		},
		//	This provides the functionality/styling for the type-ahead feature, allowing the user to only
		//	begin typing the title of an embed and have a dropdown list of embeds displayed to them
		initAutoComplete = function (embedType, scope){
			var modalCtrl = scope.modalCtrl;
			var rgxDevEnv = /^[^.]*staging[^.]*\.|\.dev$/;
			var isDevEnv = rgxDevEnv.test(window.location.host);
			var debug = 0;
			var ajaxData = {
				auth_token: EntityEmbed.apiService.getAuthToken(),
				object_type: embedType.options.object_type
			};


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
					return EntityEmbed.apiService.getDomainName() + embedType.options.httpPaths.getAll;
				},
				listLocation: function(listOfData){
					return listOfData.response.data;
				},
				getValue: function(data) {
					return data.title;
				},
				preparePostData: function(data) {
					data.title = scope.containers.selectExistingEmbed
									.find('input[name="' + embedType.options.object_type + '-query"]').val();
					return JSON.stringify(data);
				},
				list: {
					maxNumberOfElements: 20,
					match: {
						enabled: true
					},
					sort: {
						enabled: true
					},
					onChooseEvent: function(){
						var itemData = scope.containers.selectExistingEmbed
											.find('input[name="' + embedType.options.object_type + '-query"]')
											.getSelectedItemData();
						var objectId = itemData.object_id;
						scope.containers.selectExistingEmbed
									.find('input[name="' + embedType.options.object_type + '-query"]').val('')

						EntityEmbed.apiService.get({
							path: embedType.options.httpPaths.get,
							data: {
								object_id: objectId
							}
						})
						.done(function(respData){
							if (typeof respData.response === 'string')
							{
								console.log('Failed to get list of current embed types for the Select Existing page: ' + respData.response);
								return;
							}

							// create an event to be raised
							var addEvent = jQuery.Event('existingItemSelected');
							// add data to it so the handler knows what to do
							addEvent.embedModel = respData.response;
							scope.containers.selectExistingEmbed
								.find('input[name="' + embedType.options.object_type + '-query"]')
								.trigger(addEvent);

						})
						.fail(function(respData){
							// TODO: show error UI
							console.log('failed to get embed type!');
						});
					}
				}
			};

			scope.containers.selectExistingEmbed
				.find('input[name="' + embedType.options.object_type + '-query"]')
				.easyAutocomplete(options);

			scope.containers.selectExistingEmbed
				.find('input[name="' + embedType.options.object_type + '-query"]')
				.closest('.easy-autocomplete')
				.removeAttr('style');
		},
		generateSelectExistingInputHtml = function(embedType) {
			return	'<div class="embed-modal-row ' + embedType.options.object_type + '-query-container query-container">' +
						'<div class="embed-modal-full-column">' +
							'<label class="embed-modal-label" for="query">Search for ' + embedType.options.displayName + '</label>' +
							'<input type="text" class="embed-modal-form-control"' +
								' name="' + embedType.options.object_type + '-query" placeholder="begin typing ' + embedType.options.displayName + ' title ">' +
						'</div>' +
					'</div>';
		};

	function embedModalDefaults(){};

	embedModalDefaults.prototype.functions = {
		init:{
			before: function(scope){
				/*
				 * define necessary fields for scope
				 *
				 * assume that these are already defined:
				 *		scope.modalCtrl			(default for all modals from modal.js)
				 *			modalCtrl.promise	(default for all modals from modal.js)
				 *		scope.$embedTypeSelect
				 *		scope.$currentEditorLocation
				 *		scope.$modalBody
				 *		scope.embedTypes
				 */

				gatherModalElements(scope, scope.modalCtrl.$el);

				embedTypes_stale = scope.embedTypes;
				scope.elements.saveSpinner.hide();
			},
			after: function(scope){
				var $selExInput, $embedView, $confirmModal, confirmModalScope, confirmModalDefaults, embedObject, templatePath, i;

				function initEmbedTypeModal(embedType, $view) {
					embedType.initModal($view, scope.modalCtrl);
				}

				// Register events before adding dynamic content in case that content contains
				// elements with id's we plann to target in this scope.

				// // configure save button to call save method
				// scope.modalCtrl.registerEvent(embedModalSelectors.buttons.saveEmbed, 'click',
				// 	function(e, currentScope){
				// 		scope.modalCtrl.$el.completeModal(currentScope);
				// 	}
				// );

				// configure show-select-existing button to show the select-existing view
				scope.modalCtrl.registerEvent(scope.buttons.showSelectExisting, 'click',
					function(e, currentScope){
						showSelectExistingView(currentScope);
					}
				);

				// configure cancel-select-existing button to show the create-new-embed view
				scope.modalCtrl.registerEvent(scope.buttons.cancelSelectExisting, 'click',
					function(e, currentScope){
						showCreateNewEmbedView(currentScope);
					}
				);

				// configure the select-embed-type dropdown to change the modal view
				scope.modalCtrl.registerEvent(scope.$embedTypeSelect, 'change',
					function(e, currentScope){
						var embedType = e.currentTarget.options[e.currentTarget.selectedIndex].value;

						currentScope.currentEmbedType.clearForm(currentScope.currentEmbedType.$view);
						setModalView(currentScope, embedType);

						if (currentScope.modalType === EntityEmbed.embedModalTypes.selectExisting)
						{
							scope.containers.selectExistingEmbed
								.find('.query-container').hide();
							scope.containers.selectExistingEmbed
								.find('.' + currentScope.currentEmbedType.options.object_type + '-query-container').show();
						}
					}
				);

				// Load all dynamic content

				// load a query input in the select existing container for each embed type
				for(i = 0; i < scope.embedTypes.length; i++)
				{
					embedObject = scope.embedTypes[i];

					scope.containers.selectExistingEmbed.append(generateSelectExistingInputHtml(embedObject));

					$selExInput = scope.containers.selectExistingEmbed
											.find('input[name="' + embedObject.options.object_type + '-query"]');

					initAutoComplete(embedObject, scope);
					scope.containers.selectExistingEmbed
						.find('.' + embedObject.options.object_type + '-query-container').hide();

					scope.modalCtrl.registerEvent($selExInput, 'existingItemSelected',
						function(e, currentScope){
							currentScope.currentEmbedType.model = e.embedModel;
							currentScope.modalCtrl.$el.completeModal();
						});

					// TODO: Figure out how to move this process to the open::before so these options can be
					// 		adjusted for each usage of modal. eg. Limit Lede Embed field to only Audio, Video, or Slideshow.
					// load the views for creating new embeds (one view for each embed type)
					// create option in dropdown for this embed
					// scope.$embedTypeSelect.append('<option value="' +
					// 	embedObject.options.object_type + '">' + embedObject.options.displayName +
					// 	'</option>');

					// create the embed view container and load the view into it
					$embedView = $('<div id="' + embedObject.name + '"></div>');

					scope.containers.createNewEmbed.append($embedView);

					templatePath = scope.modalHtmlLocation + embedObject.options.viewPath;

					// Check to if there is a cached template for this template path
					if(EntityEmbed.templateCache && EntityEmbed.templateCache[templatePath])
					{
						$embedView.html( EntityEmbed.templateCache[templatePath] );
						initEmbedTypeModal(embedObject, $embedView);
					}
					else
					{
						$embedView.load(templatePath, (function(_embedObject, _templatePath) {
							return function(responseText, textStatus, xhr){
								console.log(_embedObject.options.viewPath + ' load completed with status: ' + textStatus);

								if (textStatus === 'error')
								{
									// TODO : error view (so that user knows something went wrong)
								}

								// Add template to template cache
								EntityEmbed.templateCache = EntityEmbed.templateCache || {};
								EntityEmbed.templateCache[_templatePath] = $(this).html();

								initEmbedTypeModal(_embedObject, $(this));
							}
						})(embedObject, templatePath));
					}

					// augment the embedObject for use with this modal
					embedObject.$view = $embedView;
					embedObject.optionIndex = i;
					// Hide embed view container until needed
					$embedView.hide();
				}

				// Load the confirm navigation modal
				confirmModalDefaults = new EntityEmbed.confirmModalDefaults();
				embedModalSelectors.elements.confirmModal = '#' + confirmModalDefaults.options.modalId;
				$confirmModal = scope.elements.confirmModal = $(embedModalSelectors.elements.confirmModal, scope.$modalEl);
				templatePath = scope.modalHtmlLocation + confirmModalDefaults.options.viewPath
				confirmModalScope = {
					parentModalCtrl: scope.modalCtrl,
					$modalEl: $confirmModal
				};

				// Check to if there is a cached template for this template path
				if(EntityEmbed.templateCache && EntityEmbed.templateCache[templatePath])
				{
					$confirmModal.html( EntityEmbed.templateCache[templatePath] );
					confirmModalDefaults.init(confirmModalScope); // this re-registers abort and complete buttons - now that they are loaded, JQuery can find them
					$confirmModal.modal(confirmModalDefaults, confirmModalScope);
				}
				else
				{
					$confirmModal.load(templatePath, function(responseText, textStatus, xhr){
							console.log('leave confirmation modal load completed with status: ' + textStatus);
							if (textStatus === 'error')
							{
								// TODO : error view (so that user knows something went wrong)
								return;
							}

							// Add template to template cache
							EntityEmbed.templateCache = EntityEmbed.templateCache || {};
							EntityEmbed.templateCache[templatePath] = $confirmModal.html();
							confirmModalDefaults.init(confirmModalScope); // this re-registers abort and complete buttons - now that they are loaded, JQuery can find them
							$confirmModal.modal(confirmModalDefaults, confirmModalScope);
						});
				}
			}
		},
		open: {
			before: function(scope){
				toggleEditorTyping(scope, "false");

				delete scope.selectableEMbedTypes;

				if (!!scope.embedType){
					if(typeof scope.embedType !== 'string')
					{
						scope.selectableEMbedTypes = scope.embedType;
					}
					setModalView(scope, scope.embedType);
					delete scope.embedType;
				}
				else{
					resetModalView(scope);
				}
			},
			after: function(scope){

				function applyData(data) {
					data = data || {};

					// Make sure html_rendered key is not set to normalize stale model to current model comparison
					if(!!data.html_rendered)
					{
						data.html_rendered = null;
					}

					setModalView(scope, data.object_type);
					scope.currentEmbedType.model = data;
					scope.currentEmbedType.staleModel = $.extend(true, {}, data); // so we can check if the form is dirty later
					scope.currentEmbedType.populateFormWithModel(scope.currentEmbedType.$view);
				}

				switch(scope.modalType)
				{
					case EntityEmbed.embedModalTypes.edit:
						showEditEmbedView(scope);

						if(scope.buffered)
						{
							applyData(scope.embedData);
							delete scope.embedData;
							break;
						}

						// TODO : loading spinner
						EntityEmbed.apiService.get({
							path: scope.currentEmbedType.options.httpPaths.get,
							data: {
								object_id: scope.embedId
							}
						})
						.done(function(data){
							if (typeof data.response === 'string')
							{
								console.log('Failed to get embed type: ' + data.response);
								// show UI error here
								return;
							}

							applyData(data.response);

						})
						.fail(function(data){
							// TODO : UI failure message
							console.log('failed to get embed type!');
						});

						break;
					case EntityEmbed.embedModalTypes.add:
						showCreateNewEmbedView(scope);
						break;
					case EntityEmbed.embedModalTypes.addSingle:
						showCreateNewEmbedView(scope);
						scope.$embedTypeSelect.hide();
						break;
					case EntityEmbed.embedModalTypes.selectExisting:
						showSelectExistingView(scope);
						break;
					case EntityEmbed.embedModalTypes.selectExistingSingle:
						showSelectExistingView(scope, true);
						break;
				}
			},
		},
		abort: {
			before: function(scope){
				var self = this;
				var staleVal, modelVal;

				function prepVal(val) {
					var result;

					if(val)
					{
						switch (typeof val)
						{
							case 'array' :
							case 'object' :
								result = JSON.stringify(val);
								break;

							default :
								result = val;
								break;
						}
					}

					return result || null;
				}

				if (!scope.confirmedLeave)
				{
					if (scope.modalType === EntityEmbed.embedModalTypes.edit && !!scope.currentEmbedType.staleModel) // this is an edit modal - compare current model to stale model
					{
						scope.currentEmbedType.getModelFromForm(scope.currentEmbedType.$view);

						for (var fieldName in scope.currentEmbedType.model)
						{
							staleVal = prepVal(scope.currentEmbedType.staleModel[fieldName]);
							modelVal = prepVal(scope.currentEmbedType.model[fieldName]);

							if (staleVal !== modelVal)
							{
								scope.elements.confirmModal.openModal({parentModal: self});
								return false;
							}
						}
					}
					else if (isFormDirty(scope.currentEmbedType.$view)) // this is an add modal
					{
						scope.elements.confirmModal.openModal({parentModal: self});
						return false;
					}
				}
				// no changes made OR leave already confirmed - okay to close without prompting user
				scope.currentEmbedType.$view.hide();
				scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
				delete scope.confirmedLeave;
				return true;
			},
			after: function(scope){
				toggleEditorTyping(scope, 'true');
			}
		},
		complete: {
			before: function(scope){
				return !!scope.skipSave || saveEmbed(scope);
			},
			after: function(scope){
				var $embedContainer, $embedTemp;
				var classes, i, m;

				toggleEditorTyping(scope, 'true');

				// return only necessary information to anyone interested in promise resolution
				scope.modalCtrl.promise.resolve({
					data: $.extend(true, {}, scope.currentEmbedType.model),
					embedType: scope.currentEmbedType
				});

				scope.currentEmbedType.$view.hide();
				scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
			}
		}
	};

	EntityEmbed.embedModalDefaults = embedModalDefaults;

}());
