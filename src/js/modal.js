;(function () {
	
	'use strict';

	var defaults = {
		contentClass: 'embed-modal',
		backdropClass: 'embed-modal-backdrop',
		closeBtnIcon: 'fa fa-times',
		showCloseBtn: true,
		toggleTriggers:[/*{
			openEvent: 'click',
			element: '.select-element-here #can-have-many'
		}*/]
	};


	function modal(el, options) {	
		var self = this;

		self.$el = $(el);
		self.options = $.extend(true, {}, defaults, options);

		self.init();
	};

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
			self.toggle(self);
		});

		// add close button and give expected functionality
		if (self.options.showCloseBtn){
			self.$el.after(self.closeBtnHtml());
			self.$closeBtn = $('.' + self.closeBtnClass);
			self.$closeBtn.click(function(){
				self.toggle(self);
			});
		}

		// register user specified triggers that toggles this modal	
		// TODO : make open and close triggers (?)
		for(var i = 0; i < self.options.toggleTriggers.length; i++)
		{
			var trigger = self.options.toggleTriggers[i];

			// TODO : register more events
			switch(trigger.openEvent)
			{
				case 'click':
				default:
					trigger.element.click(function(){
						self.toggle(self);
					});
					break;
			}
		}
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

	$.fn.toggleModal = function()
	{
		return this.each(function(){
			var modalCtrl = $.data(this, 'ctrl');
			if (!!modalCtrl)
			{
				modalCtrl.toggle(modalCtrl);
			}
		});
	}
})();