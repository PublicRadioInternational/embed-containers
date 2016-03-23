var EntityEmbed = EntityEmbed || {};

(function(){

	// PRIVATE

	var $toolbars = {},	// field name identifies embed type by name
						// field value is jQuery object of toolbar HTML
		activeEmbedClass = 'entity-embed-active',	// class name given to active (selected) embeds
		activeToolbarBtnClass = 'medium-editor-button-active', // class name given to the active toolbar button
		styleToolbarClass = 'medium-insert-images-toolbar', // class name given to the medium insert toolbar
		actionToolbarClass = 'medium-insert-images-toolbar2', // class name given to the secondary toolbar
		actionToolbarLocatorClass = 'entity-embed-secondary-toolbar-locator',
		entityEmbedEditorLineClass = 'entity-embed-editor-line', // class name given to a line (<p> element) in the editor on which an entity is embedded
		entityEmbedContainerClass = 'entity-embed-container',
		toolbarHtml = function(configs, embedName){ // function that creates the HTML for a toolbar
			// TODO change class names
			var toolbarClasses = '';
			if (!!embedName) // this is a styles toolbar (specific to embed)
			{
				toolbarClasses = 'medium-insert-images-toolbar medium-editor-toolbar medium-toolbar-arrow-under medium-editor-toolbar-active ';
				toolbarClasses += embedName + 'StyleToolbar'
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


			htmlString +=
					'</ul>' + 
				'</div>';

			return htmlString;
		};

	// CONSTRUCTOR
	toolbarManager = function(mediumEditorAddon, toolbarStyles, toolbarActions, activeEmbedClassParam){
		var self = this;
		self.mediumEditorAddon = mediumEditorAddon;
		self.styles = toolbarStyles;
		self.actions = toolbarActions;
		if (!!activeEmbedClassParam)
		{
			activeEmbedClass = activeEmbedClassParam;
		}
		self.events();
	};

	// PUBLIC
	toolbarManager.prototype.events = function(){
		var self = this;
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
		$location.append(toolbarHtml(self.actions)); // trim?
		self.$actionToolbar = $('.' + actionToolbarClass);
		self.$actionToolbar.hide();
	}

	toolbarManager.prototype.createStyleToolbar = function($location, embed) {
		var self = this;
		var stylesCopy = $.extend(self.styles, {});
		var deletedEveryField = true;
		if (!embed.options.styles)
		{
			return;
		}
		for(var style in embed.options.styles)
		{
			if (!embed.options.styles[style])
			{
				delete stylesCopy[style];
			}
			else
			{
				deletedEveryField = false;
			}
		}

		if (!deletedEveryField)
		{
			$location.append(toolbarHtml(stylesCopy, embed.name)); // .trim() ?
			$toolbars[embed.name] = $('.' + styleToolbarClass + '.' + embed.name + 'StyleToolbar');
			$toolbars[embed.name].hide();
		}
	};

	toolbarManager.prototype.showToolbars = function($embed) {
		var self = this;
		var $activeLine = $embed.parent();
		var $activeButton;
		self.currentToolbarEmbedType = $embed.find('[data-embed-type]').attr('data-embed-type');

		self.$actionToolbar.show();

		if (!!$toolbars[self.currentToolbarEmbedType])
		{
			$toolbars[self.currentToolbarEmbedType].find('button').each(function () {
				if($activeLine.hasClass('entity-embed-' + $(this).data('action')))	
				{
					$activeButton = $(this);
					$activeButton.addClass(activeToolbarBtnClass);
				}
			});

			if (!$activeButton)
			{
				$activeButton = $toolbars[self.currentToolbarEmbedType].find('button').first();
			}

			$activeButton.addClass(activeToolbarBtnClass);

			self.styleToolbarDo($activeButton);

			$toolbars[self.currentToolbarEmbedType].show();
		}

		self.positionToolbars($embed);
	};

	toolbarManager.prototype.styleToolbarDo = function($buttonClicked) {
		var self = this;
		var $buttonList = $buttonClicked.closest('li').closest('ul');
		var $activeLine = $('.' + activeEmbedClass).closest('.' + entityEmbedEditorLineClass);

		// change the active button to this one
		// there should only be one active button
		$buttonList
			.find('.' + activeToolbarBtnClass)
			.removeClass(activeToolbarBtnClass);
		$buttonClicked.addClass(activeToolbarBtnClass);

		$buttonList.find('button').each(function(){
			var $curButton = $(this);
			var className = 'entity-embed-' + $curButton.data('action');

			if ($curButton.hasClass(activeToolbarBtnClass))
			{
				$activeLine.addClass(className);
				if (!!self.styles[$curButton.data('action')].added)
				{
					self.styles[$curButton.data('action')].added($activeLine)
				}
				setTimeout(function(){
					self.positionToolbars($('.' + activeEmbedClass));
				}, 50);
			}
			else
			{
				$activeLine.removeClass(className);	
				if (!!self.styles[$curButton.data('action')].removed)
				{
					self.styles[$curButton.data('action')].removed($activeLine)
				}
			}
		});
	};


	toolbarManager.prototype.actionToolbarDo = function($toolbarButton) {
		var self = this;
		var $activeEmbed = $('.' + activeEmbedClass);
		var action = self.actions[$toolbarButton.data('action')].clicked;
		action(self.mediumEditorAddon, $activeEmbed);
	};

	toolbarManager.prototype.hideToolbar = function(){
		var self = this;

		self.$actionToolbar.hide();	
		self.$actionToolbar.find('button').removeClass(activeToolbarBtnClass);

		if (!self.currentToolbarEmbedType || !$toolbars[self.currentToolbarEmbedType])
		{
			return;
		}
		$toolbars[self.currentToolbarEmbedType].hide();
		$toolbars[self.currentToolbarEmbedType].find('button').removeClass(activeToolbarBtnClass);
		self.currentToolbarEmbedType = null;
	};

	toolbarManager.prototype.positionToolbars = function($embed) {
		var self = this;

		// position action tool bar

		// TODO : position action tool bar in a way that doesn't suck
		//			this positioning frequently interferes with the other toolbar
		//			the code for this is convoluted

		var $toolbarLocator = $embed.find('.' + actionToolbarLocatorClass);
		if ($toolbarLocator.length === 0)
		{
			$toolbarLocator = $embed;
		}

		top = $embed.offset().top + 2; // 2px - distance from a border
		var left = $toolbarLocator.offset().left + $toolbarLocator.width() + 4; // 4px - distance from border

		if (left > ($(window).width() - self.$actionToolbar.width()))
		{
			top -= (self.$actionToolbar.height() + 8); //8 px - distance from border
			left = ($(window).width() - self.$actionToolbar.width()) - 50; // 100 px - width of the toolbar;  50 px - addittional room
		}

		self.$actionToolbar
			.css({
				top: top,
				left: left
			});

		// get current styles toolbar
		var $stylesToolbar = $toolbars[self.currentToolbarEmbedType];
		if (!$stylesToolbar)
		{
			return;
		}

		// position styles toolbar

		var top = $embed.offset().top - $stylesToolbar.height() - 8 - 2 - 5; // 8px - hight of an arrow under toolbar, 2px - height of an image outset, 5px - distance from an image
		if (top < 0)
		{
			top = 0;
		}

		$stylesToolbar
			.css({
				top: top,
				left: $embed.offset().left + $embed.width() / 2 - $stylesToolbar.width() / 2
			});
	};

	EntityEmbed.toolbarManager = toolbarManager;
})();