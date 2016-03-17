var EntityEmbed = EntityEmbed || {};

;(function(){

	// MODAL TYPE ENUM
	EntityEmbed.embedModalTypes = {
		add: 0,
		edit: 1,
		selectExisting: 2
	};

	// PRIVATE

	var embedTypes_stale = undefined; // this is for the jquery plugin embedModalOpen_edit func (see bottom)

	var embedModalSelectors = {
			buttons: {
				saveEmbed: '#btn-save-modal', // saves the modal
				abortModal: '#btn-abort-modal', // aborts (cancels) the modal
				showSelectExisting: '#btn-show-select-existing', // shows the select-existing-embed view
				selectExisting: '#btn-select-existing-embed', // confirms selection of existing embed
				cancelSelectExisting: '#btn-cancel-select-existing' // cancels selection of existin embed
			},
			containers: {
				createNewEmbed: '#embed-modal-create-new', // contains all the views for creating a new embed
				selectExistingEmbed: '#embed-modal-select-existing', // contains views for selecting an existing embed
				createButtons: '#embed-modal-buttons-create', // contains buttons shown in the create new embed view
				selectButtons: '#embed-modal-buttons-select' // contains buttons shown in the select existing embed view
			},
			elements: {
				selectExistingTableBody: '.embed-modal-select-existing tbody',
				selectExistingTableRow: '.embed-modal-select-existing-item',
				selectExistingActiveItem: 'embed-modal-active-row'
			}
		},
		tableRowHtml = function(title, id){
			return	'<tr class="embed-modal-select-existing-item" id="' + id + '">' +
						'<td>' + title + '</tr>'+
					'</td>';
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
			var $validator = scope.currentEmbedType.validate(scope.currentEmbedType.$view);
			if (!scope.currentEmbedType.$view.find('form').valid())
			{
				return;
			}

			scope.currentEmbedType.getModelFromForm(scope.currentEmbedType.$view);
			var isAddModal = scope.modalType == EntityEmbed.embedModalTypes.add;
			if (isAddModal)
			{
				var successFunction = function(data){
					if (data.status === 'ERROR')
					{
						console.log('post failed');
						return;
					}
					scope.currentEmbedType.model.object_id = data.response.object_id;
					console.log('post succeeded');
					scope.modalCtrl.$el.completeModal();
				},
				failFunction = function(data){
					// TODO : UI failure message
					console.log('post failed');
				};
			}
			else
			{
				var successFunction = function(data){
					if (data.status === 'ERROR')
					{
						console.log('put failed');
						return;
					}

					console.log('put succeeded');
					scope.modalCtrl.$el.completeModal();
				},
				failFunction = function(data){
					// TODO : UI failure message
					console.log('put failed');

				};
			}
			scope.currentEmbedType.saveEmbed(isAddModal, successFunction, failFunction);

			$validator.resetForm();

		},
		populateSelectExistingView = function(scope){
			$(embedModalSelectors.elements.selectExistingTableRow).remove();

			EntityEmbed.apiService.get({
				path: scope.currentEmbedType.options.httpPaths.get,
				data: {
					object_id: scope.currentEmbedType.options.getAllObjectId,
					auth_token: 'abc123'
				},
				success: function(data){
					// this is how we expect things to be 
					if (!data.response.list){

						return;
					}
					scope.selectExistingItems = data.response.list;
					for (var i = 0; i < scope.selectExistingItems.length; i++)
					{
						var $row = $(tableRowHtml(scope.selectExistingItems[i].title, scope.selectExistingItems[i].id));
						$(embedModalSelectors.elements.selectExistingTableBody).append($row);

						scope.modalCtrl.registerEvent($row, 'click', function(e, scope){
							// we do not need to add the class back if it is already on the item being clicked
							var needToAddClass = !$(e.currentTarget).hasClass(embedModalSelectors.elements.selectExistingActiveItem);

							$(embedModalSelectors.elements.selectExistingTableBody)
								.find('.' + embedModalSelectors.elements.selectExistingActiveItem)
								.removeClass(embedModalSelectors.elements.selectExistingActiveItem);

							if (needToAddClass){
								$(e.currentTarget).addClass(embedModalSelectors.elements.selectExistingActiveItem);
								$(embedModalSelectors.buttons.selectExisting).removeClass('disabled');
							}
							else // since we didnt add a class, that means nothing is selected, so disable the select button
							{
								$(embedModalSelectors.buttons.selectExisting).addClass('disabled');
							}
						});
					}
				},
				fail: function(data){
					console.log('Failed to get list of current embed types for the Select Existing page.');
				}
			});
		},
		showCreateNewEmbedView = function(scope){
			$(embedModalSelectors.buttons.showSelectExisting).show();
			scope.$embedTypeSelect.show();

			$(embedModalSelectors.containers.selectExistingEmbed).slideUp();
			$(embedModalSelectors.containers.createNewEmbed).slideDown();

			$(embedModalSelectors.containers.selectButtons).hide();
			$(embedModalSelectors.containers.createButtons).show();
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
		generateEmbedHtmlInternal = function(embedType, addNewLine, noWrapper){
			var figureClass = 'entity-embed';

			if (!!embedType.defaultStyle)
			{
				figureClass += ' ' + embedType.defaultStyle;
			}

			var ret = '<figure contenteditable="false" class="' + figureClass + '" ' +
				'id="' + embedType.model.object_id  + '" ' +
				'data-embed-type="' + embedType.options.object_type + '" >' +
				embedType.parseForEditor() +
			'</figure>';

			if (!noWrapper)
			{
			 ret =
				'<div class="entity-embed-container">' +
					 ret +
				'</div>';
			}

			if (addNewLine)
			{
				// add a new paragraph after the embed so that user can continue typing
				// TODO : make sure that no one can ever remove this
				//			user could put self in bad editing state
				ret = ret + '<p class="entity-embed-new-line">&nbsp</p>';
			}

			return ret;
		};

	function embedModalDefaults() {};

	embedModalDefaults.prototype.generateEmbedHtml = generateEmbedHtmlInternal;

	embedModalDefaults.prototype.functions = {
		init:{
			before: function(scope){
				/*
				 * define necessary fields for scope
				 *
				 * assume that these are already defined:
				 *		scope.modalCtrl			(default for all modals from modal.js)
				 *		scope.$embedTypeSelect
				 *		scope.$currentEditorLocation
				 *		scope.$modalBody
				 *		scope.embedTypes
				 */
				scope.currentEmbedType = null;
				embedTypes_stale = scope.embedTypes;
			},
			after: function(scope){
				// first load all dynamic content

				// load the select existing view
				scope.$modalBody.find(embedModalSelectors.containers.selectExistingEmbed)
					.load('modal/modal_selectedExisting.html', function(responseText, textStatus, xhr){
						console.log('modal_selectedExisting.html load completed with status: ' + textStatus);
						if (textStatus === 'error')
						{
								// TODO : error view (so that user knows something went wrong)
						}

						$(embedModalSelectors.buttons.selectExisting).addClass('disabled');
					});

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
							populateSelectExistingView(currentScope);
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
						currentScope.modalType = EntityEmbed.embedModalTypes.selectExisting;
						populateSelectExistingView(currentScope);

						$(embedModalSelectors.containers.createNewEmbed).slideUp();
						$(embedModalSelectors.containers.selectExistingEmbed).slideDown();

						$(embedModalSelectors.containers.createButtons).hide();
						$(embedModalSelectors.containers.selectButtons).show();
					}
				);

				// configure cancel-select-existing button to show the create-new-embed view
				scope.modalCtrl.registerEvent(embedModalSelectors.buttons.cancelSelectExisting, 'click',
					function(e, currentScope){
						currentScope.modalType = EntityEmbed.embedModalTypes.add;
						showCreateNewEmbedView(currentScope);
					}
				);

				scope.modalCtrl.registerEvent(embedModalSelectors.buttons.selectExisting, 'click',
					function(e, currentScope){
						if ($(embedModalSelectors.buttons.selectExisting).hasClass('disabled'))
						{
							return;
						}

						EntityEmbed.apiService.get({
							path: currentScope.currentEmbedType.options.httpPaths.get,
							data: {
								object_id: $('.' + embedModalSelectors.elements.selectExistingActiveItem).attr('id'),
								auth_token: 'abc123'
							},
							success: function(data){
								currentScope.currentEmbedType.model = data.response;
								currentScope.modalCtrl.$el.completeModal();
							},
							fail: function(data){
								// TODO: show error UI
								console.log('failed to get embed type!');
							}
						});
					}
				);
			}
		},
		open: {
			before: function(scope){
			},
			after: function(scope){
				toggleEditorTyping(scope, "false");

				if (scope.modalType == EntityEmbed.embedModalTypes.edit)
				{
					scope.currentEmbedType = getEmbedTypeFromTypeString(scope.embedType);
					showEditEmbedView(scope);

					EntityEmbed.apiService.get({
						path: scope.currentEmbedType.options.httpPaths.get,
						data: {
							object_id: scope.embedId
						},
						success: function(data){
							scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);

							setModalView(scope, data.response.object_type);
							scope.currentEmbedType.model = data.response;
							scope.staleModel = $.extend(true, {}, data.response); // so we can check if the form is dirty later
							scope.currentEmbedType.populateFormWithModel(scope.currentEmbedType.$view);
						},
						fail: function(data){
							console.log('failed to get embed type!');
						}
					});

					delete scope.embedType;
				}
				else if (scope.modalType == EntityEmbed.embedModalTypes.add)
				{
					showCreateNewEmbedView(scope);
					if (!!scope.embedType)
					{
						// TODO : when modal opens in this context, modify modal header to
						//		  be more descriptive (i.e. 'Embed Content' --> 'Embed <type>')
						setModalView(scope, scope.embedType);
						scope.$embedTypeSelect.hide();
					}
					else
					{
						resetModalView(scope);
					}
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
								$(embedModalSelectors.elements.confirmModal).openModal();
								return false;
							}
						}
					}
					else if (isFormDirty(scope.currentEmbedType.$view)) // this is an add modal
					{
						$(embedModalSelectors.elements.confirmModal).openModal();
						return false;
					}
				}
				// no changes made OR leave already confirmed - okay to close without prompting user
				var $validator = scope.currentEmbedType.validate(scope.currentEmbedType.$view);
				$validator.resetForm();
				delete scope.confirmedLeave;
				return true;
			},
			after: function(scope){
				toggleEditorTyping(scope, "true");
				scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
			}
		},
		complete: {
			before: function(scope){
				return true;
			},
			after: function(scope){
				toggleEditorTyping(scope, "true");
				var needNewlineAtEnd = $('.entity-embed-new-line').length == 0;

				scope.$currentEditorLocation.addClass('entity-embed-editor-line');
				scope.$currentEditorLocation.html(generateEmbedHtmlInternal(scope.currentEmbedType, needNewlineAtEnd));
				scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
			}
		}
	};

	// expose necessary functionality


	// if embedType is specified then the modal will only show that embed type
	//		and the select embed type dropdown will be hidden
	// embedType should match the object_type field on some configured embed type object
	$.fn.embedModalOpen_add = function(embedType){
		var addToScope = {
			$currentEditorLocation: $('.medium-insert-active'),
			modalType: EntityEmbed.embedModalTypes.add,
			embedType: embedType
		};
		this.openModal(addToScope);
		console.log('called embed modal open...')
	};

	// embedType should match the object_type field on some configured embed type object
	$.fn.embedModalOpen_edit = function(embedTypeStr, id){
		var scope = {
			$currentEditorLocation: $('.medium-insert-active'),
			modalType: EntityEmbed.embedModalTypes.edit,
			embedId: id,
			embedType: embedTypeStr
		};

		this.openModal(scope);
	};
	EntityEmbed.embedModalDefaults = embedModalDefaults;
}());
