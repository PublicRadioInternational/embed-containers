var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'opinary',
		defaults = {
			viewPath: 'modal_opinary.html',
			displayName: 'Opinary',
			object_type: 'opinary',
			validationOptions: {
				rules: {
					title: 'required',
					url: {
						required: true,
						validOpinaryPollUrl: true
					}
				}
			}
		},
		uiElements = {
			intro: '.social_editor-intro',
			previewBtn: '.js-btn-preview',
			preview: '.social_editor-preview',
			previewPost: '.social_editor-preview_post',
			titleInput: '.js-input-title',
			urlInput: '.js-input-url',
			editBtn: '.js-btn-edit',
			cancelBtn: '.js-btn-cancel',
			dropTarget: '.social_editor-intro_inner'
		};

	function registerUiElements(scope, $el) {
		scope.$ui = scope.$ui || {};

		for(var key in uiElements)
		{
			if(uiElements.hasOwnProperty(key))
			{
				scope.$ui[key] = $(uiElements[key], $el);
			}
		}

		return scope.$ui;
	}

	function showIntro(scope) {
		var $ui = scope.$ui;

		// Show cancel button as needed
		$ui.cancelBtn.toggle(!!scope.modalCtrl.isAdd);

		// Show intro
		$ui.intro.show();

		// Hide preview related elements
		$ui.preview.hide();
		$ui.editBtn.hide();
	}

	function showPreview(scope) {
		var $ui = scope.$ui;

		// Append embed html code
		$ui.previewPost.html(scope.parseForEditor());

		// Set title text
		$ui.titleInput.val(scope.model.title);

		// Show edit btn as needed
		$ui.editBtn.toggle(!!scope.modalCtrl.isAdd);

		// Show preview container
		$ui.preview.show();

		// Hide intro related elements
		$ui.intro.hide();
		$ui.cancelBtn.hide();
	}

	function isValidUrl(url) {
		var rgxOpinaryPollUrl = /^(?:https:)?\/\/compass.pressekompass.net\/compasses/i;
		return rgxOpinaryPollUrl.test(url);
	}

	// CONSTRUCTOR
	function opinaryEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	opinaryEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = opinaryEmbed;

	// PUBLIC
	opinaryEmbed.prototype.orderIndex = 14;

	// function to initialize the modal view
	// called after the modal view has loaded
	// $el: a jQuery element for the modal view
	opinaryEmbed.prototype.initModal = function($el, modalCtrl) {
		var self = this;
		var $ui;

		self.parent.initModal($el, modalCtrl, self);

		$ui = registerUiElements(self, $el);

		$.validator.addMethod('validOpinaryPollUrl', function(value, element, params) {
			var isValid = isValidUrl(value);
			return this.optional(element) || isValid;
		}, 'The URL must be to a valid Opinary poll.');

		$ui.previewBtn.on('click', function(evt) {

			evt.preventDefault();

			self.getModelFromForm($el);

			if(isValidUrl(self.model.url))
			{
				showPreview(self);
			}
		});

		$ui.editBtn.on('click', function(evt) {
			evt.preventDefault();
			showIntro(self);
		});

		$ui.cancelBtn.on('click', function(evt) {
			evt.preventDefault();
			showPreview(self);
		});

		$ui.dropTarget
			.on('dragenter dragover', function() {
				$(this).addClass('js-dragover');
			})
			.on('dragleave drop', function() {
				$(this).removeClass('js-dragover');
			})
			.on('drop', function(evt) {

				evt.stopPropagation();
				evt.preventDefault();

				var droppedString = evt.originalEvent.dataTransfer.getData('text/plain');
				var droppedHtml = evt.originalEvent.dataTransfer.getData('text/html');
				var $droppedElm = $( droppedHtml );
				var $context = $('<div>');
				var droppedUrl;

				if(!!droppedString)
				{
					droppedUrl = droppedString;
				}
				else if(!!$droppedElm.length)
				{
					$context.append($droppedElm);
					droppedUrl = $context.find('[href]').attr('href');
				}

				if(!!droppedUrl && isValidUrl(droppedUrl))
				{
					$ui.urlInput.val(droppedUrl);
					$ui.previewBtn.click();
				}
			});

		$(document).on('dragover drop', function(event) {
			event.preventDefault();
		});
	};

	opinaryEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url: null,
			object_type: defaults.object_type
		};
	};

	opinaryEmbed.prototype.clearForm = function($el) {
		var self = this;

		self.parent.clearForm($el, self);

		showIntro(self);

		self.$ui.previewPost.empty();
	};

	opinaryEmbed.prototype.getModelFromForm = function($form) {
		var self = this;
		var promise = $.Deferred();

		// Gather fields data
		self.parent.getModelFromForm($form.find('form').first(), self);

		if(!!self.model.object_id)
		{
			// Not a new embed. Don't need to check for duplication when editing.
			promise.resolve(self.model);
		}
		else
		{
			// Get Opinary embeds that have matching URL
			EntityEmbed.apiService.get({
				path: self.options.httpPaths.getAll,
				data: {
					url: self.model.url,
					object_type: self.options.object_type
				}
			})
			.done(function(resp) {
				var items = resp.response && resp.response.data || [];

				if(!!items.length && items[0].url === self.model.url)
				{
					// Use object_id from first item
					self.model.object_id = items[0].object_id;
					// Make sure original title is used
					self.model.title = items[0].title;
					self.$ui.titleInput.val(self.model.title);
				}
			})
			.always(function() {
				// Always resolve to keep things moving.
				promise.resolve(self.model);
			});
		}

		return promise;
	};

	opinaryEmbed.prototype.populateFormWithModel = function($form) {
		var self = this;
		var $ui = self.$ui;

		self.parent.populateFormWithModel($form.find('form').first(), self);

		// Show video player and title
		if(!self.model.object_id)
		{
			showIntro(self);
		}
		else
		{
			showPreview(self);
		}
	};

	opinaryEmbed.prototype.parseForEditor = function(){
		var html = [
			'<div class="opinary-widget-wrapper" style="width: 100%; max-width: 600px; height:100%; margin:0 auto;">',
				'<div class="opinary-widget" style="position:relative; padding-top: 100%;">',
					'<iframe src="' + this.model.url + '" class="opinary-iframe" frameborder="0" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"></iframe>',
				'</div>',
			'</div>',
			'<script src="//compass.pressekompass.net/static/opinary.js"></script>'
		].join('');

		return html;
	};

})();