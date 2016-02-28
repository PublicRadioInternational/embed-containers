(function(base, EntityEmbedTypes){

	'use strict';

	// check for EntityEmbedTypes namespace
	if (!EntityEmbedTypes)
	{
		console.log('Could not find EntityEmbedTypes namespace. ' +
			'Please ensure that the genericEmbed has loaded before this one.');
		return;
	}

	// PRIVATE
	var embedName = 'globalBuzz',
		defaults = {
			viewPath: base + 'modal/modal_globalBuzz.html',
			displayName: 'Global Buzz',
			httpPaths: {
				put: '',
				post: '',
				get: '',
				del: ''
			},
			object_type: 'global-buzz',
			validationOptions: {
				rules: {
					internalTitle: 'required',
					quote: 'required',
					credit: 'required',
					quoteUrlText: 'required',
					quoteUrl: 'required',
					url: 'required'
				}

			}
		};

	// CONSTRUCTOR
	function globalBuzzEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	globalBuzzEmbed.inherits(EntityEmbedTypes.genericEmbed);
	EntityEmbedTypes[embedName] = globalBuzzEmbed;

	// PUBLIC
	globalBuzzEmbed.prototype.orderIndex = 12;

	globalBuzzEmbed.prototype.cleanModel = function(){
		return {

			internalTitle: null,
			quote: null,
			credit: null,
			quoteUrl: null
		};
	};

	globalBuzzEmbed.prototype.parseForEditor = function(){
		var self = this;
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
							'<div class="buzz-field-quote-credit">' + 
							self.model.credit +
							'</div>' + 
							'<a class="btn btn-primary global-buzz-link" href="' + self.model.quoteUrl + '">' + self.model.quoteUrlText + 
							'</a>' +
							'</div>' +
						'</div>' +
					'</article>' +
				'</div>';
	};

})('', EntityEmbedTypes);