;(function () {
	
	'use strict';

	var defaults = {
		contentClass: 'modal',
		backdropClass: 'modal-backdrop',
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

	modal.prototype.toggle = function(ctrl)
	{
		ctrl.$el.toggleClass('active');	
		ctrl.$backdrop.toggleClass('active');
	};

	modal.prototype.init = function()
	{
		var self = this;

		// style this class as a modal and
		// add optional user specified styling
		self.$el.addClass(self.options.contentClass);

		// link back drop to this modal
		// add optional user specified styling
		var uniqueId = self.generateId();
		self.$el.before('<div id="' + uniqueId + 
			'" class="' + self.options.backdropClass + '"></div>');
		self.$backdrop = $('#' + uniqueId);
		self.$backdrop.click(function(){
			self.toggle(self);
		});

		// register user specified triggers that toggles this modal	
		// TODO : make open and close triggers
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