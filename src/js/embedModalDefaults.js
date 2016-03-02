var EntityEmbed = EntityEmbed || {};

;(function(){

	// MODAL TYPE ENUM
	EntityEmbed.embedModalTypes = {
		add: 0,
		edit: 1,
		selectExisting: 2
	};

	// PRIVATE

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
			var currentEditorClass = scope.$currentEditorLocation[0].parentNode.className;
			currentEditorClass = currentEditorClass.split(' ');
			$("." + currentEditorClass[0]).attr('contenteditable', toggleCmd);
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
		};

	function embedModalDefaults() {};

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
 
				scope.setModalView = function(scope, embedType){
					if (!embedType)
					{
						return;
					}

					if (!!scope.currentEmbedType)
					{
						scope.currentEmbedType.$view.hide();
						scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
					}

					scope.currentEmbedType = $.grep(scope.embedTypes, function(et){
						return et.options.object_type == embedType;
					})[0];

					var $validator = scope.currentEmbedType.validate(scope.currentEmbedType.$view);					
					scope.currentEmbedType.$view.show();
					$validator.resetForm();
					scope.$embedTypeSelect[0].selectedIndex = scope.currentEmbedType.optionIndex;
				};

				scope.resetModalView = function(scope){					
					var embedName = scope.embedTypes[0].options.object_type;
					scope.setModalView(scope, embedName);
				};

				scope.saveEmbed = function(scope){
					var $validator = scope.currentEmbedType.validate(scope.currentEmbedType.$view);
					if (!scope.currentEmbedType.$view.find('form').valid())
					{
						return;
					}

					scope.currentEmbedType.getModelFromForm(scope.currentEmbedType.$view);

					if (scope.modalType == EntityEmbed.embedModalTypes.edit)
					{
						scope.currentEmbedType.model.object_id = scope.currentEmbedType.model.id;

						EntityEmbed.apiService.put(
							scope.currentEmbedType.options.httpPaths.put, 
							scope.currentEmbedType.model,
							// TODO : save spinner
							function(data){
								if (data.status === 'ERROR')
								{
									console.log('put failed');
									return;
								}

								console.log('put succeeded');
								scope.modalCtrl.$el.completeModal();
							},
							function(data){
								// TODO : UI failure message
								console.log('put failed');
							}
						);
					}
					else if (scope.modalType == EntityEmbed.embedModalTypes.add){
						// add the object_type onto the model
						//		this code smells, do something better here...
						scope.currentEmbedType.model.object_type = scope.currentEmbedType.options.object_type;

						EntityEmbed.apiService.post(
							scope.currentEmbedType.options.httpPaths.post, 
							scope.currentEmbedType.model,
							// TODO : save spinner
							function(data){
								if (data.status === 'ERROR')
								{
									console.log('post failed');
									return;
								}
								scope.currentEmbedType.model.object_id = data.response.object_id;
								console.log('post succeeded');
								scope.modalCtrl.$el.completeModal();
							}, 
							function(data){
								// TODO : UI failure message
								console.log('post failed');
							}
						);
					}

					$validator.resetForm();
				};

				scope.populateSelectExistingView = function(scope){
					$(embedModalSelectors.elements.selectExistingTableRow).remove();

					EntityEmbed.apiService.get(
						scope.currentEmbedType.options.httpPaths.get,
						{
							object_id: scope.currentEmbedType.options.getAllObjectId
						},
						function(data){
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
						function(data){
							console.log('Failed to get list of current embed types for the Select Existing page.');
						}
					);
				};

				scope.showCreateNewEmbedView = function(scope){
					$(embedModalSelectors.buttons.showSelectExisting).show();
					scope.$embedTypeSelect.show();

					$(embedModalSelectors.containers.selectExistingEmbed).slideUp();
					$(embedModalSelectors.containers.createNewEmbed).slideDown();

					$(embedModalSelectors.containers.selectButtons).hide();
					$(embedModalSelectors.containers.createButtons).show();
				};

				scope.showEditEmbedView = function(scope){
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
				};

				scope.generateEmbedHtml = function(scope, addNewLine){
					var figureClass = 'entity-embed'

					scope.$currentEditorLocation.addClass('entity-embed-editor-line');

					if (!!scope.currentEmbedType.defaultStyle)
					{
						figureClass += ' ' + scope.currentEmbedType.defaultStyle;
					}

					var ret =
						'<div class="entity-embed-container">' + 
							'<figure contenteditable="false" class="' + figureClass + '" ' + 
								'id="' + scope.currentEmbedType.model.object_id  + '" ' + 
								'data-embed-type="' + scope.currentEmbedType.name + '" >' +
								scope.currentEmbedType.parseForEditor() +
							'</figure>' + 
						'</div>';

					if (addNewLine)
					{
						// add a new paragraph after the embed so that user can continue typing
						// TODO : make sure that no one can ever remove this
						//			user could put self in bad editing state
						ret = ret + '<p class="entity-embed-new-line">&nbsp</p>';
					}

					return ret;
				};
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
						currentScope.setModalView(currentScope, embedType);

						if (currentScope.modalType === EntityEmbed.embedModalTypes.selectExisting)
						{
							currentScope.populateSelectExistingView(currentScope);
						}
					}
				);

				// configure save button to call save method
				scope.modalCtrl.registerEvent(embedModalSelectors.buttons.saveEmbed, 'click',
					function(e, currentScope){
						currentScope.saveEmbed(currentScope);
					}
				);

				// configure show-select-existing button to show the select-existing view
				scope.modalCtrl.registerEvent(embedModalSelectors.buttons.showSelectExisting, 'click',
					function(e, currentScope){
						currentScope.modalType = EntityEmbed.embedModalTypes.selectExisting;
						currentScope.populateSelectExistingView(currentScope);

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
						currentScope.showCreateNewEmbedView(currentScope);
					}
				);

				scope.modalCtrl.registerEvent(embedModalSelectors.buttons.selectExisting, 'click',
					function(e, currentScope){
						if ($(embedModalSelectors.buttons.selectExisting).hasClass('disabled'))
						{
							return;
						}

						EntityEmbed.apiService.get(
							currentScope.currentEmbedType.options.httpPaths.get,
							{
								object_id: $('.' + embedModalSelectors.elements.selectExistingActiveItem).attr('id')
							},
							function(data){
								currentScope.currentEmbedType.model = data.response;
								currentScope.modalCtrl.$el.completeModal();
							},
							function(data){
								// TODO: show error UI
								console.log('failed to get embed type!');
							}
						);
					}
				);
			}
		},
		open: {
			before: function(scope){},
			after: function(scope){
				toggleEditorTyping(scope, "false");	

				if (scope.modalType == EntityEmbed.embedModalTypes.edit)
				{
					scope.showEditEmbedView(scope);
					
					EntityEmbed.apiService.get(
						scope.currentEmbedType.options.httpPaths.get,
						{
							object_id: scope.embedId
						},
						function(data){
							scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);

							scope.setModalView(scope, data.response.object_type);
							scope.currentEmbedType.model = data.response;
							scope.staleModel = $.extend(true, {}, data.response); // so we can check if the form is dirty later
							scope.currentEmbedType.populateFormWithModel(scope.currentEmbedType.$view);
						},
						function(data){
							console.log('failed to get embed type!');
						}
					);
				}
				else if (scope.modalType == EntityEmbed.embedModalTypes.add)
				{
					scope.showCreateNewEmbedView(scope);
					scope.resetModalView(scope);
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
				scope.showCreateNewEmbedView(scope);
				toggleEditorTyping(scope, "true");	
			}
		},
		complete: {
			before: function(scope){
				return true;
			},
			after: function(scope){
				toggleEditorTyping(scope, "true");
				var needNewlineAtEnd = $('.entity-embed-new-line').length == 0;
				scope.$currentEditorLocation.html(scope.generateEmbedHtml(scope, needNewlineAtEnd));
			}
		}
	};

	EntityEmbed.embedModalDefaults = embedModalDefaults;
}());
