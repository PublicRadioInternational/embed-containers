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
		self.toggle = function()
		{
			self.toggleClass('active');	
			if (!!self.backdropElement)
			{
				self.backdropElement.toggleClass('active');
			}
		};

		// avoid null reference errors
		if (!options)
		{
			options = {};
		}

		// style this class as a modal and
		// add optional user specified styling
		self.addClass('modal');
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

		self.backdropElement.click(self.toggle);

		// register user specified triggers that open this modal	
		if (!!options.openTriggers){
			for(var i = 0; i < options.openTriggers.length; i++)
			{
				var trigger = options.openTriggers[i];

				// TODO : register more events
				switch(trigger.openEvent)
				{
					case 'click':
					default:
						trigger.element.click(self.toggle);
						break;
				}
			}
		}

		return self;
	};
})();