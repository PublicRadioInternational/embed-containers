var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'globalBuzz',
		defaults = {
			viewPath: 'modal_globalBuzz.html',
			displayName: 'Global Buzz',
			object_type: 'global-buzz',
			validationOptions: {
				rules: {
					title: 'required',
					quote: 'required',
					quoteUrlText: 'required',
					quoteUrlText: 'required'
				}
			}
		};

	// CONSTRUCTOR
	function globalBuzzEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	globalBuzzEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = globalBuzzEmbed;

	// PUBLIC
	globalBuzzEmbed.prototype.orderIndex = 13;

	globalBuzzEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			quote: null,
			credit: null,
			quoteUrl: null,
			quoteUrlText: null
		};
	};

	globalBuzzEmbed.prototype.parseForEditor = function(){
		var self = this;
		var credit;

		credit = !self.model.credit ? '' :
			'<div class="buzz-field-quote-credit">' +
				self.model.credit +
			'</div>';

		return '<div class="global-buzz">' +
					'<article class="global-buzz-quote-wrapper engagement-badge-wrapper">' +
						'<div class="engagement-badge"></div>' +
						'<div>' +
							'<h1 class="global-buzz-teaser">Global Buzz</h1>' +
							'<div class="buzz-field-quote">' +
								'<img class ="buzz-field-quote-png" src="http://www.pri.org/sites/all/themes/pri/images/icon-open-quote.png">' +
								'<div class="buzz-quote-inner">' +
									self.model.quote +
								'</div>' +
							'</div>' +
							credit +
							'<a class="btn btn-primary global-buzz-link" href="' + self.model.quoteUrl + '">' + self.model.quoteUrlText + '</a>' +
						'</div>' +
					'</article>' +
				'</div>';
	};

})();