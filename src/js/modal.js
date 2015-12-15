;(function () {
	
	'use strict';

	var generateId = function () {
		var seg = function()
		{
			return Math.floor((1 + Math.random()) * 0x10000)
						.toString(16)
						.substring(1);
		}
  		return seg() + seg() + '-' + seg() + '-' + seg() + '-' +
				seg() + '-' + seg() + seg() + seg();
	};

	$.fn.modal = function(options){
		var self = this;

		// style this class as a modal and
		// add optional user specified styling
		self.addClass('modal-content');
		if (!!options.contentClass)
		{
			self.addClass(options.contentClass);
		}

		// add optional user specified styling to backdrop
		var classes = 'modal-backdrop'; 
		if (!!options.backdropClass)
		{

			if (options.backdropClass.constructor.toString().indexOf('Array') > -1)
			{ 
				for(var i = 0; i < options.backdropClass.length; i++)
				{
					classes += ' ' + options.backdropClass[i];
				}
			}
		} 

		// link back drop to this modal and
		// give it expected functionality
		var uniqueId = generateId();
		self.before('<div id="' + uniqueId + '" class="' + classes + '"></div>');
		self.backdropElement = $('#' + uniqueId);
		self.backdropElement.click(function()
		{
			self.backdropElement.toggleClass('active');
			self.toggleClass('active');
		});

		// register user specified triggers that open this modal
		for(var i = 0; i < options.openTriggers.length; i++)
		{
			var trigger = options.openTriggers[i];

			// TODO : register more events
			switch(trigger.openEvent)
			{
				case 'click':
				default:
					trigger.element.click(function()
					{
						self.backdropElement.toggleClass('active');
						self.toggleClass('active');
					});
					break;
			}
		}

		return self;
	};
})();