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

	modal.prototype.toggle = function(ctrl, isActive)
	{
		var self = this;
		var modalScope = ctrl.$el.data('scope');

		ctrl.isActive = isActive;

		console.log('modal:toggle::ctrl.$el', ctrl.$el);

		ctrl.$el.toggle(ctrl.isActive).toggleClass('in', ctrl.isActive);
		ctrl.$backdrop.toggle(ctrl.isActive).toggleClass('in', ctrl.isActive);

		if( !modalScope.parentModal )
		{
			$('body').toggleClass('embed-modal-open', ctrl.isActive);
		}
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

		self.$el.click(function(e){
			if(e.target === self.$el[0])
			{
				self.$el.abortModal();
			}
		});

		// add close button and give expected functionality
		if (self.options.showCloseBtn){
			self.$closeBtn = self.$el.find('.close');
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
			modalCtrl.toggle(modalCtrl, true);
			modalCtrl.options.functions.open.after(modalScope);

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
					modalCtrl.toggle(modalCtrl, false);
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
			var currentScope, newScope, modalScope, completeBefore, completeBeforeDeffered;

			if (!!modalCtrl && modalCtrl.isActive)
			{
				if (!!addToScope)
				{
					currentScope = modalCtrl.$el.data('scope');
					newScope = $.extend(true, {}, currentScope, addToScope);
					modalCtrl.$el.data('scope', newScope);
				}

				modalScope = modalCtrl.$el.data('scope');

				completeBefore = modalCtrl.options.functions.complete.before(modalScope);

				if(typeof completeBefore.state === 'function')
				{
					// Promise returned
					completeBeforeDeffered = completeBefore;
				}
				else {
					// Boolean returned
					// Establish a promise and resolve/reject accordingly
					completeBeforeDeffered = $.Deferred();
					if(completeBefore)
					{
						completeBeforeDeffered.resolve();
					}
					else
					{
						completeBeforeDeffered.reject();
					}
				}

				completeBeforeDeffered.done(function(){

					modalCtrl.toggle(modalCtrl, false);
					modalCtrl.options.functions.complete.after(modalScope);

					// resolve promise if app dev has not already done so
					if(modalCtrl.promise.state() === 'pending')
					{
						modalCtrl.promise.resolve();
					}
				});
			}
		});
	};
})();