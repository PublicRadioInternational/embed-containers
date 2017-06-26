var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'opinary',
		defaults = {
			viewPath: 'modal_opinary.html',
			displayName: 'Opinary',
			object_type: 'opinary',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required',
				}
			}
		};

	// CONSTRUCTOR
	function opinaryEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	opinaryEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = opinaryEmbed;


	// PUBLIC
	opinaryEmbed.prototype.orderIndex = 14;

	opinaryEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url: null,
			object_type: defaults.object_type
		};
	};

	opinaryEmbed.prototype.parseForEditor = function(){
		var html = [
			'<div class="opinary-widget-wrapper" style="width: 100%; max-width: 600px; height:100%; margin:0 auto;">',
				'<div class="opinary-widget" style="position:relative; padding-top: 100%;">',
					'<iframe src="' + this.model.url + '" class="opinary-iframe" frameborder="0" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"></iframe>',
				'</div>',
			'</div>',
			'<script src="//compass.pressekompass.net/static/opinary.js"></script>'
		].join('');

		return html;
	};

})();