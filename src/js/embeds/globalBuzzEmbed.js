var EntityEmbed = EntityEmbed || {};

(function(base){

	'use strict';

	// PRIVATE
	var embedName = 'globalBuzz',
		defaults = {
			viewPath: base + 'modal/modal_globalBuzz.html',
			displayName: 'Global Buzz',
			object_type: 'global-buzz',
			validationOptions: {
				rules: {
					title: 'required',
					quote: 'required',
					url: 'required'
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

	globalBuzzEmbed.prototype.getModelFromForm = function($el){
		var self = this;
		self.parent.getModelFromForm($el, self);

		var html_rendered_name = 'html_rendered';
		var code = '<div class="global-buzz">' +
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
								'<div class="buzz-field-quote-credit">' +
									self.model.credit +
								'</div>' +
								'<a class="btn btn-primary global-buzz-link" href="' + self.model.quoteUrl + '">' + self.model.quoteUrlText + '</a>' +
							'</div>' +
						'</article>' +
					'</div>';
		self.model[html_rendered_name] = code;
	};

	globalBuzzEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			quote: null,
			credit: null,
			quoteUrl: null
		};
	};
})('');