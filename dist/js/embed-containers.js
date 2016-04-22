var EntityEmbed = EntityEmbed || {};

(function(){

	var defaultConfig = {
		data: {},
		debug: 0,
		auth_token: '',
		path: ''
	};

	function ajaxWrapper(config){
		config = $.extend(true, {}, defaultConfig, config);
		config.data.debug = config.debug;
		config.data.auth_token = config.auth_token;

		return $.ajax({
				timeout: 15000,
				crossDomain: true,
				type: config.methodType, 
				dataType: 'json',
				url: config.path,
				data: JSON.stringify(config.data)
			});
	};

	// TODO : refactor this - we (probably) only need one function, since everything uses POST now
	function put(config) {
		config.methodType = 'POST';
		return ajaxWrapper(config);
	};

	function post(config) {
		config.methodType = 'POST';
		return ajaxWrapper(config);
	};

	function get(config) {
		config.methodType = 'POST';
		return ajaxWrapper(config);
	};

	function setAuthToken(token){
		defaultConfig.auth_token = token;
	};

	function getAuthToken(token){
		return defaultConfig.auth_token;	
	};

	// determine debug level
	var rgxDevEnv = /^[^.]*staging[^.]*\.|\.dev$/;
	var isDevEnv = rgxDevEnv.test(window.location.host);
	if (isDevEnv){
		defaultConfig.debug = 1;
		setAuthToken('abc123');
	}

	// expose necesary functionality
	EntityEmbed.apiService = {
		put: put,
		post: post,
		get: get,
		setAuthToken: setAuthToken,
		getAuthToken: getAuthToken
	};	
})();
var EntityEmbed = EntityEmbed || {};

(function(){

	// PRIVATE

	var $toolbars = {},	// field name identifies embed type by name
						// field value is jQuery object of toolbar HTML
		activeEmbedClass = 'entity-embed-active',	// class name given to active (selected) embeds
		activeToolbarBtnClass = 'medium-editor-button-active', // class name given to the active toolbar button
		styleToolbarClass = 'medium-insert-images-toolbar', // class name given to the medium insert toolbar
		actionToolbarClass = 'medium-insert-images-toolbar2', // class name given to the secondary toolbar
		actionToolbarLocatorClass = 'entity-embed-secondary-toolbar-locator',
		entityEmbedEditorLineClass = 'entity-embed-editor-line', // class name given to a line (<p> element) in the editor on which an entity is embedded
		entityEmbedContainerClass = 'entity-embed-container', // class name given to the objects which contain entity embeds
		toolbarHtml = function(configs, embedName){ // function that creates the HTML for a toolbar
			// TODO change class names
			var toolbarClasses = '';
			if (!!embedName) // this is a styles toolbar (specific to embed)
			{
				toolbarClasses = 'medium-insert-images-toolbar medium-editor-toolbar medium-toolbar-arrow-under medium-editor-toolbar-active ';
				toolbarClasses += embedName + 'StyleToolbar'
			}
			else // this is an action toolbar (not specific to embed)
			{
				toolbarClasses = 'medium-insert-images-toolbar2 medium-editor-toolbar medium-editor-toolbar-active';
			}

			var htmlString =
				'<div class="' + toolbarClasses + '">' +
					'<ul class="medium-editor-toolbar-actions clearfix">';

			for(var configName in configs)
			{
				var config = configs[configName];
				if (!config.label)
				{
					continue;
				}
				htmlString +=
						'<li>' +
							'<button class="medium-editor-action" data-action="' + configName + '">' +
								config.label +
							'</button>' +
						'</li>';
			}


			htmlString +=
					'</ul>' +
				'</div>';

			return htmlString;
		};

	// CONSTRUCTOR
	toolbarManager = function(mediumEditorAddon, toolbarStyles, toolbarActions, activeEmbedClassParam){
		var self = this;
		self.mediumEditorAddon = mediumEditorAddon;
		self.styles = toolbarStyles;
		self.actions = toolbarActions;
		if (!!activeEmbedClassParam)
		{
			activeEmbedClass = activeEmbedClassParam;
		}
		self.events();
	};

	// PUBLIC
	toolbarManager.prototype.events = function(){
		var self = this;
		$(document)
			// fire toolbar actions when buttons are clicked
			.on('click', '.' + styleToolbarClass + ' .medium-editor-action', function(){
				self.styleToolbarDo($(this));
			})
			// fire secondary toolbar actions when buttons are clicked
			.on('click', '.' + actionToolbarClass + ' .medium-editor-action', function(){
				self.actionToolbarDo($(this));
			})
	};

	toolbarManager.prototype.createActionToolbar = function($location) {
		var self = this;
		$location.append(toolbarHtml(self.actions)); // trim?
		self.$actionToolbar = $('.' + actionToolbarClass);
		self.$actionToolbar.hide();
	}

	toolbarManager.prototype.createStyleToolbar = function($location, embed) {
		var self = this;
		var stylesCopy = $.extend(self.styles, {});
		var deletedEveryField = true;
		if (!embed.options.styles)
		{
			return;
		}
		for(var style in embed.options.styles)
		{
			if (!embed.options.styles[style])
			{
				delete stylesCopy[style];
			}
			else
			{
				deletedEveryField = false;
			}
		}

		if (!deletedEveryField)
		{
			$location.append(toolbarHtml(stylesCopy, embed.name));
			$toolbars[embed.name] = $('.' + styleToolbarClass + '.' + embed.name + 'StyleToolbar');
			$toolbars[embed.name].hide();
		}
	};

	// $embed is the embed html element
	// embedType is the name of the embed (name field on embed object)
	toolbarManager.prototype.showToolbars = function($embed, embedType) {
		var self = this;
		var $activeLine = $('.' + activeEmbedClass);
		var $activeButton;
		self.currentToolbarEmbedType = embedType;

		self.$actionToolbar.show();

		if (!!$toolbars[self.currentToolbarEmbedType])
		{
			$toolbars[self.currentToolbarEmbedType].find('button').each(function () {
				if($activeLine.hasClass('entity-embed-' + $(this).data('action')))
				{
					$activeButton = $(this);
					$activeButton.addClass(activeToolbarBtnClass);
				}
			});

			$toolbars[self.currentToolbarEmbedType].show();

			if (!!$activeButton)
			{
				$activeButton.addClass(activeToolbarBtnClass);
			}
		}

		self.positionToolbars($embed);
	};

	toolbarManager.prototype.styleToolbarDo = function($buttonClicked) {
		var self = this;
		var $buttonList = $buttonClicked.closest('li').closest('ul');
		var $activeLine = $('.' + activeEmbedClass);

		// change the active button to this one
		// there should only be one active button
		$buttonList
			.find('.' + activeToolbarBtnClass)
			.removeClass(activeToolbarBtnClass);
		$buttonClicked.addClass(activeToolbarBtnClass);

		$buttonList.find('button').each(function(){
			var $curButton = $(this);
			var className = 'entity-embed-' + $curButton.data('action');

			if ($curButton.hasClass(activeToolbarBtnClass))
			{
				self.addStyle($activeLine, className, $curButton.data('action'), true);
			}
			else
			{
				$activeLine.removeClass(className);
				if (!!self.styles[$curButton.data('action')].removed)
				{
					self.styles[$curButton.data('action')].removed($activeLine)
				}
			}
		});

		self.mediumEditorAddon.core.triggerInput();
	};

	toolbarManager.prototype.addStyle = function($activeLine, styleClass, buttonAction, shouldPositionToolbar){
		var self = this;

		$activeLine.addClass(styleClass);
		if (!!self.styles[buttonAction].added)
		{
			self.styles[buttonAction].added($activeLine)
		}
		if (shouldPositionToolbar)
		{
			setTimeout(function(){
				self.positionToolbars($('.' + activeEmbedClass));
			}, 50);
		}
	};


	toolbarManager.prototype.actionToolbarDo = function($toolbarButton) {
		var self = this;
		var $activeEmbed = $('.' + activeEmbedClass);
		var action = self.actions[$toolbarButton.data('action')].clicked;
		action(self.mediumEditorAddon, $activeEmbed);
	};

	toolbarManager.prototype.hideToolbar = function(){
		var self = this;

		self.$actionToolbar.hide();
		self.$actionToolbar.find('button').removeClass(activeToolbarBtnClass);

		if (!self.currentToolbarEmbedType || !$toolbars[self.currentToolbarEmbedType])
		{
			return;
		}
		$toolbars[self.currentToolbarEmbedType].hide();
		$toolbars[self.currentToolbarEmbedType].find('button').removeClass(activeToolbarBtnClass);
		self.currentToolbarEmbedType = null;
	};

	toolbarManager.prototype.positionToolbars = function($embed) {
		var self = this;

		// position action tool bar

		// TODO : position action tool bar in a way that doesn't suck
		//			this positioning frequently interferes with the other toolbar

		var $toolbarLocator = $embed.find('.' + actionToolbarLocatorClass);
		if ($toolbarLocator.length === 0)
		{
			$toolbarLocator = $embed;
		}

		top = $embed.offset().top + 2; // 2px - distance from a border
		var left = $toolbarLocator.offset().left + $toolbarLocator.width() + 4; // 4px - distance from border

		if (left > ($(window).width() - self.$actionToolbar.width()))
		{
			top -= (self.$actionToolbar.height() + 8); //8 px - distance from border
			left = ($(window).width() - self.$actionToolbar.width()) - 50; // 50 px - addittional room
		}

		self.$actionToolbar
			.css({
				top: top,
				left: left
			});

		// get current styles toolbar
		var $stylesToolbar = $toolbars[self.currentToolbarEmbedType];
		if (!$stylesToolbar)
		{
			return;
		}

		// position styles toolbar

		var top = $embed.offset().top - $stylesToolbar.height() - 8 - 2 - 5; // 8px - hight of an arrow under toolbar, 2px - height of an image outset, 5px - distance from an image
		if (top < 0)
		{
			top = 0;
		}

		$stylesToolbar
			.css({
				top: top,
				left: $embed.offset().left + $embed.width() / 2 - $stylesToolbar.width() / 2
			});
	};

	EntityEmbed.toolbarManager = toolbarManager;
})();
var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// CONSTRUCTOR
	function genericEmbed(options, defaults, embedName, ref){
		var self = ref || this;
		self.name = embedName;
		defaults = $.extend(true, {}, self.defaultOptions, defaults);
		self.options = $.extend(true, {}, defaults, options);
		self.init();
	};

	// PUBLIC
	genericEmbed.prototype.defaultOptions = {
		viewPath: '',
		displayName: 'Generic',
		httpPaths:{
			put: 'https://test-services.pri.org/admin/embed/edit',	// TODO : rename API path handle (put is now a misnomer)
			post: 'https://test-services.pri.org/admin/embed/edit',
			get: 'https://test-services.pri.org/admin/embed/fetch',
			getAll: 'https://test-services.pri.org/admin/embed/list'
		},
		styles: {
			left: true,
			right: true,
			center: true,
			wide: true
		},
		validationOptions: {}
	};

	genericEmbed.prototype.cleanModel = function(){
		return {};
	};

	genericEmbed.prototype.defaultStyle = 'entity-embed-center'; 

	genericEmbed.prototype.init = function(){
		var self = this;
		self.model = self.cleanModel();
	};

	// function to initialize the modal view
	// called after the modal view has loaded
	// $el: a jQuery element for the modal view
	genericEmbed.prototype.initModal = function($el){
		var self = this;
	};

	genericEmbed.prototype.getModelFromForm = function($el, child){
		var self = child || this;
		var formFields = $el.find('.embed-modal-form-control, .embed-modal-file-input');
		for(var i = 0; i < formFields.length; i++)
		{
			var name = formFields[i].name;
			var type = formFields[i].type;
			var value = null;
			if (type === 'file')
			{
				value = formFields[i].files[0];
			}
			else
			{
				value = formFields[i].value;
			}
			if (!!name)
			{
				self.model[name] = value;
			}
		}
	};

	genericEmbed.prototype.populateFormWithModel = function($form, child){
		var self = child || this;
		var formFields = $form.find('.embed-modal-form-control');
		for (var i = 0; i < formFields.length; i++)
		{
			if (!!formFields[i].type && formFields[i].type.indexOf('file') !== -1)
			{
				continue;
			}
			if (!!formFields[i].type && formFields[i].type.indexOf('select') !== -1)
			{
				var options = $(formFields[i]).find('option');
				var selectedOption = self.model[formFields[i].name];
				var optionIndex = 0;
				options.each(function(index){
					if (this.value === selectedOption)
					{
						optionIndex = index;
					}
				});
				formFields[i].selectedIndex = optionIndex;
			}
			else if (!!self.model[formFields[i].name])
			{
				formFields[i].value = self.model[formFields[i].name];
			}
		}
	};
	// TODO: Get rid of self paramater. See inherits function
	genericEmbed.prototype.clearForm = function($el, child){
		var self = child || this;

		if(!!self.$validator)
		{	
 			self.$validator.resetForm();
		}
		var formList = $el.find('form');
		for (var i = 0; i < formList.length; i++)
		{
			formList[i].reset();
		}
	 	self.model = self.cleanModel();
	};

	genericEmbed.prototype.editorEvents = function(){};

	genericEmbed.prototype.parseForEditor = function(){
		var self = this;
		return	'<div class="embedded-content">' +
					'<div class="ui-text"> <strong>Embed Type: </strong>' 	+ self.options.object_type + '</div>' +
					'<div class="ui-text"> <strong>Title: </strong> ' 		+ self.model.title + '</div>' +
				'</div>';
	};

	// returns validator object
	genericEmbed.prototype.validate = function($el, isAddModal, child){
		var self = child || this;
		var $form = $el;
		if (!$form.is('form'))
		{
			$form = $el.find('form');
		}
		self.$validator = $form.validate(self.options.validationOptions);
		return self.$validator;
	};

	// ASSUMPTION - model is already populated
	// TODO : embedIsNew can be determined programatically (check if model has object_id)
	genericEmbed.prototype.saveEmbed = function(embedIsNew, child){
		var self = child || this;

		if (embedIsNew){
			// add the object_type onto the model
			//		this code smells, do something better here... maybe put in cleanModel?
			self.model.object_type = self.options.object_type;

			return EntityEmbed.apiService.post({
				path: self.options.httpPaths.post, 
				data: self.model
			});
		}
		else
		{
			return EntityEmbed.apiService.put({
				path: self.options.httpPaths.put, 
				data: self.model
			});
		}
	};

	EntityEmbed.embedTypes = {
		genericEmbed: genericEmbed
	};

	// augment Function to enable simple inheritance, if not already done so
	if (!Function.prototype.inherits)
	{
		Function.prototype.inherits = function(parent){
			var self = this;
			self.prototype = new parent; // TODO: Better way to mock protected data members
			self.prototype.constructor = self;
			self.prototype.parent = parent.prototype;
			return self;
		};
	}
})();

