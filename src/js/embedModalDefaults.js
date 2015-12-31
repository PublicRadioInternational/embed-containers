;(function(){
	var mediumActiveLine = '.medium-insert-active';

	function embedModalDefaults(medActiveLine)
	{
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
				
				scope.setModalView = function(scope, embedName){
					scope.currentEmbedType.$view.hide();
					scope.currentEmbedType = scope.embedTypes[embedName];
					scope.currentEmbedType.$view.show();
				};

				scope.generateEmbedHtml = function(scope)
				{
					var embedHtml = scope.currentEmbedType.parseForEditor();

					return '<figure  class="' +
						scope.currentEmbedType.name +
						'">' + embedHtml + '</figure>';
				}
			},
			after: function(scope){
				// configure the select embed type dropdown dropdown to change the modal view
				scope.$embedTypeSelect.change(function(e){
					// TODO : confirm navigation;
					scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
					var embedType = e.currentTarget.options[e.currentTarget.selectedIndex].id;
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
						// TODO : load error message on failure
					});
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
			},
			after: function(scope){},
		},
		abort: {
			before: function(scope){
				// TODO : leave confirmation (?)
			},
			after: function(scope){
				// TODO : rotate plus icon 45 degrees
				scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
			}
		},
		complete: {
			before: function(scope){
				// TODO : form validation
				
				scope.embedModel = scope.currentEmbedType.getModelFromForm(scope.currentEmbedType.$view);
				
				return true;
			},
			after: function(scope){
				$(mediumActiveLine).html(scope.generateEmbedHtml(scope));
				scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
			}
		}
	};

	window.embedModalDefaults = embedModalDefaults;
}(window));