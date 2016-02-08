var EntityEmbed = EntityEmbed || {};

;(function(){

	function embedModalDefaults() {};

	// MODAL TYPE ENUM
	EntityEmbed.embedModalTypes = {
		add: 0,
		edit: 1
		//SelectExisting: 2
	};

	embedModalDefaults.prototype.functions = {
		init:{
			before: function(scope){
				// define necessary fields for scope
				// assume that these are already defined:
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

					scope.currentEmbedType = scope.embedTypes[embedName];
					scope.currentEmbedType.$view.show();
					scope.$embedTypeSelect[0].selectedIndex = scope.currentEmbedType.optionIndex;
				};

				scope.resetModalView = function(scope){
					var embedName = scope.$embedTypeSelect.children('option')[0].value;
					scope.setModalView(scope, embedName);
				}

				scope.generateEmbedHtml = function(scope)
				{
					scope.$currentEditorLocation.addClass('entity-embed-center');
					scope.$currentEditorLocation.addClass('entity-embed-editor-line');

					var figureClass = 'entity-embed'
					if (!!scope.currentEmbedType.defaultStyle)
					{
						figureClass += ' ' + scope.currentEmbedType.defaultStyle;
					}

					return '<figure contenteditable="false" class="' + figureClass + '">' +
								scope.currentEmbedType.parseForEditor() +
							'</figure>' + 
							'<p>' + 
								'<br />' + 
							'</p>';
				}
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

				var optionIndex = 0;
				// load embed type views and initialize them
				for(var embedType in scope.embedTypes)
				{
					var embedObject = scope.embedTypes[embedType];

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
					for(var embedType in scope.embedTypes)
					{
						var embedObject = scope.embedTypes[embedType];
						embedObject.initModal(embedObject.$view);
					}
				}, 200);
			}
		},
		open: {
			before: function(scope){
				if (scope.modalType == EntityEmbed.embedModalTypes.edit)
				{
					scope.$embedTypeSelect.hide();
					scope.setModalView(scope, scope.editModel.embedName);
					
					// TODO : loading spinner
					EntityEmbed.apiService.get(
						scope.currentEmbedType.options.httpPaths.get + editModel.id,
						function(data){
							scope.currentEmbedType.model = data
							delete scope.editModel;
							scope.currentEmbedType.populateFormWithModel(scope.currentEmbedType.$view);
							scope.loading == false;
						},
						function(data){
							console.log('failed to get embed type!');
						}
					);
				}
				else // this options.is an add modal
				{
					scope.$embedTypeSelect.show();
					scope.resetModalView(scope);
				}
			},
			after: function(scope){},
		},
		abort: {
			before: function(scope){
				// TODO : leave confirmation (?)
			},
			after: function(scope){
				// TODO : rotate plus icon 45 degrees
			}
		},
		complete: {
			before: function(scope){
				// TODO : form validation
				return true;
				
			},
			after: function(scope){
				scope.currentEmbedType.getModelFromForm(scope.currentEmbedType.$view);
				scope.currentEmbedType.model.embedName = scope.currentEmbedType.name;

				scope.$currentEditorLocation.html(scope.generateEmbedHtml(scope));

				scope.currentEmbedType.model.auth_token='abc123';
				scope.currentEmbedType.model.debug=1;


				if (scope.modalType == EntityEmbed.embedModalTypes.edit)
				{
					scope.currentEmbedType.model.story_id = scope.currentEmbedType.model.id;
					delete scope.currentEmbedType.model.id;

					EntityEmbed.apiService.put(
						scope.currentEmbedType.options.httpPaths.put, 
						scope.currentEmbedType.model,
						// TODO : save spinner
						function(data){
							console.log('success!');
							scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
						}, 
						function(data){
							console.log('failure!');
						}
					);
				}

				else if (scope.modalType == EntityEmbed.embedModalTypes.add){
					EntityEmbed.apiService.post(
						scope.currentEmbedType.options.httpPaths.post, 
						scope.currentEmbedType.model,
						// TODO : save spinner
						function(data){
							// should get an id back in data - put that on the html
							console.log('success!');
							scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
						}, 
						function(data){
							console.log('failure!');
						}
					);
				}
			}
		}
	};

	EntityEmbed.embedModalDefaults = embedModalDefaults;
}());