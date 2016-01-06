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
		functions:{
			init:{
				before: function(scope){},
				after: function(scope){}
			},
			open:{
				before: function(scope){},
				after: function(scope){}
			},
			abort:{
				before: function(scope){},
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
		self.scope.modal = self.$el;
		self.$el.data('scope', self.scope);
		
		self.options.functions.init.before(self.scope);
		self.init();
		self.options.functions.init.after(self.scope);
	};

	modal.prototype.isActive = false;
	modal.prototype.activeClass = 'em-active';
	modal.prototype.closeBtnClass = 'em-close-btn';

	modal.prototype.generateId = function () {
		var seg = function()
		{
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return seg() + seg() + '-' + seg() + '-' + seg() + '-' +
				seg() + '-' + seg() + seg() + seg();
	}
	
	modal.prototype.backdropHtml = function(id)
	{
		var self = this;
		return '<div id="' + id + '" class="' 
			+ self.options.backdropClass + '"></div>';
	};

	modal.prototype.closeBtnHtml = function()
	{
		var self = this;
		var style = self.closeBtnClass +  
			' ' + self.options.closeBtnIcon;
		return '<i class="' + style + '"></i>';
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
			self.$el.after(self.closeBtnHtml());
			self.$closeBtn = $('.' + self.closeBtnClass);
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

	$.fn.modal = function(options, scope){
		return this.each(function(){
			if(!$.data(this, 'ctrl'))
			{
				// avoid null reference errors
				if (!options)
				{
					options = {};
				}
				$.data(this, 'ctrl', new modal(this, options, scope));
			}
		});
	};

	$.fn.openModal = function(addToScope){
		return this.each(function()
		{
			var modalCtrl = $.data(this, 'ctrl');
			if (!!modalCtrl && !modalCtrl.isActive )
			{
				var currentScope = modalCtrl.$el.data('scope');
				var newScope = $.extend(true, {}, currentScope, addToScope);
				modalCtrl.$el.data('scope', newScope);

				modalCtrl.options.functions.open.before(modalCtrl.$el.data('scope'));
				modalCtrl.toggle(modalCtrl);
				modalCtrl.options.functions.open.after(modalCtrl.$el.data('scope'));
			}
		});
	};

	$.fn.abortModal = function(){
		return this.each(function(){
			var modalCtrl = $.data(this, 'ctrl');
			if (!!modalCtrl && modalCtrl.isActive)
			{
				modalCtrl.options.functions.abort.before(modalCtrl.$el.data('scope'));
				modalCtrl.toggle(modalCtrl);
				modalCtrl.options.functions.abort.after(modalCtrl.$el.data('scope'));
			}
		});
	};

	$.fn.completeModal = function(){
		return this.each(function(){
			var modalCtrl = $.data(this, 'ctrl');
			if (!!modalCtrl && modalCtrl.isActive)
			{
				if (modalCtrl.options.functions.complete.before(modalCtrl.$el.data('scope')))
				{
					modalCtrl.toggle(modalCtrl);
					modalCtrl.options.functions.complete.after(modalCtrl.$el.data('scope'));
				}
			}
		});
	};
})();