;(function () {
	
	'use strict';

	var defaultOptions = {
		contentClass: 'embed-modal',
		backdropClass: 'embed-modal-backdrop',
		closeBtnIcon: 'fa fa-times',
		showCloseBtn: true,
		// TODO : add boolean to disable backdrop click to close
		// elements to open, abort, or complete the modal on click
		$openEl: $(''),
		$abortEl: $(''),
		$completeEl: $(''),
		functions:{ // TODO : rename to hooks
			init:{
				before: function(scope){},
				after: function(scope){}
			},
			open:{
				before: function(scope){},
				after: function(scope){}
			},
			abort:{
				before: function(scope){
					return true;
				},
				after: function(scope){}
			},
			complete:{
				before: function(scope){
					return true;
				},
				after: function(scope){}
			}
		}
	};

	function modal(el, options, scope) {	
		var self = this;

		// TODO : only store modal element on scope (no need to have it in two places)
		self.$el = $(el);

		self.options = $.extend(true, {}, defaultOptions, options);
		self.scope = {};
		if (!!scope)
		{
			self.scope = scope;
		}

		self.scope.modalCtrl = self;
		self.$el.data('scope', self.scope);
		
		self.options.functions.init.before(self.scope);
		self.init();
		self.options.functions.init.after(self.scope);
	};

	modal.prototype.isActive = false;
	modal.prototype.activeClass = 'em-active';
	modal.prototype.closeBtnClass = 'em-close-btn';

	// generates a pseudo guid (not guatanteed global uniqueness)
	modal.prototype.generateId = function () {
		var seg = function()
		{
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return seg() + seg() + '-' + seg() + '-' + seg() + '-' +
				seg() + '-' + seg() + seg() + seg();
	};
	
	modal.prototype.backdropHtml = function(id)
	{
		var self = this;
		return '<div id="' + id + '" class="' 
			+ self.options.backdropClass + '"></div>';
	};

	modal.prototype.closeBtnHtml = function(id)
	{
		var self = this;
		var style = self.closeBtnClass + ' ' + self.options.closeBtnIcon;
		return '<i id="' + id + '"" class="' + style + '"></i>';
	};

	modal.prototype.toggle = function(ctrl)
	{
		ctrl.$el.toggleClass(ctrl.activeClass);	
		ctrl.$backdrop.toggleClass(ctrl.activeClass);
		ctrl.$closeBtn.toggleClass(ctrl.activeClass);
		ctrl.isActive = !ctrl.isActive;
	};

	modal.prototype.init = function()
	{
		var self = this;

		// style this class as a modal and
		self.$el.addClass(self.options.contentClass);

		var backdropId = self.generateId();

		// link back drop to this modal
		self.$el.before(self.backdropHtml(backdropId));
		self.$backdrop = $('#' + backdropId);
		self.$backdrop.click(function(){
			self.$el.abortModal();
		});
	
		// add close button and give expected functionality
		if (self.options.showCloseBtn){
			var closeBtnId = self.generateId();
			self.$el.prepend(self.closeBtnHtml(closeBtnId));
			self.$closeBtn = $('.' + self.closeBtnClass + '#' + closeBtnId);
			self.$closeBtn.click(function(){
				self.$el.abortModal();
			});
		}

		// register user specified triggers that open this modal
		self.options.$openEl.click(function(){
			self.$el.openModal();
		});

		// register user specified triggers that complete this modal
		self.options.$completeEl.click(function(){
			self.$el.completeModal();
		});

		// register user specified triggers that abort this modal
		self.options.$abortEl.click(function(){
			self.$el.abortModal();
		});
	};

	/* 
	 * -- registers an event for the modal --
	 *
	 * element : the string selector or JQuery object for the element
	 *				on which the eventlistener is instantiated
	 * eventType : the event, i.e. 'click', 'keydown', 'mouseOver', etc.
	 * action : the function that fires when the event is called, it will
	 *			always be passed the default event parameter, scope, and
	 * params : an object to wrap up parameters for action
	 *
	 */
	modal.prototype.registerEvent = function(element, eventType, action, params){
		var self = this;
		self.$el.find(element).on(eventType, function(e){
			action(e, self.$el.data('scope'), params);
		});
	};

	$.fn.modal = function(options, scope){
		return this.each(function(){
			// avoid null reference errors
			if (!options)
			{
				options = {};
			}
			$.data(this, 'ctrl', new modal(this, options, scope));
		});
	};

	$.fn.openModal = function(addToScope){
		var modalCtrl = $.data(this[0], 'ctrl');
		// TODO : decrease cyclomatic complexity
		if (!!modalCtrl)
		{
			if (!!addToScope)
			{
				var currentScope = modalCtrl.$el.data('scope');
				var newScope = $.extend(true, {}, currentScope, addToScope);
				modalCtrl.$el.data('scope', newScope);
			}

			var modalScope = modalCtrl.$el.data('scope');
			modalCtrl.promise = $.Deferred();

			modalCtrl.options.functions.open.before(modalScope);
			modalCtrl.toggle(modalCtrl);
			modalCtrl.options.functions.open.after(modalScope);

			if (!modalScope.keepPosition)
			{
				// position the modal within the viewport
				var distanceFromTop = $(window).height() * .1; // 10% from top of the window
				var newTopVal = distanceFromTop + $(document).scrollTop();
				modalCtrl.$el.css('top', newTopVal);
			}
			return modalCtrl.promise;
		}
		// TODO : return promise even if there is no modalCtrl
		//			promise would need to be immediately rejected
	};

	$.fn.abortModal = function(addToScope){
		return this.each(function(){
			var modalCtrl = $.data(this, 'ctrl');
			if (!!modalCtrl && modalCtrl.isActive)
			{
				if (!!addToScope)
				{
					var currentScope = modalCtrl.$el.data('scope');
					var newScope = $.extend(true, {}, currentScope, addToScope);
					modalCtrl.$el.data('scope', newScope);
				}

				var modalScope = modalCtrl.$el.data('scope');

				if (modalCtrl.options.functions.abort.before(modalScope))
				{
					modalCtrl.toggle(modalCtrl);
					modalCtrl.options.functions.abort.after(modalScope);

					// reject promise if app dev has not already done so
					if(modalCtrl.promise.state() === 'pending')
					{
						modalCtrl.promise.reject();
					}
				}
			}
		});
	};

	$.fn.completeModal = function(addToScope){
		return this.each(function(){
			var modalCtrl = $.data(this, 'ctrl');
			if (!!modalCtrl && modalCtrl.isActive)
			{
				if (!!addToScope)
				{
					var currentScope = modalCtrl.$el.data('scope');
					var newScope = $.extend(true, {}, currentScope, addToScope);
					modalCtrl.$el.data('scope', newScope);
				}

				var modalScope = modalCtrl.$el.data('scope');
				
				if (modalCtrl.options.functions.complete.before(modalScope))
				{
					modalCtrl.toggle(modalCtrl);
					modalCtrl.options.functions.complete.after(modalScope);
					
					// reject promise if app dev has not already done so
					if(modalCtrl.promise.state() === 'pending')
					{
						modalCtrl.promise.resolve();
					}
				}
			}
		});
	};
})();
var EntityEmbed = EntityEmbed || {};

;(function(){

	// PRIVATE

	var defaultOptions = {
			modalId: 'leave-confirmation-modal', // the HTML id of the element which contains the modal
			viewPath: 'modal/modal_confirmation.html', // path to modal HTML file
			abortElId: 'btn-cancel-leave',
			completeElId: 'btn-confirm-leave'
		};

	function confirmModalDefaults(options) {
		var self = this;
		if (!options)
		{
			options = {};
		}
		self.options = $.extend(true, {}, defaultOptions, options);
		self.init();
	};


	confirmModalDefaults.prototype.init = function(){
		var self = this;

		self.$abortEl = $('#' + self.options.abortElId);
		self.$completeEl = $('#' + self.options.completeElId);
	};

	confirmModalDefaults.prototype.functions = {
		init: {
			before: function(scope){
				/*
				 * assume that these are already defined:
				 *		scope.modalCtrl			(default for all modals from modal.js)
				 *		scope.parentModalCtrl
				 */
			},
			after: function(scope){
			}
		},
		open: {
			before: function(scope){},
			after: function(scope){},
		},
		abort: {
			before: function(scope){
				return true;
			},
			after: function(scope){}
		},
		complete: {
			before: function(scope){
				scope.parentModalCtrl.$el.abortModal({ confirmedLeave: true });
				return true;
			},
			after: function(scope){}
		}
	};

	EntityEmbed.confirmModalDefaults = confirmModalDefaults;
}());

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
				selectExisting: '#btn-select-existing-embed', // confirms selection of existing embed
				cancelSelectExisting: '#btn-cancel-select-existing' // cancels selection of existing embed
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
				selectExistingActiveItem: 'embed-modal-active-row',
				saveSpinner: '#embed-modal-spinner'
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
		populateSelectExistingView = function(scope){
			$(embedModalSelectors.elements.selectExistingTableRow).remove();

			EntityEmbed.apiService.post({
				path: scope.currentEmbedType.options.httpPaths.getAll,
				data: {
					object_type: scope.currentEmbedType.options.object_type,
					auth_token: EntityEmbed.apiService.getAuthToken()
				}
			})
			.done(function(respData){
				if (typeof respData.response === 'string')
				{
					console.log('Failed to get list of current embed types for the Select Existing page.: ' + respData.response);
					return;
				}

				if (!respData.response.data){
					return;
				}
				scope.selectExistingItems = respData.response.data;
				for (var i = 0; i < scope.selectExistingItems.length; i++)
				{
					var $row = $(tableRowHtml(scope.selectExistingItems[i].title, scope.selectExistingItems[i].object_id));
					$(embedModalSelectors.elements.selectExistingTableBody).append($row);

					// add click event to highlight (select) a row
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
			})
			.fail(function(respData){
				// TODO : UI failure message
				console.log('Failed to get list of current embed types for the Select Existing page.');
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
		showSelectExistingView = function(scope, isSingle){
			scope.modalType = EntityEmbed.embedModalTypes.selectExisting;
			populateSelectExistingView(scope);

			$(embedModalSelectors.containers.createNewEmbed).slideUp();
			$(embedModalSelectors.containers.selectExistingEmbed).slideDown();

			$(embedModalSelectors.containers.createButtons).hide();
			$(embedModalSelectors.containers.selectButtons).show();

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
						showSelectExistingView(currentScope);
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
								object_id: $('.' + embedModalSelectors.elements.selectExistingActiveItem).attr('id')
							}
						})
						.done(function(respData){
							if (typeof respData.response === 'string')
							{
								console.log('Failed to get list of current embed types for the Select Existing page.: ' + respData.response);
								return;
							}

							currentScope.currentEmbedType.model = respData.response;
							currentScope.modalCtrl.$el.completeModal();
						})
						.fail(function(respData){
							// TODO: show error UI
							console.log('failed to get embed type!');
						});
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
				toggleEditorTyping(scope, 'true');
				if (scope.$currentEditorLocation.length > 0)
				{
					var $embedContainer = scope.$currentEditorLocation.replaceWith(generateEmbedHtmlInternal(scope.currentEmbedType, true));

					// create an event to be raised
					var addEvent = jQuery.Event('entityEmbedAdded');
					// add data to it so the handler knows what to do
					addEvent.embedType = scope.currentEmbedType;
					$embedContainer.trigger(addEvent);
				}

				// return only necessary information to anyone interested in promise resolution
				scope.modalCtrl.promise.resolve({
					data: 		scope.currentEmbedType.model,
					options: 	scope.currentEmbedType.options
				});
			}
		}
	};

	EntityEmbed.embedModalDefaults = embedModalDefaults;

}());

