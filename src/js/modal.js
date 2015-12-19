;(function () {
	
	'use strict';

	var defaults = {
		contentClass: 'embed-modal',
		backdropClass: 'embed-modal-backdrop',
		closeBtnIcon: 'fa fa-times',
		showCloseBtn: true,
		// TODO : add boolean to disable backdrop click to close
		// elements to abort, or complete the modal on click
		$openEl: $(''),
		$abortEl: $(''),
		$completeEl: $(''),
		abortFunc: function(){
			console.log('embed modal abort');
		},
		completeFunc: function() {
			console.log('embed modal complete');
		}
	};


	function modal(el, options) {	
		var self = this;

		self.$el = $(el);
		self.options = $.extend(true, {}, defaults, options);

		self.init();
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

	$.fn.modal = function(options){
		return this.each(function(){
			if(!$.data(this, 'ctrl'))
			{
				// avoid null reference errors
				if (!options)
				{
					options = {};
				}
				$.data(this, 'ctrl', new modal(this, options));
			}
		});
	};

	$.fn.openModal = function(){
		return this.each(function()
		{
			var modalCtrl = $.data(this, 'ctrl');
			if (!!modalCtrl && !modalCtrl.isActive )
			{
				modalCtrl.toggle(modalCtrl);
			}
		});
	};

	$.fn.abortModal = function(){
		return this.each(function(){
			var modalCtrl = $.data(this, 'ctrl');
			if (!!modalCtrl && modalCtrl.isActive)
			{
				if (!!modalCtrl.options.abortFunc)
				{
					modalCtrl.options.abortFunc();
				}
				modalCtrl.toggle(modalCtrl);
			}
		});
	};

	$.fn.completeModal = function(){
		return this.each(function(){
			var modalCtrl = $.data(this, 'ctrl');
			if (!!modalCtrl && modalCtrl.isActive)
			{
				if (!!modalCtrl.options.completeFunc)
				{
					modalCtrl.options.completeFunc();
				}
				modalCtrl.toggle(modalCtrl);
			}
		});
	};
})();