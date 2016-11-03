var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'customText',
		customTextEditorId = 'custom-text-editor',
		defaults = {
			viewPath: 'modal_customText.html',
			displayName: 'Custom Text',
			object_type: 'custom',
			validationOptions: {
				rules : {
					title: 'required',
					customText: 'required'
				}
			}
		},
		customTextEditor;

	// CONSTRUCTOR
	function customTextEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	customTextEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = customTextEmbed;

	// PUBLIC
	customTextEmbed.prototype.orderIndex = 5;

	customTextEmbed.prototype.getModelFromForm = function($form){
		var self = this;
		var $formFields = $form.find('.embed-modal-form-control');

		$formFields.each(function() {
			var $this = $(this);
			var prop = $this.attr('name');
			var editor = $this.data('editor');
			var val;

			if(editor)
			{
				val = editor.getContent();
			}
			else
			{
				val = $this.val();
			}

			val = val.replace(/^\s+|\s+$/, '');

			self.model[prop] = val || null;
		});
	};

	customTextEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			displayTitle: "",
			text: null
		};
	}

	customTextEmbed.prototype.clearForm = function($form, _self){
		var self = _self || this;
		var $formFields = $form.find('.embed-modal-form-control');

		self.parent.clearForm($form, self);

		$formFields.each(function() {
			var $this = $(this);
			var editor = $this.data('editor');

			if(editor)
			{
				editor.setContent('');
			}
			else
			{
				$this.val(null);
			}
		});

		self.model = self.cleanModel();
	};

	customTextEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		var $formFields = $form.find('.embed-modal-form-control');

		$formFields.each(function() {
			var $this = $(this);
			var prop = $this.attr('name');
			var data = self.model[prop];
			var editor = $this.data('editor');

			if(editor)
			{
				editor.setContent(data);
			}
			else
			{
				$this.val(data);
			}
		});
	};

	customTextEmbed.prototype.initModal = function($el, modalCtrl){
		var self = this;
		var $customText = $('#' + customTextEditorId);
		var customTextEditor = new MediumEditor($customText[0], {
			placeholder:{
				text: "Type your text. Highlight words to trigger the styles editor"
			}
		});

		self.parent.initModal($el, modalCtrl);

		$customText.data('editor', customTextEditor);
	};

	customTextEmbed.prototype.parseForEditor = function(){
		var self = this;
		var embedHtml = [
			'<div class="custom-text">' + self.model.customText + '</div>'
		];

		if(self.model.displayTitle)
		{
			embedHtml.unshift('<div class="display-title">' + self.model.displayTitle + '</div>');
		}

		return  '<div class="custom-text-embed entity-embed-secondary-toolbar-locator">' + embedHtml.join('') +'</div>';
	};

})();