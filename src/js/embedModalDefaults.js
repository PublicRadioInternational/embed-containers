;(function(){
	var mediumActiveLine = '.medium-insert-active';

	function embedModalDefaults(selEmbedType, selEmbedTypeChildren, medActiveLine)
	{
		if (!!selEmbedType)
		{
			selectEmbedType = selEmbedType;
		}
		if (!!selEmbedTypeChildren)
		{
			selectEmbedTypeChildren = selEmbedTypeChildren;
		}
		if (!!medActiveLine)
		{
			mediumActiveLine = medActiveLine;
		}
	};

	embedModalDefaults.prototype.functions = {
		init:{
			before: function(scope){
				// define necessary fields for scope
				// assume that these are already defined:
				//		scope.$embedTypeSelect
				//		scope.$modalBody
				//		scope.embedTypes

				scope.currentEmbedType = null;
				scope.setModalView= function(scope, embedName){
					scope.currentEmbedType.$view.hide();
					scope.currentEmbedType = scope.embedTypes[embedName];
					scope.currentEmbedType.$view.show();
				};
			},
			after: function(scope){
				// configure the select embed type dropdown dropdown to change the modal view
				scope.$embedTypeSelect.change(function(e){
					// TODO : confirm navigation;
					scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
					var embedType = e.currentTarget.options[e.currentTarget.selectedIndex].value;
					scope.setModalView(scope, embedType);
				});

				var first = true;
				// load embed type views and initialize them
				for(var embedType in scope.embedTypes)
				{
					var embedObject = scope.embedTypes[embedType];

					scope.$embedTypeSelect.append('<option id="' + 
						embedObject.name + '">' + embedObject.options.displayName +
						'</option>');

					scope.$modalBody.append('<div id="' + embedObject.name + '"></div>');

					var $embedView = scope.$modalBody.find('#' + embedObject.name);
					
					$embedView.load(embedObject.options.viewPath, function(response, status, xhr){
						console.log(response);
					});
					embedObject.initModal($embedView);
					embedObject.$view = $embedView;

					if (first)
					{
						scope.currentEmbedType = embedObject;
						first = false;
					}
					else
					{
						$embedView.hide();
					}
				}
			}
		},
		open: {
			before: function(scope){
			},
			after: function(scope){},
		},
		abort: {
			before: function(scope){
				// TODO : leave confirmation (?)
			},
			after: function(scope){
				// TODO : rotate plus icon 45 degrees
				scope.currentEmbedType.clearForm();
			}
		},
		complete: {
			before: function(scope){
				// TODO : form validation
				
				scope.embedModel = scope.currentEmbedType.getModelFromForm(scope.currentEmbedType.$view);
				
				return true;
			},
			after: function(scope){
				$(mediumActiveLine).html(scope.currentEmbedType.fromModalToEditor(scope.embedModel));
				scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
			}
		}
	};

	window.embedModalDefaults = embedModalDefaults;
}(window));