var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// PRIVATE
	var embedName = 'audio',
		defaults = {
			viewPath: base + 'modal/modal_audio.html',
			displayName: 'Audio',
			object_type: 'audio',
			audioLocation: 'https://test-services.pri.org',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required',
					upload: {
						required: true,
						extension: "mp3"
					},
					wavFile: {
						extension: "wav"
					}
				}
			},
			httpPaths:{
				uploadFile: 'https://test-services.pri.org/admin/embed/file-upload'
			}
		},
		uploadedAudioDisplay = '.uploaded-audio-file',
		cancelUploadAudioBtn = '.cancel-upload-file-btn',
		editAudioFileBtn = '.edit-chosen-file-btn',
		uploadMp3FileBtn = ".embed-modal-file-input",
		getAudioUrl = function(audioLocation, audioUrl)
		{
			if (audioUrl.indexOf(audioLocation) >= 0)
			{
				return audioUrl;
			}

			// ensure that there isn't an unintended '//' in final URL
			if (audioLocation.endsWith('/'))
			{
				audioLocation = audioLocation.substring(0, audioLocation.length - 1);
			}
			if (!audioUrl.startsWith('/'))
			{
				audioLocation = '/' + audioUrl;
			}

			return audioLocation + audioUrl;
		};

	function formatFileSize(bytes) {
		if (typeof bytes !== 'number')
		{
			return '';
		}

		if (bytes >= 100000000)
		{
			return (bytes / 1000000000).toFixed(2) + ' GB';
		}

		if (bytes >= 1000000)
		{
			return (bytes / 1000000).toFixed(2) + ' MB';
		}
		return (bytes / 1000).toFixed(2) + ' KB';
	};

	// CONSTRUCTOR
	function audioEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	}

	audioEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = audioEmbed;

	// PUBLIC
	audioEmbed.prototype.orderIndex = 3;

	audioEmbed.prototype.audioPreviewClass = 'audio-preview';

	audioEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url_path: null,
			credit: null,
			creditLink: null
		};
	};

	audioEmbed.prototype.initModal = function($el){
		var self = this;	

		self.$mp3Form = $el.find('input[name="upload"]');
		//self.$wavForm = $el.find('input[name="wavFile"]');

		$el.find(editAudioFileBtn).on('click', function(){
			$el.find(uploadedAudioDisplay).hide();
			$el.find(editAudioFileBtn).hide();

			self.$mp3Form.css('display', 'inline-block');
			$el.find(cancelUploadAudioBtn).show();
		});

		$el.find(cancelUploadAudioBtn).on('click', function(){
			self.$mp3Form.hide();
			$el.find(cancelUploadAudioBtn).hide();
			if (self.$mp3Form.parent().find('#upload-error').is(':visible'))
			{
				self.$mp3Form.parent().find('#upload-error').hide();	
			}

			$el.find(editAudioFileBtn).show();
			$el.find(uploadedAudioDisplay).show();
		});

		$el.find(uploadMp3FileBtn).on('change', function(){
			var fileName =  $el.find(uploadMp3FileBtn)[0].files[0].name;
			$el.find("[name=title]").val(fileName);
		});
	};

	audioEmbed.prototype.clearForm = function($el){
		var self = this;
		self.parent.clearForm($el, self);

		$el.find(uploadedAudioDisplay).find('.' + self.audioPreviewClass).remove();
		$el.find(uploadedAudioDisplay).hide();
		$el.find(cancelUploadAudioBtn).hide();
		$el.find(editAudioFileBtn).hide();
		self.$mp3Form.show();
	};

	audioEmbed.prototype.saveEmbed = function(embedIsNew)
	{
		var self = this;
		var file = self.model.upload;
		delete self.model.upload;

		var promise = self.parent.saveEmbed(embedIsNew, self);
		
		if (!!file)
		{
			promise.then(function(responseData){
				//var wavFile = self.$wavForm[0].files[0];
				// if (!!wavFile)				// only send wav file if user specified
				// {
				// 	var wavFormData = new FormData();
				// 	wavFormData.append('upload', wavFile);
				// 	sendFile(wavFormData)
				// 		.then(function(responseData){
				// 			self.model.wavFile = self.options.audioLocation + responseData.response.url_path;
				// 		});
				// }

				var mp3FormData = new FormData();
				mp3FormData.append('upload', file);

				return $.ajax({
					url: self.options.httpPaths.uploadFile,
					type: 'POST',
					data: mp3FormData,
					headers: {
						'x-auth-token': EntityEmbed.apiService.getAuthToken(),
						'x-object-id': responseData.response.object_id,
						'x-debug': '1'
					},
					processData: false,
					contentType: false
				});
			})
			.done(function(responseData){
				self.model.url_path = responseData.response.url_path;
			});
		}
		
		return promise;
	};

	audioEmbed.prototype.generateUploadedPreview = function() {
		var self = this;
		if (!!self.model.object_id) // this is an edit modal - there must be an existing url_path to the audio file
		{
			var fileType = self.model.url_path.substring(self.model.url_path.lastIndexOf('.') + 1);

			return '<audio controls class="' + self.audioPreviewClass + '">' +
						'<source src="' + getAudioUrl(self.options.audioLocation, self.model.url_path) + '" type="audio/' + fileType + '">' + 
					'</audio>';
		}
		else // this is an add modal - the audio has been uploaded by the client but not pushed to the server
		{
			return	'<div class="' + self.audioPreviewClass + '">' +
				(self.model.url_path || self.model.upload.name) +
			'</div>';
		}
	};

	audioEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		self.parent.populateFormWithModel($form, self);

		if (!self.model.upload && !self.model.url_path)
		{	
			return;
		}

		self.$mp3Form.hide();

		$form.find(uploadedAudioDisplay).show();
		$form.find(editAudioFileBtn).show();
		$form.find(uploadedAudioDisplay).append(self.generateUploadedPreview());
	};

	audioEmbed.prototype.parseForEditor = function(){
		var self = this;
		
		var fileType = self.model.url_path.substring(self.model.url_path.lastIndexOf('.') + 1);

		return  '<div class="audio-embed">' + 
					'<audio controls>' +
						'<source src="' + getAudioUrl(self.options.audioLocation, self.model.url_path) + '" type="audio/' + fileType + '">' + 
					'</audio>' +
					'<div class="credit">Credit: ' + self.model.credit + '</div>' +
					'<div class="link">Link: ' + self.model.creditLink + '</div>' + 
				'</div>';
	};

})('');
var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// PRIVATE
	var embedName = 'customText',
		customTextEditorId ='custom-text-editor',
		defaults = {
			viewPath: base + 'modal/modal_customText.html',
			displayName: 'Custom Text',
			object_type: 'custom',
			validationOptions: {
				rules : {
					title: 'required',
					customText: 'required'
				}
			}
		};

	// CONSTRUCTOR
	function customTextEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	customTextEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = customTextEmbed;

	// PUBLIC
	customTextEmbed.prototype.orderIndex = 5;

	customTextEmbed.prototype.getModelFromForm = function($el){
		var self = this;
		var formFields = $el.find('.embed-modal-form-control');
		for(var i = 0; i < formFields.length; i++)
		{
			var name;
			var value;

			if(formFields[i].id == customTextEditorId)
			{
				name = formFields[i].attributes.name.nodeValue
				value = formFields[i].innerHTML;
			}
			else
			{
				 name = formFields[i].name;
				 value = formFields[i].value;
			}

			if (!!name && !!value)
			{
				self.model[name] = value;
			}
			
		}
	};

	customTextEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			displayTitle: null,
			text: null
		};
	}

	customTextEmbed.prototype.clearForm = function($el, self){
		var self = this;
		self.parent.clearForm($el, self);
		var formFields = $el.find('.embed-modal-form-control');
		for(var i = 0; i < formFields.length; i++)
		{
			if (!!formFields[i].type && formFields[i].type.indexOf('select') !== -1)
			{
				formFields[i].selectedIndex = 0;
			}
			else
			{
				formFields[i].value = null;
				formFields[i].innerHTML ="";
			}
		}
		self.model = self.cleanModel();
	};

	customTextEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		var formFields = $form.find('.embed-modal-form-control');
		for (var i = 0; i < formFields.length; i++)
		{
			if (!!formFields.type && formFields[i].type.indexOf('select') !== -1)
			{
				var options = $(formFields[i]).find('option');
				var selectedOption = self.model[formFields[i].name];
				var optionIndex = 0;
				options.each(function(index){
					if (this.value === selectedOption)
					{
						optionIndex = index;
					}
				});
				formFields[i].selectedIndex = optionIndex;
			}
			else
			{
				
				formFields[i].value = self.model[formFields[i].name];

				if(formFields[i].id == customTextEditorId)
				{
					formFields[i].innerHTML = self.model[formFields[i].attributes.name.nodeValue];
				}
			}
		}
	};

	customTextEmbed.prototype.initModal = function($el){
		var self = this;
		var customTextEditor = new MediumEditor('#' + customTextEditorId, {
			placeholder:{
				text: "Type your text. Highlight words to trigger the styles editor"
			}
		});
	};

	customTextEmbed.prototype.parseForEditor = function(){
		var self = this;
		return  '<div class="custom-text-embed">' + 
					'<div class="display-title">' + self.model.displayTitle + '</div>' +
					'<div class="custom-text">' + self.model.customText + '</div>' +
				'</div>';
	};

})('');
var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// PRIVATE
	var embedName = 'externalLink',
		defaults = {
			viewPath: base + 'modal/modal_externalLink.html',
			displayName: 'External Link',
			object_type: 'external-link',
			imageLocation: 'https://test-services.pri.org',
			validationOptions: {
				rules: {
					upload: 'required',
					title: 'required',
					url: 'required',
					linkText: 'required'
				}
			},
			httpPaths:{
				uploadFile: 'https://test-services.pri.org/admin/embed/file-upload'
			}
		},
		uploadedImgDisplay = '.uploaded-image-file',
		cancelUploadImageBtn = '.cancel-upload-image-btn',
		editImageFileBtn = '.edit-chosen-file-btn',
		uploadImageFileBtn = ".embed-modal-file-input",
		getImageUrl = function(imageLocation, imageUrl)
		{
			if (imageUrl.indexOf(imageLocation) >= 0)
			{
				return imageUrl;
			}

			// ensure that there isn't an unintended '//' in final URL
			if (imageLocation.endsWith('/'))
			{
				imageLocation = imageLocation.substring(0, imageLocation.length - 1);
			}
			if (!imageUrl.startsWith('/'))
			{
				imageUrl = '/' + imageUrl;
			}

			return imageLocation + imageUrl;
		};

	// CONSTRUCTOR
	function externalLinkEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};


	// TODO : inherit from imagesEmbed
	externalLinkEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = externalLinkEmbed;

	// PUBLIC
	externalLinkEmbed.prototype.orderIndex = 9;

	externalLinkEmbed.prototype.cleanModel = function(){
		return {
			url_path: null, // URL to upload image file
			upload: null,	// form data for upload image file
			title: null,
			displayTitle: null,
			teaser: null,
			linkText: null,
			url: null,
		};
	};

	externalLinkEmbed.prototype.initModal = function($el){
		var self = this;

		self.$imageForm = $el.find('input[name="upload"]');

		$el.find(editImageFileBtn).on('click', function(){
			$el.find(uploadedImgDisplay).hide();
			$el.find(editImageFileBtn).hide();

			self.$imageForm.css('display', 'inline-block');
			$el.find(cancelUploadImageBtn).show();
		});

		$el.find(cancelUploadImageBtn).on('click', function(){
			self.$imageForm.hide();
			$el.find(cancelUploadImageBtn).hide();
			if (self.$imageForm.parent().find('#upload-error').is(':visible'))
			{
				self.$imageForm.parent().find('#upload-error').hide();	
			}

			$el.find(uploadedImgDisplay).show();
			$el.find(editImageFileBtn).show();
		});

		$el.find(uploadImageFileBtn).on('change', function(){
			var fileName =  $el.find(uploadImageFileBtn)[0].files[0].name;
			$el.find("[name=title]").val(fileName);
		});
	};

	externalLinkEmbed.prototype.saveEmbed = function(embedIsNew)
	{
		var self = this;
		var file = self.model.upload;
		delete self.model.upload;

		var promise = self.parent.saveEmbed(embedIsNew, self);
		
		if (!!file)
		{
			promise.then(function(responseData){
				var imageFormData = new FormData();
				imageFormData.append('upload', file);

				return $.ajax({
					url: self.options.httpPaths.uploadFile,
					type: 'POST',
					data: imageFormData,
					headers: {
						'x-auth-token': EntityEmbed.apiService.getAuthToken(),
						'x-object-id': responseData.response.object_id,
						'x-debug': '1'
					},
					processData: false,
					contentType: false
				});
			}).done(function(responseData){
				self.model.url_path = responseData.response.url_path;
			});
		}

		return promise;
	};

	externalLinkEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		self.parent.populateFormWithModel($form, self);

		if (!self.model.upload && !self.model.url_path)
		{	
			return;
		}

		self.$imageForm.hide();

		$form.find(uploadedImgDisplay).show();
		$form.find(editImageFileBtn).show();
		$form.find(uploadedImgDisplay).append(self.generateUploadedImgPreview());
	};
	
	externalLinkEmbed.prototype.clearForm = function($el){
		var self = this;
		self.parent.clearForm($el, self);

		$el.find(uploadedImgDisplay).find('.' + self.imagePreviewClass).remove();
		$el.find(uploadedImgDisplay).hide();
		$el.find(cancelUploadImageBtn).hide();
		$el.find(editImageFileBtn).hide();
		self.$imageForm.show();
	};

	externalLinkEmbed.prototype.generateUploadedImgPreview = function() {
		var self = this;
		if (!!self.model.object_id) // this is an edit modal - there must be an existing url_path to the image file
		{
			return '<img class="' + self.imagePreviewClass +
					'" src="' + getImageUrl(self.options.imageLocation, self.model.url_path) + '">';
		}
		else // this is an add modal - the image has been uploaded by the client but not pushed to the server
		{
			return	'<div class="' + self.imagePreviewClass + '">' +
				(self.model.url_path || self.model.upload.name) +
			'</div>';
		}
	};

	externalLinkEmbed.prototype.parseForEditor = function(){
		var self = this;

		return 	'<div class="external-link-embed entity-embed-secondary-toolbar-locator">' +
					'<img src="' + getImageUrl(self.options.imageLocation, self.model.url_path) + '">' + 
					'<div class="text-container">' + 
						'<div class="display-title">' + self.model.displayTitle + '</div>' +
						'<div class="teaser">' + self.model.teaser + '</div>' +
					'</div>' + 
					'<a href="' + self.model.url + '">'  + self.model.linkText + '</a>' + 
				'</div>';
	};

})('');
var EntityEmbed = EntityEmbed || {};

(function(window, base){

	'use strict';

	// PRIVATE
	var embedName = 'facebook',
		defaults = {
			viewPath: base + 'modal/modal_facebook.html',
			displayName: 'Facebook',
			object_type: 'facebook',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required'
				}
			}
		};

	// CONSTRUCTOR
	function facebookEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	facebookEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = facebookEmbed;

	// PUBLIC
	facebookEmbed.prototype.orderIndex = 7;

	facebookEmbed.prototype.getModelFromForm = function($el){
		var self = this;

		// TODO: Need to extract this block of code, and instead call parent function
		var formFields = $el.find('.embed-modal-form-control');

		for(var i = 0; i < formFields.length; i++)
		{
			var name = formFields[i].name;
			var value = formFields[i].value;
			if (!!name && !!value)
			{
				self.model[name] = value;
			}
		}

		var embedCodeName = 'embedCode';
		var code = 	'<script>' +
						'(function(d, s, id) {' +
							'var js, fjs = d.getElementsByTagName(s)[0];' +
							'if (d.getElementById(id)) return;' +
							'js = d.createElement(s);' +
							'js.id = id;' +
							'js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3";' +
							'fjs.parentNode.insertBefore(js, fjs);' +
							'}' +
							'(document, "script", "facebook-jssdk"));' +
						'</script>' +
					'<div class="fb-post" data-href="'+ this.model.url + '" data-width="500">' +
					'</div>';
		self.model[embedCodeName] = code;

	};
	// PUBLIC
	facebookEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url: null
		};
	};

	facebookEmbed.prototype.parseForEditor = function(){
		var self = this;
		// TODO: Need to make user unable to interact with embed
		return '<div class="facebook-embed">' +
					'<div class="facebook-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' +
					'<div class="overlay">' +

					self.model.embedCode +

					'</div>' +
					'<div class="facebook-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' +
				'</div>';
	};

	facebookEmbed.prototype.activateEmbed = function(){
		// Check to see if FB scripts have already been loaded
		if(window.FB)
		{
			// Tell FB to parse widgets again
			window.FB.XFBML.parse();
		}
	}

})(window, '');
var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// PRIVATE
	var embedName = 'globalBuzz',
		defaults = {
			viewPath: base + 'modal/modal_globalBuzz.html',
			displayName: 'Global Buzz',
			object_type: 'global-buzz',
			validationOptions: {
				rules: {
					title: 'required',
					quote: 'required',
					url: 'required'
				}

			}
		};

	// CONSTRUCTOR
	function globalBuzzEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	globalBuzzEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = globalBuzzEmbed;

	// PUBLIC
	globalBuzzEmbed.prototype.orderIndex = 13;

	globalBuzzEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			quote: null,
			credit: null,
			quoteUrl: null
		};
	};

	globalBuzzEmbed.prototype.parseForEditor = function(){
		var self = this;
		return '<div class="global-buzz">' +
					'<article class="global-buzz-quote-wrapper engagement-badge-wrapper">' +
						'<div class="engagement-badge"></div>' +
						'<div>' +
							'<h1 class="global-buzz-teaser">Global Buzz</h1>' +
							'<div class="buzz-field-quote">' +
								'<img class ="buzz-field-quote-png" src="http://www.pri.org/sites/all/themes/pri/images/icon-open-quote.png">' +
								'<div class="buzz-quote-inner">' +
									self.model.quote +
								'</div>' +
							'</div>' +
							'<div class="buzz-field-quote-credit">' +
								self.model.credit +
							'</div>' +
							'<a class="btn btn-primary global-buzz-link" href="' + self.model.quoteUrl + '">' + self.model.quoteUrlText + '</a>' +
						'</div>' +
					'</article>' +
				'</div>';
	};

})('');
var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// PRIVATE
	var embedName = 'iframe',
		defaults = {
			viewPath: base + 'modal/modal_iframe.html',
			displayName: 'iFrame',
			object_type: 'iframe',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required'
				}
			}
		};

	// CONSTRUCTOR
	function iframeEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	iframeEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = iframeEmbed;

	// PUBLIC
	iframeEmbed.prototype.orderIndex = 11;

	iframeEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url: null,
			allowsScroll: false
		};
	};

	iframeEmbed.prototype.parseForEditor = function(){
		return  '<div class="iframe-embed">' +
					'<div class="iframe-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' + 
					'<iframe src="' + this.model.url + '" ' + 
						'frameborder="0" scrolling="' + this.model.allowsScroll + '">' + 
					'</iframe>' + 
					'<div class="iframe-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' + 
				'</div>';
	};

})('');
var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// PRIVATE
	var embedName = 'image',
		defaults = {
			viewPath: base + 'modal/modal_image.html',
			displayName: 'Image(s)',
			object_type: 'image',
			imageLocation: 'https://test-services.pri.org',
			validationOptions: {
				rules: {
					title: 'required',
					altText: 'required',
					license: 'required',
					upload: {
						required: true,
						extension: "png|jpg|jpeg|gif"
					}
				}
			},
			httpPaths:{
				getLicenses: 'https://test-services.pri.org/admin/image-license/list',
				uploadFile: 'https://test-services.pri.org/admin/embed/file-upload'
			}
		},
		uploadedImgDisplay = '.uploaded-image-file',
		cancelUploadImageBtn = '.cancel-upload-image-btn',
		editImageFileBtn = '.edit-chosen-file-btn',
		uploadImageFileBtn = ".embed-modal-file-input",
		getImageUrl = function(imageLocation, imageUrl)
		{
			if (imageUrl.indexOf(imageLocation) >= 0)
			{
				return imageUrl;
			}

			// ensure that there isn't an unintended '//' in final URL
			if (imageLocation.endsWith('/'))
			{
				imageLocation = imageLocation.substring(0, imageLocation.length - 1);
			}
			if (!imageUrl.startsWith('/'))
			{
				imageUrl = '/' + imageUrl;
			}

			return imageLocation + imageUrl;
		};

	// CONSTRUCTOR
	function imagesEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	imagesEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = imagesEmbed;

	// PUBLIC
	imagesEmbed.prototype.orderIndex = 1;

	imagesEmbed.prototype.imagePreviewClass = 'image-preview';

	imagesEmbed.prototype.cleanModel = function(){
		return {
			url_path: null, // URL to image file
			upload: null,	// form data for image file
			title: null,
			altText: null,
			credit: null,
			creditLink: null,
			caption: null,
			license: null
		};
	};

	imagesEmbed.prototype.loadLicenses = function ($el){
		var self = this;
		var defaultLicenseOption = '<option disabled selected>-- select a license --</option>';
		EntityEmbed.apiService.get({
				path: self.options.httpPaths.getLicenses
			})
			.done(function(list){
				//load object into license list
				if (!list.response.data)
				{
					return;
				}
				var licenseList = [];
				licenseList.push(defaultLicenseOption);
				for(var i = 0; i < list.response.data.length;i++)
				{
					licenseList.push(
						'<option value="' + list.response.data[i].license + '">' +
							list.response.data[i].title +
						'</option>'
					);
				}
				$el.find('[name="license"]').html(licenseList);
			})
			.fail(function(data){
				console.log('failed to find load image license options');
			});
	};

	imagesEmbed.prototype.initModal = function($el){
		var self = this;

		self.loadLicenses($el);
		self.$imageForm = $el.find('input[name="upload"]');

		$el.find(editImageFileBtn).on('click', function(){
			$el.find(uploadedImgDisplay).hide();
			$el.find(editImageFileBtn).hide();

			self.$imageForm.css('display', 'inline-block');
			$el.find(cancelUploadImageBtn).show();
		});

		$el.find(cancelUploadImageBtn).on('click', function(){
			self.$imageForm.hide();
			$el.find(cancelUploadImageBtn).hide();
			if (self.$imageForm.parent().find('#upload-error').is(':visible'))
			{
				self.$imageForm.parent().find('#upload-error').hide();	
			}

			$el.find(uploadedImgDisplay).show();
			$el.find(editImageFileBtn).show();
		});

		$el.find(uploadImageFileBtn).on('change', function(){
			var fileName =  $el.find(uploadImageFileBtn)[0].files[0].name;
			$el.find("[name=title]").val(fileName);
		});
	};

	imagesEmbed.prototype.clearForm = function($el){
		var self = this;
		self.parent.clearForm($el, self);

		$el.find(uploadedImgDisplay).find('.' + self.imagePreviewClass).remove();
		$el.find(uploadedImgDisplay).hide();
		$el.find(cancelUploadImageBtn).hide();
		$el.find(editImageFileBtn).hide();
		self.$imageForm.show();
	};

	imagesEmbed.prototype.saveEmbed = function(embedIsNew)
	{
		var self = this;
		var file = self.model.upload;
		delete self.model.upload;

		var promise = self.parent.saveEmbed(embedIsNew, self);
		
		if (!!file)
		{
			promise.then(function(responseData){
				var imageFormData = new FormData();
				imageFormData.append('upload', file);

				return $.ajax({
					url: self.options.httpPaths.uploadFile,
					type: 'POST',
					data: imageFormData,
					headers: {
						'x-auth-token': EntityEmbed.apiService.getAuthToken(),
						'x-object-id': responseData.response.object_id,
						'x-debug': '1'
					},
					processData: false,
					contentType: false
				});
			}).done(function(responseData){
				self.model.url_path = responseData.response.url_path;
			});
		}

		return promise;
	};

	imagesEmbed.prototype.generateUploadedImgPreview = function() {
		var self = this;
		if (!!self.model.object_id) // this is an edit modal - there must be an existing url_path to the image file
		{
			return '<img class="' + self.imagePreviewClass +
					'" src="' + getImageUrl(self.options.imageLocation, self.model.url_path) + '">';
		}
		else // this is an add modal - the image has been uploaded by the client but not pushed to the server
		{
			return	'<div class="' + self.imagePreviewClass + '">' +
				(self.model.url_path || self.model.upload.name) +
			'</div>';
		}
	};

	imagesEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		self.parent.populateFormWithModel($form, self);

		if (!self.model.upload && !self.model.url_path)
		{	
			return;
		}

		self.$imageForm.hide();

		$form.find(uploadedImgDisplay).show();
		$form.find(editImageFileBtn).show();
		$form.find(uploadedImgDisplay).append(self.generateUploadedImgPreview());
	};

	imagesEmbed.prototype.parseForEditor = function(){
		var self = this;

		return	'<div class="images-embed">' + 
					'<img class="entity-embed-secondary-toolbar-locator"' + 
						' src="' + getImageUrl(self.options.imageLocation, self.model.url_path) + '" />' + 
					'<div class="images-embed-caption">' +
						self.model.caption +
					'</div>' + 
					'<div class="images-embed-credit">' + 
						'Credit: ' + self.model.credit +
					'</div>' + 
				'</div>';
	};
})('');
var EntityEmbed = EntityEmbed || {};

