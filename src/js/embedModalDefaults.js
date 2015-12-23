;(function(wndw){
	var selectEmbedType = $('#select-embed-type');
	var selectEmbedTypeChildren = 'option';
	var mediumActiveLine = $('.medium-insert-active');

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

	embedModalDefaults.prototype.init = {
		before: function(scope){
			// define necessary contents
			scope.contents = {
				embedView: null,
				embedType: null,
				embedModel: null
			};

			// define commonly used opterations
			scope.functions = {
				// hide all embed forms except the one specified
				// by the first option
				setModalView: function(scope, optionIndex){
					var selOption = $('');
					var emType = '';
					var options = selectEmbedType.children(selectEmbedTypeChildren);

					if (!optionIndex || !options[optionIndex])
					{
						console.log('ERROR: Invalid option index passed to setModalView.')	
					}
					
					selectEmbedType.selectedIndex = optionIndex;

					emType = options[optionIndex].value;
					selOption = $('#' + emType);
					selOption.show();

					for(var i = 1; i < options.length; i++)
					{
						if (!!options[i].value)
						{
							$('#' + options[i].value).hide();
						}
					}

					scope.contents.embedView = selOption;
					scope.contents.embedType = emType;
				},
				clearForm: function(el){
					var formFields = el.find('.form-control');
					for(var i = 0; i < formFields.length; i++)
					{
						if (formFields[i].type.indexOf('select') !== -1)
						{
							formFields[i].selectedIndex = 0;
						}
						else
						{
							formFields[i].value = null;
						}
					}
				},
				getModelFromForm: function(el){
					var model = {};
					var formFields = el.find('.form-control');
					for(var i = 0; i < formFields.length; i++)
					{
						var name = formFields[i].name;
						var value = formFields[i].value;
						if (!!name && !!value)
						{
							model[name] = value;
						}
					}
					return model;
				}
			};
		},
		after: function(scope){
			// configure the select embed type dropdown dropdown
			// to change the modal view
			selectEmbedType.change(function(e){
				if (!!scope.contents.embedView)
				{
					scope.contents.embedView.hide();
				}

				scope.contents.embedType = e.currentTarget.options[e.currentTarget.selectedIndex].value;
				scope.contents.embedView = $('#' + scope.contents.embedType);							
				scope.contents.embedView.show();
			});
		}
	};

	embedModalDefaults.prototype.open = {
		before: function(scope){
			scope.functions.setModalView(scope, 0);
		},
		after: function(scope){}
	};

	embedModalDefaults.prototype.abort = {
		before: function(scope){
			// TODO : leave confirmation (?)
		},
		after: function(scope){
			// TODO : rotate plus icon 45 degrees
			scope.functions.clearForm(scope.contents.embedView);
		}
	};

	embedModalDefaults.prototype.complete = {
		before: function(scope){
			// TODO : form validation
			// TODO : make embed object classes with parsers

			scope.contents.embedModel = scope.functions.getModelFromForm(scope.contents.embedView);
			scope.contents.embedModel.embedType = scope.contents.embedType;

			return true;
		},
		after: function(scope){
			$('.medium-insert-active').html('<pre>' + 
				JSON.stringify(scope.contents.embedModel) + '</pre>');
			
			scope.functions.clearForm(scope.contents.embedView);
		}
	};

	wndw.embedModalDefaults = embedModalDefaults;
}(window));