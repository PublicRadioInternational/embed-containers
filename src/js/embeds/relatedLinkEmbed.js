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
	var embedName = 'relatedLinkEmbed',
		defaults = {
			viewPath: base + 'modal/modal_relatedLink.html',
			displayName: 'Related Link',
			httpPaths: {
				put: '',
				post: '',
				get: '',
				del: ''
			}
		};

	// CONSTRUCTOR
	function relatedLinkEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	relatedLinkEmbed.inherits(EntityEmbedTypes.genericEmbed);
	EntityEmbedTypes[embedName] = relatedLinkEmbed;

	// PUBLIC
	relatedLinkEmbed.prototype.cleanModel = function(){
		return {
			internalTitle: null,
			displayTitle: null,
			links: []
		};
	};

	relatedLinkEmbed.prototype.initModal = function($el){
		var self = this;

		var $linkList = $el.find('#related-link-list');

		var addLinkBtn = '<button class="add-link-btn">' +
							'<i class="fa fa-plus-circle add"></i>' + 
						'</button>';

		$el.append(addLinkBtn).click(function(){
			
			$linkList.append(
				'<div class="related-link-url">' + 
					'<div class="embed-modal-form">' +
						'<input type="text" placeholder="link url" class="embed-modal-form-control">' +
					'</div>' + 
					'<button class="remove-link-btn">' + 
						'<i class="fa fa-minus-circle"></i>' + 
					'</button>' + 
				'</div>'
			);
		});
	}
})('', EntityEmbedTypes);