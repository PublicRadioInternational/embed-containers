var EntityEmbed = EntityEmbed || {};

(function(){

	// PRIVATE

	var $toolbars = {},	// field name identifies embed type by name
						// field value is jQuery object of toolbar HTML
		activeEmbedClass = 'entity-embed-active',	// class name given to active (selected) embeds
		activeToolbarBtnClass = 'medium-editor-button-active', // class name given to the active toolbar button
		styleToolbarClass = 'medium-insert-images-toolbar', // class name given to the medium insert toolbar
		actionToolbarClass = 'medium-insert-images-toolbar2', // class name given to the secondary toolbar
		secondaryToolbarLocatorClass = 'entity-embed-secondary-toolbar-locator',
		toolbarHtml = function(configs, embedName){ // function that creates the HTML for a toolbar
			// TODO change class names
			var toolbarClasses = '';
			if (!!embedName) // this is a styles toolbar (specific to embed)
			{
				toolbarClasses = 'medium-insert-images-toolbar medium-editor-toolbar medium-toolbar-arrow-under medium-editor-toolbar-active';
				toolbarClasses += ' ' + embedName + 'StyleToolbar'
			}
			else // this is an action toolbar (not specific to embed)
			{
				toolbarClasses = 'medium-insert-images-toolbar2 medium-editor-toolbar medium-editor-toolbar-active';
			}

			var htmlString =
				'<div class="' + toolbarClasses + '">' + 
					'<ul class="medium-editor-toolbar-actions clearfix">';

			for(var configName in configs)
			{
				var config = configs[configName];
				if (!config.label)
				{
					continue;
				}
				htmlString +=
						'<li>' + 
							'<button class="medium-editor-action" data-action="' + configName + '">' + 
								config.label +
							'</button>' + 
						'</li>';
			}


			var htmlString +=
					'</ul>' + 
				'</div>';

			return htmlString;
		};

	// CONSTRUCTOR
	function toolbarManager = function(toolbarStyles, toolbarActions){
		var self = this;
		self.styles = toolbarStyles;
		self.actions = toolbarActions;
		self.events();
	};

	// PUBLIC
	toolbarManager.prototype.events = function(){
		$(document)
			// fire toolbar actions when buttons are clicked
			.on('click', '.' + styleToolbarClass + ' .medium-editor-action', function(){
				self.styleToolbarDo($(this));
			})
			// fire secondary toolbar actions when buttons are clicked
			.on('click', '.' + actionToolbarClass + ' .medium-editor-action', function(){
				self.actionToolbarDo($(this));
			})
	};

	toolbarManager.prototype.createActionToolbar = function($location) {
		var self = this;
		$location.append(toolbarHtml(toolbarAction)).trim();
		self.$actionToolbar = $('.' + actionToolbarClass);
		self.$actionToolbar.hide();
	}

	toolbarManager.prototype.createStyleToolbar = function($location, embed) {
		var self = this;
		var stylesCopy = $.extend(self.styles, {});
		for(var style in embed.options.styles)
		{
			if (!embed.options.styles[style])
			{
				delete stylesCopy[style];
			}
		}
		$location.append(toolbarHtml(stylesCopy, embed.name)).trim()
		$toolbars[embed.name] = $('.' + styleToolbarClass + '.' + embed.name + 'StyleToolbar');
		$toolbars[embed.name].hide();
	};

	toolbarManager.prototype.showToolbar = function(embed) {
		if (!toolbars[embed.name])
		{
			return;	
		}
		toolbars[embed.name].show();
	};

	toolbarManager.prototype.styleToolbarDo = function($embed) {

	};


	toolbarManager.prototype.actionToolbarDo = function($embed) {

	};

	toolbarManager.prototype.showToolbar = function(embedName) {
		var self = this;
		var $activeLine = $embed.parent();
		var $activeButton;

		self.$toolbar.find('button').each(function () {
			if($activeLine.hasClass('entity-embed-'+ $(this).data('action')))
			{
				$activeButton = $(this);
				$activeButton.addClass(activeToolbarBtnClass);
			}
		});

		if (!$activeButton)
		{
			$activeButton = self.$toolbar.find('button').first();
		}

		$activeButton.addClass(activeToolbarBtnClass);
		self.toolbarAction($activeButton);

		self.$toolbar.show();
		self.$toolbar2.show();
	};

	toolbarManager.prototype.positionToolbar = function($toolbar, $toolbar2, $embed) {
		var self = this;

		var top = $embed.offset().top - $toolbar.height() - 8 - 2 - 5; // 8px - hight of an arrow under toolbar, 2px - height of an image outset, 5px - distance from an image
		if (top < 0)
		{
			top = 0;
		}

		$toolbar
			.css({
				top: top,
				left: $embed.offset().left + $embed.width() / 2 - $toolbar.width() / 2
			});

		var $toolbarLocator = $embed.find('.' + secondaryToolbarLocatorClass);
		if ($toolbarLocator.length === 0)
		{
			$toolbarLocator = $embed;
		}

		top = $embed.offset().top + 2; // 2px - distance from a border
		var left = $toolbarLocator.offset().left + $toolbarLocator.width() + 4; // 4px - distance from border

		if (left > ($(window).width() - $toolbar2.width()))
		{
			top -= ($toolbar2.height() + 8); //8 px - distance from border
			left = ($(window).width() - $toolbar2.width()) - 50; // 100 px - width of the toolbar;  50 px - addittional room
		}

		$toolbar2
			.css({
				top: top,
				left: left
			});
	};

	EntityEmbed.toolbarManager = toolbarManager;
})();