(function(window, base){

	'use strict';

	// PRIVATE
	var embedName = 'instagram',
		defaults = {
			viewPath: base + 'modal/modal_instagram.html',
			displayName: 'Instagram',
			object_type: 'instagram',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required'
				}
			}
		};

	// CONSTRUCTOR
	function instagramEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	instagramEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = instagramEmbed;

	// PUBLIC
	instagramEmbed.prototype.orderIndex = 8;

	instagramEmbed.prototype.getModelFromForm = function($el){
		var self = this;


		// TODO: Need to extract this block of code, and instead call parent function
		var formFields = $el.find('.embed-modal-form-control');
		for(var i = 0; i < formFields.length; i++)
		{
			var name = formFields[i].name;
			var value = formFields[i].value;
			if (!!name && !!value)
			{
				self.model[name] = value;
			}
		}

		var embedCodeName = 'embedCode';
		var code = '<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: auto; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px); ">' +
						'<a href="' + self.model.url +
						'" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">' +
						'</a>' +
					'</blockquote>' +
					'<script async defer src="//platform.instagram.com/en_US/embeds.js"></script>';
		self.model[embedCodeName] = code;
	};

	// PUBLIC
	instagramEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url: null
		};
	};

	instagramEmbed.prototype.parseForEditor = function(){
		var self = this;

		// TODO: Need to make user unable to interact with embed
		return '<div class="instagram-embed">' +
					'<div class="instagram-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' +
					'<div class="overlay">' +
						self.model.embedCode +
					'</div>' +
					'<div class="instagram-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' +
				'</div>';
	};

  instagramEmbed.prototype.activateEmbed = function(){
    // Check to see if Instagram scripts have already been loaded
    if(window.instgrm)
    {
      // Tell instegram to process embeds again
      window.instgrm.Embeds.process();
    }
  }

})(window, '');
var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// PRIVATE
	var embedName = 'newsletterSubscribe',
		defaults = {
			viewPath: base + 'modal/modal_newsletterSubscribe.html',
			displayName: 'Newsletter Subscribe',
			object_type: 'newsletter',
			validationOptions: {
				rules: {
					title: 'required',
					newsletter: 'required',					
				}
			},
			httpPaths:{
				getNewsletters: 'https://test-services.pri.org/admin/newsletter/list'
			}
		};

	// CONSTRUCTOR
	function newsletterSubscribeEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	newsletterSubscribeEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = newsletterSubscribeEmbed;

	// PUBLIC
	newsletterSubscribeEmbed.prototype.orderIndex = 12;

	newsletterSubscribeEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			displayTitle: null,
			newsletterId: null,
			teaser: null
		};
	};
	
	newsletterSubscribeEmbed.prototype.initModal = function($el){
		var self = this;
		var defaultSubscriptionOption = '<option disabled selected>-- select a newsletter --</option>';
		EntityEmbed.apiService.get({
				path: self.options.httpPaths.getNewsletters,
			})
			.done(function(list){
				//load object into license list
				if (!list.response.data)
				{
					return;
				}
				var subscriptionList = [];
				subscriptionList.push(defaultSubscriptionOption);

				for(var i = 0; i < list.response.data.length; i++)
				{
					subscriptionList.push(
						'<option value="' + list.response.data[i].newsletter_id +'" >' + 
							list.response.data[i].title +
						'</option>'
					);
				}
				$el.find('[name="newsletter"]').html(subscriptionList);
			})
			.fail(function(){
				console.log('failed to load newsletter subscription options');
			});
	};

	newsletterSubscribeEmbed.prototype.parseForEditor = function(){
		var self = this;
		return '<div class="newsletter-subscribe-embed entity-embed-secondary-toolbar-locator">' +
					'<div class="display-title">' + self.model.displayTitle + '</div>' +
					'<div class="subscribe-form">' +			
						'<div class="teaser">' + self.model.teaser + '</div>' +
						'<div class="embed-modal-form">' +
							'<input name="email" type="text" placeholder="user@domain.com" class="embed-modal-form-control">' + 
						'</div>' + 
						'<button class="btn btn-primary subscribe-btn">Subscribe</button>'
					'</div>' + 
				'</div>';
	};

})('');
var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// check for EntityEmbedTypes namespace
	if (!EntityEmbed.embedTypes)
	{
		console.log('Could not find EntityEmbedTypes namespace. ' +
			'Please ensure that the genericEmbed has loaded before this one.');
		return;
	}

	// PRIVATE
	var embedName = 'relatedLink',
		defaults = {
			viewPath: base + 'modal/modal_relatedLink.html',
			displayName: 'Related Link',
			object_type: 'related-link',
			validationOptions: {
				rules: {
					title: 'required',
				}
			},
			httpPaths:{
				getContentList: 'https://test-services.pri.org/admin/content/list',
				getContentItem: {
					story: 'https://test-services.pri.org/admin/story/fetch',
					episode: 'https://test-services.pri.org/admin/episode/fetch'
				}
			}
		},
		linkListId = '#related-link-list',
		addLinkInputId = '#add-link-eac',
		dragLinkClass = 'drag-link-btn',
		dragPlaceholderClass = 'related-link-placeholder',
		progressBarId = '#related-links-progress',
		removeLinkClass = 'remove-link-btn',
		linkClass = 'related-link-url',
		generateLinkItem = function(linkData, index) {
			var linkHtml = generateLinkInputHtml(linkData);
			var $linkItem = $(linkHtml);

			// Attach data to element
			$linkItem.data('link-data', linkData);

			// Add click hanlder to remove btn
			$linkItem.find('.' + removeLinkClass).on('click', function() {
				var $this = $(this);
				var $li = $this.closest('.' + linkClass);

				$li.remove();
			});

			return $linkItem;
		},
		generateLinkInputHtml = function(linkData){
			return	'<div class="' + linkClass + '">' +
						'<div class="related-link-control">' +
							'<span class="' + dragLinkClass + '">' +
								'<i class="fa fa-bars"></i>' +
							'</span>' +
						'</div>' +
						'<div class="related-link-title">' +
							linkData.title +
						'</div>' +
						'<div class="related-link-control">' +
							'<button class="' + removeLinkClass + '">' +
								'<i class="fa fa-minus"></i>' +
							'</button>' +
						'</div>' +
					'</div>';
		},
		//	This provides the functionality/styling for the type-ahead feature, allowing the user to only
		//	begin typing the title of a story and have a dropdown list of stories displayed to them
		//	based on their input. This function also takes into account validation of the modal form.
		initAutoComplete = function (inputId, self, $el){
			var rgxDevEnv = /^[^.]*staging[^.]*\.|\.dev$/;
			var isDevEnv = rgxDevEnv.test(window.location.host);
			var debug = 0;
			var ajaxData = {
				auth_token: EntityEmbed.apiService.getAuthToken(),
			};
			var $input = $el.find(inputId);


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
					return self.options.httpPaths.getContentList;
				},
				listLocation: function(listOfData){
					return listOfData.response.data;
				},
				getValue: function(data) {
					if(data.pub_state == 1)
					{
						return data.title;
					}
					else
					{
						return '';
					}
				},
				preparePostData: function(data) {
					data.title = $input.val();
					return JSON.stringify(data);
				},
				list: {
					maxNumberOfElements: 10,
					match: {
						enabled: true
					},
					sort: {
						enabled: true
					},
					onChooseEvent: function(){ // store the users story selection
						var itemData = $input.getSelectedItemData();
						var objectId = itemData.object_id;
						var $linkList = $el.find(linkListId);
						var $linkItem;

						if (!!itemData.object_id)
						{
							$linkItem = generateLinkItem(itemData);
							$linkList.append($linkItem);
						}

						$input.val('');
					}
				}
			};

			$input.easyAutocomplete(options);

			$input.closest('.easy-autocomplete').removeAttr('style');
		};

	/**
	 * Private function to get a clopy of an embed type object by object_type value.
	 * @param	{String} objectType API object_type name
	 * @return {Object}						Initialized embed type object from EntityEmbed.currentEmbedTypes.
	 */
	function getEmbedTypeByObjectType(objectType) {
		var embedType = $.grep(EntityEmbed.currentEmbedTypes, function(et){
			return et.options.object_type == objectType;
		})[0];

		return embedType && $.extend(true, {}, embedType);
	}

	// CONSTRUCTOR
	function relatedLinkEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	relatedLinkEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = relatedLinkEmbed;

	// PUBLIC
	relatedLinkEmbed.prototype.orderIndex = 10;

	relatedLinkEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			displayTitle: null,
			links: []
		};
	};

	relatedLinkEmbed.prototype.initModal = function($el){
		var self = this;
		var $linkList = $el.find(linkListId);
		var $progress = $el.find(progressBarId);
		var adjustment, placeholderHeight;

		// Don't need to show progress on new or cleared forms
		$progress.parent().hide();

		// Initialize Add Link field's Auto Complete functionality
		initAutoComplete(addLinkInputId, self, $el);

		// Make link list sortabel
		$linkList.sortable({
			group: 'links',
			itemSelector: '.' + linkClass,
			draggedClass: 'related-link-dragged',
			placeholderClass: dragPlaceholderClass,
			placeholder: '<div class="' + dragPlaceholderClass + '"></div>',
			nested: false,
			onDragStart: function ($item, container, _super) {
				var offset = $item.offset(),
						pointer = container.rootGroup.pointer;

				adjustment = {
					left: pointer.left - offset.left,
					top: pointer.top - offset.top
				};

				placeholderHeight = $item.outerHeight();

				_super($item, container);
			},
			onDrag: function ($item, position) {
				$item.css({
					left: position.left - adjustment.left,
					top: position.top - adjustment.top
				});
			},
			afterMove: function($placeholder) {
				$placeholder.height(placeholderHeight);
			}
		});
	};

	relatedLinkEmbed.prototype.clearForm = function($el){
		var self = this;
		self.parent.clearForm($el, self);

		// Remove children from link list
		$el.find(linkListId).empty();
	};

	relatedLinkEmbed.prototype.getModelFromForm = function($el){
		var self = this;
		self.parent.getModelFromForm($el, self);
		self.model.links = [];

		// Pull data from all link elements and add to model just the properties need to look it up again
		$el.find('.' + linkClass).each(function() {
			var $this = $(this);
			var linkData = $this.data('link-data');

			self.model.links.push({
				object_id: linkData.object_id,
				object_type: linkData.object_type
			});
		});
	};

	relatedLinkEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		var $linkList = $form.find(linkListId);
		var $progress = $form.find(progressBarId);
		var $linkItem, i, m, promise, fetchPath;
		var deferreds = [];
		var linksData = [];
		var totalLinks = 0;
		var totalLoaded = 0;
		var percentLoaded = 0;

		self.parent.populateFormWithModel($form, self);

		// Check to see if model has links
		if (!self.model.links.length)
		{
			// exit now. don't need to load anything
			return;
		}

		// Reset progress elements size and visiblity
		$progress.width(0);
		$progress.parent().slideDown(0);

		for(i = 0, m = self.model.links.length; i < m; i++)
		{
			// Make sure link data at this index exists
			if(self.model.links[i])
			{
				// Increment our counter for links we are loading data for
				totalLinks++;

				// Get links data from API
				promise = EntityEmbed.apiService.get({
					path: self.options.httpPaths.getContentItem[self.model.links[i].object_type],
					data: {
						object_id: self.model.links[i].object_id
					}
				});

				// Handle API resonse
				promise.done((function(index) {
					return function(respData) {
						// Increment count of finished link loads, no matter the status of the request
						totalLoaded++;

						// Update progress bar
						percentLoaded = totalLoaded / totalLinks * 100;
						$progress.css({
							width: percentLoaded + '%'
						});

						if(respData.status === 'OK')
						{
							// Request returned data. Add to model at the correct index
							linksData[index] = respData.response;
						}
					};
				})(i));

				deferreds.push(promise);
			}
		}

		$.when.apply($, deferreds).done(function(){
			var $linkItem, i, m;

			$progress.parent().delay(400).slideUp(500);

			// Compact linksData array
			for (i = 0, m = linksData.length; i < m; i++)
			{
				if(!linksData[i])
				{
					linksData.splice(i,1);
				}
			}

			// Create link elements in link list
			for(i = 0, m = linksData.length; i < m; i++)
			{
				$linkItem = generateLinkItem(linksData[i]);
				$linkList.append($linkItem);
				$linkItem.hide().delay(1000).slideDown(150);
			}
		});
	};

	// TODO : make this the default styling for genericEmbed
	relatedLinkEmbed.prototype.parseForEditor = function(){
		var self = this;

		return '<div class="relatedLink-embed">' +
					'<div class="relatedLink-embed-uiText"> <strong>Embed Type:</strong> Related Link </div>' +
					'<div class="relatedLink-embed-uiText"> <strong>Title:</strong> ' + self.model.title + '</div>' +
					'<div class="relatedLink-embed-uiText"> <strong>Links:</strong> ' + self.model.links.length + '</div>' +
				'</div>';
	};

})('');
var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// PRIVATE
	var embedName = 'slideshow',
		defaults = {
			viewPath: base + 'modal/modal_slideshow.html',
			displayName: 'Slideshow',
			object_type: 'slideshow',
			validationOptions: {
				rules: {
					slideshowTitle: 'required',
					title: 'required',
					altText: 'required',
					license: 'required'//,
					// radioOption: {
					// 	slideshowImage: true,
					// 	errorLabelContainer: '.slideshow-image-error'
					// }
				}
			}
		},
		generateId = function () {
			var ret = '';
			for(var i = 0; i < 8; i++){
				ret += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
			return ret;
		},
		// TODO : organize these into object (see embedModalDefaults.js)
		imageForm = '#embed-modal-slideshow-image',
		selectExistingImageContainer = '#embed-modal-slideshow-image-select-existing',
		selectExistingBtnContainer = '#slideshow-image-select-btns',
		selectExistingImageBtn = '#btn-select-existing-simg',
		cancelSelectExistingImageBtn = '#btn-cancel-select-existing-simg',
		imageSelect = '.embed-modal-slideshow-image-list',
		labelTextClass = 'slideshow-radio-label-text',
		instructionalText = '.radio-option-placeholder',
		selectExistingTableBody = '.embed-modal-select-existing-simg tbody',
		selectExistingTableRow = '.embed-modal-select-existing-item',
		selectExistingActiveItem = 'embed-modal-active-row',
		imageEmbed,
		imageObjects = {}, // key = image ID; value = image object
		currentImageId = null,
		selectExistingItems = null,
		newRadioOption = function(label, guid){
			if ($(instructionalText).is(':visible'))
			{
				$(instructionalText).hide();
			}

			var id = guid || generateId();
			var newHtml = 
				'<div class="slideshow-radio-container">' + 
					'<label class="slideshow-radio">' + 
						'<input type="radio" id="' + id + '" name="radioOption">' + 
						'<span class="' + labelTextClass + '">' +
							label +
						'</span>' +
						'<label class="slideshow-image-error"></label>' + 
					'</label>' + 
					'<div class="remove-slideshow-image">' + 
						'<i class="fa fa-times"></i>' + 
					'</div>' + 
				'</div>';

			$(imageSelect).append(newHtml);
			var $op = $(imageSelect).children().last();

			$op.find('.remove-slideshow-image').on('click', (function(){
				return function(embedId, $radioOp){
					delete imageObjects[id];
					$op.remove();
				}
			})(id, $op));

			return id;
		},
		tableRowHtml = function(title, id){
			return	'<tr class="embed-modal-select-existing-item" id="' + id + '">' +
						'<td>' + title + '</tr>'+
					'</td>';
		},
		saveChangesToImageModel = function(){ // save changes made to $(imageForm) to the respective model
			imageEmbed.getModelFromForm($(imageForm));
			imageObjects[currentImageId] = imageEmbed.model;
		},
		selectSlideshowImage = function(imageId){
			var $newImageSelectOption = $('#' + imageId); 

			if (!currentImageId || currentImageId === '') // this is the first image - show hidden UI items
			{
				$(imageForm).show();
			}
			else if (currentImageId === imageId)
			{
				return;
			}
			else // this is not the first image - save current changes to respective model
			{
				saveChangesToImageModel();

				// set the form to show to the selected image's data
				imageEmbed.clearForm($(imageForm));
				imageEmbed.model = imageObjects[imageId];
				imageEmbed.populateFormWithModel($(imageForm));
			}

			currentImageId = imageId;
		},
		showSelectExistingImage = function(){
			$(imageForm).hide();
			$(selectExistingImageContainer).show();
		},
		hideSelectExistingImage = function(){
			$(imageForm).show();
			$(selectExistingImageContainer).hide();
		};

	// CONSTRUCTOR
	function slideshowEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	slideshowEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = slideshowEmbed;

	// PUBLIC
	slideshowEmbed.prototype.orderIndex = 2;

	slideshowEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			displayTitle: null,
			images: []
		};
	};

	slideshowEmbed.prototype.initModal = function($el){
		var self = this;
		self.model =  self.cleanModel();

		// get image embed type
		for (var et in EntityEmbed.embedTypes)
		{
			if (EntityEmbed.embedTypes[et].name === 'imagesEmbed')
			{
				imageEmbed = new EntityEmbed.embedTypes[et]();

				// initialize it with the correct form (remember there are two on this page)
				imageEmbed.initModal($(imageForm));

				$(imageForm).hide();
				break;
			}
		}
		if (!imageEmbed)
		{
			console.log('could not find image embed for use in slideshow embed');
			return;
		}

		// configure validation for slideshow images
		$.validator.addMethod('slideshowImage', function(value, element, params) {
			var imgId = element.id;
			var isValid = true;
			if (!!imgId || !!imageObjects[imgId])
			{
				isValid = !!imageObjects[imgId].title &&
							!!imageObjects[imgId].license &&
							!!imageObjects[imgId].altText &&
							(!!imageObjects[imgId].upload || !!imageObjects[imgId].url_path);
			}
			return this.optional(element) || isValid;
		}, 'missing required fields');

		imageEmbed.loadLicenses($el);

		/*
		 * configure icons event handlers that enable a user to create a dynamic list of images
		 */

		// event handler for the add image icon
		$('.slideshow-image-add').on('click', function(){
			var imageNum = 1;
			for (var image in imageObjects)
			{
				imageNum += 1;
			}

			var id = newRadioOption('image ' + imageNum);
			imageObjects[id] = imageEmbed.cleanModel();
		});

		// event handler for the select existing image icon
		$('.slideshow-image-select-existing').on('click', function(){
			showSelectExistingImage();
			$(selectExistingTableRow).remove();

			EntityEmbed.apiService.post({
				path: self.options.httpPaths.getAll,
				data: {
					object_type: imageEmbed.options.object_type,
					auth_token: EntityEmbed.apiService.getAuthToken()
				}
			})
			.done(function(respData){
				if (typeof respData.response === 'string')
				{
					console.log('Failed to get list of current embed types for the Select Existing page.: ' + respData.response);
					return;
				}

				if (!respData.response.data){
					return;
				}
				selectExistingItems = respData.response.data;
				for (var i = 0; i < selectExistingItems.length; i++)
				{
					var $row = $(tableRowHtml(selectExistingItems[i].title, selectExistingItems[i].object_id));
					$(selectExistingTableBody).append($row);

					// add click event to highlight (select) a row
					$row.on('click', function(e, scope){
						// we do not need to add the class back if it is already on the item being clicked
						var needToAddClass = !$(e.currentTarget).hasClass(selectExistingActiveItem);

						$(selectExistingTableBody)
							.find('.' + selectExistingActiveItem)
							.removeClass(selectExistingActiveItem);

						if (needToAddClass){
							$(e.currentTarget).addClass(selectExistingActiveItem);
							$(selectExistingImageBtn).removeClass('disabled');
						}
						else // since we didnt add a class, that means nothing is selected, so disable the select button
						{
							$(selectExistingImageBtn).addClass('disabled');
						}
					});
				}
			})
			.fail(function(respData){
				// TODO : UI failure message
				console.log('Failed to get list of current embed types for the Select Existing page.');
			});
		});

		// event handler for the select button within the select existing view
		$(selectExistingImageBtn).on('click', function(){
			if ($(selectExistingImageBtn).hasClass('disabled'))
			{
				return;
			}

			EntityEmbed.apiService.get({
				path: imageEmbed.options.httpPaths.get,
				data: {
					object_id: $('.' + selectExistingActiveItem).attr('id')
				}
			})
			.done(function(respData){
				if (typeof respData.response === 'string')
				{
					console.log('Failed to get list of current embed types for the Select Existing page.: ' + respData.response);
					return;
				}

				var imageNum = 1;
				for (var image in imageObjects)
				{
					imageNum += 1;
				}

				// track image object
				imageObjects[respData.response.object_id] = respData.response;

				// make radio option for image and select it
				newRadioOption(respData.response.title, respData.response.object_id);
				$('#' + respData.response.object_id).attr('checked', '');

				// clear image form and save data
				if (!!currentImageId && currentImageId !== '')
				{
					saveChangesToImageModel();
					imageEmbed.clearForm($(imageForm));
					currentImageId = respData.response.object_id;
				}

				// populate image form
				imageEmbed.model = respData.response;
				imageEmbed.populateFormWithModel($(imageForm));
				hideSelectExistingImage();
				selectExistingItems = null;
			})
			.fail(function(respData){
				// TODO: show error UI
				console.log('failed to get embed type!');
			});
		});

		$(cancelSelectExistingImageBtn).on('click', function(){
			hideSelectExistingImage();
			selectExistingItems = null;
		});
		// event handler for changing the image object which populates the form (select radio option)
		$(imageSelect).on('click', function(e){
			var $clickedOption = $(imageSelect + ' :checked');
			if ($clickedOption.length == 0)
			{
				return;
			}
			selectSlideshowImage($clickedOption.attr('id'));
		});

		// event handler to change the radio option text to match the title of the image
		$(imageForm).find('input[name="title"]').on('blur', function(){
			var titleVal = $(this).val();
			if (titleVal === '')
			{
				return;
			}

			var $currentRadio = $('#' + currentImageId).parent();
			$currentRadio.find('.' + labelTextClass).text(titleVal);
		});
	};	

	slideshowEmbed.prototype.saveEmbed = function(embedIsNew){
		var self = this;
		var deferreds = [];

		// if this is an edit modal, slideshowTitle will be on model and thats just no good!
		if (!!self.model.slideshowTitle)
		{
			delete self.model.slideshowTitle;
		}

		for(var i = 0; i < self.model.images.length; i++)
		{
			imageEmbed.model = self.model.images[i];
			var imageEmbedIsNew = !imageEmbed.model.object_id;

			var promise = imageEmbed.saveEmbed(imageEmbedIsNew);
			
			promise.done( (function(imageNum){
					return function(data){
						if (data.status == 'ERROR')
						{
							console.log('failed to put/post a slideshow image');
							return;
						}

						self.model.images[imageNum] = {
							'object_id' : data.response.object_id,
							'order'		: imageNum
						};
					};
				})(i))
				.fail((function(imageNum){
					return function(){
						console.log('failed to save a slideshow image number ' + imageNum);
					};
				})(i));

			deferreds.push(promise);
		}
		return $.when.apply($, deferreds).then(function(){
			return self.parent.saveEmbed(embedIsNew, self);
		});	
	};

	slideshowEmbed.prototype.validate = function($el, isAddModal){
		var self = this;

		
		// TODO : make this work
		imageEmbed.validate($(imageForm), isAddModal);


		return self.parent.validate($el.find('form').first(), isAddModal, self);
	};

	slideshowEmbed.prototype.getModelFromForm = function($form)
	{
		var self = this;
		saveChangesToImageModel();
		self.model.title = $form.find('input[name=slideshowTitle]').val();
		self.model.displayTitle = $form.find('input[name=displayTitle]').val();
		self.model.images = [];

		for (var image in imageObjects)
		{
			self.model.images.push(imageObjects[image]);
		}
	};

	slideshowEmbed.prototype.populateFormWithModel = function($form){
		var self = this,
			deferreds = [];

		self.model.slideshowTitle = self.model.title;
		self.parent.populateFormWithModel($form.find('form').first(), self);

		// hide this while we are loading the image embeds
		$(imageSelect).hide();

		$(instructionalText).hide();

		// make sure images array is sorted on order
		self.model.images.sort(function(l, r){
			return l.order - r.order;
		});

		for(var i = 0; i < self.model.images.length; i++)
		{
			newRadioOption('image ' + (i+1), self.model.images[i].object_id);

			if (i === 0)
			{
				$('#' + self.model.images[i].object_id).attr('checked', '');
				currentImageId = self.model.images[i].object_id;
			}
		}

		for(var i = 0; i < self.model.images.length; i++)
		{
			var promise = EntityEmbed.apiService.get({
				path: imageEmbed.options.httpPaths.get,
				data: {
					object_id: self.model.images[i].object_id,
					auth_token: EntityEmbed.apiService.getAuthToken
				}
			});

			promise.done((function(imageOrder){
				return function(data){
					if (data.status === 'ERROR' || typeof data.response === 'string')
					{
						console.log('could not load slideshow image number ' + imageOrder);
						return;
					}

					imageObjects[data.response.object_id] = data.response;

					var $radioOp = $('#' + data.response.object_id).parent();
					$radioOp.find('.' + labelTextClass).text(data.response.title);

					if (imageOrder == 0)
					{
						imageEmbed.model = data.response;
					}
				};
			})(self.model.images[i].order))
			.fail((function(imageOrder){
				return function(){
					console.log('could not load slideshow image number ' + imageOrder)
				};
			})(self.model.images[i].order));

			deferreds.push(promise);
		}

		$.when.apply($, deferreds).done(function(){
			$(imageSelect).show();
			$(imageForm).show();

			imageEmbed.populateFormWithModel($(imageForm));

		});
	};

	slideshowEmbed.prototype.clearForm = function($el){
		var self = this;
		self.parent.clearForm($el, self);
		if (!!imageEmbed)
		{
			imageEmbed.clearForm($(imageForm));
		}

		imageObjects = {};
		currentImageId = '';

		$el.find('.slideshow-radio-container').remove();
		$(imageForm).hide();

		$(instructionalText).show();
	};

})('');
var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// PRIVATE
	var embedName = 'twitter',
		defaults = {
			viewPath: base + 'modal/modal_twitter.html',
			displayName: 'Twitter',
			object_type: 'twitter',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required'
				}
			}
		};

	// CONSTRUCTOR
	function twitterEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	twitterEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = twitterEmbed;

	// PUBLIC
	twitterEmbed.prototype.orderIndex = 6;

	twitterEmbed.prototype.getModelFromForm = function($el){
		var self = this;

		// TODO: Need to extract this block of code, and instead call parent function
		var formFields = $el.find('.embed-modal-form-control');
		for(var i = 0; i < formFields.length; i++)
		{
			var name = formFields[i].name;
			var value = formFields[i].value;
			if (!!name && !!value)
			{
				self.model[name] = value;
			}
		}

		var embedCodeName = 'embedCode';
		var code = '<blockquote class="twitter-tweet" data-lang="en" style="width:50%; margin:auto;">' +
						'<a href="' + self.model.url + '">' +
						'</a>' +
					'</blockquote>' +
					'<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
		self.model[embedCodeName] = code;
	};

	// PUBLIC
	twitterEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url: null
		};
	};

	twitterEmbed.prototype.parseForEditor = function(){
		var self = this;

		// TODO: Need to make user unable to interact with embed
		return '<div class="twitter-embed">' +
					'<div class="twitter-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' +
					'<div class="overlay">' +
						self.model.embedCode +
					'</div>' +
					'<div class="twitter-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' +
				'</div>';
	};

})('');
var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// PRIVATE
	var embedName = 'video',
		defaults = {
			viewPath: base + 'modal/modal_video.html',
			displayName: 'Video',
			object_type: 'video',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required'
				}
			}
		};

	// CONSTRUCTOR
	function videoEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	videoEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = videoEmbed;

	// PUBLIC
	videoEmbed.prototype.orderIndex = 4;

	videoEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url: null
		};
	};

	videoEmbed.prototype.parseForEditor = function(){
		var self = this;

		$.support.cors = true;

		$.ajax({
			crossDomain: true,
			cache: false,
			async: false,
			timeout: 15000,
			url: 'http://medium.iframe.ly/api/oembed?iframe=1',
			dataType: 'json',
			data: {
				url: self.model.url
			},
			success: function(data){
				self.model.videoHtmlString = $(data.html).find('iframe').attr("style", "").prop('outerHTML');
			},
			error: function(jqXHR, textStatus, error){
				// TODO
			}
		});

		return '<div class="video-embed">' +
					'<div class="video-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' +
					'<div class="overlay">' +
						self.model.videoHtmlString  +
					'</div>' +
					'<div class="video-info">' +
						'<span>click here to show the toolbars</span>' +
					'</div>' +
				'</div>';
	};

})('');
var EntityEmbed = EntityEmbed || {};

