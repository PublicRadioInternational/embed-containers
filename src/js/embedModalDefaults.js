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
				saveSpinner: '#embed-modal-spinner'
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
			if (!embedType)
			{
				return;
			}

			if (!!scope.currentEmbedType)
			{
				scope.currentEmbedType.$view.hide();
				scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
			}

			scope.currentEmbedType = getEmbedTypeFromTypeString(embedType);

			scope.currentEmbedType.$view.show();
			scope.$embedTypeSelect[0].selectedIndex = scope.currentEmbedType.optionIndex;
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
			if (isSaving || !scope.currentEmbedType.$view.find('form').valid())
			{
				return;
			}
			isSaving = true;
			$(embedModalSelectors.elements.saveSpinner).show();
			scope.currentEmbedType.getModelFromForm(scope.currentEmbedType.$view);
			if (isAddModal)
			{
				var successFunction = function(data){
					if (data.status === 'ERROR')
					{
						console.log('POST failed');
						return;
					}
					if (typeof data.response === 'string')
					{
						console.log('Failed to POST embed type: ' + data.response);
						return;
					}
					scope.currentEmbedType.model.object_id = data.response.object_id;
					console.log('POST succeeded');
					scope.modalCtrl.$el.completeModal();
					if (!!scope.successCallback)
					{
						// TODO : call this function on select existing (if appropriate)
						scope.successCallback(data.response);
					}
				},
				failFunction = function(data){
					// TODO : UI failure message
					console.log('POST failed');

					if (!!scope.failCallback)
					{
						// TODO : call this function on select existing (if appropriate)
						scope.failCallback();
					}
				};
			}
			else
			{
				var successFunction = function(data){
					if (data.status === 'ERROR')
					{
						console.log('PUT failed');
						return;
					}
					if (typeof data.response === 'string')
					{
						console.log('Failed to PUT embed type: ' + data.response);
						return;
					}
					console.log('PUT succeeded');
					scope.modalCtrl.$el.completeModal();

					if (!!scope.successCallback)
					{
						// TODO : call this function on select existing (if appropriate)
						scope.successCallback(data.response);
					}
				},
				failFunction = function(data){
					// TODO : UI failure message
					console.log('PUT failed');

					if (!!scope.failCallback)
					{
						// TODO : call this function on select existing (if appropriate)
						scope.failCallback();
					}
				};
			}

			var alwaysFunction = function(data){
				isSaving = false;
				$(embedModalSelectors.elements.saveSpinner).hide();

				if (!!scope.alwaysCallback)
				{
					scope.alwaysCallback();
				}
			};

			scope.currentEmbedType.saveEmbed(isAddModal)
				.done(successFunction)
				.fail(failFunction)
				.always(alwaysFunction);

			$validator.resetForm();
		},
		showCreateNewEmbedView = function(scope){
			$(embedModalSelectors.buttons.showSelectExisting).show();
			scope.$embedTypeSelect.show();

			$(embedModalSelectors.containers.selectExistingEmbed).slideUp();
			$(embedModalSelectors.containers.createNewEmbed).slideDown();

			$(embedModalSelectors.containers.selectButtons).hide();
			$(embedModalSelectors.containers.createButtons).show();

			$(embedModalSelectors.containers.selectExistingEmbed).find('.query-container').hide();
		},
		showEditEmbedView = function(scope){
			$(embedModalSelectors.buttons.showSelectExisting).hide();
			scope.$embedTypeSelect.hide();

			if ($(embedModalSelectors.containers.selectExistingEmbed).is(':visible'))
			{
				$(embedModalSelectors.containers.selectExistingEmbed).slideUp();
				$(embedModalSelectors.containers.createNewEmbed).slideDown();
			}

			$(embedModalSelectors.containers.selectButtons).hide();
			$(embedModalSelectors.containers.createButtons).show();

			$(embedModalSelectors.buttons.showSelectExisting).hide();
		},
		showSelectExistingView = function(scope, isSingle){
			scope.modalType = EntityEmbed.embedModalTypes.selectExisting;

			$(embedModalSelectors.containers.createNewEmbed).slideUp();
			$(embedModalSelectors.containers.selectExistingEmbed).slideDown();

			$(embedModalSelectors.containers.createButtons).hide();
			$(embedModalSelectors.containers.selectButtons).show();

			$(embedModalSelectors.containers.selectExistingEmbed)
				.find('.' + scope.currentEmbedType.options.object_type + '-query-container').show();

			if (isSingle)
			{
				$(embedModalSelectors.buttons.cancelSelectExisting).hide();
				scope.$embedTypeSelect.hide();
			}
			else
			{
				$(embedModalSelectors.buttons.cancelSelectExisting).show();
				scope.$embedTypeSelect.show();
			}
		},
		getEmbedTypeFromTypeString = function(object_type){

			var ret = $.grep(embedTypes_stale, function(et){
				return et.options.object_type == object_type;
			});

			if (ret.length > 0)
			{
				return ret[0];
			}
			else
			{
				return null;
			}
		},
		generateEmbedHtmlInternal = function(embedType, includeWrapper){
			var figureClass = 'entity-embed';
			var ret = '<figure contenteditable="false" ' +
							'id="' + embedType.model.object_id	+ '" ' +
							'data-embed-type="' + embedType.options.object_type + '" >' +
							embedType.parseForEditor() +
							'<div class="entity-embed-blocker"></div>' +
						'</figure>';

			if (includeWrapper)
			{
				return	'<div class="entity-embed-container">' +
							ret +
						'</div>';
			}
			return ret;
		},
		//	This provides the functionality/styling for the type-ahead feature, allowing the user to only
		//	begin typing the title of an embed and have a dropdown list of embeds displayed to them
		initAutoComplete = function (embedType, modalCtrl){
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
					return embedType.options.httpPaths.getAll;
				},
				listLocation: function(listOfData){
					return listOfData.response.data;
				},
				getValue: function(data) {
					return data.title;
				},
				preparePostData: function(data) {
					data.title = $(embedModalSelectors.containers.selectExistingEmbed)
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
						var itemData = $(embedModalSelectors.containers.selectExistingEmbed)
											.find('input[name="' + embedType.options.object_type + '-query"]')
											.getSelectedItemData();
						var objectId = itemData.object_id;
						$(embedModalSelectors.containers.selectExistingEmbed)
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
							$(embedModalSelectors.containers.selectExistingEmbed)
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

			$(embedModalSelectors.containers.selectExistingEmbed)
				.find('input[name="' + embedType.options.object_type + '-query"]')
				.easyAutocomplete(options);

			$(embedModalSelectors.containers.selectExistingEmbed)
				.find('input[name="' + embedType.options.object_type + '-query"]')
				.closest('.easy-autocomplete')
				.removeAttr('style');
		},
		generateSelExInputHtml = function(embedType) { // SelEx -> SelectExisting
			return	'<div class="embed-modal-row ' + embedType.options.object_type + '-query-container query-container">' +
						'<div class="embed-modal-full-column">' +
							'<label class="embed-modal-label" for="query">Search for ' + embedType.options.displayName + '</label>' +
							'<input type="text" class="embed-modal-form-control"' +
								' name="' + embedType.options.object_type + '-query" placeholder="begin typing ' + embedType.options.displayName + ' title ">' +
						'</div>' +
					'</div>';

		};

	function embedModalDefaults(){};

	embedModalDefaults.prototype.generateEmbedHtml = generateEmbedHtmlInternal;

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
				scope.currentEmbedType = null;
				embedTypes_stale = scope.embedTypes;
				$(embedModalSelectors.elements.saveSpinner).hide();
			},
			after: function(scope){
				// first load all dynamic content

				// load a query input in the select existing container for each embed type
				for(var i = 0; i < scope.embedTypes.length; i++)
				{
					$(embedModalSelectors.containers.selectExistingEmbed).append(generateSelExInputHtml(scope.embedTypes[i]));

					var $selExInput = $(embedModalSelectors.containers.selectExistingEmbed)
											.find('input[name="' + scope.embedTypes[i].options.object_type + '-query"]');

					initAutoComplete(scope.embedTypes[i], scope.modalCtrl);
					$(embedModalSelectors.containers.selectExistingEmbed)
						.find('.' + scope.embedTypes[i].options.object_type + '-query-container').hide();

					scope.modalCtrl.registerEvent($selExInput, 'existingItemSelected',
						function(e, currentScope){
							currentScope.currentEmbedType.model = e.embedModel;
							currentScope.modalCtrl.$el.completeModal();
						});
				}

				// load the views for creating new embeds (one view for each embed type)
				var optionIndex = 0;
				for(var i = 0; i < scope.embedTypes.length; i++)
				{
					var embedObject = scope.embedTypes[i];
					// create option in dropdown for this embed
					scope.$embedTypeSelect.append('<option value="' +
						embedObject.options.object_type + '">' + embedObject.options.displayName +
						'</option>');

					// create the embed view container and load the view into it
					scope.$modalBody
						.find(embedModalSelectors.containers.createNewEmbed)
						.append('<div id="' + embedObject.name + '"></div>');

					var $embedView = scope.$modalBody.find('#' + embedObject.name);
					$embedView.load(embedObject.options.viewPath, function(responseText, textStatus, xhr){
						console.log(embedObject.options.viewPath + ' load completed with status: ' + textStatus);

						if (textStatus === 'error')
						{
							// TODO : error view (so that user knows something went wrong)
						}
					});

					// augment the embedObject for use with this modal
					embedObject.$view = $embedView;
					embedObject.optionIndex = optionIndex;
					$embedView.hide();

					// increment optionIndex to keep it valid
					optionIndex++;
				}

				// TODO : find a better way to handle async load
				setTimeout(function(){
					for(var i = 0; i < scope.embedTypes.length; i++)
					{
						scope.embedTypes[i].initModal(scope.embedTypes[i].$view);
					}
				}, 200);

				// load the confirm navigation modal
				var confirmModalDefaults = new EntityEmbed.confirmModalDefaults();
				embedModalSelectors.elements.confirmModal = '#' + confirmModalDefaults.options.modalId;
				$('#' + confirmModalDefaults.options.modalId).load(confirmModalDefaults.options.viewPath, function(responseText, textStatus, xhr){
						console.log('leave confirmation modal load completed with status: ' + textStatus);
						if (textStatus === 'error')
						{
							// TODO : error view (so that user knows something went wrong)
							return;
						}
						var confirmModalScope = {
							parentModalCtrl: scope.modalCtrl
						};
						confirmModalDefaults.init(); // this re-registers abort and complete buttons - now that they are loaded, JQuery can find them
						$('#' + confirmModalDefaults.options.modalId).modal(confirmModalDefaults, confirmModalScope);
					});

				// now set up events for buttons etc.

				// configure the select-embed-type dropdown to change the modal view
				scope.modalCtrl.registerEvent(scope.$embedTypeSelect, 'change',
					function(e, currentScope){
						currentScope.currentEmbedType.clearForm(currentScope.currentEmbedType.$view);
						var embedType = e.currentTarget.options[e.currentTarget.selectedIndex].value;
						setModalView(currentScope, embedType);

						if (currentScope.modalType === EntityEmbed.embedModalTypes.selectExisting)
						{
							$(embedModalSelectors.containers.selectExistingEmbed)
								.find('.query-container').hide();
							$(embedModalSelectors.containers.selectExistingEmbed)
								.find('.' + currentScope.currentEmbedType.options.object_type + '-query-container').show();
						}
					}
				);

				// configure save button to call save method
				scope.modalCtrl.registerEvent(embedModalSelectors.buttons.saveEmbed, 'click',
					function(e, currentScope){
						saveEmbed(currentScope);
					}
				);

				// configure show-select-existing button to show the select-existing view
				scope.modalCtrl.registerEvent(embedModalSelectors.buttons.showSelectExisting, 'click',
					function(e, currentScope){
						showSelectExistingView(currentScope, currentScope.modalType === EntityEmbed.embedModalTypes.addSingle ||
															 currentScope.modalType === EntityEmbed.embedModalTypes.selectExistingSingle);
					}
				);

				// configure cancel-select-existing button to show the create-new-embed view
				scope.modalCtrl.registerEvent(embedModalSelectors.buttons.cancelSelectExisting, 'click',
					function(e, currentScope){
						currentScope.modalType = EntityEmbed.embedModalTypes.add;
						showCreateNewEmbedView(currentScope);
					}
				);
			}
		},
		open: {
			before: function(scope){
				toggleEditorTyping(scope, "false");
				if (!!scope.embedType){
					setModalView(scope, scope.embedType);
					delete scope.embedType;
				}
				else{
					resetModalView(scope);
				}
			},
			after: function(scope){
				switch(scope.modalType)
				{
					case EntityEmbed.embedModalTypes.edit:
						showEditEmbedView(scope);

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

							setModalView(scope, data.response.object_type);
							scope.currentEmbedType.model = data.response;
							scope.staleModel = $.extend(true, {}, data.response); // so we can check if the form is dirty later
							scope.currentEmbedType.populateFormWithModel(scope.currentEmbedType.$view);
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

				if (!scope.confirmedLeave)
				{
					if (scope.modalType === EntityEmbed.embedModalTypes.edit && !!scope.staleModel) // this is an edit modal - compare current model to stale model
					{
						scope.currentEmbedType.getModelFromForm(scope.currentEmbedType.$view);
						for (var fieldName in scope.currentEmbedType.model)
						{
							if (!scope.staleModel[fieldName] || scope.staleModel[fieldName] !== scope.currentEmbedType.model[fieldName])
							{
								$(embedModalSelectors.elements.confirmModal).openModal({keepPosition: true});
								return false;
							}
						}
					}
					else if (isFormDirty(scope.currentEmbedType.$view)) // this is an add modal
					{
						$(embedModalSelectors.elements.confirmModal).openModal({keepPosition: true});
						return false;
					}
				}
				// no changes made OR leave already confirmed - okay to close without prompting user
				// TODO : track validator on scope, reset here, then delete from scope
				// 			could also use validator on currentEmbedType object
				var $validator = scope.currentEmbedType.validate(scope.currentEmbedType.$view, true);
				$validator.resetForm();
				delete scope.confirmedLeave;
				return true;
			},
			after: function(scope){
				toggleEditorTyping(scope, 'true');
			}
		},
		complete: {
			before: function(scope){
				return true;
			},
			after: function(scope){
				var $embedContainer;

				toggleEditorTyping(scope, 'true');

				if (scope.$currentEditorLocation.length > 0)
				{
					$embedContainer = scope.$currentEditorLocation.replaceWith(generateEmbedHtmlInternal(scope.currentEmbedType, true));
				}

				// return only necessary information to anyone interested in promise resolution
				scope.modalCtrl.promise.resolve({
					data: 		scope.currentEmbedType.model,
					embedType: 	scope.currentEmbedType,
					$embed: $embedContainer
				});
			}
		}
	};

	EntityEmbed.embedModalDefaults = embedModalDefaults;

}());
