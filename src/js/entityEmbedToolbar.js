var EntityEmbed = EntityEmbed || {};

(function(){

	// PRIVATE

	var $toolbars = {},	// field name identifies embed type by name
						// field value is jQuery object of toolbar HTML
		pluginName = 'mediumInsert',
		addonName = 'EntityEmbeds', // name of the Medium Editor Insert Plugin
		activeEmbedClass = 'entity-embed-active',	// class name given to active (selected) embeds
		activeToolbarBtnClass = 'medium-editor-button-active', // class name given to the active toolbar button
		styleToolbarClass = 'medium-insert-images-toolbar', // class name given to the medium insert toolbar
		actionToolbarClass = 'medium-insert-images-toolbar2', // class name given to the secondary toolbar
		actionToolbarLocatorClass = '.entity-embed-secondary-toolbar-locator',
		docEventsReadyKey = 'entityEmbedToolbarEventsReady',
		entityEmbedToolbarClass = 'entity-embed-toolbar',
		entityEmbedEditorLineClass = 'entity-embed-editor-line', // class name given to a line (<p> element) in the editor on which an entity is embedded
		entityEmbedContainerClass = 'entity-embed-container', // class name given to the objects which contain entity embeds
		toolbarHtml = function(configs, embedName){ // function that creates the HTML for a toolbar
			// TODO change class names
			var toolbarClasses = entityEmbedToolbarClass;
			if (!!embedName) // this is a styles toolbar (specific to embed)
			{
				toolbarClasses += ' medium-insert-images-toolbar medium-editor-toolbar medium-editor-stalker-toolbar medium-toolbar-arrow-under medium-editor-toolbar-active ';
				toolbarClasses += embedName + 'StyleToolbar'
			}
			else // this is an action toolbar (not specific to embed)
			{
				toolbarClasses += ' medium-insert-images-toolbar2 medium-editor-toolbar medium-toolbar-arrow-after medium-editor-toolbar-active';
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

	function getCore($embed) {
		var $contentEditable = $embed.closest('[contenteditable]');
		var core = $contentEditable.data('plugin_' + pluginName);

		return core;
	}

	function getAddon($embed) {
		var $contentEditable = $embed.closest('[contenteditable]');
		var addon = $contentEditable.data('plugin_' + pluginName + addonName);

		return addon;
	}

	// CONSTRUCTOR
	toolbarManager = function(mediumEditorAddon, toolbarStyles, toolbarActions, activeEmbedClassParam){
		var self = this;
		self.mediumEditorAddon = mediumEditorAddon;
		self.styles = toolbarStyles;
		self.actions = toolbarActions;
		self.embedTypes = [];
		if (!!activeEmbedClassParam)
		{
			activeEmbedClass = activeEmbedClassParam;
		}
		self.events();
	};

	// PUBLIC
	toolbarManager.prototype.events = function(){
		var self = this;
		var $document = $(document);

		if(!$document.data(docEventsReadyKey))
		{
			$document
				// Set
				.data(docEventsReadyKey, true)
				// fire toolbar actions when buttons are clicked
				.on('click', '.' + styleToolbarClass + ' .medium-editor-action', function(){
					self.styleToolbarDo($(this));
				})
				// fire secondary toolbar actions when buttons are clicked
				.on('click', '.' + actionToolbarClass + ' .medium-editor-action', function(){
					self.actionToolbarDo($(this));
				});
		}
	};

	toolbarManager.prototype.createActionToolbar = function($location) {
		var self = this;
		var $toolbar = $location.find('.' + actionToolbarClass);

		if(!$toolbar.length)
		{
			$toolbar = $(toolbarHtml(self.actions));
			$location.append($toolbar);
		}

		self.$actionToolbar = $toolbar;
		self.$actionToolbar.hide();
	}

	toolbarManager.prototype.createStyleToolbar = function($location, embed) {
		var self = this;
		var stylesCopy = $.extend(self.styles, {});
		var deletedEveryField = true;
		var $toolbar = $location.find('.' + styleToolbarClass + '.' + embed.name + 'StyleToolbar');

		console.log(embed);

		self.embedTypes[embed.name] = embed;

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
			if(!$toolbar.length)
			{
					$toolbar = $(toolbarHtml(stylesCopy, embed.name));
					$location.append($toolbar);
			}

			$toolbars[embed.name] = $toolbar;
			$toolbars[embed.name].hide();
		}
	};

	// $embed is the embed html element
	// embedType is the name of the embed (name field on embed object)
	toolbarManager.prototype.showToolbars = function($embed, embedType) {
		var self = this;
		var $activeLine = $('.' + activeEmbedClass);
		var $activeButton;
		self.currentToolbarEmbedType = embedType;

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

			$toolbars[self.currentToolbarEmbedType].show();

			if (!!$activeButton)
			{
				$activeButton.addClass(activeToolbarBtnClass);
			}
		}

		self.positionToolbars($embed);
	};

	toolbarManager.prototype.styleToolbarDo = function($buttonClicked) {
		var self = this;
		var $buttonList = $buttonClicked.closest('li').closest('ul');
		var $activeLine = $('.' + activeEmbedClass);
		var core = getCore($activeLine);

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
				self.addStyle($activeLine, className, $curButton.data('action'), true);
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

		console.log('activeline data:', $activeLine.data());

		// TODO: Tell EntityEmbedAddon to re-render embed.
		self.mediumEditorAddon.renderEmbed($activeLine, true);

		core.triggerInput();
	};

	toolbarManager.prototype.addStyle = function($activeLine, styleClass, buttonAction, shouldPositionToolbar){
		var self = this;
		var prevWidth = $activeLine.width();
		var PrevHeight = $activeLine.height();
		var count = 0;

		window.clearTimeout(self.positionToolbarsTimeout);

		function repositionToolbars() {
			var w = $activeLine.width();
			var h = $activeLine.height();

			if(w !== prevWidth || h !== PrevHeight)
			{
				console.log('reposition toolbars...', count, w, prevWidth, h, PrevHeight);
				count = 1;
				prevWidth = w;
				PrevHeight = h;
				self.positionToolbars($activeLine);
			}

			if(count < 20) {
				count++;
				console.log(count);
				self.positionToolbarsTimeout = window.setTimeout(function(){
					repositionToolbars();
				}, 100);
			}
			else
			{
				delete self.positionToolbarsTimeout;
			}
		}

		$activeLine.addClass(styleClass);

		if (!!self.styles[buttonAction].added)
		{
			self.styles[buttonAction].added($activeLine)
		}
		if (shouldPositionToolbar)
		{
			repositionToolbars();
		}
	};


	toolbarManager.prototype.actionToolbarDo = function($toolbarButton) {
		var self = this;
		var $activeEmbed = $('.' + activeEmbedClass);
		var action = self.actions[$toolbarButton.data('action')].clicked;
		var addon = getAddon($activeEmbed);

		action(addon, $activeEmbed);
	};

	toolbarManager.prototype.hideToolbar = function(){
		var self = this;
    var $toolbars = $('.' + entityEmbedToolbarClass);

		$toolbars.hide();
		$toolbars.find('button').removeClass(activeToolbarBtnClass);

		self.currentToolbarEmbedType = null;

		if(self.positionToolbarsTimeout)
		{
			window.clearTimeout(self.positionToolbarsTimeout);
			delete self.positionToolbarsTimeout;
		}
	};

	toolbarManager.prototype.positionToolbars = function($embed) {
		var self = this;
		var $figure = $embed.find('> figure');
		var embedType = $figure.data('embed');
		var toolbarLocatorClass = embedType.options.actionToolbarLocatorClass || actionToolbarLocatorClass;

		if(!$embed.length)
		{
			return;
		}

		// position action tool bar

		// TODO : position action tool bar in a way that doesn't suck
		//			this positioning frequently interferes with the other toolbar

		var $toolbarLocator = $embed.find(toolbarLocatorClass);
		if ($toolbarLocator.length === 0)
		{
			$toolbarLocator = $embed;
		}

		top = $embed.offset().top + $embed.height() / 2 - self.$actionToolbar.height() / 2; // 2px - distance from a border
		var left = $toolbarLocator.offset().left + $toolbarLocator.outerWidth() + 8 + 4; // 4px - distance from border

		if (left > ($(window).width() - self.$actionToolbar.width()))
		{
			left = ($(window).width() - self.$actionToolbar.width()) - 50; // 50 px - addittional room
		}

		self.$actionToolbar
			.css({
				top: Math.min(top, $embed.offset().top),
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