;(function(){
	// Creates an embed modal using the embedModalDefaults.js and any options that a user specifies
	$.embed_modal_create = function(options){
		var	defaults = {
			modalOptions: {},			//see modal.js to customize if embedModalDefaults.js is insufficient
			modalScope: {				// default scope to pass to the modal
				$embedTypeSelect: null,	// selector for the embed typoe dropdown (<select> element)
				$modalBody: null		// selector for the modal body container element
			},
			$modalEl: null,				// select for the entire modal (element that modal.js establishes a ctrl on)
			embedTypes:{				// specify all embed types and their options here
				image:{},				//		TODO : allow global specification without hardcoding defaults
				slideshow: {},
				video:{},
				audio:{},
				twitter:{},
				instagram:{},
				facebook:{},
				relatedLink:{},
				externalLink:{},
				globalBuzz:{},
				newsletterSubscribe:{},
				iframe:{},
				customText:{}
			}
		};

		defaultModalSelectors = function(){
			// we cant specify certain elements as default options
			// because they are not yet loaded into the DOM when this script runs
			// so if they are null, select them here

			if (!defaults.$modalEl)
			{
				defaults.$modalEl = $('#embed-modal');
			}

			if (!defaults.modalScope.$embedTypeSelect)
			{
				defaults.modalScope.$embedTypeSelect = $('#select-embed-type');
			}

			if (!defaults.modalScope.$modalBody)
			{
				defaults.modalScope.$modalBody = $('.embed-modal-body');
			}

			if (!defaults.modalOptions.$abortEl)
			{
				defaults.modalOptions.$abortEl = $('#btn-abort-modal');
			}
		};

		defaultModalSelectors();
		options = $.extend(true, {}, defaults, options);

		var embedTypes = [];
		for (var embedName in EntityEmbed.embedTypes)
		{
			if (!!options.embedTypes[embedName])
			{
				var embedObject = new EntityEmbed.embedTypes[embedName](options.embedTypes[embedName]);
				embedTypes.push(embedObject);
			}
		}

		embedTypes.sort(function(l, r){
			return l.orderIndex - r.orderIndex;
		});

		var finalModalOptions = {};
		var defaultModalOptions = new EntityEmbed.embedModalDefaults();
		if (!!options.modalOptions)
		{
			finalModalOptions = $.extend(true, {}, defaultModalOptions, options.modalOptions);
		}
		else
		{
			finalModalOptions = defaultModalOptions;
		}

		var modalScope = {
			embedTypes: embedTypes
		};

		modalScope = $.extend(true, {}, options.modalScope, modalScope);

		options.$modalEl.modal(finalModalOptions, modalScope);

		EntityEmbed.$embedModal = options.$modalEl;
		EntityEmbed.currentEmbedTypes = embedTypes;
		return EntityEmbed.$embedModal;
	};

	$.embed_modal_open = function(options){
		var defaults = {
			$currentEditorLocation: $(''),		// selector for the current editor location (can be null or empty)
			embedTypeStr: null,					// string for the embed type (match object_type field) (can be null)
												//		null - add any
												//		not null - add single or edit (if id is also specified)
			id: null,
			selectExisting: false
		};
		

		if (!EntityEmbed.$embedModal)
		{
			$.embed_modal_create({
				modalOptions: options
			});
		}

		options = $.extend(true, {}, defaults, options);

		var self = this;
		var mType;
		if (!!options.id)
		{
			mType = EntityEmbed.embedModalTypes.edit;
		}
		else if (!!options.embedTypeStr)
		{
			if (options.selectExisting)
			{
				mType = EntityEmbed.embedModalTypes.selectExistingSingle;
			}
			else
			{
				mType = EntityEmbed.embedModalTypes.addSingle;
			}
		}
		else
		{
			if (options.selectExisting)
			{
				mType = EntityEmbed.embedModalTypes.selectExisting;
			}
			else
			{
				mType = EntityEmbed.embedModalTypes.add;
			}
		}

		var scope = {
			$currentEditorLocation: options.$currentEditorLocation,
			modalType: mType,
			embedId: options.id,
			embedType: options.embedTypeStr
		};

		return EntityEmbed.$embedModal.openModal(scope);
	};
})();
var EntityEmbed = EntityEmbed || {};

