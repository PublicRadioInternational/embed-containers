var EntityEmbed = EntityEmbed || {};

;(function(){

	function embedModalDefaults() {};

	// MODAL TYPE ENUM
	EntityEmbed.embedModalTypes = {
		add: 0,
		edit: 1
		//SelectExisting: 2
	};

	var enableContentEditable = function(scope){
		//enable typing in the editor by finding the first class
		var currentEditorClass = scope.$currentEditorLocation[0].parentNode.className;
		currentEditorClass = currentEditorClass.split(" ");
		$("." + currentEditorClass[0]).attr("contenteditable", "true");

	}

	embedModalDefaults.prototype.functions = {
		init:{
			before: function(scope){
				// define necessary fields for scope
				// assume that these are already defined:
				//		scope.modalCtrl			(default for all modals from modal.js)
				//		scope.$embedTypeSelect
				//		scope.$currentEditorLocation
				//		scope.$modalBody
				//		scope.embedTypes

				scope.currentEmbedType = null;
				
				scope.setModalView = function(scope, embedName){
					if (!embedName)
					{
						return;
					}

					if (!!scope.currentEmbedType)
					{
						scope.currentEmbedType.$view.hide();
						scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
					}

					scope.currentEmbedType = $.grep(scope.embedTypes, function(et){
						return et.name == embedName;
					})[0];

					scope.currentEmbedType.$view.show();
					scope.$embedTypeSelect[0].selectedIndex = scope.currentEmbedType.optionIndex;
				};

				scope.resetModalView = function(scope){
					var embedName = scope.embedTypes[0].name;
					scope.setModalView(scope, embedName);
				};

				scope.saveEmbed = function(scope){
					scope.currentEmbedType.getModelFromForm(scope.currentEmbedType.$view);

					if (scope.modalType == EntityEmbed.embedModalTypes.edit)
					{
						scope.currentEmbedType.model.object_id = scope.currentEmbedType.model.id;

						EntityEmbed.apiService.put(
							scope.currentEmbedType.options.httpPaths.put, 
							scope.currentEmbedType.model,
							// TODO : save spinner
							function(data){
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
						EntityEmbed.apiService.post(
							scope.currentEmbedType.options.httpPaths.post, 
							scope.currentEmbedType.model,
							// TODO : save spinner
							function(data){
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
				};

				scope.generateEmbedHtml = function(scope){
					scope.$currentEditorLocation.addClass('entity-embed-center');
					scope.$currentEditorLocation.addClass('entity-embed-editor-line');

					var figureClass = 'entity-embed'
					if (!!scope.currentEmbedType.defaultStyle)
					{
						figureClass += ' ' + scope.currentEmbedType.defaultStyle;
					}

					return '<figure contenteditable="false" class="' + figureClass + '" ' + 
								'id="' + scope.currentEmbedType.model.object_id + '" ' + 
								'data-embed-type="' + scope.currentEmbedType.name + '">' +
								scope.currentEmbedType.parseForEditor() +
							'</figure>' + 
							// ad a new paragraph after the embed so that user can continue typing
							'<p>' + 
								'<br />' + 
							'</p>';
				};
			},
			after: function(scope){
				// configure the select embed type dropdown dropdown to change the modal view
				scope.$embedTypeSelect.change(function(e){
					// TODO : confirm navigation
					// TODO : find a better way to manage scope - this code smells
					//			possible solution: register events in modal.js

					var currentScope = scope.$modalBody.parent().parent().data('scope');
					currentScope.currentEmbedType.clearForm(currentScope.currentEmbedType.$view);
					var embedType = e.currentTarget.options[e.currentTarget.selectedIndex].value;
					currentScope.setModalView(currentScope, embedType);
				});

				$('#btn-save-modal').click(function(){
					// TODO : find a better way to manage scope - this code smells
					//			possible solution: register events in modal.js

					var currentScope = scope.$modalBody.parent().parent().data('scope');
					scope.saveEmbed(currentScope);
				});

				var optionIndex = 0;

				for(var i = 0; i < scope.embedTypes.length; i++)
				{
					var embedObject = scope.embedTypes[i];
					// create option in dropdown for this embed
					scope.$embedTypeSelect.append('<option value="' + 
						embedObject.name + '">' + embedObject.options.displayName +
						'</option>');

					// create the embed view container and load the view into it
					scope.$modalBody.append('<div id="' + embedObject.name + '"></div>');
					var $embedView = scope.$modalBody.find('#' + embedObject.name);
					$embedView.load(embedObject.options.viewPath, function(response, status, xhr){
						// TODO : load error message on failure
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
			}
		},
		open: {
			before: function(scope){
				$('#embed-modal-save-warning').hide();

				//Disable typing in the editor by finding the first class
				var currentEditorClass = scope.$currentEditorLocation[0].parentNode.className;
				currentEditorClass = currentEditorClass.split(" ");
				$("." + currentEditorClass[0]).attr("contenteditable", "false");

				if (scope.modalType == EntityEmbed.embedModalTypes.edit)
				{
					scope.$embedTypeSelect.hide();
					scope.setModalView(scope, scope.embedType);
					
					// TODO : loading spinner
					EntityEmbed.apiService.get(
						scope.currentEmbedType.options.httpPaths.get,
						{ object_id: scope.embedId },
						function(data){
							scope.currentEmbedType.model = data.response;
							scope.currentEmbedType.populateFormWithModel(scope.currentEmbedType.$view);
						},
						function(data){
							console.log('failed to get embed type!');
						}
					);
				}
				else // this is an add modal
				{
					scope.$embedTypeSelect.show();
					scope.resetModalView(scope);
				}
			},
			after: function(scope){},
		},
		abort: {
			before: function(scope){},
			after: function(scope){
				enableContentEditable(scope);

			}
		},
		complete: {
			before: function(scope){
				return true;
			},
			after: function(scope){
				enableContentEditable(scope);
				scope.$currentEditorLocation.html(scope.generateEmbedHtml(scope));
			}
		}
	};

	EntityEmbed.embedModalDefaults = embedModalDefaults;
}());
