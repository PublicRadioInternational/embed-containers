var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'iframe',
		defaults = {
			viewPath: 'modal_iframe.html',
			displayName: 'iFrame',
			object_type: 'iframe',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required',
					height: 'required'
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
			allowsScroll: false,
			width: null,
			height: 300,
			object_type: defaults.object_type
		};
	};

	iframeEmbed.prototype.parseForEditor = function(){
		var h = this.model.height;
		var w = this.model.width || this.model.height;
		var heightRatio = h / w * 100;
		var isResponsive = !!this.model.width;
		var html = [
			'<div',
				' class="iframe-embed' + (isResponsive ? ' iframe-embed-responsive' : '') + '"',
				isResponsive ? ' style="padding-bottom: ' + heightRatio + '%"' : '',
			'>',
				'<iframe src="' + this.model.url + '"',
					' frameborder="0"',
					' scrolling="' + this.model.allowsScroll + '"',
					' height="' + (this.model.height || 300) + '"',
					' width="' + (this.model.width ? this.model.width : '100%') + '"',
				'></iframe>',
			'</div>'
		].join('');

		if(isResponsive)
		{
			html = [
				'<div class="iframe-embed-responsive-wrapper" style="max-width:' + this.model.width + 'px">',
				html,
				'</div>'
			].join('');
		}

		return html;
	};

})();