;(function ($, window, document, undefined) {

	'use strict';

	/** Default values */
	var pluginName = 'mediumInsert',
		addonName = 'EntityEmbeds', // name of the Medium Editor Insert Plugin
		activeEmbedClass = 'entity-embed-active',	// class name given to active (selected) embeds
		mediumEditorActiveSelector = '.medium-insert-active', // selector for the medium editor active class
		activeEmbedClass = 'entity-embed-active',	// class name given to active (selected) embeds
		entityEmbedEditorLineClass = 'entity-embed-editor-line', // class name given to a line (<p> element) in the editor on which an entity is embedded
		entityEmbedContainerClass = 'entity-embed-container', // class name given to the objects which contain entity embeds
		defaults = {
			label: '<span class="fa fa-code"></span>',
			styles: {
				left: {
					label: '<span class="fa fa-align-left"></span>',
					added: function ($el) {
						$el.addClass('clearfix');
					},
					removed: function ($el) {
						$el.removeClass('clearfix');
					}
				},
				center: {
					label: '<span class="fa fa-align-center"></span>'
					// added: function ($el) {},
					// removed: function ($el) {}
				},
				right: {
					label: '<span class="fa fa-align-right"></span>',
					added: function ($el) {
						$el.addClass('clearfix');
					},
					removed: function ($el) {
						$el.removeClass('clearfix');
					}
				},
				wide: {
					label: '<span class="fa fa-align-justify"></span>'
					// added: function ($el) {},
					// removed: function ($el) {}
				}
			},
			actions: {
				remove: {
					label: '<span class="fa fa-times"></span>',
					clicked: function (entityEmbed, $embed) {
						entityEmbed.removeEmbed($embed);
					}
				},
				edit:{
					label: '<span class="fa fa-cog"></span>',
					clicked: function(entityEmbed, $embed){
						entityEmbed.editEmbed($embed);
					}
				},
				newline:{
					label: '<span class="fa fa-i-cursor"></span>',
					clicked: function(entityEmbed, $embed){
						entityEmbed.addNewline($embed);
					}
				}
			}
		};

	/**
	 * Private method to generate unique placeholder string for serialization.
	 *  This string should:
	 *  		- be recreate able during deserialization using models in the embeds array.
	 *  		- be unique to the point that users would not accidentally enter content that could be interpreted as a placeholder.
	 *  		- namespace to our addon to not conflict with others that may have had the same idea.
	 *  		- provide an explicite identifier for the embed to be inserted.
	 *  		- provide index pointer so styling data can be preserved in cases where the same embed is place multiple times but styled differently.
	 * @param  {Object} embed Embed model data. Should contain keys:
	 *                        id - Embed's API object_id
	 *                        index: Nth position it was found in the content
	 * @return {String}       Placeholder string unique the the embed being serialized/inserted
	 */
	function generatePlaceholderString(embed) {
		var placeholder, placeholderKey,
			placeholderPrefix = '[[',
			placeholderSuffix = ']]';

		// Construct our placeholder key string
		placeholderKey = [
			addonName,
			embed.index,
			embed.id
		].join(':');

		// Construct placeholder by wrapping with prefix and suffix
		placeholder = [
			placeholderPrefix,
			placeholderKey,
			placeholderSuffix
		].join('');

		return placeholder;
	}

	/**
	 * Private function to get a clopy of an embed type object by object_type value.
	 * @param  {String} objectType API object_type name
	 * @return {Object}            Initialized embed type object from EntityEmbed.currentEmbedTypes or undefined if not found.
	 */
	function getEmbedTypeByObjectType(objectType) {
		var embedType = $.grep(EntityEmbed.currentEmbedTypes, function(et){
			return et.options.object_type == objectType;
		})[0];

		return embedType && $.extend(true, {}, embedType);
	}

	function getSelection() {
		var selection;

		if (window.getSelection)
		{
			selection = window.getSelection();
		}
		else if (document.getSelection)
		{
			selection = document.getSelection();
		}
		else if (document.selection)
		{
			selection = document.selection.createRange();
		}

		return selection;
	}

	function moveCaretToEdge(el, atStart) {
		var range, sel;

		el.focus();

		if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
			range = document.createRange();
			sel = window.getSelection();

			range.selectNodeContents(el);
			range.collapse(atStart);

			sel.removeAllRanges();
			sel.addRange(range);
		} else if (typeof document.body.createTextRange != "undefined") {
			range = document.body.createTextRange();

			range.moveToElementText(el);
			range.collapse(atStart);
			range.select();
		}
	}

	/**
	 * Custom Addon object
	 *
	 * Sets options, variables and calls init() function
	 *
	 * @constructor
	 * @param {DOM} el - DOM element to init the plugin on
	 * @param {object} options - Options to override defaults
	 * @return {void}
	 */

	function EntityEmbeds (el, options) {
		var self = this;

		self.el = el;
		self.$el = $(el);
		self.templates = window.MediumInsert.Templates;

		self.core = self.$el.data('plugin_'+ pluginName);

		self.options = $.extend(true, {}, defaults, options);

		self._defaults = defaults;
		self._name = pluginName;

		self.toolbarManager = new EntityEmbed.toolbarManager(self, self.options.styles, self.options.actions, activeEmbedClass);

		// Extend editor's functions
		if (self.core.getEditor())
		{
			// allow access the EntityEmbeds object by keeping the object on this prototype
			self.core.getEditor().get_content = function(){
				return self.getContent();
			};
			self.core.getEditor().load_content = function(contentData){
				self.loadContent(contentData);
			};
		}

		self.init();
	}

	/**
	 * initialization
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.init = function () {
		var self = this;

		self.toolbarManager.createActionToolbar($('body'));

		self.events();

		if (!EntityEmbed.$embedModal)
		{
			$.embed_modal_create();
		}

		for (var i = 0, m = EntityEmbed.currentEmbedTypes.length; i < m; i++)
		{
			self.toolbarManager.createStyleToolbar($('body'), EntityEmbed.currentEmbedTypes[i]);
		}
	};

	/**
	 * Event listeners
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.events = function () {
		var self = this;

		$(document)
			// hide toolbar (if active) when clicking anywhere except for toolbar elements
			.on('click', function(e){
				if (!$(e.target).is('.medium-editor-action') &&
					!$(e.target.parentElement).is('.medium-editor-action') &&
					self.$el.find('.' + activeEmbedClass).length != 0)
				{
					$('.' + activeEmbedClass).removeClass(activeEmbedClass);
					self.toolbarManager.hideToolbar();
				}
			})
			// toggle select embed when embed is clicked
			.on('click', '.' + entityEmbedContainerClass, function(e){
				self.toggleSelectEmbed($(this));
				e.stopPropagation(); // done allow the first onClick event to propagate
			})
			// prevent user from destroying modal functionality when deleting first element
			.on('keydown keypress', '.editable.editor', function(e){
				var editor, selection, range, textLength, selectionLength, numChildren, isEmptyP, siblingIsEmbed, $anchor, $sibling, $base;

				// Don't do anything if key is not backspace (8) or delete (46)
				// or if caret is in a ext node of editor.
				if(e.which !== 8 && e.which !== 46)
				{
					return;
				}

				selection = getSelection(); // Get current selection

				if(!selection.rangeCount)
				{
					return;
				}

				editor = self.core.getEditor();
				range = selection.getRangeAt(0); // Get current selected range
				selectionLength = range.endOffset - range.startOffset; // Get length of current selection
				$anchor = $(selection.anchorNode); // Get the element the selection is currently originating from
				textLength = $anchor.text().length;
				numChildren = self.$el.children().not('.medium-insert-buttons').length; // Get number of editors children that are not UI fof MEIP
				isEmptyP = false;
				siblingIsEmbed = false;

				if (selectionLength > 0)
				{
					// When removing a range of charcters, the caret doesn't move positions.
					// We don't have to worry about removing a sibling embed now.
					return;
				}

				if($anchor[0].nodeType === 3)
				{
					$anchor = $anchor.closest('p');
				}

				// Check to see if our anchor element is a p tag with no text
				isEmptyP = $anchor.is('p') && !$anchor.text().length;

				// Get the previous sibling when
				// 	- Backspace is pressed
				// 	- Caret is at the begining of text
				// Get the next sibling when
				// 	- Delete is pressed
				// 	- Caret is at the end of text
				if (e.which === 8 && selection.anchorOffset === 0)
				{
					$sibling = $anchor.prev();
				}
				else if (e.which === 46 && selection.anchorOffset === textLength)
				{
					$sibling = $anchor.next();
				}

				// If we found a sibling, check to see if it is an embed wrapper
				if(!!$sibling)
				{
					siblingIsEmbed = $sibling.is('.' + entityEmbedContainerClass);
					// Make sure sibling has content. MeduimEditor will remove any empty elements up to and including
					if(!$sibling.children().length && !$sibling.text().length)
					{
						$sibling.append('<br>');
					}
				}

				console.log('keydown', e.which, selection, range, textLength, $anchor, $sibling);

				// Prevent default when:
				// 	- Anchor is the last empty p tag
				// 	- A sipling element was fond and is and embed
				if ( (isEmptyP && numChildren <= 1) || siblingIsEmbed)
				{
					e.preventDefault();
				}

				if(isEmptyP && numChildren > 1)
				{
					e.preventDefault();

					if(e.which === 8)
					{
						$base = $anchor.prevAll('p').first();
					}
					else if(e.which === 46)
					{
						$base = $anchor.nextAll('p').first();
					}

					// Make sure base element has content so selection process works.
					if(!$base.children().length && !$base.text().length)
					{
						$base.append('<br>');
					}

					// Select the prev/next p's content
					editor.selectElement($base[0]);
					// Move caret to selection edge opision of caret movement from keypress
					moveCaretToEdge($base[0], e.which === 46);
					// Updated editors toolbar state
					editor.checkSelection();

					// Remove empty anchor element
					$anchor.remove();
				}

			})
			// conditionally remove embed
			.on('keydown', function(e){
				// TODO : this will not be fired if the user highlights content and begins typing
				//			could use JQuery UI 'remove' event
				//			or we could just hide the toolbar on any key press
				if (e.which == 8 || e.which == 46) // backspace or delete
				{
					// TODO : this could hide toolbar on another selected embed
					if (self.$el.find('.' + activeEmbedClass).length != 0)
					{
						self.toolbarManager.hideToolbar();
					}
				}
			})
			.on('entityEmbedAdded', '.' + entityEmbedContainerClass, function(e){
				self.addEmbed($(this), e.embedType);
			});
	};

	/**
	 * Get the Core object
	 *
	 * @return {object} Core object
	 */

	EntityEmbeds.prototype.getCore = function () {
		return this.core;
	};


	/**
	 * Get the story data from the editor and serialize it
     *
     * @return {object} Serialized data
     */

	EntityEmbeds.prototype.getContent = function() {
		var self = this;
		var data = self.core.getEditor().serialize();
		var cleanedData = {
			html: '',
			embeds: []
		};

		$.each(data, function(key){
			var $data, $embedContainers;

			$data = $('<div />').html(data[key].value);

			$embedContainers = $data.find('.entity-embed-container', $data);

			// jQuery has a builtin method to iterate over all match elements.
			// Callback is fired in the context of the current element, so the
			// keyword 'this' refers to the element, in this case our embed container.
			$embedContainers.each(function(index) {
				var $this, $embed, embed, placeholder;

				$this = $(this);

				// Find child figure element, which should hold embed's data attributes
				$embed = $this.find('figure');

				// jQuery.each() iteration loop can be stop by returning false. There is no continue equivelant,
				// so we nest our found embed logic in a truthy condition.
				if(!!$embed)
				{
					// Establish embed model
					embed = {
						// Include index expclicitly so reordering of the embeds array doesn't affect insertion.
						index: index,
						// API object_id used to look up complete data for the embed
						id: $embed.attr('id'),
						// Inlcude embed type name so embed can be rendered correctly during deserialization
						type: $embed.attr('data-embed-type')
					};

					// Add embed model to embeds list to be returned
					cleanedData.embeds.push(embed);

					// Construct our placeholder
					placeholder = generatePlaceholderString(embed);

					// Repace container's HTML with placeholder
					$this.html(placeholder);
				} else {
					// This container is missing a figure element and no longer has data to store.
					// Probably occured when a script error prevented proper serialization of embed.
					// Remove from data HTML to clean up DOM and save serilization steps and/or
					// errors later on.
					$this.remove();
				}
			});

			// Append resulting HTML to our returned model
			cleanedData.html += $data.html();
		});

		return cleanedData;
	 };

 	/**
	 * Extend editor to allow dynamic loading of content
	 *
	 * retrieves story by id and loads content into editor
     *
     * @return {void}
     */

	EntityEmbeds.prototype.loadContent = function(contentData) {
		var self = this,
			isString = (typeof contentData === 'string'),
			isHtml = isString && (/<[^>]>/g).test(contentData),
			fullHtml, embedType, usableEmbeds;

		function updateHtml(data) {
			var deferreds;

			if(!data)
			{
				setEditorHtml();
				return;
			}

			fullHtml = data.html || '';

			if(!data.embeds)
			{
				setEditorHtml();
				return;
			}

			usableEmbeds = [];
			deferreds = [];

			// Iterate over returned embeds
			for (var i = 0; i < data.embeds.length; i++)
			{
				// Convert returned type name to a useful embedType object
				embedType = getEmbedTypeByObjectType(data.embeds[i].type);

				if(!embedType)
				{
					// An embedType could not be found for this embed.
					// Skip this embed since it is unusable.
					continue;
				}

				embedType.model = embedType.cleanModel();

				data.embeds[i].embedType = embedType;

				// Send request for complete emebed data
				var promise = EntityEmbed.apiService.get({
					path: data.embeds[i].embedType.options.httpPaths.get,
					data: {
						object_id: data.embeds[i].id
					}
				});

				// associate callback to promise
				promise.done((function(embed) {
						// Encapsulate embed data by passing data.embeds[i] into self invoking function (See **EMBED** below).
						// The embed parameter should retain it's reference when the returned async function is fired.
						// Changes made to embed should bind out of the async function, but that is not required
						// since we append the modified embed object to our list of usable embeds to render once the
						// editors inner DOM has been created later on.
						return function(request){
							var embedHtml, placeholder;

							if (request.status === 'ERROR')
							{
								console.log('failed to get embed object!');
								return request;
							}

							// Update embed model with API data
							embed.embedType.model = request.response;

							// Add embed to our list of usable embeds
							usableEmbeds.push(embed);

							// Construct placeholder string
							placeholder = generatePlaceholderString(embed);

							// Generate the embed HTML
							embedHtml = EntityEmbed.embedModalDefaults.prototype.generateEmbedHtml(embed.embedType, false);

							// Replace placeholder string in full story HTML with the embed HTML
							// A quick split and join should work since our placeholder string is unique to:
							// 		- our addon (eg. addonName)
							// 		- the embed being inserted (eg. embed.id)
							// 		- the position the embed is inserted (embed.index)
							fullHtml = fullHtml.split(placeholder).join(embedHtml);
						};
					})(data.embeds[i])); // **EMBED**

				// add the promise to our deferreds list.
				deferreds.push(promise);
			}

			// execute this function when all the AJAX calls to get embed types are done
			$.when.apply($, deferreds).done(function(){
				var embed, $embed, innerHtml;
				var done = {};

				// Each of our deferreds should have updated the full story HTML with embed HTML.
				// Set editor content to establish a DOM tree to work with.
				setEditorHtml();

				// Fix for Issue #164: Reattach embed HTML to an existing DOM, similar to adding/editing an embed while editing.
				// Iterate over usable embeds
				for (var i = 0; i < usableEmbeds.length; i++)
				{
					// Get reference to embed at this index
					embed = usableEmbeds[i];

					// We only need to do reattach HTML once for embed id. Make sure an embed with this id
					// hasn't laready been reattached.
					if(!done[embed.id])
					{
						// Set a flag to skip id's that have already been reattached.
						done[embed.id] = true;

						// Find all embed wrapper elements with this ID.
						$embed = self.$el.find('[id="' + embed.id + '"]');

						innerHtml = $embed.html();

						// Find embeds placeholder element and replcae it with embed HTML
						$embed.html(innerHtml);

						// Fire embedType's activateEmbed method
						self.activateEmbed(embed);
					}
				}
			});
		}

		function setEditorHtml() {
			self.core.getEditor().setContent(fullHtml);
		}

		if(!contentData)
		{
			console.log('Must provide either story id or serialized story data.');
			return;
		}

		fullHtml = !isString ? contentData.html : isHtml ? contentData : '';

		if(isString && !isHtml)
		{
			EntityEmbed.apiService.get({
					path: 'https://test-services.pri.org/admin/embed/edit',
					data: {
						object_id : contentData
					}
				})
				.done(function(data){
					if (data.status === 'ERROR')
					{
						console.log('Failed to get story with id ' + contentData);
						return;
					}

					updateHtml(data.repsonse);
				})
				.fail(function(data){
					console.log('Failed to get story with id ' + contentData);
				});
		}
		else
		{
			updateHtml(contentData);
		}
	};


	/**
	 * Add embed
	 *
	 * This function is called when a user click on the + icon
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.add = function () {
		var self = this;
		var addToScope = {
			$currentEditorLocation: $(mediumEditorActiveSelector)
		};
		$.embed_modal_open(addToScope);
	};

	/**
	 * Edit embed
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.editEmbed = function ($embed) {
		var self = this;

		var scope = {
			$currentEditorLocation: $('.' + activeEmbedClass),
			id: $embed.find('figure').attr('id'),
			embedTypeStr: $embed.find('[data-embed-type]').attr('data-embed-type')
		};

		self.toolbarManager.hideToolbar();
		$.embed_modal_open(scope);
	};

	/**
	 * Remove custom content
	 *
	 * This function is called when a user removes an entity embed
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.removeEmbed = function ($embed) {
		var self = this;
		self.toolbarManager.hideToolbar();
		$embed.remove();
		self.core.triggerInput();
	};

	/**
	 * Add a new line before and after an embed
	 *
	 * Sometimes this cannot be done with the cursor, so this toolbar button is important
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.addNewline = function ($embed) {
		var self = this;
		var newline = '<p class="entity-embed-new-line">&nbsp</p>';
		// TODO : check if there is already a newline before / after
		$embed.before(newline);
		$embed.after(newline);
		self.toolbarManager.positionToolbars($embed);
	};

	/**
	 * Toggles embed selection
	 *
	 * Selected embeds have a toolbar over them
	 *
	 * @returns {void}
	 */

	EntityEmbeds.prototype.toggleSelectEmbed = function ($embed) {
		var self = this;
		var $currentActiveEmbed = $('.' + activeEmbedClass);
		var embedObjectType = $embed.find('[data-embed-type]').attr('data-embed-type');
		var embedType = getEmbedTypeByObjectType(embedObjectType);

		// hide current toolbars and deactive any active embed
		self.toolbarManager.hideToolbar();
		$currentActiveEmbed.toggleClass(activeEmbedClass);

		// activate this embed
		$embed.toggleClass(activeEmbedClass);

		if (!!self.options.actions)
		{
			if ($embed.hasClass(activeEmbedClass))
			{
				self.toolbarManager.showToolbars($embed, embedType.name);
			}
			else
			{
				self.toolbarManager.hideToolbar();
			}
		}
	};

	/**
	 * Add custom content
	 *
	 * This function is called when a user completes the entity embed modal
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.addEmbed = function ($embedContainer, embed) {
		var self = this;

		// apply the default styling to the embed that was just added
		var buttonAction = embed.defaultStyle.replace('entity-embed-', '');
		self.toolbarManager.addStyle($embedContainer, embed.defaultStyle, buttonAction, false);

		self.activateEmbed(embed);

		self.core.triggerInput();
	};

	/**
	 * Run an embed's acticateEMbed method if it has one.
	 *
	 * This function should be called after embed HTML has been inserted into the editor content.
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.activateEmbed = function(embed) {
		var embedType = embed.embedType || embed;

		// Make sure activeEmbed is a function
		if(typeof embedType.activateEmbed === 'function')
		{
			embedType.activateEmbed();
		}
	}

	/** Addon initialization */

	$.fn[pluginName + addonName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName + addonName)) {
				$.data(this, 'plugin_' + pluginName + addonName, new EntityEmbeds(this, options));
			}
		});
	};

})(jQuery, window, document);
/*
 * easy-autocomplete
 * jQuery plugin for autocompletion
 * 
 * @author Łukasz Pawełczak (http://github.com/pawelczak)
 * @version 1.3.3
 * Copyright MIT License: https://github.com/pawelczak/easy-autocomplete/blob/master/LICENSE.txt
 */

