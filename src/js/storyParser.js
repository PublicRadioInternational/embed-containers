;(function () {
	
	'use strict';

	var defaultOptions = {
		//getAll: true
	};

	function storyParser(el) {	
		var self = this;

		self.$el = $(el);

		//self.options = $.extend(true, {}, defaultOptions, options);
		//self.scope = $.extend(true, {}, defaultScope, scope);

		self.init();
	};

	//storyParser.prototype.isActive = false;

	storyParser.prototype.generateId = function () {
		var seg = function()
		{
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return seg() + seg() + '-' + seg() + '-' + seg() + '-' +
				seg() + '-' + seg() + seg() + seg();
	}
	

	storyParser.prototype.init = function()
	{
		var self = this;
	};

	
	
	$.fn.storyParser = function(){
		return this.each(function(){
			}
		);
	};
	
	
	$.fn.parse = function(storyHtml){
		//return this.each(function(){
		//	return storyHtml;
		//});
		return storyHtml;
	};
	
	
})();