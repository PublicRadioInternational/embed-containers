;(function () {
	
	'use strict';

	$.fn.makeModal = function(){
		var self = this;
		
		self.addClass('modal-content');
		self.before('<div class="modal-backdrop"></div>');

		return self;
	};

	$.fn.opensModal = function(el)
	{
		var self = this;
		var clickFunc = function()
		{
			el.toggleClass('active');
			$('.modal-backdrop').toggleClass('active');
		};

		self.click(clickFunc);
		$('.modal-backdrop').click(clickFunc);

		return self;
	};
})();