var EasyAutocomplete=function(a){return a.Configuration=function(a){function b(){if("xml"===a.dataType&&(a.getValue||(a.getValue=function(a){return $(a).text()}),a.list||(a.list={}),a.list.sort||(a.list.sort={}),a.list.sort.method=function(b,c){return b=a.getValue(b),c=a.getValue(c),c>b?-1:b>c?1:0},a.list.match||(a.list.match={}),a.list.match.method=function(b,c){return b=a.getValue(b),c=a.getValue(c),b===c?!0:!1}),void 0!==a.categories&&a.categories instanceof Array){for(var b=[],c=0,d=a.categories.length;d>c;c+=1){var e=a.categories[c];for(var f in h.categories[0])void 0===e[f]&&(e[f]=h.categories[0][f]);b.push(e)}a.categories=b}}function c(){function b(a,c){var d=a||{};for(var e in a)void 0!==c[e]&&null!==c[e]&&("object"!=typeof c[e]||c[e]instanceof Array?d[e]=c[e]:b(a[e],c[e]));return void 0!==c.data&&null!==c.data&&"object"==typeof c.data&&(d.data=c.data),d}h=b(h,a)}function d(){if("list-required"!==h.url&&"function"!=typeof h.url){var b=h.url;h.url=function(){return b}}if(void 0!==h.ajaxSettings.url&&"function"!=typeof h.ajaxSettings.url){var b=h.ajaxSettings.url;h.ajaxSettings.url=function(){return b}}if("string"==typeof h.listLocation){var c=h.listLocation;h.listLocation="XML"===h.dataType.toUpperCase()?function(a){return $(a).find(c)}:function(a){return a[c]}}if("string"==typeof h.getValue){var d=h.getValue;h.getValue=function(a){return a[d]}}void 0!==a.categories&&(h.categoriesAssigned=!0)}function e(){h.ajaxSettings=void 0!==a.ajaxSettings&&"object"==typeof a.ajaxSettings?a.ajaxSettings:{}}function f(a){return void 0!==h[a]&&null!==h[a]?!0:!1}function g(a,b){function c(b,e){for(var f in e)void 0===b[f]&&a.log("Property '"+f+"' does not exist in EasyAutocomplete options API."),"object"!=typeof b[f]||d(f)||c(b[f],e[f])}function d(a){var b=["ajaxSettings","template"];return Array.prototype.contains=function(a){for(var b=this.length;b--;)if(this[b]===a)return!0;return!1},b.contains(a)}c(h,b)}var h={data:"list-required",url:"list-required",dataType:"json",listLocation:function(a){return a},xmlElementName:"",getValue:function(a){return a},autocompleteOff:!0,placeholder:!1,ajaxCallback:function(){},matchResponseProperty:!1,list:{sort:{enabled:!1,method:function(a,b){return a=h.getValue(a),b=h.getValue(b),b>a?-1:a>b?1:0}},maxNumberOfElements:6,hideOnEmptyPhrase:!0,match:{enabled:!1,caseSensitive:!1,method:function(a,b){return a=h.getValue(a),b=h.getValue(b),a===b?!0:!1}},showAnimation:{type:"normal",time:400,callback:function(){}},hideAnimation:{type:"normal",time:400,callback:function(){}},onClickEvent:function(){},onSelectItemEvent:function(){},onLoadEvent:function(){},onChooseEvent:function(){},onKeyEnterEvent:function(){},onMouseOverEvent:function(){},onMouseOutEvent:function(){},onShowListEvent:function(){},onHideListEvent:function(){}},highlightPhrase:!0,theme:"",cssClasses:"",minCharNumber:0,requestDelay:0,adjustWidth:!0,ajaxSettings:{},preparePostData:function(a){return a},loggerEnabled:!0,template:"",categoriesAssigned:!1,categories:[{maxNumberOfElements:4}]};this.get=function(a){return h[a]},this.equals=function(a,b){return f(a)&&h[a]===b?!0:!1},this.checkDataUrlProperties=function(){return"list-required"===h.url&&"list-required"===h.data?!1:!0},this.checkRequiredProperties=function(){for(var a in h)if("required"===h[a])return logger.error("Option "+a+" must be defined"),!1;return!0},this.printPropertiesThatDoesntExist=function(a,b){g(a,b)},b(),c(),h.loggerEnabled===!0&&g(console,a),e(),d()},a}(EasyAutocomplete||{}),EasyAutocomplete=function(a){return a.Logger=function(){this.error=function(a){console.log("ERROR: "+a)},this.warning=function(a){console.log("WARNING: "+a)}},a}(EasyAutocomplete||{}),EasyAutocomplete=function(a){return a.Constans=function(){var a={CONTAINER_CLASS:"easy-autocomplete-container",CONTAINER_ID:"eac-container-",WRAPPER_CSS_CLASS:"easy-autocomplete"};this.getValue=function(b){return a[b]}},a}(EasyAutocomplete||{}),EasyAutocomplete=function(a){return a.ListBuilderService=function(a,b){function c(b,c){function d(){var d,e={};return void 0!==b.xmlElementName&&(e.xmlElementName=b.xmlElementName),void 0!==b.listLocation?d=b.listLocation:void 0!==a.get("listLocation")&&(d=a.get("listLocation")),void 0!==d?"string"==typeof d?e.data=$(c).find(d):"function"==typeof d&&(e.data=d(c)):e.data=c,e}function e(){var a={};return void 0!==b.listLocation?"string"==typeof b.listLocation?a.data=c[b.listLocation]:"function"==typeof b.listLocation&&(a.data=b.listLocation(c)):a.data=c,a}var f={};if(f="XML"===a.get("dataType").toUpperCase()?d():e(),void 0!==b.header&&(f.header=b.header),void 0!==b.maxNumberOfElements&&(f.maxNumberOfElements=b.maxNumberOfElements),void 0!==a.get("list").maxNumberOfElements&&(f.maxListSize=a.get("list").maxNumberOfElements),void 0!==b.getValue)if("string"==typeof b.getValue){var g=b.getValue;f.getValue=function(a){return a[g]}}else"function"==typeof b.getValue&&(f.getValue=b.getValue);else f.getValue=a.get("getValue");return f}function d(b){var c=[];return void 0===b.xmlElementName&&(b.xmlElementName=a.get("xmlElementName")),$(b.data).find(b.xmlElementName).each(function(){c.push(this)}),c}this.init=function(b){var c=[],d={};return d.data=a.get("listLocation")(b),d.getValue=a.get("getValue"),d.maxListSize=a.get("list").maxNumberOfElements,c.push(d),c},this.updateCategories=function(b,d){if(a.get("categoriesAssigned")){b=[];for(var e=0;e<a.get("categories").length;e+=1){var f=c(a.get("categories")[e],d);b.push(f)}}return b},this.convertXml=function(b){if("XML"===a.get("dataType").toUpperCase())for(var c=0;c<b.length;c+=1)b[c].data=d(b[c]);return b},this.processData=function(c,d){for(var e=0,f=c.length;f>e;e+=1)c[e].data=b(a,c[e],d);return c},this.checkIfDataExists=function(a){for(var b=0,c=a.length;c>b;b+=1)if(void 0!==a[b].data&&a[b].data instanceof Array&&a[b].data.length>0)return!0;return!1}},a}(EasyAutocomplete||{}),EasyAutocomplete=function(a){return a.proccess=function(a,b,c){function d(b,c){var d=[],e="";if(a.get("list").match.enabled)for(var f=0,g=b.length;g>f;f+=1)e=a.get("getValue")(b[f]),a.get("list").match.caseSensitive||("string"==typeof e&&(e=e.toLowerCase()),c=c.toLowerCase()),e.search(c)>-1&&d.push(b[f]);else d=b;return d}function e(a){return void 0!==b.maxNumberOfElements&&a.length>b.maxNumberOfElements&&(a=a.slice(0,b.maxNumberOfElements)),a}function f(b){return a.get("list").sort.enabled&&b.sort(a.get("list").sort.method),b}var g=b.data,h=c;return g=d(g,h),g=e(g),g=f(g)},a}(EasyAutocomplete||{}),EasyAutocomplete=function(a){return a.Template=function(a){var b={basic:{type:"basic",method:function(a){return a},cssClass:""},description:{type:"description",fields:{description:"description"},method:function(a){return a+" - description"},cssClass:"eac-description"},iconLeft:{type:"iconLeft",fields:{icon:""},method:function(a){return a},cssClass:"eac-icon-left"},iconRight:{type:"iconRight",fields:{iconSrc:""},method:function(a){return a},cssClass:"eac-icon-right"},links:{type:"links",fields:{link:""},method:function(a){return a},cssClass:""},custom:{type:"custom",method:function(){},cssClass:""}},c=function(a){var c,d=a.fields;return"description"===a.type?(c=b.description.method,"string"==typeof d.description?c=function(a,b){return a+" - <span>"+b[d.description]+"</span>"}:"function"==typeof d.description&&(c=function(a,b){return a+" - <span>"+d.description(b)+"</span>"}),c):"iconRight"===a.type?("string"==typeof d.iconSrc?c=function(a,b){return a+"<img class='eac-icon' src='"+b[d.iconSrc]+"' />"}:"function"==typeof d.iconSrc&&(c=function(a,b){return a+"<img class='eac-icon' src='"+d.iconSrc(b)+"' />"}),c):"iconLeft"===a.type?("string"==typeof d.iconSrc?c=function(a,b){return"<img class='eac-icon' src='"+b[d.iconSrc]+"' />"+a}:"function"==typeof d.iconSrc&&(c=function(a,b){return"<img class='eac-icon' src='"+d.iconSrc(b)+"' />"+a}),c):"links"===a.type?("string"==typeof d.link?c=function(a,b){return"<a href='"+b[d.link]+"' >"+a+"</a>"}:"function"==typeof d.link&&(c=function(a,b){return"<a href='"+d.link(b)+"' >"+a+"</a>"}),c):"custom"===a.type?a.method:b.basic.method},d=function(a){return a&&a.type&&a.type&&b[a.type]?c(a):b.basic.method},e=function(a){var c=function(){return""};return a&&a.type&&a.type&&b[a.type]?function(){var c=b[a.type].cssClass;return function(){return c}}():c};this.getTemplateClass=e(a),this.build=d(a)},a}(EasyAutocomplete||{}),EasyAutocomplete=function(a){return a.main=function(b,c){function d(){return 0===t.length?void p.error("Input field doesn't exist."):o.checkDataUrlProperties()?o.checkRequiredProperties()?(e(),void g()):void p.error("Will not work without mentioned properties."):void p.error("One of options variables 'data' or 'url' must be defined.")}function e(){function a(){var a=$("<div>"),c=n.getValue("WRAPPER_CSS_CLASS");o.get("theme")&&""!==o.get("theme")&&(c+=" eac-"+o.get("theme")),o.get("cssClasses")&&""!==o.get("cssClasses")&&(c+=" "+o.get("cssClasses")),""!==q.getTemplateClass()&&(c+=" "+q.getTemplateClass()),a.addClass(c),t.wrap(a),o.get("adjustWidth")===!0&&b()}function b(){var a=t.outerWidth();t.parent().css("width",a)}function c(){t.unwrap()}function d(){var a=$("<div>").addClass(n.getValue("CONTAINER_CLASS"));a.attr("id",f()).prepend($("<ul>")),function(){a.on("show.eac",function(){switch(o.get("list").showAnimation.type){case"slide":var b=o.get("list").showAnimation.time,c=o.get("list").showAnimation.callback;a.find("ul").slideDown(b,c);break;case"fade":var b=o.get("list").showAnimation.time,c=o.get("list").showAnimation.callback;a.find("ul").fadeIn(b),c;break;default:a.find("ul").show()}o.get("list").onShowListEvent()}).on("hide.eac",function(){switch(o.get("list").hideAnimation.type){case"slide":var b=o.get("list").hideAnimation.time,c=o.get("list").hideAnimation.callback;a.find("ul").slideUp(b,c);break;case"fade":var b=o.get("list").hideAnimation.time,c=o.get("list").hideAnimation.callback;a.find("ul").fadeOut(b,c);break;default:a.find("ul").hide()}o.get("list").onHideListEvent()}).on("selectElement.eac",function(){a.find("ul li").removeClass("selected"),a.find("ul li").eq(w).addClass("selected"),o.get("list").onSelectItemEvent()}).on("loadElements.eac",function(b,c,d){var e="",f=a.find("ul");f.empty().detach(),v=[];for(var h=0,i=0,k=c.length;k>i;i+=1){var l=c[i].data;if(0!==l.length){void 0!==c[i].header&&c[i].header.length>0&&f.append("<div class='eac-category' >"+c[i].header+"</div>");for(var m=0,n=l.length;n>m&&h<c[i].maxListSize;m+=1)e=$("<li><div class='eac-item'></div></li>"),function(){var a=m,b=h,f=c[i].getValue(l[a]);e.find(" > div").on("click",function(){t.val(f).trigger("change"),w=b,j(b),o.get("list").onClickEvent(),o.get("list").onChooseEvent()}).mouseover(function(){w=b,j(b),o.get("list").onMouseOverEvent()}).mouseout(function(){o.get("list").onMouseOutEvent()}).html(q.build(g(f,d),l[a]))}(),f.append(e),v.push(l[m]),h+=1}}a.append(f),o.get("list").onLoadEvent()})}(),t.after(a)}function e(){t.next("."+n.getValue("CONTAINER_CLASS")).remove()}function g(a,b){return o.get("highlightPhrase")&&""!==b?i(a,b):a}function h(a){return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}function i(a,b){var c=h(b);return(a+"").replace(new RegExp("("+c+")","gi"),"<b>$1</b>")}t.parent().hasClass(n.getValue("WRAPPER_CSS_CLASS"))&&(e(),c()),a(),d(),u=$("#"+f()),o.get("placeholder")&&t.attr("placeholder",o.get("placeholder"))}function f(){var a=t.attr("id");return a=n.getValue("CONTAINER_ID")+a}function g(){function a(){s("autocompleteOff",!0)&&g(),b(),c(),d(),e(),f()}function b(){t.off("keyup").keyup(function(a){function b(a){function b(){var a={},b=o.get("ajaxSettings")||{};for(var c in b)a[c]=b[c];return a}function c(a,b){return o.get("matchResponseProperty")!==!1?"string"==typeof o.get("matchResponseProperty")?b[o.get("matchResponseProperty")]===a:"function"==typeof o.get("matchResponseProperty")?o.get("matchResponseProperty")(b)===a:!0:!0}if(!(a.length<o.get("minCharNumber"))){if("list-required"!==o.get("data")){var d=o.get("data"),e=r.init(d);e=r.updateCategories(e,d),e=r.processData(e,a),k(e,a),t.parent().find("li").length>0?h():i()}var f=b();(void 0===f.url||""===f.url)&&(f.url=o.get("url")),(void 0===f.dataType||""===f.dataType)&&(f.dataType=o.get("dataType")),void 0!==f.url&&"list-required"!==f.url&&(f.url=f.url(a),f.data=o.get("preparePostData")(f.data,a),$.ajax(f).done(function(b){var d=r.init(b);d=r.updateCategories(d,b),d=r.convertXml(d),c(a,b)&&(d=r.processData(d,a),k(d,a)),r.checkIfDataExists(d)&&t.parent().find("li").length>0?h():i(),o.get("ajaxCallback")()}).fail(function(){p.warning("Fail to load response data")}).always(function(){}))}}switch(a.keyCode){case 27:i(),l();break;case 38:a.preventDefault(),v.length>0&&w>0&&(w-=1,t.val(o.get("getValue")(v[w])),j(w));break;case 40:a.preventDefault(),v.length>0&&w<v.length-1&&(w+=1,t.val(o.get("getValue")(v[w])),j(w));break;default:if(a.keyCode>40||8===a.keyCode){var c=t.val();o.get("list").hideOnEmptyPhrase!==!0||8!==a.keyCode||""!==c?o.get("requestDelay")>0?(void 0!==m&&clearTimeout(m),m=setTimeout(function(){b(c)},o.get("requestDelay"))):b(c):i()}}})}function c(){t.on("keydown",function(a){a=a||window.event;var b=a.keyCode;return 38===b?(suppressKeypress=!0,!1):void 0}).keydown(function(a){13===a.keyCode&&w>-1&&(t.val(o.get("getValue")(v[w])),o.get("list").onKeyEnterEvent(),o.get("list").onChooseEvent(),w=-1,i(),a.preventDefault())})}function d(){t.off("keypress")}function e(){t.focus(function(){""!==t.val()&&v.length>0&&(w=-1,h())})}function f(){t.blur(function(){setTimeout(function(){w=-1,i()},250)})}function g(){t.attr("autocomplete","off")}a()}function h(){u.trigger("show.eac")}function i(){u.trigger("hide.eac")}function j(a){u.trigger("selectElement.eac",a)}function k(a,b){u.trigger("loadElements.eac",[a,b])}function l(){t.trigger("blur")}var m,n=new a.Constans,o=new a.Configuration(c),p=new a.Logger,q=new a.Template(c.template),r=new a.ListBuilderService(o,a.proccess),s=o.equals,t=b,u="",v=[],w=-1;a.consts=n,this.getConstants=function(){return n},this.getConfiguration=function(){return o},this.getContainer=function(){return u},this.getSelectedItemIndex=function(){return w},this.getItemData=function(a){return v.length<a||void 0===v[a]?-1:v[a]},this.getSelectedItemData=function(){return this.getItemData(w)},this.build=function(){e()},this.init=function(){d()}},a.easyAutocompleteHandles=[],a.inputHasId=function(a){return void 0!==$(a).attr("id")&&$(a).attr("id").length>0?!0:!1},a.assignRandomId=function(b){var c="";do c="eac-"+Math.floor(1e4*Math.random());while(0!==$("#"+c).length);elementId=a.consts.getValue("CONTAINER_ID")+c,$(b).attr("id",c)},a}(EasyAutocomplete||{});$.fn.easyAutocomplete=function(a){return this.each(function(){var b=$(this),c=new EasyAutocomplete.main(b,a);EasyAutocomplete.inputHasId(b)||EasyAutocomplete.assignRandomId(b),c.init(),EasyAutocomplete.easyAutocompleteHandles[b.attr("id")]=c})},$.fn.getSelectedItemIndex=function(){var a=$(this).attr("id");return void 0!==a?EasyAutocomplete.easyAutocompleteHandles[a].getSelectedItemIndex():-1},$.fn.getItemData=function(a){var b=$(this).attr("id");return void 0!==b&&a>-1?EasyAutocomplete.easyAutocompleteHandles[b].getItemData(a):-1},$.fn.getSelectedItemData=function(){var a=$(this).attr("id");return void 0!==a?EasyAutocomplete.easyAutocompleteHandles[a].getSelectedItemData():-1};