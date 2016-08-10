(function(){EntityEmbed = EntityEmbed || {}; var templateCache = {};templateCache["modal"] = "null";
templateCache["modal/modal_audio.html"] = "<form method=\"post\" enctype=\"multipart/form-data\"><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"upload\">MP3 File</label><div class=\"audio_editor\"><div class=\"audio_editor-intro\"><div class=\"audio_editor-intro_inner\"><input class=\"embed-modal-input embed-modal-file-input\" type=\"file\" name=\"upload\" accept=\"audio/mpeg, audio/mp3\"></div></div><div class=\"audio_editor-preview\"><div class=\"audio_editor-preview_inner\"><audio class=\"audio_editor-preview_audio\" controls></audio></div></div><div class=\"audio_editor-toolbar\"><ul class=\"audio_editor-toolbar_list\"><li class=\"audio_editor-toolbar_item js-upload\"><a class=\"audio_editor-tollbar_btn\"><span class=\"fa fa-upload\" aria-label=\"Select Another Image\"></span></a></li><li class=\"audio_editor-toolbar_item js-upload-undo\"><a class=\"audio_editor-tollbar_btn\"><span class=\"fa fa-undo\" aria-label=\"Revert Selected Image\"></span></a></li><li class=\"audio_editor-toolbar_item js-upload-cancel\"><a class=\"audio_editor-tollbar_btn\"><span class=\"fa fa-arrow-left\" aria-label=\"Cancel Image Select\"></span></a></li></ul></div></div></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title\" class=\"embed-modal-input embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div id=\"audio-credits\" class=\"embed-modal-form\"><div class=\"embed-modal-half-column\"><label for=\"credit\" class=\"embed-modal-label\">Credit</label><input id=\"credit\" class=\"embed-modal-form-control embed-modal-input\" type=\"text\" name=\"credit\"></div><div class=\"embed-modal-half-column\"><label for=\"creditLink\" class=\"embed-modal-label\">Credit Link</label><input id=\"creditLink\" class=\"embed-modal-form-control embed-modal-input\" type=\"url\" name=\"creditLink\"></div></div></div></form>";
templateCache["modal/modal_confirmation.html"] = "<div class=\"embed-modal-dialog\"><div class=\"embed-modal-content\"><div class=\"embed-modal-header\"><h3>Are you sure you want to leave?</h3></div><div class=\"embed-modal-body\"><h4>All your changes will be lost if you leave this window!</h4></div><div class=\"embed-modal-footer\"><button id=\"btn-confirm-leave\">Yes - Leave</button> <button id=\"btn-cancel-leave\">No - Stay</button></div></div></div>";
templateCache["modal/modal_customText.html"] = "<form><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"control-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title for internal use\" class=\"embed-modal-form-control embed-modal-input\"></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"control-label\" for=\"displayTitle\">Display Title</label><input name=\"displayTitle\" type=\"text\" placeholder=\"Enter a title for display purposes\" class=\"embed-modal-form-control embed-modal-input\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"control-label\" for=\"customText\">Text</label><div name=\"customText\" type=\"text\" placeholder=\"Type your text. Highlight words to trigger the styles editor\" class=\"embed-modal-form-control\" id=\"custom-text-editor\"></div></div></div></div></form>";
templateCache["modal/modal_externalLink.html"] = "<form method=\"post\" enctype=\"multipart/form-data\"><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"upload\">Image Thumbnail File</label><input class=\"embed-modal-input embed-modal-file-input\" type=\"file\" name=\"upload\" accept=\"image/*\"> <span class=\"fa fa-times cancel-upload-image-btn\"></span> <span class=\"fa fa-cog edit-chosen-file-btn\"></span><div class=\"uploaded-image-file\"></div></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title for internal use\" class=\"embed-modal-form-control\"></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"displayTitle\">Display Title</label><input name=\"displayTitle\" type=\"text\" placeholder=\"Enter a title for display purposes\" class=\"embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"linkText\">External Link Text</label><input name=\"linkText\" type=\"text\" placeholder=\"Enter link text\" class=\"embed-modal-form-control\"></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"url\">External Link Url</label><input name=\"url\" type=\"url\" placeholder=\"Enter URL\" class=\"embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"teaser\">Teaser</label><textarea name=\"teaser\" type=\"text\" placeholder=\"Enter teaser\" rows=\"3\" class=\"embed-modal-form-control\"></textarea></div></div></div></form>";
templateCache["modal/modal_facebook.html"] = "<form><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title\" class=\"embed-modal-input embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form has-error\"><label class=\"embed-modal-label\" for=\"url\">Facebook Status</label><input name=\"url\" type=\"url\" placeholder=\"Enter URL to status\" class=\"embed-modal-form-control\"></div></div></div></form>";
templateCache["modal/modal_globalBuzz.html"] = "<form><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title for internal use\" class=\"embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"quote\">Quote</label><textarea name=\"quote\" type=\"text\" placeholder=\"Enter quote\" rows=\"5\" class=\"embed-modal-form-control\"></textarea></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label clas=\"embed-modal-label\" for=\"quoteText\">Quote Url Text</label><input name=\"quoteUrlText\" type=\"text\" placeholder=\"Enter URL label\" class=\"embed-modal-form-control\"></div><div class=\"embed-modal-form\"><label clas=\"embed-modal-label\" for=\"quoteUrl\">Quote Url</label><input name=\"quoteUrl\" type=\"url\" placeholder=\"Enter URL\" class=\"embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"credit\">Credit</label><input name=\"credit\" type=\"text\" placeholder=\"Attribute the source\" class=\"embed-modal-form-control\"></div></div></div></form>";
templateCache["modal/modal_iframe.html"] = "<form><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title\" class=\"embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"url\">Source</label><input name=\"url\" type=\"url\" placeholder=\"Enter URL or iframe source code\" class=\"embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"url\">Height</label><div class=\"embed-modal-input-group\"><input name=\"height\" type=\"number\" placeholder=\"\" class=\"embed-modal-form-control\"> <span class=\"embed-modal-input-group-addon\">px</span></div></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"url\">Width</label><div class=\"embed-modal-input-group\"><input name=\"width\" type=\"number\" placeholder=\"Full Width\" class=\"embed-modal-form-control\"> <span class=\"embed-modal-input-group-addon\">px</span></div></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"allowsScroll\">Scroll</label><select name=\"allowsScroll\" class=\"embed-modal-form-control\"><option>No</option><option>Yes</option></select></div></div></div></form>";
templateCache["modal/modal_image.html"] = "<form method=\"post\" enctype=\"multipart/form-data\"><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"upload\">Image File</label><div class=\"image_editor\"><div class=\"image_editor-intro\"><div class=\"image_editor-intro_inner\"><input class=\"embed-modal-input embed-modal-file-input\" type=\"file\" name=\"upload\" accept=\"image/*\"></div></div><div class=\"image_editor-preview\"><img class=\"image_editor-preview_image\"></div><div class=\"image_editor-toolbar\"><ul class=\"image_editor-toolbar_list\"><li class=\"image_editor-toolbar_item js-upload\"><a class=\"image_editor-tollbar_btn\"><span class=\"fa fa-upload\" aria-label=\"Select Another Image\"></span></a></li><li class=\"image_editor-toolbar_item js-upload-undo\"><a class=\"image_editor-tollbar_btn\"><span class=\"fa fa-undo\" aria-label=\"Revert Selected Image\"></span></a></li><li class=\"image_editor-toolbar_item js-upload-cancel\"><a class=\"image_editor-tollbar_btn\"><span class=\"fa fa-arrow-left\" aria-label=\"Cancel Image Select\"></span></a></li></ul></div></div></div><div class=\"embed-modal-form\"><label for=\"title\" class=\"embed-modal-label\">Title</label><input class=\"embed-modal-input embed-modal-form-control\" type=\"text\" name=\"title\"></div><div class=\"embed-modal-form\"><label for=\"altText\" class=\"embed-modal-label\">Alt Text</label><input class=\"embed-modal-input embed-modal-form-control\" type=\"text\" name=\"altText\"></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label for=\"caption\" class=\"embed-modal-label\">Caption</label><textarea class=\"embed-modal-input embed-modal-form-control\" name=\"caption\" rows=\"5\"></textarea></div><div class=\"embed-modal-form\"><label for=\"credit\" class=\"embed-modal-label\">Credit</label><input class=\"embed-modal-input embed-modal-form-control\" type=\"text\" name=\"credit\"></div><div class=\"embed-modal-form\"><label for=\"creditLink\" class=\"embed-modal-label\">Credit Link</label><input class=\"embed-modal-input embed-modal-form-control\" type=\"url\" name=\"creditLink\"></div><div class=\"embed-modal-form\"><label for=\"license\" class=\"embed-modal-label\">License</label><select class=\"embed-modal-form-control\" type=\"text\" name=\"license\"><option value=\"\" disabled=\"disabled\" selected=\"selected\">-- Select A License --</option></select></div></div><!-- <div class=\"embed-modal-full-column\">\r\n			<label class=\"embed-modal-label\" for=\"upload\">Image File</label>\r\n			<input class=\"embed-modal-input embed-modal-file-input\" type=\"file\" name=\"upload\" accept=\"image/*\" />\r\n			<span class=\"fa fa-times cancel-upload-image-btn\"></span>\r\n			<span class=\"fa fa-cog edit-chosen-file-btn\"></span>\r\n			<div class=\"uploaded-image-file\">\r\n				<img class=\"image-preview\">\r\n			</div>\r\n		</div>\r\n	</div>\r\n	<div class=\"embed-modal-row\">\r\n		<div class=\"embed-modal-half-column\">\r\n			<div class=\"embed-modal-form\">\r\n				<label for=\"title\" class=\"embed-modal-label\">Title</label>\r\n				<input class=\"embed-modal-input embed-modal-form-control\" type=\"text\" name=\"title\" />\r\n			</div>\r\n		</div>\r\n		<div class=\"embed-modal-half-column\">\r\n			<div class=\"embed-modal-form\">\r\n				<label for=\"altText\" class=\"embed-modal-label\">Alt Text</label>\r\n				<input class=\"embed-modal-input embed-modal-form-control\" type=\"text\" name=\"altText\" />\r\n			</div>\r\n		</div>\r\n	</div>\r\n	<div class=\"embed-modal-row\">\r\n		<div class=\"embed-modal-form\">\r\n			<div class=\"embed-modal-half-column\">\r\n				<label for=\"credit\" class=\"embed-modal-label\">Credit</label>\r\n				<input class=\"embed-modal-input embed-modal-form-control\" type=\"text\" name=\"credit\" />\r\n			</div>\r\n			<div class=\"embed-modal-half-column\">\r\n				<label for=\"creditLink\" class=\"embed-modal-label\">Credit Link</label>\r\n				<input class=\"embed-modal-input embed-modal-form-control\" type=\"url\" name=\"creditLink\" />\r\n			</div>\r\n		</div>\r\n	</div>\r\n	<div class=\"embed-modal-row\">\r\n		<div class=\"embed-modal-half-column\">\r\n			<div class=\"embed-modal-form\">\r\n				<label for=\"caption\" class=\"embed-modal-label\">Caption</label>\r\n				<input class=\"embed-modal-input embed-modal-form-control\" type=\"text\" name=\"caption\" />\r\n			</div>\r\n		</div>\r\n		<div class=\"embed-modal-half-column\">\r\n			<div class=\"embed-modal-form\">\r\n				<label for=\"license\" class=\"embed-modal-label\">License</label>\r\n				<select class=\"embed-modal-form-control\" type=\"text\" name=\"license\">\r\n					<option disabled selected>-- Select A License --</option>\r\n				</select>\r\n			</div>\r\n		</div>\r\n	</div> --></div></form>";
templateCache["modal/modal_instagram.html"] = "<form><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title\" class=\"embed-modal-input embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"url\">Insert Instagram URL</label><input name=\"url\" type=\"url\" placeholder=\"Enter URL to instagram post\" class=\"embed-modal-input embed-modal-form-control\"></div></div></div></form>";
templateCache["modal/modal_main.html"] = "<div class=\"embed-modal-dialog\"><div class=\"embed-modal-content\"><div class=\"embed-modal-header\"><button type=\"button\" class=\"close\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button><div class=\"embed-modal-half-column\"><h3 class=\"header-title\"></h3></div><div class=\"embed-modal-half-column\"><select class=\"embed-modal-form-control\" id=\"select-embed-type\"></select></div></div><div class=\"embed-modal-body\"><div id=\"embed-modal-create-new\"></div><div id=\"embed-modal-select-existing\"></div></div><div class=\"embed-modal-footer\"><div id=\"embed-modal-buttons-create\"><button id=\"btn-show-select-existing\">Select Existing Embed</button><!-- TODO : add publishing state dropdown --><!-- TODO : publishing state dropdown affects Save button text --> <i class=\"fa fa-spinner fa-spin\" id=\"embed-modal-spinner\"></i> <button id=\"btn-save-modal\">Save</button> <button id=\"btn-abort-modal\">Cancel</button></div><div id=\"embed-modal-buttons-select\"><button id=\"btn-cancel-select-existing\">Create New Embed</button></div></div><!-- the leave confirmation modal will be loaded here --><div class=\"embed-modal\" id=\"leave-confirmation-modal\"><div></div></div></div></div>";
templateCache["modal/modal_newsletterSubscribe.html"] = "<form><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title for internal use\" class=\"embed-modal-form-control embed-modal-input\"></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"displayTitle\">Display Title</label><input name=\"displayTitle\" type=\"text\" placeholder=\"Enter a title for display purposes\" class=\"embed-modal-input embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"teaser\">Teaser</label><textarea name=\"teaser\" type=\"text\" placeholder=\"Enter teaser\" rows=\"3\" class=\"embed-modal-form-control\"></textarea></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"newsletter\">Select Newsletter</label><select name=\"newsletter\" class=\"embed-modal-form-control\"></select></div></div></div></form>";
templateCache["modal/modal_relatedLink.html"] = "<form><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title for internal use\" class=\"embed-modal-form-control\"></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"displayTitle\">Display Title</label><input name=\"displayTitle\" type=\"text\" placeholder=\"Enter a title to display\" class=\"embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><label class=\"embed-modal-label\">Links</label><div class=\"progress\"><div id=\"related-links-progress\" class=\"progress-bar progress-bar-info\"></div></div><ul id=\"related-link-list\"></ul></div></div><hr><div class=\"embed-modal-row\"><div class=\"related-link-add\"><input name=\"linkInput\" type=\"text\" id=\"add-link-eac\" placeholder=\"Begin typing a title. Select one to add link.\" class=\"embed-modal-form-control\"></div></div></form>";
templateCache["modal/modal_slideshow.html"] = "<form><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label for=\"slideshowTitle\" class=\"embed-modal-label\">Slideshow Title</label><input class=\"embed-modal-input embed-modal-form-control\" placeholder=\"Enter a title for internal use\" type=\"text\" name=\"title\"></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label for=\"displayTitle\" class=\"embed-modal-label\">Display Title</label><input class=\"embed-modal-input embed-modal-form-control\" placeholder=\"Enter a title to display\" type=\"text\" name=\"displayTitle\"></div></div></div><hr><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column slideshow_drop_files\"><div class=\"slideshow_intro\"><a class=\"btn btn-lg btn-primary js-add_slide\"><span class=\"fa fa-plus\" aria-hidden=\"true\"></span> Add First Image</a></div><div class=\"slideshow_editor\"><div class=\"slideshow_editor-slide\"><div class=\"slideshow_editor-slide_image-container\"><div class=\"slideshow_editor-slide_image js-slide_image\" style=\"background-image:url(https://test-services.pri.org/image/2016/05/13/b2e0f83b63414f74a21d8a4fdb9d5328/Prince_We_World_web.jpg)\"><img src=\"https://test-services.pri.org/image/2016/05/13/b2e0f83b63414f74a21d8a4fdb9d5328/Prince_We_World_web.jpg\"></div></div><div class=\"slideshow_editor-slide_text js-slide_text\"><div class=\"slideshow_editor-slide_caption js-slide_caption\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam feugiat ac nulla in tincidunt. Curabitur pellentesque, justo at sagittis gravida, nunc eros blandit dolor, a scelerisque eros mauris in tellus.</div><div class=\"slideshow_editor-slide_credit-container\"><span class=\"slideshow_editor-slide_label\">Credit</span> <span class=\"slideshow_editor-slide_credit_text js-slide_credit\">John A. Doe / Unknown News</span> <a class=\"slideshow_editor-slide_credit_link js-slide_credit\" href=\"\" target=\"_blank\">John A. Doe / Unknown News</a></div></div></div><div class=\"slideshow_editor-nav\"><ul class=\"slideshow_editor-nav_list js-slides\"><li class=\"slideshow_editor-nav_item js-slide_template\"><a class=\"slideshow_editor-nav_btn\"><span class=\"slideshow_editor-nav_ind fa\" aria-hidden=\"true\"></span><span class=\"slideshow_editor-nav_handle\" aria-hidden=\"true\"></span></a></li></ul><div class=\"slideshow_editor-add_item\"><a class=\"slideshow_editor-add_btn js-add_slide\"><span class=\"fa fa-plus\" aria-label=\"Add Slide\"></span></a></div></div><div class=\"slideshow_editor-toolbar\"><ul class=\"slideshow_editor-toolbar_list\"><li class=\"slideshow_editor-toolbar_item\"><a class=\"slideshow_editor-toolbar_btn js-remove_slide\"><span class=\"fa fa-remove\" aria-label=\"Remove Slide\"></span></a></li><li class=\"slideshow_editor-toolbar_item\"><a class=\"slideshow_editor-toolbar_btn js-edit_slide\"><span class=\"fa fa-cog\" aria-label=\"Edit Slide\"></span></a></li></ul></div></div></div></div></form><div class=\"embed-modal\" id=\"embed-modal-slideshow-image\"></div>";
templateCache["modal/modal_twitter.html"] = "<form><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title\" class=\"embed-modal-input embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"tweetUrl\">Tweet URL</label><input name=\"url\" type=\"url\" placeholder=\"Enter URL to tweet\" class=\"embed-modal-input embed-modal-form-control\"></div></div></div></form>";
templateCache["modal/modal_video.html"] = "<form><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title\" class=\"embed-modal-input embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"url\">Video URL</label><input name=\"url\" type=\"url\" placeholder=\"Enter URL to video\" class=\"embed-modal-input embed-modal-form-control\"></div></div></div></form>";EntityEmbed.templateCache = templateCache;})();
var EntityEmbed = EntityEmbed || {};

(function(){

	var defaultConfig = {
		data: {},
		debug: 0,
		auth_token: '',
		domainName: '',
		path: ''
	};

	function ajaxWrapper(config){
		config = $.extend(true, {}, defaultConfig, config);

		var ajaxOptions = {
			timeout: 15000,
			crossDomain: true,
			type: config.methodType,
			dataType: 'json',
			jsonp: false,
			url: config.domainName + config.path,
		};

		if (!!config.headers) // this is a file upload
		{
			config.headers['x-auth-token'] = config.auth_token;
			config.headers['x-debug'] = config.debug;

			ajaxOptions.headers = config.headers;

			ajaxOptions.processData = false;
			ajaxOptions.contentType = false;
			ajaxOptions.data = config.data;

			if (typeof config.xhr === 'function')
			{
				ajaxOptions.xhr = config.xhr;
			}
		}
		else
		{
			config.data.debug = config.debug;
			config.data.auth_token = config.auth_token;
			ajaxOptions.data = JSON.stringify(config.data);
		}

		return $.ajax(ajaxOptions);
	};

	function set(config){
		config.methodType = 'POST';
		return ajaxWrapper(config);
	};

	function get(config){
		config.methodType = 'POST';
		return ajaxWrapper(config);
	};

	function uploadFile(config){
		config.methodType = 'POST';
		return ajaxWrapper(config);
	};

	function setAuthToken(token){
		defaultConfig.auth_token = token;
	};

	function getAuthToken(token){
		return defaultConfig.auth_token;
	};

	function getDomainName(d){
		return defaultConfig.domainName;
	};

	function setDomainName(d){
		defaultConfig.domainName = d;
		if (!defaultConfig.domainName.endsWith('/'))
		{
			defaultConfig.domainName += '/';
		}
	};

	// determine debug level
	var rgxDevEnv = /^[^.]*staging[^.]*\.|\.dev$/;
	var isDevEnv = rgxDevEnv.test(window.location.host);
	if (isDevEnv){
		defaultConfig.auth_token = 'abc123';
		defaultConfig.debug = 1;
	}

	// expose necesary functionality
	EntityEmbed.apiService = {
		set: set,
		get: get,
		uploadFile: uploadFile,
		setAuthToken: setAuthToken,
		getAuthToken: getAuthToken,
		getDomainName: getDomainName,
		setDomainName: setDomainName
	};
})();
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
		actionToolbarLocatorClass = 'entity-embed-secondary-toolbar-locator',
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

		core.triggerInput();
	};

	toolbarManager.prototype.addStyle = function($activeLine, styleClass, buttonAction, shouldPositionToolbar){
		var self = this;

		$activeLine.addClass(styleClass);
		if (!!self.styles[buttonAction].added)
		{
			self.styles[buttonAction].added($activeLine)
		}
		if (shouldPositionToolbar)
		{
			setTimeout(function(){
				self.positionToolbars($('.' + activeEmbedClass));
			}, 50);
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
	};

	toolbarManager.prototype.positionToolbars = function($embed) {
		var self = this;

		if(!$embed.length)
		{
			return;
		}

		// position action tool bar

		// TODO : position action tool bar in a way that doesn't suck
		//			this positioning frequently interferes with the other toolbar

		var $toolbarLocator = $embed.find('.' + actionToolbarLocatorClass);
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
var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// CONSTRUCTOR
	function genericEmbed(options, defaults, embedName, ref){
		var self = ref || this;
		self.name = embedName;
		defaults = $.extend(true, {}, self.defaultOptions, defaults);
		self.options = $.extend(true, {}, defaults, options);
		self.init();
	};

	// PUBLIC
	genericEmbed.prototype.defaultOptions = {
		viewPath: '',
		displayName: 'Generic',
		httpPaths:{
			set: 'admin/embed/edit',	// TODO : rename API path handle (put is now a misnomer)
			get: 'admin/embed/fetch',
			getAll: 'admin/embed/list'
		},
		styles: {
			left: true,
			right: true,
			center: true,
			wide: true
		},
		validationOptions: {
			focusCleanup: true,
			errorPlacement: function(error, element) {
				var $parent = element.parent();
				if($parent.is('.embed-modal-input-group'))
				{
					error.insertAfter( $parent );
				}
				else
				{
					error.insertAfter( element );
				}
			}
		}
	};

	genericEmbed.prototype.cleanModel = function(){
		return {};
	};

	genericEmbed.prototype.defaultStyle = 'entity-embed-center';

	genericEmbed.prototype.init = function(){
		var self = this;
		self.model = self.cleanModel();
	};

	// function to initialize the modal view
	// called after the modal view has loaded
	// $el: a jQuery element for the modal view
	genericEmbed.prototype.initModal = function($el){
		var self = this;
	};

	genericEmbed.prototype.getModelFromForm = function($el, child){
		var self = child || this;
		var formFields = $el.find('.embed-modal-form-control, .embed-modal-file-input');

		for(var i = 0; i < formFields.length; i++)
		{
			var name = formFields[i].name;
			var type = formFields[i].type;
			var value = null;
			if (type === 'file')
			{
				value = formFields[i].files[0];
			}
			else if(!!formFields[i].value.length)
			{
				value = formFields[i].value;
			}
			if (!!name)
			{
				self.model[name] = value;
			}
		}

		self.model.html_rendered = null;
	};

	genericEmbed.prototype.populateFormWithModel = function($form, child){
		var self = child || this;
		var formFields = $form.find('.embed-modal-form-control');
		for (var i = 0; i < formFields.length; i++)
		{
			if (!!formFields[i].type && formFields[i].type.indexOf('file') !== -1)
			{
				continue;
			}
			if (!!formFields[i].type && formFields[i].type.indexOf('select') !== -1)
			{
				var options = $(formFields[i]).find('option');
				var selectedOption = self.model[formFields[i].name];
				var optionIndex = 0;
				options.each(function(index){
					if (this.value === selectedOption)
					{
						optionIndex = index;
					}
				});
				formFields[i].selectedIndex = optionIndex;
			}
			else if (!!self.model[formFields[i].name])
			{
				formFields[i].value = self.model[formFields[i].name];
			}
		}
	};
	// TODO: Get rid of self paramater. See inherits function
	genericEmbed.prototype.clearForm = function($el, child){
		var self = child || this;

		var $form = $el;
		if (!$form.is('form'))
		{
			$form = $el.find('form');
		}
		$form.each(function(){
			$(this).validate(self.options.validationOptions).resetForm();
		});

		var formList = $el.find('form');
		for (var i = 0; i < formList.length; i++)
		{
			formList[i].reset();
		}

		self.model = self.cleanModel();
	};

	genericEmbed.prototype.parseForEditor = function(){
		var self = this;
		return	'<div class="embedded-content">' +
					'<div class="ui-text"> <strong>Embed Type: </strong>' 	+ self.options.object_type + '</div>' +
					'<div class="ui-text"> <strong>Title: </strong> ' 		+ self.model.title + '</div>' +
				'</div>';
	};

	// returns validator object
	genericEmbed.prototype.validate = function($el, isAddModal, child){
		var self = child || this;
		var $form = $el;
		if (!$form.is('form'))
		{
			$form = $el.find('form');
		}
		self.$validator = $form.each(function(){
			$(this).validate(self.options.validationOptions);
		});
		return self.$validator;
	};

	// ASSUMPTION - model is already populated
	// TODO : embedIsNew can be determined programatically (check if model has object_id)
	genericEmbed.prototype.saveEmbed = function(embedIsNew, child){
		var self = child || this;

		if (embedIsNew)
		{
			// add the object_type onto the model
			self.model.object_type = self.options.object_type;
		}

		return EntityEmbed.apiService.set({
			path: self.options.httpPaths.set,
			data: self.model
		});
	};

	EntityEmbed.embedTypes = {
		genericEmbed: genericEmbed
	};

	// augment Function to enable simple inheritance, if not already done so
	if (!Function.prototype.inherits)
	{
		Function.prototype.inherits = function(parent){
			var self = this;
			self.prototype = new parent; // TODO: Better way to mock protected data members
			self.prototype.constructor = self;
			self.prototype.parent = parent.prototype;
			return self;
		};
	}
})();

;(function () {

	'use strict';

	var defaultOptions = {
		contentClass: 'embed-modal',
		backdropClass: 'embed-modal-backdrop',
		closeBtnIcon: 'fa fa-times',
		showCloseBtn: true,
		// TODO : add boolean to disable backdrop click to close
		// elements to open, abort, or complete the modal on click
		$openEl: $(''),
		$abortEl: $(''),
		$completeEl: $(''),
		functions:{ // TODO : rename to hooks
			init:{
				before: function(scope){},
				after: function(scope){}
			},
			open:{
				before: function(scope){},
				after: function(scope){}
			},
			abort:{
				before: function(scope){
					return true;
				},
				after: function(scope){}
			},
			complete:{
				before: function(scope){
					return true;
				},
				after: function(scope){}
			}
		}
	};

	function modal(el, options, scope) {
		var self = this;

		// TODO : only store modal element on scope (no need to have it in two places)
		self.$el = $(el);

		self.options = $.extend(true, {}, defaultOptions, options);
		self.scope = {};
		if (!!scope)
		{
			self.scope = scope;
		}

		self.scope.modalCtrl = self;
		self.$el.data('scope', self.scope);

		self.options.functions.init.before(self.scope);
		self.init();
		self.options.functions.init.after(self.scope);
	};

	modal.prototype.isActive = false;
	modal.prototype.activeClass = 'em-active';
	modal.prototype.closeBtnClass = 'em-close-btn';

	// generates a pseudo guid (not guatanteed global uniqueness)
	modal.prototype.generateId = function () {
		var seg = function()
		{
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return seg() + seg() + '-' + seg() + '-' + seg() + '-' +
				seg() + '-' + seg() + seg() + seg();
	};

	modal.prototype.backdropHtml = function(id)
	{
		var self = this;
		return '<div id="' + id + '" class="'
			+ self.options.backdropClass + '"></div>';
	};

	modal.prototype.closeBtnHtml = function(id)
	{
		var self = this;
		var style = self.closeBtnClass + ' ' + self.options.closeBtnIcon;
		return '<i id="' + id + '"" class="' + style + '"></i>';
	};

	modal.prototype.toggle = function(ctrl, isActive)
	{
		var self = this;
		var modalScope = ctrl.$el.data('scope');

		ctrl.isActive = isActive;

		ctrl.$el.toggle(ctrl.isActive).toggleClass('in', ctrl.isActive);
		ctrl.$backdrop.toggle(ctrl.isActive).toggleClass('in', ctrl.isActive);

		if( !modalScope.parentModal )
		{
			$('body').toggleClass('embed-modal-open', ctrl.isActive);
		}
	};

	modal.prototype.init = function()
	{
		var self = this;

		// style this class as a modal and
		self.$el.addClass(self.options.contentClass);

		var backdropId = self.generateId();

		// link back drop to this modal
		self.$el.before(self.backdropHtml(backdropId));
		self.$backdrop = $('#' + backdropId);

		self.$el.click(function(e){
			if(e.target === self.$el[0])
			{
				self.$el.abortModal();
			}
		});

		// add close button and give expected functionality
		if (self.options.showCloseBtn){
			self.$closeBtn = self.$el.find('.close');
			self.$closeBtn.click(function(){
				self.$el.abortModal();
			});
		}

		// register user specified triggers that open this modal
		self.options.$openEl.click(function(){
			self.$el.openModal();
		});

		// register user specified triggers that complete this modal
		self.options.$completeEl.click(function(){
			self.$el.completeModal();
		});

		// register user specified triggers that abort this modal
		self.options.$abortEl.click(function(){
			self.$el.abortModal();
		});
	};

	/*
	 * -- registers an event for the modal --
	 *
	 * element : the string selector or JQuery object for the element
	 *				on which the eventlistener is instantiated
	 * eventType : the event, i.e. 'click', 'keydown', 'mouseOver', etc.
	 * action : the function that fires when the event is called, it will
	 *			always be passed the default event parameter, scope, and
	 * params : an object to wrap up parameters for action
	 *
	 */
	modal.prototype.registerEvent = function(element, eventType, action, params){
		var self = this;
		self.$el.find(element).on(eventType, function(e){
			action(e, self.$el.data('scope'), params);
		});
	};

	$.fn.modal = function(options, scope){
		return this.each(function(){
			// avoid null reference errors
			if (!options)
			{
				options = {};
			}
			$.data(this, 'ctrl', new modal(this, options, scope));
		});
	};

	$.fn.openModal = function(addToScope){
		var modalCtrl = $.data(this[0], 'ctrl');
		// TODO : decrease cyclomatic complexity
		if (!!modalCtrl)
		{
			if (!!addToScope)
			{
				var currentScope = modalCtrl.$el.data('scope');
				var newScope = $.extend(true, {}, currentScope, addToScope);
				modalCtrl.$el.data('scope', newScope);
			}

			var modalScope = modalCtrl.$el.data('scope');
			modalCtrl.promise = $.Deferred();

			modalCtrl.options.functions.open.before(modalScope);
			modalCtrl.toggle(modalCtrl, true);
			modalCtrl.options.functions.open.after(modalScope);

			return modalCtrl.promise;
		}
		// TODO : return promise even if there is no modalCtrl
		//			promise would need to be immediately rejected
	};

	$.fn.abortModal = function(addToScope){
		return this.each(function(){
			var modalCtrl = $.data(this, 'ctrl');
			if (!!modalCtrl && modalCtrl.isActive)
			{
				if (!!addToScope)
				{
					var currentScope = modalCtrl.$el.data('scope');
					var newScope = $.extend(true, {}, currentScope, addToScope);
					modalCtrl.$el.data('scope', newScope);
				}

				var modalScope = modalCtrl.$el.data('scope');

				if (modalCtrl.options.functions.abort.before(modalScope))
				{
					modalCtrl.toggle(modalCtrl, false);
					modalCtrl.options.functions.abort.after(modalScope);

					// reject promise if app dev has not already done so
					if(modalCtrl.promise.state() === 'pending')
					{
						modalCtrl.promise.reject();
					}
				}
			}
		});
	};

	$.fn.completeModal = function(addToScope){
		return this.each(function(){
			var modalCtrl = $.data(this, 'ctrl');
			var currentScope, newScope, modalScope, completeBefore, completeBeforeDeffered;

			if (!!modalCtrl && modalCtrl.isActive)
			{
				if (!!addToScope)
				{
					currentScope = modalCtrl.$el.data('scope');
					newScope = $.extend(true, {}, currentScope, addToScope);
					modalCtrl.$el.data('scope', newScope);
				}

				modalScope = modalCtrl.$el.data('scope');

				completeBefore = modalCtrl.options.functions.complete.before(modalScope);

				if(typeof completeBefore.state === 'function')
				{
					// Promise returned
					completeBeforeDeffered = completeBefore;
				}
				else {
					// Boolean returned
					// Establish a promise and resolve/reject accordingly
					completeBeforeDeffered = $.Deferred();
					if(completeBefore)
					{
						completeBeforeDeffered.resolve();
					}
					else
					{
						completeBeforeDeffered.reject();
					}
				}

				completeBeforeDeffered.done(function(data){

					if(data)
					{
						modalScope.currentEmbedType.model = data;
					}

					modalCtrl.toggle(modalCtrl, false);
					modalCtrl.options.functions.complete.after(modalScope);

					// resolve promise if app dev has not already done so
					if(modalCtrl.promise.state() === 'pending')
					{
						modalCtrl.promise.resolve();
					}
				});
			}
		});
	};
})();
var EntityEmbed = EntityEmbed || {};

;(function(){

	// PRIVATE

	var defaultOptions = {
			modalId: 'leave-confirmation-modal', // the HTML id of the element which contains the modal
			viewPath: 'modal_confirmation.html', // path to modal HTML file
			abortElId: 'btn-cancel-leave',
			completeElId: 'btn-confirm-leave'
		};

	function confirmModalDefaults(options) {
		var self = this;
		if (!options)
		{
			options = {};
		}
		self.options = $.extend(true, {}, defaultOptions, options);
	};


	confirmModalDefaults.prototype.init = function(scope){
    var self = this;

    self.$abortEl = $('#' + self.options.abortElId, scope.$modalEl);
    self.$completeEl = $('#' + self.options.completeElId, scope.$modalEl);
	};

	confirmModalDefaults.prototype.functions = {
		init: {
			before: function(scope){
				/*
				 * assume that these are already defined:
				 *		scope.modalCtrl			(default for all modals from modal.js)
				 *		scope.parentModalCtrl
				 */
			},
			after: function(scope){
			}
		},
		open: {
			before: function(scope){},
			after: function(scope){},
		},
		abort: {
			before: function(scope){
				return true;
			},
			after: function(scope){}
		},
		complete: {
			before: function(scope){
				scope.parentModalCtrl.$el.abortModal({ confirmedLeave: true });
				return true;
			},
			after: function(scope){}
		}
	};

	EntityEmbed.confirmModalDefaults = confirmModalDefaults;
}());

var EntityEmbed = EntityEmbed || {};

;(function(){

	// MODAL TYPE ENUM
	EntityEmbed.embedModalTypes = {
		add: 0,
		addSingle: 1,				// this is for adding a specific embed type
		edit: 2,
		selectExisting: 3,
		selectExistingSingle: 4		// this is for selecting a specific embed type
	};

	// PRIVATE
	var embedTypes_stale = undefined; // this is for the jquery plugin embedModalOpen_edit func (see bottom)
	var isSaving = false; //this determines when a modal is being saved
	var embedModalSelectors = {
			buttons: {
				saveEmbed: '#btn-save-modal', // saves the modal
				abortModal: '#btn-abort-modal', // aborts (cancels) the modal
				showSelectExisting: '#btn-show-select-existing', // shows the select-existing-embed view
				cancelSelectExisting: '#btn-cancel-select-existing' // cancels selection of existing embed
			},
			containers: {
				createNewEmbed: '#embed-modal-create-new', // contains all the views for creating a new embed
				selectExistingEmbed: '#embed-modal-select-existing', // contains views for selecting an existing embed
				createButtons: '#embed-modal-buttons-create', // contains buttons shown in the create new embed view
				selectButtons: '#embed-modal-buttons-select' // contains buttons shown in the select existing embed view
			},
			elements: {
				saveSpinner: '#embed-modal-spinner',
				headerText: '.header-title'
			}
		},
		gatherModalElements = function(scope, $el) {
			function gather(groupKey) {
				scope[groupKey] = scope[groupKey] || {};
				for (key in embedModalSelectors[groupKey])
				{
					if(embedModalSelectors[groupKey].hasOwnProperty(key))
					{
						scope[groupKey][key] = $(embedModalSelectors[groupKey][key], $el);
					}
				}
			}

			for (groupKey in embedModalSelectors)
			{
				if(embedModalSelectors.hasOwnProperty(groupKey))
				{
					gather(groupKey);
				}
			}
		},
		toggleEditorTyping = function(scope, toggleCmd){
			// enable/disable typing in the editor by finding the first class
			// TODO : find a more generic solution to this
			$('.editable').attr('contenteditable', toggleCmd);
		},
		isFormDirty = function($form){
			var isDirty = false;

			$form.find(':input:not(:button):not([type=hidden])').each(function () {
				var formField = this;

				// check text and textarea forms
				if ((formField.type == 'text' || formField.type == 'textarea' || formField.type == 'hidden') && formField.defaultValue != formField.value) {
					isDirty = true;
					return false;
				}

				// check radio and checkbox forms
				if ((formField.type == 'radio' || formField.type == 'checkbox') && formField.defaultChecked != formField.checked)
				{
					isDirty = true;
					return false;
				}

				// check select one and select multiple forms
				if ((this.type == 'select-one' || this.type == 'select-multiple')) {
					for (var x = 0; x < this.length; x++) {
						if (this.options[x].selected != this.options[x].defaultSelected) {
							hasChanges = true;
							return false;
						}
					}
				}

			});
			return isDirty;
		},
		setModalView = function(scope, embedType){
			var headerText;

			if (!embedType)
			{
				return;
			}

			if (!!scope.currentEmbedType)
			{
				delete scope.currentEmbedType.model;
				scope.currentEmbedType.$view.hide();
				scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
			}

			scope.currentEmbedType = scope.modalCtrl.scope.currentEmbedType = getEmbedTypeByObjectType(embedType, scope.embedTypes);
			scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
			scope.currentEmbedType.$view.show();
			scope.$embedTypeSelect[0].selectedIndex = scope.currentEmbedType.optionIndex;

			headerText = scope.headerText;

			if(!headerText)
			{
				// set the header text
				headerText = 'Add ';
				if (scope.modalType === EntityEmbed.embedModalTypes.edit)
				{
					headerText = 'Edit ';
				}
				if (!scope.embedId)
				{
					headerText += 'New ';
				}
				headerText += scope.currentEmbedType.options.displayName;
			}

			scope.elements.headerText.text(headerText);
		},
		resetModalView = function(scope){
			var embedName = scope.embedTypes[0].options.object_type;
			setModalView(scope, embedName);
			scope.$embedTypeSelect.show();
		},
		saveEmbed = function(scope){
			var isAddModal = scope.modalType == EntityEmbed.embedModalTypes.add ||
							 scope.modalType == EntityEmbed.embedModalTypes.addSingle;
			var $validator = scope.currentEmbedType.validate(scope.currentEmbedType.$view, isAddModal);
			var isValid = true;
			var promise = $.Deferred();
			var respData = {};

			for(var i = 0; i < $validator.length; i++)
			{
				isValid = $(scope.currentEmbedType.$validator[i]).valid() && isValid;
			}

			if (isSaving || !isValid)
			{
				promise.reject()
				return promise;
			}

			isSaving = true;

			scope.elements.saveSpinner.show();

			scope.currentEmbedType.getModelFromForm(scope.currentEmbedType.$view);

			if(!scope.buffered)
			{

				scope.currentEmbedType.saveEmbed(isAddModal)
					.done(successFunction)
					.fail(failFunction)
					.always(alwaysFunction);

			}
			else
			{
				respData.response = $.extend(true, {} ,scope.currentEmbedType.model)
				successFunction(respData);
				alwaysFunction(respData);
			}

			////

			function successFunction(data) {
				if (data.status === 'ERROR')
				{
					console.log('POST failed (API)');
					promise.reject();
					return;
				}

				if (typeof data.response === 'string')
				{
					console.log('Failed to POST embed type: ' + data.response);
					promise.reject();
					return;
				}

				scope.currentEmbedType.model = data.response;

				if(isAddModal)
				{
					scope.currentEmbedType.model.object_id = data.response.object_id;
				}

				console.log('POST succeeded', data);

				if (!!scope.successCallback)
				{
					// TODO : call this function on select existing (if appropriate)
					scope.successCallback(data.response);
				}

				promise.resolve(data.response);
			}

			function failFunction(jqXhr, status, err){
				// TODO : UI failure message
				console.log('POST failed (XHR)', err);

				if (!!scope.failCallback)
				{
					// TODO : call this function on select existing (if appropriate)
					scope.failCallback();
				}

				promise.reject()
			}

			function alwaysFunction(data){
				isSaving = false;
				scope.elements.saveSpinner.hide();

				if (!!scope.alwaysCallback)
				{
					scope.alwaysCallback();
				}
			};

			////

			return promise;
		},
		showCreateNewEmbedView = function(scope){
			scope.skipSave = false;

			scope.buttons.showSelectExisting.toggle(!scope.addOnly);

			if(scope.isSingle)
			{
				scope.modalType = EntityEmbed.embedModalTypes.addSingle;
			}
			else
			{
				scope.modalType = EntityEmbed.embedModalTypes.add;
				scope.$embedTypeSelect.show();
			}

			scope.containers.selectExistingEmbed.slideUp();
			scope.containers.createNewEmbed.slideDown();

			scope.containers.selectButtons.hide();
			scope.containers.createButtons.show();

			scope.containers.selectExistingEmbed.find('.query-container').hide();
		},
		showEditEmbedView = function(scope){
			scope.skipSave = false;

			scope.buttons.showSelectExisting.hide();
			scope.$embedTypeSelect.hide();

			if (scope.containers.selectExistingEmbed.is(':visible'))
			{
				scope.containers.selectExistingEmbed.slideUp();
				scope.containers.createNewEmbed.slideDown();
			}

			scope.containers.selectButtons.hide();
			scope.containers.createButtons.show();

			scope.buttons.showSelectExisting.hide();
		},
		showSelectExistingView = function(scope){
			scope.skipSave = true;

			scope.containers.createNewEmbed.slideUp();
			scope.containers.selectExistingEmbed.slideDown();

			scope.containers.createButtons.hide();
			scope.containers.selectButtons.show();

			scope.containers.selectExistingEmbed
				.find('.' + scope.currentEmbedType.options.object_type + '-query-container').show();

			if (scope.isSingle)
			{
				scope.modalType = EntityEmbed.embedModalTypes.selectExistingSingle;
				scope.$embedTypeSelect.hide();
			}
			else
			{
				scope.modalType = EntityEmbed.embedModalTypes.selectExisting;
				scope.$embedTypeSelect.show();
			}
		},
		getEmbedTypeByObjectType = function(objectType, embedTypes){
			var embedType = $.grep(embedTypes, function(et){
				return et.options.object_type == objectType;
			})[0];

			return embedType && $.extend(true, {}, embedType);
		},
		generateEmbedHtmlInternal = function(embedType, includeWrapper){
			var $embed = $('<div>').html(embedType.parseForEditor());

			$embed.children().first().addClass('entity-embed');

			var ret = '<figure contenteditable="false" ' +
							'id="' + embedType.model.object_id	+ '" ' +
							'data-embed-type="' + embedType.options.object_type + '" >' +
							$embed.html() +
							'<div class="entity-embed-blocker"></div>' +
						'</figure>';

			if (includeWrapper)
			{
				return	'<div class="entity-embed-container">' +
							ret +
						'</div>';
			}
			return ret;
		},
		//	This provides the functionality/styling for the type-ahead feature, allowing the user to only
		//	begin typing the title of an embed and have a dropdown list of embeds displayed to them
		initAutoComplete = function (embedType, scope){
			var modalCtrl = scope.modalCtrl;
			var rgxDevEnv = /^[^.]*staging[^.]*\.|\.dev$/;
			var isDevEnv = rgxDevEnv.test(window.location.host);
			var debug = 0;
			var ajaxData = {
				auth_token: EntityEmbed.apiService.getAuthToken(),
				object_type: embedType.options.object_type
			};


			if(isDevEnv)
			{
				ajaxData.debug = 1;
			}

			var options = {
				ajaxSettings: {
					dataType: 'json',
					method: 'POST',
					data: ajaxData
				},
				requestDelay: 600,
				url: function(phrase) {
					ajaxData.title = phrase;
					return EntityEmbed.apiService.getDomainName() + embedType.options.httpPaths.getAll;
				},
				listLocation: function(listOfData){
					return listOfData.response.data;
				},
				getValue: function(data) {
					return data.title;
				},
				preparePostData: function(data) {
					data.title = scope.containers.selectExistingEmbed
									.find('input[name="' + embedType.options.object_type + '-query"]').val();
					return JSON.stringify(data);
				},
				list: {
					maxNumberOfElements: 20,
					match: {
						enabled: true
					},
					sort: {
						enabled: true
					},
					onChooseEvent: function(){
						var itemData = scope.containers.selectExistingEmbed
											.find('input[name="' + embedType.options.object_type + '-query"]')
											.getSelectedItemData();
						var objectId = itemData.object_id;
						scope.containers.selectExistingEmbed
									.find('input[name="' + embedType.options.object_type + '-query"]').val('')

						EntityEmbed.apiService.get({
							path: embedType.options.httpPaths.get,
							data: {
								object_id: objectId
							}
						})
						.done(function(respData){
							if (typeof respData.response === 'string')
							{
								console.log('Failed to get list of current embed types for the Select Existing page: ' + respData.response);
								return;
							}

							// create an event to be raised
							var addEvent = jQuery.Event('existingItemSelected');
							// add data to it so the handler knows what to do
							addEvent.embedModel = respData.response;
							scope.containers.selectExistingEmbed
								.find('input[name="' + embedType.options.object_type + '-query"]')
								.trigger(addEvent);

						})
						.fail(function(respData){
							// TODO: show error UI
							console.log('failed to get embed type!');
						});
					}
				}
			};

			scope.containers.selectExistingEmbed
				.find('input[name="' + embedType.options.object_type + '-query"]')
				.easyAutocomplete(options);

			scope.containers.selectExistingEmbed
				.find('input[name="' + embedType.options.object_type + '-query"]')
				.closest('.easy-autocomplete')
				.removeAttr('style');
		},
		generateSelExInputHtml = function(embedType) { // SelEx -> SelectExisting
			return	'<div class="embed-modal-row ' + embedType.options.object_type + '-query-container query-container">' +
						'<div class="embed-modal-full-column">' +
							'<label class="embed-modal-label" for="query">Search for ' + embedType.options.displayName + '</label>' +
							'<input type="text" class="embed-modal-form-control"' +
								' name="' + embedType.options.object_type + '-query" placeholder="begin typing ' + embedType.options.displayName + ' title ">' +
						'</div>' +
					'</div>';
		};

	function embedModalDefaults(){};

	embedModalDefaults.prototype.generateEmbedHtml = generateEmbedHtmlInternal;

	embedModalDefaults.prototype.functions = {
		init:{
			before: function(scope){
				/*
				 * define necessary fields for scope
				 *
				 * assume that these are already defined:
				 *		scope.modalCtrl			(default for all modals from modal.js)
				 *			modalCtrl.promise	(default for all modals from modal.js)
				 *		scope.$embedTypeSelect
				 *		scope.$currentEditorLocation
				 *		scope.$modalBody
				 *		scope.embedTypes
				 */

				gatherModalElements(scope, scope.modalCtrl.$el);

				embedTypes_stale = scope.embedTypes;
				scope.elements.saveSpinner.hide();
			},
			after: function(scope){
				var $selExInput, $embedView, $confirmModal, confirmModalScope, confirmModalDefaults, embedObject, templatePath, i;

				function initEmbedTypeModal(embedType, $view) {
					embedType.initModal($view, scope.modalCtrl);
				}

				// Register events before adding dynamic content in case that content contains
				// elements with id's we plann to target in this scope.

				// // configure save button to call save method
				// scope.modalCtrl.registerEvent(embedModalSelectors.buttons.saveEmbed, 'click',
				// 	function(e, currentScope){
				// 		scope.modalCtrl.$el.completeModal(currentScope);
				// 	}
				// );

				// configure show-select-existing button to show the select-existing view
				scope.modalCtrl.registerEvent(scope.buttons.showSelectExisting, 'click',
					function(e, currentScope){
						showSelectExistingView(currentScope);
					}
				);

				// configure cancel-select-existing button to show the create-new-embed view
				scope.modalCtrl.registerEvent(scope.buttons.cancelSelectExisting, 'click',
					function(e, currentScope){
						showCreateNewEmbedView(currentScope);
					}
				);

				// configure the select-embed-type dropdown to change the modal view
				scope.modalCtrl.registerEvent(scope.$embedTypeSelect, 'change',
					function(e, currentScope){
						var embedType = e.currentTarget.options[e.currentTarget.selectedIndex].value;

						currentScope.currentEmbedType.clearForm(currentScope.currentEmbedType.$view);
						setModalView(currentScope, embedType);

						if (currentScope.modalType === EntityEmbed.embedModalTypes.selectExisting)
						{
							scope.containers.selectExistingEmbed
								.find('.query-container').hide();
							scope.containers.selectExistingEmbed
								.find('.' + currentScope.currentEmbedType.options.object_type + '-query-container').show();
						}
					}
				);

				// Load all dynamic content

				// load a query input in the select existing container for each embed type
				for(i = 0; i < scope.embedTypes.length; i++)
				{
					embedObject = scope.embedTypes[i];

					scope.containers.selectExistingEmbed.append(generateSelExInputHtml(embedObject));

					$selExInput = scope.containers.selectExistingEmbed
											.find('input[name="' + embedObject.options.object_type + '-query"]');

					initAutoComplete(embedObject, scope);
					scope.containers.selectExistingEmbed
						.find('.' + embedObject.options.object_type + '-query-container').hide();

					scope.modalCtrl.registerEvent($selExInput, 'existingItemSelected',
						function(e, currentScope){
							currentScope.currentEmbedType.model = e.embedModel;
							currentScope.modalCtrl.$el.completeModal();
						});

					// load the views for creating new embeds (one view for each embed type)
					// create option in dropdown for this embed
					scope.$embedTypeSelect.append('<option value="' +
						embedObject.options.object_type + '">' + embedObject.options.displayName +
						'</option>');

					// create the embed view container and load the view into it
					$embedView = $('<div id="' + embedObject.name + '"></div>');

					scope.containers.createNewEmbed.append($embedView);

					templatePath = scope.modalHtmlLocation + embedObject.options.viewPath;

					// Check to if there is a cached template for this template path
					if(EntityEmbed.templateCache && EntityEmbed.templateCache[templatePath])
					{
						$embedView.html( EntityEmbed.templateCache[templatePath] );
						initEmbedTypeModal(embedObject, $embedView);
					}
					else
					{
						$embedView.load(templatePath, (function(_embedObject, _templatePath) {
							return function(responseText, textStatus, xhr){
								console.log(_embedObject.options.viewPath + ' load completed with status: ' + textStatus);

								if (textStatus === 'error')
								{
									// TODO : error view (so that user knows something went wrong)
								}

								// Add template to template cache
								EntityEmbed.templateCache = EntityEmbed.templateCache || {};
								EntityEmbed.templateCache[_templatePath] = $(this).html();

								initEmbedTypeModal(_embedObject, $(this));
							}
						})(embedObject, templatePath));
					}

					// augment the embedObject for use with this modal
					embedObject.$view = $embedView;
					embedObject.optionIndex = i;
					// Hide embed view container until needed
					$embedView.hide();
				}

				// Load the confirm navigation modal
				confirmModalDefaults = new EntityEmbed.confirmModalDefaults();
				embedModalSelectors.elements.confirmModal = '#' + confirmModalDefaults.options.modalId;
				$confirmModal = scope.elements.confirmModal = $(embedModalSelectors.elements.confirmModal, scope.$modalEl);
				templatePath = scope.modalHtmlLocation + confirmModalDefaults.options.viewPath
				confirmModalScope = {
					parentModalCtrl: scope.modalCtrl,
					$modalEl: $confirmModal
				};

				// Check to if there is a cached template for this template path
				if(EntityEmbed.templateCache && EntityEmbed.templateCache[templatePath])
				{
					$confirmModal.html( EntityEmbed.templateCache[templatePath] );
					confirmModalDefaults.init(confirmModalScope); // this re-registers abort and complete buttons - now that they are loaded, JQuery can find them
					$confirmModal.modal(confirmModalDefaults, confirmModalScope);
				}
				else
				{
					$confirmModal.load(templatePath, function(responseText, textStatus, xhr){
							console.log('leave confirmation modal load completed with status: ' + textStatus);
							if (textStatus === 'error')
							{
								// TODO : error view (so that user knows something went wrong)
								return;
							}

							// Add template to template cache
							EntityEmbed.templateCache = EntityEmbed.templateCache || {};
							EntityEmbed.templateCache[templatePath] = $confirmModal.html();
							confirmModalDefaults.init(confirmModalScope); // this re-registers abort and complete buttons - now that they are loaded, JQuery can find them
							$confirmModal.modal(confirmModalDefaults, confirmModalScope);
						});
				}
			}
		},
		open: {
			before: function(scope){

				scope.isSingle = scope.modalType === EntityEmbed.embedModalTypes.addSingle ||
												scope.modalType === EntityEmbed.embedModalTypes.selectExistingSingle

				toggleEditorTyping(scope, "false");
				if (!!scope.embedType){
					setModalView(scope, scope.embedType);
					delete scope.embedType;
				}
				else{
					resetModalView(scope);
				}
			},
			after: function(scope){

				function applyData(data) {
					data = data || {};
					setModalView(scope, data.object_type);
					scope.currentEmbedType.model = data;
					scope.staleModel = $.extend(true, {}, data); // so we can check if the form is dirty later
					scope.currentEmbedType.populateFormWithModel(scope.currentEmbedType.$view);
				}

				switch(scope.modalType)
				{
					case EntityEmbed.embedModalTypes.edit:
						showEditEmbedView(scope);

						if(scope.buffered)
						{
							applyData(scope.embedData);
							delete scope.embedData;
							break;
						}

						// TODO : loading spinner
						EntityEmbed.apiService.get({
							path: scope.currentEmbedType.options.httpPaths.get,
							data: {
								object_id: scope.embedId
							}
						})
						.done(function(data){
							if (typeof data.response === 'string')
							{
								console.log('Failed to get embed type: ' + data.response);
								// show UI error here
								return;
							}

							applyData(data.response);

						})
						.fail(function(data){
							// TODO : UI failure message
							console.log('failed to get embed type!');
						});

						break;
					case EntityEmbed.embedModalTypes.add:
						showCreateNewEmbedView(scope);
						break;
					case EntityEmbed.embedModalTypes.addSingle:
						showCreateNewEmbedView(scope);
						scope.$embedTypeSelect.hide();
						break;
					case EntityEmbed.embedModalTypes.selectExisting:
						showSelectExistingView(scope);
						break;
					case EntityEmbed.embedModalTypes.selectExistingSingle:
						showSelectExistingView(scope, true);
						break;
				}
			},
		},
		abort: {
			before: function(scope){
				var self = this;
				var staleVal, modelVal;

				function prepVal(val) {
					var result;

					if(val)
					{
						switch (typeof val)
						{
							case 'array' :
							case 'object' :
								result = JSON.stringify(val);
								break;

							default :
								result = val;
								break;
						}
					}

					return result || null;
				}

				if (!scope.confirmedLeave)
				{
					if (scope.modalType === EntityEmbed.embedModalTypes.edit && !!scope.staleModel) // this is an edit modal - compare current model to stale model
					{
						scope.currentEmbedType.getModelFromForm(scope.currentEmbedType.$view);

						for (var fieldName in scope.currentEmbedType.model)
						{
							staleVal = prepVal(scope.staleModel[fieldName]);
							modelVal = prepVal(scope.currentEmbedType.model[fieldName]);

							if (staleVal !== modelVal)
							{
								scope.elements.confirmModal.openModal({parentModal: self});
								return false;
							}
						}
					}
					else if (isFormDirty(scope.currentEmbedType.$view)) // this is an add modal
					{
						scope.elements.confirmModal.openModal({parentModal: self});
						return false;
					}
				}
				// no changes made OR leave already confirmed - okay to close without prompting user
				scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
				delete scope.confirmedLeave;
				return true;
			},
			after: function(scope){
				toggleEditorTyping(scope, 'true');
			}
		},
		complete: {
			before: function(scope){
				return !!scope.skipSave || saveEmbed(scope);
			},
			after: function(scope){
				var $embedContainer, $embedTemp;
				var classes, i, m;

				toggleEditorTyping(scope, 'true');

				if (scope.$currentEditorLocation.length > 0)
				{
					classes = scope.$currentEditorLocation.attr('class').split(' ');
					classes.push(scope.currentEmbedType.defaultStyle);
					$embedTemp = $( generateEmbedHtmlInternal(scope.currentEmbedType, true) );

					for(i = 0, m = classes.length; i < m; i++)
					{
						$embedTemp.addClass(classes[i]);
					}

					scope.$currentEditorLocation.after( $embedTemp );
					scope.$currentEditorLocation.remove();
					scope.$currentEditorLocation = $embedTemp;
				}

				// return only necessary information to anyone interested in promise resolution
				scope.modalCtrl.promise.resolve({
					data: $.extend(true, {}, scope.currentEmbedType.model),
					embedType: scope.currentEmbedType,
					$embed: scope.$currentEditorLocation
				});

				scope.currentEmbedType.clearForm(scope.currentEmbedType.$view);
			}
		}
	};

	EntityEmbed.embedModalDefaults = embedModalDefaults;

}());

var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'audio',
		defaults = {
			viewPath: 'modal_audio.html',
			displayName: 'Audio',
			object_type: 'audio',
			audioLocation: 'https://test-services.pri.org',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required',
					upload: {
						required: true,
						extension: "mp3"
					},
					wavFile: {
						extension: "wav"
					}
				}
			},
			httpPaths:{
				uploadFile: 'admin/embed/file-upload'
			}
		},
		uploadedAudioDisplay = '.uploaded-audio-file',
		cancelUploadAudioBtn = '.cancel-upload-file-btn',
		editAudioFileBtn = '.edit-chosen-file-btn',
		uploadMp3FileBtn = ".embed-modal-file-input",
		uiElements = {
			// myElm: '.select-my-elm'
			audioEditor: '.audio_editor',
			previewContainer: '.audio_editor-preview',
			previewAudio: '.audio_editor-preview_audio',
			editFileBtn: '.js-upload',
			cancelUploadBtn: '.js-upload-cancel',
			undoUploadBtn: '.js-upload-undo',
			uploadFileInputContainer: '.audio_editor-intro',
			uploadFileInput: '.embed-modal-file-input'
		};

	function formatFileSize(bytes) {
		if (typeof bytes !== 'number')
		{
			return '';
		}

		if (bytes >= 100000000)
		{
			return (bytes / 1000000000).toFixed(2) + ' GB';
		}

		if (bytes >= 1000000)
		{
			return (bytes / 1000000).toFixed(2) + ' MB';
		}
		return (bytes / 1000).toFixed(2) + ' KB';
	};

	function getModelFromData(data, file) {
		var model = {};

		// Title
		model.title = file.name;

		// Credit
		model.credit = data.artist;

		return model;
	}

	function getAudioUrl(audioLocation, audioUrl) {
		if (!audioUrl || audioUrl === '')
		{
			return '';
		}
		if (audioUrl.indexOf(audioLocation) >= 0)
		{
			return audioUrl;
		}

		// ensure that there isn't an unintended '//' in final URL
		if (audioLocation.endsWith('/'))
		{
			audioLocation = audioLocation.substring(0, audioLocation.length - 1);
		}
		if (!audioUrl.startsWith('/'))
		{
			audioLocation = '/' + audioUrl;
		}

		return audioLocation + audioUrl;
	}

	function registerUiElements(scope, $el) {
		scope.$ui = scope.$ui || {
			form: $el
		};

		for(key in uiElements)
		{
			if(uiElements.hasOwnProperty(key))
			{
				scope.$ui[key] = $(uiElements[key], $el);
			}
		}

		return scope.$ui;
	}

	function updateAudioPreview(scope, file) {
		var $ui = scope.$ui;
		var promise = $.Deferred();
		var src_url = scope.getAudioUrl();
		var src_type = 'audio/mp3';

		$ui.previewAudio
			.attr('src', src_url)
			.attr('type', src_type);

		showAudioPreview(scope);

		promise.resolve();

		return promise;
	}

	function updateFormWithFileData(scope, file) {
		var $ui = scope.$ui;
		var promise = $.Deferred();

		scope.getModelFromFile(file)
			.done(function (model) {

				scope.populateFormWithModel($ui.form)
					.done(function () {
						promise.resolve();
					});

			});

		return promise;
	}

	function showAudioPreview(scope) {
		var $ui = scope.$ui;

		// Hide file input and related toolbar btns
		$ui.uploadFileInputContainer.hide();
		$ui.cancelUploadBtn.hide();

		// Show Image Preview and related toolbar btns
		$ui.previewContainer.show();
		$ui.editFileBtn.show();
		$ui.undoUploadBtn.toggle(!!scope.model.url_path && !!scope.model.upload);
	}

	function showFileInput(scope) {
		var $ui = scope.$ui;

		// Hide Image Preview and related toolbar btns
		$ui.previewContainer.hide();
		$ui.editFileBtn.hide();
		$ui.undoUploadBtn.hide();

		// Show file input and related toolbar btns. Clean up after previous validation errors.
		$ui.uploadFileInput.removeClass('error')
			.parent().find('#upload-error').remove();
		$ui.uploadFileInputContainer.show();
		$ui.cancelUploadBtn.toggle(!!(scope.model.url_path || scope.model.upload));
	}

	// CONSTRUCTOR
	function audioEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	}

	audioEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = audioEmbed;

	// PUBLIC
	audioEmbed.prototype.orderIndex = 3;

	audioEmbed.prototype.audioPreviewClass = 'audio-preview';

	audioEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url_path: null,
			credit: null,
			creditLink: null
		};
	};

  audioEmbed.prototype.getAudioUrl = function() {
    return !!this.model.upload ? window.URL.createObjectURL(this.model.upload) : getAudioUrl(this.options.audioLocation, this.model.url_path);
  };

  audioEmbed.prototype.initModal = function($el, modalCtrl){
    var self = this;
    var $ui = registerUiElements(self, $el);

    $ui.editFileBtn.on('click', 'a', function(){
      $ui.uploadFileInput.click();
    });

    $ui.cancelUploadBtn.on('click', 'a', function(){
      showAudioPreview(modalCtrl.scope.currentEmbedType);
    });

    $ui.undoUploadBtn.on('click', 'a', function() {
      delete modalCtrl.scope.currentEmbedType.model.upload;
      $ui.uploadFileInput.val('');
      updateAudioPreview(modalCtrl.scope.currentEmbedType);
    });

    $ui.uploadFileInput.on('change', function(event){
      var file = event.target.files[0];
      updateFormWithFileData(modalCtrl.scope.currentEmbedType, file);
    });

    $(document).on('dragover drop', function(event) {
      event.preventDefault();
    });

    $ui.audioEditor
      .on('dragenter dragover', function() {
        $(this).addClass('js-dragover');
      })
      .on('dragleave drop', function() {
        $(this).removeClass('js-dragover');
      })
      .on('drop', function(event) {
        event.preventDefault();

        var $this = $(this);
        var files = event.originalEvent.dataTransfer.files;
        var file;

        if (!!files && !!files.length)
        {
          file = files[0];

          console.log('dropped file', file);

          if(!/(?:mpeg|mp3)/.test(file.type))
          {
            return;
          }

          $this.addClass('js-dropped');

          setTimeout(function() {

            updateFormWithFileData(modalCtrl.scope.currentEmbedType, file)
              .done(function() {
                setTimeout(function() {
                  $this.removeClass('js-dropped');
                }, 300);
              });

          }, 300);
        }
      });
  };

	audioEmbed.prototype.clearForm = function($el){
		var self = this;
		self.parent.clearForm($el, self);

		self.$ui.previewAudio
			.removeAttr('src')
			.removeAttr('type');

		showFileInput(self);
	};

	audioEmbed.prototype.saveEmbed = function(embedIsNew)
	{
		var self = this;
		var file = self.model.upload;
		delete self.model.upload;

		var promise = self.parent.saveEmbed(embedIsNew, self);

		if (!!file)
		{
			return promise.then(function(responseData){
				//var wavFile = self.$wavForm[0].files[0];
				// if (!!wavFile)				// only send wav file if user specified
				// {
				// 	var wavFormData = new FormData();
				// 	wavFormData.append('upload', wavFile);
				// 	sendFile(wavFormData)
				// 		.then(function(responseData){
				// 			self.model.wavFile = self.options.audioLocation + responseData.response.url_path;
				// 		});
				// }

				var mp3FormData = new FormData();
				mp3FormData.append('upload', file);

				return EntityEmbed.apiService.uploadFile({
					path: self.options.httpPaths.uploadFile,
					data: mp3FormData,
					headers: {
						'x-object-id': responseData.response.object_id
					}
				});
			})
			.done(function(responseData){
				self.model.url_path = responseData.response.url_path;
			});
		}
		else
		{
			return promise;
		}
	};

	audioEmbed.prototype.getModelFromForm = function($form){
		var self = this;
		var oldModel = $.extend(true, {}, self.model);

		self.parent.getModelFromForm($form, self);

		if(!!oldModel.upload && !self.model.upload)
		{
			self.model.upload = oldModel.upload;
		}
	}

	audioEmbed.prototype.getModelFromFile = function(file){
		var self = this;
		var $ui = self.$ui;
		var promise = $.Deferred();
		var musicmetadata = (typeof define === 'function' && define.amd) ? require('musicmetadata') : window.musicmetadata;

		console.log('musicmetadata: ', musicmetadata);

		function extendCurrentModel(model) {
			var currentModel, prop;
			// Clone current model so we can manipulate it
			currentModel = $.extend(true, {}, self.model);

			// Remove null properties from currentModel so they don't overwrite
			// properties on model during merge.
			for (prop in currentModel)
			{
				if(currentModel.hasOwnProperty(prop) && currentModel[prop] === null)
				{
					delete currentModel[prop];
				}
			}

			// Merge models together.
			// 		currentModel > model
			self.model = $.extend(true, {}, model, currentModel);

			// Current model may contain old upload file, make sure it is set to the new file
			self.model.upload = file;

			promise.resolve(self.model);
		}

		if (!file)
		{
			file = self.model.upload;
		}

		// Update model with current form values
		if($ui)
		{
			self.getModelFromForm($ui.form);
		}

		if(musicmetadata)
		{
			musicmetadata(file, function(err, tags) {

				console.log('file tags', tags);

				extendCurrentModel( getModelFromData(tags, file) );
			});
		}
		else
		{
			extendCurrentModel( getModelFromData({}, file) );
		}

		return promise;
	}

	audioEmbed.prototype.populateFormWithModel = function($form){
    var self = this;
    var promise = $.Deferred();

    self.parent.populateFormWithModel($form, self);

    if (!!self.model.upload || !!self.model.url_path)
    {
      updateAudioPreview(self)
        .done(function() {
          promise.resolve();
        });
    }
    else
    {
      promise.resolve();
    }

    return promise;
	};

	audioEmbed.prototype.parseForEditor = function(){
		var self = this;
		var embedHtml = [
			'<audio controls class="entity-embed-secondary-toolbar-locator" src="' + getAudioUrl(self.options.audioLocation, self.model.url_path) + '" type="audio/mp3"></audio>'
		];

		if(!!self.model.credit)
		{
			embedHtml.push('<div class="credit">Credit: ' + self.model.credit + '</div>');
		}

		if(!!self.model.creditLink)
		{
			embedHtml.push('<div class="link">Link: ' + self.model.creditLink + '</div>');
		}

		return '<div class="audio-embed">' + embedHtml.join('') +'</div>';
	};

})();
var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'customText',
		customTextEditorId = 'custom-text-editor',
		defaults = {
			viewPath: 'modal_customText.html',
			displayName: 'Custom Text',
			object_type: 'custom',
			validationOptions: {
				rules : {
					title: 'required',
					customText: 'required'
				}
			}
		},
		customTextEditor;

	// CONSTRUCTOR
	function customTextEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	customTextEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = customTextEmbed;

	// PUBLIC
	customTextEmbed.prototype.orderIndex = 5;

	customTextEmbed.prototype.getModelFromForm = function($form){
		var self = this;
		var $formFields = $form.find('.embed-modal-form-control');

		$formFields.each(function() {
			var $this = $(this);
			var prop = $this.attr('name');
			var editor = $this.data('editor');
			var val;

			if(editor)
			{
				val = editor.getContent();
			}
			else
			{
				val = $this.val();
			}

			val = val.replace(/^\s+|\s+$/, '');

			self.model[prop] = val || null;
		});
	};

	customTextEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			displayTitle: "",
			text: null
		};
	}

	customTextEmbed.prototype.clearForm = function($form, _self){
		var self = _self || this;
		var $formFields = $form.find('.embed-modal-form-control');

		self.parent.clearForm($form, self);

		$formFields.each(function() {
			var $this = $(this);
			var editor = $this.data('editor');

			if(editor)
			{
				editor.setContent('');
			}
			else
			{
				$this.val(null);
			}
		});

		self.model = self.cleanModel();
	};

	customTextEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		var $formFields = $form.find('.embed-modal-form-control');

		$formFields.each(function() {
			var $this = $(this);
			var prop = $this.attr('name');
			var data = self.model[prop];
			var editor = $this.data('editor');

			if(editor)
			{
				editor.setContent(data);
			}
			else
			{
				$this.val(data);
			}
		});
	};

	customTextEmbed.prototype.initModal = function($el){
		var self = this;
		var $customText = $('#' + customTextEditorId);
		var customTextEditor = new MediumEditor($customText[0], {
			placeholder:{
				text: "Type your text. Highlight words to trigger the styles editor"
			}
		});

		$customText.data('editor', customTextEditor);
	};

	customTextEmbed.prototype.parseForEditor = function(){
		var self = this;
		var embedHtml = [
			'<div class="custom-text">' + self.model.customText + '</div>'
		];

		if(self.model.displayTitle)
		{
			embedHtml.unshift('<div class="display-title">' + self.model.displayTitle + '</div>');
		}

		return  '<div class="custom-text-embed entity-embed-secondary-toolbar-locator">' + embedHtml.join('') +'</div>';
	};

})();
var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'externalLink',
		defaults = {
			viewPath: 'modal_externalLink.html',
			displayName: 'External Link',
			object_type: 'external-link',
			imageLocation: 'https://test-services.pri.org',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required',
					linkText: 'required'
				}
			},
			httpPaths:{
				uploadFile: 'admin/embed/file-upload'
			}
		},
		uploadedImgDisplay = '.uploaded-image-file',
		cancelUploadImageBtn = '.cancel-upload-image-btn',
		editImageFileBtn = '.edit-chosen-file-btn',
		uploadImageFileBtn = ".embed-modal-file-input",
		getImageUrl = function(imageLocation, imageUrl)
		{
			if (!imageUrl || imageUrl === '')
			{
				return '';
			}

			if (imageUrl.indexOf(imageLocation) >= 0)
			{
				return imageUrl;
			}

			// ensure that there isn't an unintended '//' in final URL
			if (imageLocation.endsWith('/'))
			{
				imageLocation = imageLocation.substring(0, imageLocation.length - 1);
			}
			if (!imageUrl.startsWith('/'))
			{
				imageUrl = '/' + imageUrl;
			}

			return imageLocation + imageUrl;
		};

	// CONSTRUCTOR
	function externalLinkEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	// TODO : inherit from imagesEmbed
	externalLinkEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = externalLinkEmbed;

	// PUBLIC
	externalLinkEmbed.prototype.orderIndex = 9;

	externalLinkEmbed.prototype.cleanModel = function(){
		return {
			url_path: null, // URL to upload image file
			upload: null,	// form data for upload image file
			title: null,
			displayTitle: null,
			teaser: null,
			linkText: null,
			url: null,
		};
	};

	externalLinkEmbed.prototype.initModal = function($el){
		var self = this;

		self.$imageForm = $el.find('input[name="upload"]');

		$el.find(editImageFileBtn).on('click', function(){
			$el.find(uploadedImgDisplay).hide();
			$el.find(editImageFileBtn).hide();

			self.$imageForm.css('display', 'inline-block');
			$el.find(cancelUploadImageBtn).show();
		});

		$el.find(cancelUploadImageBtn).on('click', function(){
			self.$imageForm.hide();
			$el.find(cancelUploadImageBtn).hide();
			if (self.$imageForm.parent().find('#upload-error').is(':visible'))
			{
				self.$imageForm.parent().find('#upload-error').hide();	
			}

			$el.find(uploadedImgDisplay).show();
			$el.find(editImageFileBtn).show();
		});

		$el.find(uploadImageFileBtn).on('change', function(){
			var fileName =  $el.find(uploadImageFileBtn)[0].files[0].name;
			$el.find("[name=title]").val(fileName);
		});
	};

	externalLinkEmbed.prototype.saveEmbed = function(embedIsNew)
	{
		var self = this;
		var file = self.model.upload;
		delete self.model.upload;

		var promise = self.parent.saveEmbed(embedIsNew, self);
		
		if (!!file)
		{
			return promise.then(function(responseData){
				var imageFormData = new FormData();
				imageFormData.append('upload', file);

				return EntityEmbed.apiService.uploadFile({
					path: self.options.httpPaths.uploadFile,
					data: imageFormData,
					headers: {
						'x-object-id': responseData.response.object_id
					}
				});
				
			}).done(function(responseData){
				self.model.url_path = responseData.response.url_path;
			});
		}
		else
		{
			return promise;
		}
	};

	externalLinkEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		self.parent.populateFormWithModel($form, self);

		if (!self.model.upload && !self.model.url_path)
		{	
			return;
		}

		self.$imageForm.hide();

		$form.find(uploadedImgDisplay).show();
		$form.find(editImageFileBtn).show();
		$form.find(uploadedImgDisplay).append(self.generateUploadedImgPreview());
	};
	
	externalLinkEmbed.prototype.clearForm = function($el){
		var self = this;
		self.parent.clearForm($el, self);

		$el.find(uploadedImgDisplay).find('.' + self.imagePreviewClass).remove();
		$el.find(uploadedImgDisplay).hide();
		$el.find(cancelUploadImageBtn).hide();
		$el.find(editImageFileBtn).hide();
		self.$imageForm.show();
	};

	externalLinkEmbed.prototype.generateUploadedImgPreview = function() {
		var self = this;
		if (!!self.model.object_id) // this is an edit modal - there must be an existing url_path to the image file
		{
			return '<img class="' + self.imagePreviewClass +
					'" src="' + getImageUrl(self.options.imageLocation, self.model.url_path) + '">';
		}
		else // this is an add modal - the image has been uploaded by the client but not pushed to the server
		{
			return	'<div class="' + self.imagePreviewClass + '">' +
				(self.model.url_path || self.model.upload.name) +
			'</div>';
		}
	};

	externalLinkEmbed.prototype.parseForEditor = function(){
		var self = this;

		return 	'<div class="external-link-embed entity-embed-secondary-toolbar-locator">' +
					'<img src="' + getImageUrl(self.options.imageLocation, self.model.url_path) + '">' + 
					'<div class="text-container">' + 
						'<div class="display-title">' + self.model.displayTitle + '</div>' +
						'<div class="teaser">' + self.model.teaser + '</div>' +
					'</div>' + 
					'<a href="' + self.model.url + '">'  + self.model.linkText + '</a>' + 
				'</div>';
	};

})();
var EntityEmbed = EntityEmbed || {};

(function(window){

	'use strict';

	// PRIVATE
	var embedName = 'facebook',
		defaults = {
			viewPath: 'modal_facebook.html',
			displayName: 'Facebook',
			object_type: 'facebook',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required'
				}
			}
		};

	// CONSTRUCTOR
	function facebookEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	facebookEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = facebookEmbed;

	// PUBLIC
	facebookEmbed.prototype.orderIndex = 7;

	facebookEmbed.prototype.getModelFromForm = function($el){
		var self = this;

		// TODO: Need to extract this block of code, and instead call parent function
		var formFields = $el.find('.embed-modal-form-control');

		for(var i = 0; i < formFields.length; i++)
		{
			var name = formFields[i].name;
			var value = formFields[i].value;
			if (!!name && !!value)
			{
				self.model[name] = value;
			}
		}

		var embedCodeName = 'embedCode';
		var code = 	'<script>' +
						'(function(d, s, id) {' +
							'var js, fjs = d.getElementsByTagName(s)[0];' +
							'if (d.getElementById(id)) return;' +
							'js = d.createElement(s);' +
							'js.id = id;' +
							'js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3";' +
							'fjs.parentNode.insertBefore(js, fjs);' +
							'}' +
							'(document, "script", "facebook-jssdk"));' +
						'</script>' +
					'<div class="fb-post" data-href="'+ this.model.url + '" data-width="500">' +
					'</div>';
		self.model[embedCodeName] = code;

	};
	// PUBLIC
	facebookEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url: null
		};
	};

	facebookEmbed.prototype.parseForEditor = function(){
		var self = this;
		// TODO: Need to make user unable to interact with embed
		return '<div class="facebook-embed">' +
					'<div class="overlay">' +
						self.model.embedCode +
					'</div>' +
				'</div>';
	};

	facebookEmbed.prototype.activateEmbed = function(){
		// Check to see if FB scripts have already been loaded
		if(window.FB)
		{
			// Tell FB to parse widgets again
			window.FB.XFBML.parse();
		}
	}

})(window);
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

	globalBuzzEmbed.prototype.cleanModel = function(){
		return {
			title: null,
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
							'<a class="btn btn-primary global-buzz-link" href="' + self.model.quoteUrl + '">' + self.model.quoteUrlText + '</a>' +
						'</div>' +
					'</article>' +
				'</div>';
	};

})();
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
			height: 300
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
var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'image',
		defaults = {
			viewPath: 'modal_image.html',
			displayName: 'Image',
			object_type: 'image',
			imageLocation: 'https://test-services.pri.org',
			validationOptions: {
				rules: {
					title: 'required',
					altText: 'required',
					license: 'required',
					upload: {
						required: true,
						extension: "png|jpg|jpeg|gif"
					}
				}
			},
			httpPaths:{
				getLicenses: 'admin/image-license/list',
				uploadFile: 'admin/embed/file-upload'
			}
		},
		uiElements = {
			// myElm: '.select-my-elm'
			imageEditorPreview: '.image_editor-preview',
			imageEditorPreviewImage: '.image_editor-preview_image',
			editImageFileBtn: '.js-upload',
			cancelUploadImageBtn: '.js-upload-cancel',
			undoUploadImageBtn: '.js-upload-undo',
			uploadFileInputContainer: '.image_editor-intro',
			uploadFileInput: '.embed-modal-file-input',
			imageEditor: '.image_editor'
		},
		licenseConfigs = {
			'ap': {
				claimData: function(data) {
					var rgx = /(AP Images|Associated Press)/ig;
					return !!data.credit && rgx.test(data.credit) ||
						!!data.copyright && rgx.test(data.copyright);
				}
			},
			'getty': {
				claimData: function(data) {
					var rgx = /(Getty ?Images)/ig;
					return !!data.credit && rgx.test(data.credit) ||
						!!data.copyright && rgx.test(data.copyright);
				}
			},
			'reuters': {
				claimData: function(data) {
					return !!data.credit && data.credit.toLowerCase() === 'reuters';
				},
				getModelFromData: function(data, file) {
					var model = {};
					var creditArray = [];

					// Credit
					if(data.byline)
					{
						creditArray.push( data.byline.replace(/^\W*\u00A9\s*/, '') )
					}

					if(data.copyright)
					{
						creditArray.push(data.copyright)
					}

					model.credit = !!creditArray.length ? creditArray.join(' / ') : undefined;;

					// Caption
					model.caption = data.caption.replace(/\s+REUTERS\/.+$/mg, '');

					return model;
				}
			}
		};

	function getModelFromData(data, file) {
		var model = {};
		var creditArray = [];

		// Title
		model.title = file.name;

		// Credit
		if(data.byline)
		{
			creditArray.push(data.byline)
		}

		if(data.credit)
		{
			creditArray.push(data.credit)
		}

		if(data.copyright)
		{
			creditArray.push(data.copyright)
		}

		model.credit = creditArray.join(' / ');

		// Caption
		model.caption = data.caption && data.caption.replace(/\s*\([^\)]+\)\s*$/, '');

		// Alt Text
		model.altText = data.headline;

		// License
		// Defalut to not defining a license

		return model;
	}

	function getImageUrl(imageLocation, imageUrl)
	{
		if (!imageUrl || imageUrl === '')
		{
			return '';
		}

		if (imageUrl.indexOf(imageLocation) >= 0)
		{
			return imageUrl;
		}

		// ensure that there isn't an unintended '//' in final URL
		if (imageLocation.endsWith('/'))
		{
			imageLocation = imageLocation.substring(0, imageLocation.length - 1);
		}
		if (!imageUrl.startsWith('/'))
		{
			imageUrl = '/' + imageUrl;
		}

		return imageLocation + imageUrl;
	};

	function registerUiElements(scope, $el) {
		scope.$ui = scope.$ui || {
			form: $el
		};

		for(key in uiElements)
		{
			if(uiElements.hasOwnProperty(key))
			{
				scope.$ui[key] = $(uiElements[key], $el);
			}
		}

		return scope.$ui;
	}

	function updateImagePreview(scope, file) {
		var $ui = scope.$ui;
		var image = new Image();
		var promise = $.Deferred();
		var imageUrl;

		function handleLoad() {
			showImagePreview(scope);
			promise.resolve();
			$(this).off('load', handleLoad);
		}

		$ui.imageEditorPreviewImage.on('load', handleLoad);

		if (file)
		{
			scope.model.upload = file;
		}

		imageUrl = scope.getImageUrl();

		$ui.imageEditorPreview.css('background-image', 'url("' + imageUrl + '")')
		$ui.imageEditorPreviewImage.attr('src', imageUrl);

		return promise;
	}

	function updateFormWithImageData(scope, file) {
		var $ui = scope.$ui;
		var promise = $.Deferred();

		scope.getModelFromFile(file)
			.done(function (model) {

				scope.populateFormWithModel($ui.form)
					.done(function () {
						promise.resolve();
					});

			});

		return promise;
	}

	function showImagePreview(scope) {
		var $ui = scope.$ui;

		// Hide file input and related toolbar btns
		$ui.uploadFileInputContainer.hide();
		$ui.cancelUploadImageBtn.hide();

		// Show Image Preview and related toolbar btns
		$ui.imageEditorPreview.show();
		$ui.editImageFileBtn.show();
		$ui.undoUploadImageBtn.toggle(!!scope.model.url_path && !!scope.model.upload);
	}

	function showFileInput(scope) {
		var $ui = scope.$ui;

		// Hide Image Preview and related toolbar btns
		$ui.imageEditorPreview.hide();
		$ui.editImageFileBtn.hide();
		$ui.undoUploadImageBtn.hide();

		// Show file input and related toolbar btns. Clean up after previous validation errors.
		$ui.uploadFileInput.removeClass('error')
			.parent().find('#upload-error').remove();
		$ui.uploadFileInputContainer.show();
		$ui.cancelUploadImageBtn.toggle(!!(scope.model.url_path || scope.model.upload));
	}

	// CONSTRUCTOR
	function imagesEmbed(options, file){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);

		if(file)
		{
			self.getModelFromFile(file);
		}
	};

	imagesEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = imagesEmbed;

	// PUBLIC
	imagesEmbed.prototype.orderIndex = 1;

	imagesEmbed.prototype.imageEditorPreviewImageClass = 'image-preview';

	imagesEmbed.prototype.cleanModel = function(){
		return {
			url_path: null, // URL to image file
			upload: null,	// form data for image file
			title: null,
			altText: null,
			credit: null,
			creditLink: null,
			caption: null,
			license: null,
			object_type: defaults.object_type
		};
	};

	imagesEmbed.prototype.getImageUrl = function() {
		return !!this.model.upload ? window.URL.createObjectURL(this.model.upload) : getImageUrl(this.options.imageLocation, this.model.url_path);
	};

	imagesEmbed.prototype.loadLicenses = function ($el){
		var self = this;
		var $licenseField = $el.find('[name="license"]');

		if($licenseField.children().length > 1)
		{
			$licenseField.val(self.model.license);
			return;
		}

		EntityEmbed.apiService.get({
				path: self.options.httpPaths.getLicenses
			})
			.done(function(list){
				var $option;

				//load object into license list
				if (!list.response.data)
				{
					return;
				}

				if($licenseField.children().length > 1)
				{
					$licenseField.val(self.model.license);
					return;
				}

				self.licenses = list.response.data;

				for(var i = 0; i < list.response.data.length;i++)
				{
					$option = $('<option>');
					$option.attr('value', list.response.data[i].license)
						.text(list.response.data[i].title);
					$licenseField.append($option);
				}

				$licenseField.val(self.model.license);
			})
			.fail(function(data){
				console.log('failed to find load image license options');
			});
	};

	imagesEmbed.prototype.initModal = function($el, modalCtrl){
		var self = this;
		var $ui = registerUiElements(self, $el);

		self.loadLicenses($el);

		$ui.editImageFileBtn.on('click', 'a', function(){
			$ui.uploadFileInput.click();
		});

		$ui.cancelUploadImageBtn.on('click', 'a', function(){
			showImagePreview(modalCtrl.scope.currentEmbedType);
		});

		$ui.undoUploadImageBtn.on('click', 'a', function() {
			delete modalCtrl.scope.currentEmbedType.model.upload;
			$ui.uploadFileInput.val('');
			updateImagePreview(modalCtrl.scope.currentEmbedType);
		});

		$ui.uploadFileInput.on('change', function(event){
			var file = event.target.files[0];
			updateFormWithImageData(modalCtrl.scope.currentEmbedType, file);
		});

		$(document).on('dragover drop', function(event) {
			event.preventDefault();
		});

		$ui.imageEditor
			.on('dragenter dragover', function() {
				$(this).addClass('js-dragover');
			})
			.on('dragleave drop', function() {
				$(this).removeClass('js-dragover');
			})
			.on('drop', function(event) {
				event.preventDefault();

				var $this = $(this);
				var files = event.originalEvent.dataTransfer.files;
				var file;

				if (!!files && !!files.length)
				{
					file = files[0];

					if(file.type.indexOf('image') === -1)
					{
						return;
					}

					$this.addClass('js-dropped');

					setTimeout(function() {

						updateFormWithImageData(modalCtrl.scope.currentEmbedType, file)
							.done(function() {
								setTimeout(function() {
									$this.removeClass('js-dropped');
								}, 300);
							});

					}, 300);
				}
			});
	};

	imagesEmbed.prototype.clearForm = function($el){
		var self = this;
		var $ui = self.$ui;

		self.parent.clearForm($el, self);

		$ui.imageEditorPreviewImage.removeAttr('src');

		showFileInput(self);
	};

	imagesEmbed.prototype.saveEmbed = function(embedIsNew)
	{
		var self = this;
		var file = self.model.upload;
		delete self.model.upload;

		var promise = self.parent.saveEmbed(embedIsNew, self);

		if (!!file)
		{
			return promise.then(function(responseData){
				var imageFormData = new FormData();
				imageFormData.append('upload', file);

				return EntityEmbed.apiService.uploadFile({
					path: self.options.httpPaths.uploadFile,
					data: imageFormData,
					headers: {
						'x-object-id': responseData.response.object_id
					}
				});
			}).done(function(responseData){
				self.model.url_path = responseData.response.url_path;
			});
		}
		else
		{
			return promise;
		}
	};

	imagesEmbed.prototype.getModelFromForm = function($form){
		var self = this;
		var oldModel = $.extend(true, {}, self.model);

		self.parent.getModelFromForm($form, self);

		if(!!oldModel.upload && !self.model.upload)
		{
			self.model.upload = oldModel.upload;
		}
	}

	imagesEmbed.prototype.getModelFromFile = function(file){
		var self = this;
		var $ui = self.$ui;
		var promise = $.Deferred();

		if (!file)
		{
			file = self.model.upload;
		}

		EXIF.getData(file, function() {
			var imageData = this.iptcdata;
			var currentModel, tempModel, lcModel, prop, lc;

			// Try to identify Licence by giving license configs a chance to claim the data. First come, first serve.
			for (prop in licenseConfigs)
			{
				if(licenseConfigs.hasOwnProperty(prop))
				{
					lc = licenseConfigs[ prop ];
					// Check if config can and does claim data
					if(typeof lc.claimData === 'function' && lc.claimData(imageData))
					{
						// Attempt to get model object from congifs getModelFromData method, fallback to empty object
						lcModel = typeof lc.getModelFromData === 'function' ? lc.getModelFromData(imageData, this) : {};
						// Set license prop to the claiming license
						lcModel.license = prop;
					}
				}
			}

			// Get a model using the default mapping method
			tempModel = getModelFromData(imageData, this);

			// Update model with current form values
			if($ui)
			{
				self.getModelFromForm($ui.form);
			}

			// Clone current model so we can manipulate it
			currentModel = $.extend(true, {}, self.model);

			// Remove null properties from currentModel so they don't overwrite
			// properties on tempModel or lcModel during merge.
			for (prop in currentModel)
			{
				if(currentModel.hasOwnProperty(prop) && currentModel[prop] === null)
				{
					delete currentModel[prop];
				}
			}

			// Merge models together.
			// 		currentModel > lcModel > tempModel
			self.model = $.extend(true, {}, tempModel, lcModel || {}, currentModel);

			// Current model may contain old upload file, make sure it is set to the new file
			self.model.upload = file;

			promise.resolve(self.model);
		});

		return promise;
	}


	imagesEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		var promise = $.Deferred();

		self.parent.populateFormWithModel($form, self);

		self.loadLicenses($form);

		if (!!self.model.upload || !!self.model.url_path)
		{
			updateImagePreview(self)
				.done(function() {
					promise.resolve();
				});
		}
		else
		{
			promise.resolve();
		}

		return promise;
	};

	imagesEmbed.prototype.parseForEditor = function(){
		var self = this;
		var embedHtml = [
			'<img class="entity-embed-secondary-toolbar-locator" src="' + getImageUrl(self.options.imageLocation, self.model.url_path) + '" />'
		];

		if(!!self.model.caption)
		{
			embedHtml.push('<div class="images-embed-caption">' + self.model.caption +'</div>');
		}

		if(!!self.model.credit)
		{
			embedHtml.push('<div class="images-embed-credit">Credit: ' + self.model.credit +'</div>');
		}

		return	'<div class="images-embed">' + embedHtml.join('') +'</div>';
	};
})();
var EntityEmbed = EntityEmbed || {};

(function(window){

	'use strict';

	// PRIVATE
	var embedName = 'instagram',
		defaults = {
			viewPath: 'modal_instagram.html',
			displayName: 'Instagram',
			object_type: 'instagram',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required'
				}
			}
		};

	// CONSTRUCTOR
	function instagramEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	instagramEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = instagramEmbed;

	// PUBLIC
	instagramEmbed.prototype.orderIndex = 8;

	instagramEmbed.prototype.getModelFromForm = function($el){
		var self = this;


		// TODO: Need to extract this block of code, and instead call parent function
		var formFields = $el.find('.embed-modal-form-control');
		for(var i = 0; i < formFields.length; i++)
		{
			var name = formFields[i].name;
			var value = formFields[i].value;
			if (!!name && !!value)
			{
				self.model[name] = value;
			}
		}

		var embedCodeName = 'embedCode';
		var code = '<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: auto; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px); ">' +
						'<a href="' + self.model.url +
						'" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">' +
						'</a>' +
					'</blockquote>' +
					'<script async defer src="//platform.instagram.com/en_US/embeds.js"></script>';
		self.model[embedCodeName] = code;
	};

	// PUBLIC
	instagramEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url: null
		};
	};

	instagramEmbed.prototype.parseForEditor = function(){
		var self = this;
		return '<div class="instagram-embed">' +
					'<div class="overlay">' +
						self.model.embedCode +
					'</div>' +
				'</div>';
	};

  instagramEmbed.prototype.activateEmbed = function(){
    // Check to see if Instagram scripts have already been loaded
    if(window.instgrm)
    {
      // Tell instegram to process embeds again
      window.instgrm.Embeds.process();
    }
  }

})(window);
var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'newsletterSubscribe',
		defaults = {
			viewPath: 'modal_newsletterSubscribe.html',
			displayName: 'Newsletter Subscribe',
			object_type: 'newsletter',
			validationOptions: {
				rules: {
					title: 'required',
					newsletter: 'required',					
				}
			},
			httpPaths:{
				getNewsletters: 'admin/newsletter/list'
			}
		};

	// CONSTRUCTOR
	function newsletterSubscribeEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	newsletterSubscribeEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = newsletterSubscribeEmbed;

	// PUBLIC
	newsletterSubscribeEmbed.prototype.orderIndex = 12;

	newsletterSubscribeEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			displayTitle: null,
			newsletterId: null,
			teaser: null
		};
	};
	
	newsletterSubscribeEmbed.prototype.initModal = function($el){
		var self = this;
		var defaultSubscriptionOption = '<option disabled selected>-- select a newsletter --</option>';
		EntityEmbed.apiService.get({
				path: self.options.httpPaths.getNewsletters,
			})
			.done(function(list){
				//load object into license list
				if (!list.response.data)
				{
					return;
				}
				var subscriptionList = [];
				subscriptionList.push(defaultSubscriptionOption);

				for(var i = 0; i < list.response.data.length; i++)
				{
					subscriptionList.push(
						'<option value="' + list.response.data[i].newsletter_id +'" >' + 
							list.response.data[i].title +
						'</option>'
					);
				}
				$el.find('[name="newsletter"]').html(subscriptionList);
			})
			.fail(function(){
				console.log('failed to load newsletter subscription options');
			});
	};

	newsletterSubscribeEmbed.prototype.parseForEditor = function(){
		var self = this;
		return '<div class="newsletter-subscribe-embed entity-embed-secondary-toolbar-locator">' +
					'<div class="display-title">' + self.model.displayTitle + '</div>' +
					'<div class="subscribe-form">' +			
						'<div class="teaser">' + self.model.teaser + '</div>' +
						'<div class="embed-modal-form">' +
							'<input name="email" type="text" placeholder="user@domain.com" class="embed-modal-form-control">' + 
						'</div>' + 
						'<button class="btn btn-primary subscribe-btn">Subscribe</button>'
					'</div>' + 
				'</div>';
	};

})();
var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// check for EntityEmbedTypes namespace
	if (!EntityEmbed.embedTypes)
	{
		console.log('Could not find EntityEmbedTypes namespace. ' +
			'Please ensure that the genericEmbed has loaded before this one.');
		return;
	}

	// PRIVATE
	var embedName = 'relatedLink',
		defaults = {
			viewPath: 'modal_relatedLink.html',
			displayName: 'Related Link',
			object_type: 'related-link',
			validationOptions: {
				rules: {
					title: 'required',
					linkInput: 'atLeastOne'
				}
			},
			httpPaths:{
				getContentList: 'admin/content/list',
				getContentItem: {
					story: 'admin/story/fetch',
					episode: 'admin/episode/fetch'
				}
			}
		},
		linkListId = '#related-link-list',
		addLinkInputId = '#add-link-eac',
		dragLinkClass = 'drag-link-btn',
		dragPlaceholderClass = 'related-link-placeholder',
		progressBarId = '#related-links-progress',
		removeLinkClass = 'remove-link-btn',
		linkClass = 'related-link-url',
		generateLinkItem = function(linkData, index) {
			var linkHtml = generateLinkInputHtml(linkData);
			var $linkItem = $(linkHtml);

			// Attach data to element
			$linkItem.data('link-data', linkData);

			// Add click hanlder to remove btn
			$linkItem.find('.' + removeLinkClass).on('click', function() {
				var $this = $(this);
				var $li = $this.closest('.' + linkClass);

				$li.remove();
			});

			return $linkItem;
		},
		generateLinkInputHtml = function(linkData){
			return	'<div class="' + linkClass + '">' +
						'<div class="related-link-control">' +
							'<span class="' + dragLinkClass + '">' +
								'<i class="fa fa-bars"></i>' +
							'</span>' +
						'</div>' +
						'<div class="related-link-title">' +
							linkData.title +
						'</div>' +
						'<div class="related-link-control">' +
							'<button class="' + removeLinkClass + '">' +
								'<i class="fa fa-minus"></i>' +
							'</button>' +
						'</div>' +
					'</div>';
		},
		//	This provides the functionality/styling for the type-ahead feature, allowing the user to only
		//	begin typing the title of a story and have a dropdown list of stories displayed to them
		//	based on their input. This function also takes into account validation of the modal form.
		initAutoComplete = function (inputId, self, $el){
			var rgxDevEnv = /^[^.]*staging[^.]*\.|\.dev$/;
			var isDevEnv = rgxDevEnv.test(window.location.host);
			var debug = 0;
			var ajaxData = {
				auth_token: EntityEmbed.apiService.getAuthToken(),
			};
			var $input = $el.find(inputId);


			if(isDevEnv)
			{
				ajaxData.debug = 1;
			}

			var options = {
				ajaxSettings: {
					dataType: 'json',
					method: 'POST',
					data: ajaxData
				},
				requestDelay: 600,
				url: function(phrase) {
					ajaxData.title = phrase;
					return EntityEmbed.apiService.getDomainName() + self.options.httpPaths.getContentList;
				},
				listLocation: function(listOfData){
					return listOfData.response.data;
				},
				getValue: function(data) {
					if(data.pub_state == 1)
					{
						return data.title;
					}
					else
					{
						return '';
					}
				},
				preparePostData: function(data) {
					data.title = $input.val();
					return JSON.stringify(data);
				},
				list: {
					maxNumberOfElements: 10,
					match: {
						enabled: true
					},
					sort: {
						enabled: true
					},
					onChooseEvent: function(){ // store the users story selection
						var itemData = $input.getSelectedItemData();
						var objectId = itemData.object_id;
						var $linkList = $el.find(linkListId);
						var $linkItem;

						if (!!itemData.object_id)
						{
							$linkItem = generateLinkItem(itemData);
							$linkList.append($linkItem);
						}

						$input.val('');
					}
				}
			};

			$input.easyAutocomplete(options);

			$input.closest('.easy-autocomplete').removeAttr('style');
		};

	// CONSTRUCTOR
	function relatedLinkEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	relatedLinkEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = relatedLinkEmbed;

	// PUBLIC
	relatedLinkEmbed.prototype.orderIndex = 10;

	relatedLinkEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			displayTitle: null,
			links: []
		};
	};

	relatedLinkEmbed.prototype.initModal = function($el){
		var self = this;
		var $linkList = $el.find(linkListId);
		var $progress = $el.find(progressBarId);
		var adjustment, placeholderHeight;

		// Don't need to show progress on new or cleared forms
		$progress.parent().hide();

		// Initialize Add Link field's Auto Complete functionality
		initAutoComplete(addLinkInputId, self, $el);

		// Make link list sortabel
		$linkList.sortable({
			axis: 'y',
			handle: '.' + dragLinkClass,
			items: '.' + linkClass,
			placeholder: dragPlaceholderClass,
			start: function (event, ui) {
				ui.placeholder.height(ui.helper.outerHeight());
			}
		});

		$.validator.addMethod('atLeastOne', function(value, element){
			return $('.related-link-url').length > 0;
		}, $.validator.format('One link is required.'));
	};

	relatedLinkEmbed.prototype.clearForm = function($el){
		var self = this;
		self.parent.clearForm($el, self);

		// Remove children from link list
		$el.find(linkListId).empty();
	};

	relatedLinkEmbed.prototype.getModelFromForm = function($el){
		var self = this;
		self.parent.getModelFromForm($el, self);
		delete self.model.linkInput;
		self.model.links = [];

		// Pull data from all link elements and add to model just the properties need to look it up again
		$el.find('.' + linkClass).each(function() {
			var $this = $(this);
			var linkData = $this.data('link-data');

			self.model.links.push({
				object_id: linkData.object_id,
				object_type: linkData.object_type
			});
		});
	};

	relatedLinkEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		var $linkList = $form.find(linkListId);
		var $progress = $form.find(progressBarId);
		var $linkItem, i, m, promise, fetchPath;
		var deferreds = [];
		var linksData = [];
		var totalLinks = 0;
		var totalLoaded = 0;
		var percentLoaded = 0;

		self.parent.populateFormWithModel($form, self);

		// Check to see if model has links
		if (!self.model.links.length)
		{
			// exit now. don't need to load anything
			return;
		}

		// Reset progress elements size and visiblity
		$progress.width(0);
		$progress.parent().slideDown(0);

		for(i = 0, m = self.model.links.length; i < m; i++)
		{
			// Make sure link data at this index exists
			if(self.model.links[i])
			{
				// Increment our counter for links we are loading data for
				totalLinks++;

				// Get links data from API
				promise = EntityEmbed.apiService.get({
					path: self.options.httpPaths.getContentItem[self.model.links[i].object_type],
					data: {
						object_id: self.model.links[i].object_id
					}
				});

				// Handle API resonse
				promise.done((function(index) {
					return function(respData) {
						// Increment count of finished link loads, no matter the status of the request
						totalLoaded++;

						// Update progress bar
						percentLoaded = totalLoaded / totalLinks * 100;
						$progress.css({
							width: percentLoaded + '%'
						});

						if(respData.status === 'OK')
						{
							// Request returned data. Add to model at the correct index
							linksData[index] = respData.response;
						}
					};
				})(i));

				deferreds.push(promise);
			}
		}

		$.when.apply($, deferreds).done(function(){
			var $linkItem, i, m;

			$progress.parent().delay(400).slideUp(500);

			// Compact linksData array
			for (i = 0, m = linksData.length; i < m; i++)
			{
				if(!linksData[i])
				{
					linksData.splice(i,1);
				}
			}

			// Create link elements in link list
			for(i = 0, m = linksData.length; i < m; i++)
			{
				$linkItem = generateLinkItem(linksData[i]);
				$linkList.append($linkItem);
				$linkItem.hide().delay(1000).slideDown(150);
			}
		});
	};

	// TODO : make this the default styling for genericEmbed
	relatedLinkEmbed.prototype.parseForEditor = function(){
		var self = this;

		return '<div class="relatedLink-embed">' +
					'<div class="relatedLink-embed-uiText"> <strong>Embed Type:</strong> Related Link </div>' +
					'<div class="relatedLink-embed-uiText"> <strong>Title:</strong> ' + self.model.title + '</div>' +
					'<div class="relatedLink-embed-uiText"> <strong>Links:</strong> ' + self.model.links.length + '</div>' +
				'</div>';
	};

})();
var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'slideshow',
		defaults = {
			viewPath: 'modal_slideshow.html',
			displayName: 'Slideshow',
			object_type: 'slideshow',
			validationOptions: {
				rules: {
					title: 'required'
				}
			}
		},
		imageModalOptions = {
			modalElId: 'embed-modal-slideshow-image',
			embedTypes: {
				image: {}
			},
			modalOptions: {
				embedTypeStr: 'image',
				bufferData: true
			}
		},
		generateId = function () {
			var ret = '';
			for(var i = 0; i < 8; i++){
				ret += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
			return ret;
		},
		slideClass = 'slideshow_editor-nav_item',
		slideActiveClass = 'active',
		slideHanleClass = 'slideshow_editor-nav_handle',
		slideIndicatorClass = 'slideshow_editor-nav_ind',
		slideAddedClass = 'fa-circle-o',
		slideNewClass = 'fa-star',
		slideChangedClass = 'fa-star-o',
		slideSavingClass = 'fa-circle-o-notch fa-spin',
		slideCompleteClass = 'fa-check',
		slideErrorClass = 'fa-exclamation',
		slidePlaceholderClass = 'slideshow_editor-slide_placholder',
		uiElements = {
			// myElm: '.select-my-elm'
			addSlide: '.js-add_slide',
			intro: '.slideshow_intro',
			editor: '.slideshow_editor',
			slideImage: '.js-slide_image',
			slideCaption: '.js-slide_caption',
			slideCreditBlock: '.slideshow_editor-slide_credit-container',
			slideCredit: '.js-slide_credit',
			slideText: '.js-slide_text',
			slides: '.js-slides',
			slideTemplate: '.js-slide_template',
			removeSlide: '.js-remove_slide',
			editSlide: '.js-edit_slide',
			dropFiles: '.slideshow_drop_files'
		};

	function activateSlide($slide, scope) {
		var $ui = scope.$ui;

		scope.$currentSlide = $slide;

		$ui.slides.find('.' + slideActiveClass).removeClass(slideActiveClass);
		$slide.addClass(slideActiveClass);

		$ui.slides.sortable('refresh');

		viewCurrentSlide(scope);

		showEditor(scope);
	}

	function viewCurrentSlide(scope) {
		var imageEmbed = new EntityEmbed.embedTypes.image();
		var $ui = scope.$ui;
		var model = scope.$currentSlide.data('model');
		var creditFilter = !!model.creditLink ? 'a' : 'span';
		var hasCaption = !!model.caption;
		var hasCredit = !!model.credit;
		var hasText = hasCaption || hasCredit;
		var imageUrl;

		imageEmbed.model = model;

		imageUrl = imageEmbed.getImageUrl();

		$ui.slideText.toggle(hasText);

		// Render image
		$ui.slideImage.css('background-image', 'url("' + imageUrl + '")')
			.find('img').attr('src', imageUrl);

		// Render Caption
		$ui.slideCaption.toggle(hasCaption).text(model.caption);

		// Render Credit
		$ui.slideCreditBlock.toggle(hasCredit);
		$ui.slideCredit.text(model.credit).hide().filter(creditFilter).show();
		$ui.slideCreditBlock.find('a:visible').attr('href', model.creditLink);
	}

	function hideEditor(scope) {
		var $ui = scope.$ui;

		$ui.intro.show();
		$ui.editor.hide();

		// Remove slide elements
		$ui.slides.empty();

		// Clear preview
		$ui.slideImage.css('background-image', 'none')
			.find('img').removeAttr('src');
		$ui.slideText.hide();
		$ui.slideCaption.empty();
		$ui.slideCreditBlock.hide();
		$ui.slideCredit.empty().filter('a').removeAttr('href');
	}

	function showEditor(scope) {
		var $ui = scope.$ui;

		$ui.intro.hide();
		$ui.editor.show();
	}

	function registerUiElements(scope, $el) {
		scope.$ui = scope.$ui || {};

		for(key in uiElements)
		{
			if(uiElements.hasOwnProperty(key))
			{
				scope.$ui[key] = $(uiElements[key], $el);
			}
		}

		return scope.$ui;
	}

	// CONSTRUCTOR
	function slideshowEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	slideshowEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = slideshowEmbed;

	// PUBLIC
	slideshowEmbed.prototype.orderIndex = 2;

	slideshowEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			displayTitle: null,
			images: []
		};
	};

	slideshowEmbed.prototype.initModal = function($el, modalCtrl){
		var self = this;
		var $ui;

		self.model = self.cleanModel();

		self.$el = imageModalOptions.modalContainer = $el;

		imageModalOptions.modalOptions.parentModal = modalCtrl;

		// Set up ui interaction events

		$ui = registerUiElements(self, $el);

		$ui.slideTemplate.removeClass('js-slide_template').detach();
		$ui.slideTemplate.on('click', 'a', function(e) {
			var $this = $(this);
			var $slide = $this.closest('.' + slideClass);
			activateSlide($slide, self);
		});

		$ui.slides.sortable({
			axis: 'x',
			handle: '.' + slideHanleClass,
			placeholder: slidePlaceholderClass
		});

		$ui.addSlide.on('click', function() {
			delete imageModalOptions.modalOptions.id;
			delete imageModalOptions.modalOptions.embedData;

			$.embed_modal_open(imageModalOptions)
				.done(function(response) {
					var $slide = $ui.slideTemplate.clone(true);
					var slideClass = !!response.data.object_id ? slideAddedClass : slideNewClass;

					// Add data to slide
					$slide.data('model', response.data);
					$slide.find('.' + slideIndicatorClass).addClass(slideClass);

					// Append slide
					$ui.slides.append($slide);

					// Activate slide
					activateSlide($slide, self);

					showEditor(self);
				});
		});

		$ui.editSlide.on('click', function() {
			var $slide = self.$ui.slides.find('.' + slideActiveClass);
			var model = $slide.data('model');

			self.$currentSlide = $slide;

			imageModalOptions.modalOptions.id = model.object_id;
			imageModalOptions.modalOptions.embedData = model;

			$.embed_modal_open(imageModalOptions)
				.done(function(response) {
					// Update data on slide
					$slide.data('model', response.data);
					// Added changed indicator if not a new slide
					if(model.object_id)
					{
						$slide.find('.' + slideIndicatorClass)
							.removeClass(slideAddedClass)
							.addClass(slideChangedClass);
					}
					// Show changes to slide
					viewCurrentSlide(self);
				});
		});

		$ui.removeSlide.on('click', function() {
			var $slide = self.$ui.slides.find('.' + slideActiveClass);
			var $prev = $slide.prev();
			var $next = $slide.next();
			var $sibling;

			$slide.remove();

			switch(true)
			{
				case !!$next.length :
					$sibling = $next;
					break;

				case !!$prev.length :
					$sibling = $prev;
					break;
			}

			if($sibling)
			{
				activateSlide($sibling, self);
			}
			else
			{
				self.$currentSlide = undefined;
				hideEditor(self);
			}
		});

		$ui.dropFiles
			.on('dragenter dragover', function() {
				$(this).addClass('js-dragover');
			})
			.on('dragleave drop', function() {
				$(this).removeClass('js-dragover');
			})
			.on('drop', function(event) {
				var filesList = event.originalEvent.dataTransfer.files;
				var files = [];
				var slides = [];
				var i, m;

				event.preventDefault();

				if(!filesList.length)
				{
					return;
				}

				for (i = 0, m = filesList.length; i < m; i++)
				{
					files[i] = filesList[i];
				}

				function processFile(file) {
					var fileNumber = filesList.length - files.length;
					var imageEmbed, $slide;

					if(file.type.indexOf('image') === -1)
					{
						return;
					}

					imageEmbed = new EntityEmbed.embedTypes.image();

					imageEmbed.getModelFromFile(file)
						.done(function(model) {

							delete imageModalOptions.modalOptions.id;

							imageModalOptions.modalOptions.headerText = ['Add Image', fileNumber, 'of', filesList.length].join(' ');
							imageModalOptions.modalOptions.embedData = model;

							$.embed_modal_open(imageModalOptions)
								.done(function(response) {
									var $slide = $ui.slideTemplate.clone(true);
									var slideClass = !!response.data.object_id ? slideAddedClass : slideNewClass;

									// Add data to slide
									$slide.data('model', response.data);
									$slide.find('.' + slideIndicatorClass).addClass(slideClass);

									// Append slide
									slides.push($slide);
								})
								.always(function() {

									delete imageModalOptions.modalOptions.headerText;

									if(!!files.length)
									{
										processFile(files.shift());
									}
									else
									{
										for (i = 0, m = slides.length; i < m; i++)
										{
											$ui.slides.append(slides[i]);
											if(i === 0)
											{
												activateSlide(slides[i], self);
											}
										}
									}
								});

						});
				}

				processFile(files.shift());
			});

	};

	slideshowEmbed.prototype.saveEmbed = function(embedIsNew){
		var self = this;
		var deferreds = [];
		var imageEmbed = new EntityEmbed.embedTypes.image();
		var $slides = self.$ui.slides.children();

		self.model.images = [];

		$slides.removeClass(slideActiveClass).each(function(index) {
			var $this = $(this);
			var model = $this.data('model');
			var isNew = !model.object_id;
			var promise;

			$this.addClass('saving').find('.' + slideIndicatorClass)
				.removeClass([slideNewClass, slideAddedClass].join(' '))
				.addClass(slideSavingClass);

			imageEmbed.model = model;
			promise = imageEmbed.saveEmbed(isNew);
			promise.done( (function(_index_, _$this_){
					return function(data){
						if (data.status == 'ERROR')
						{
							console.log('failed to put/post a slideshow image');
							return;
						}

						_$this_.removeClass('saving').addClass('complete')
							.find('.' + slideIndicatorClass).removeClass(slideSavingClass).addClass(slideCompleteClass);

						self.model.images[_index_] = {
							'object_id' : data.response.object_id,
							'order'		: _index_
						};
					};
				})(index, $this))
				.fail((function(_index_, _$this_){
					return function(jqXhr, status, err){
						console.log('failed to save a slideshow image number ' + _index_, err);

						_$this_.removeClass('saving').addClass('error')
							.find('.' + slideIndicatorClass).removeClass(slideSavingClass).addClass(slideErrorClass);
					};
				})(index, $this));

			deferreds.push(promise);
		});

		return $.when.apply($, deferreds).then(function(){

			console.log('all images saved.', self.model.images);

			return self.parent.saveEmbed(embedIsNew, self);
		});
	};

	slideshowEmbed.prototype.getModelFromForm = function($form){
		var self = this;
		var $slides = self.$ui.slides.children();

		// Gather slideshow fields data
		self.parent.getModelFromForm($form.find('form').first(), self);

		self.model.images = [];

		$slides.each(function(index) {
			var $this = $(this);
			var model = $this.data('model');

			self.model.images[index] = {
				object_id: model.object_id,
				order: index
			}
		});
	};

	slideshowEmbed.prototype.populateFormWithModel = function($form){
		var self = this;
		var $ui = self.$ui;
		var imageEmbed = new EntityEmbed.embedTypes.image();
		var deferreds = [];

		self.parent.populateFormWithModel($form.find('form').first(), self);

		if(!self.model.images.length)
		{
			hideEditor(self);
			return;
		}

		// make sure images array is sorted on order
		self.model.images.sort(function(l, r){
			return !!l && !!r && l.order - r.order;
		});

		for(var i = 0; i < self.model.images.length; i++)
		{
			// Skip empty items in case a past bug left a gap in the data.
			if(!self.model.images[i])
			{
				continue;
			}

			// Request image emebed data from API
			var promise = EntityEmbed.apiService.get({
				path: imageEmbed.options.httpPaths.get,
				data: {
					object_id: self.model.images[i].object_id + 'err',
					auth_token: EntityEmbed.apiService.getAuthToken
				}
			});

			// Handle response
			promise.done((function(image){
				return function(data){
					if (data.status === 'ERROR' || typeof data.response === 'string')
					{
						console.log('Could not load slideshow image number ' + image.order, image, data);
						// TODO: Remove invalid item from images array... Maybe?
						return;
					}

					// Extend image with returned data
					$.extend(true, image, data.response);

				};
			})(self.model.images[i]))
			.fail((function(image){
				return function(jqXhr, status, err){
					console.log('Could not load slideshow image number ' + image.order, image, err);
						// TODO: Remove invalid item from images array... Maybe?
				};
			})(self.model.images[i]));

			// Add request promise to our deferreds
			deferreds.push(promise);
		}

		//
		$.when.apply($, deferreds).done(function(){
			var i, m, $slide, $first;

			// Generte and attach slides
			for (i = 0, m = self.model.images.length; i < m; i++)
			{
				$slide = $ui.slideTemplate.clone(true);
				$slide.data('model', self.model.images[i]);
				$ui.slides.append($slide);

				if(i === 0)
				{
					$first = $slide;
				}
			}

			activateSlide($first, self);

			showEditor(self);
		});
	};

	slideshowEmbed.prototype.clearForm = function($el){
		var self = this;

		self.parent.clearForm($el, self);

		hideEditor(self);
	};

})();
var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'twitter',
		defaults = {
			viewPath: 'modal_twitter.html',
			displayName: 'Twitter',
			object_type: 'twitter',
			validationOptions: {
				rules: {
					title: 'required',
					url: 'required'
				}
			}
		};

	// CONSTRUCTOR
	function twitterEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	twitterEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = twitterEmbed;

	// PUBLIC
	twitterEmbed.prototype.orderIndex = 6;

	twitterEmbed.prototype.getModelFromForm = function($el){
		var self = this;

		self.parent.getModelFromForm($el, self);

		self.model.embedCode =
			'<blockquote class="twitter-tweet" data-lang="en">' +
				'<a href="' + self.model.url + '"></a>' +
			'</blockquote>' +
			'<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
	};

	// PUBLIC
	twitterEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url: null,
			embedCode: null
		};
	};

	twitterEmbed.prototype.parseForEditor = function(){
		var self = this;

		return '<div class="twitter-embed">' +
					'<div class="overlay">' +
						self.model.embedCode +
					'</div>' +
				'</div>';
	};
})();
var EntityEmbed = EntityEmbed || {};

(function(){

	'use strict';

	// PRIVATE
	var embedName = 'video',
		defaults = {
			viewPath: 'modal_video.html',
			displayName: 'Video',
			object_type: 'video',
			validationOptions: {
				rules: {
					title: 'required',
					url: {
						required: true,
						validDomain: true
					}
				}
			}
		},
		makeVideoUrl = function(url){
			if (url.indexOf('vimeo.com') !== -1)
			{
				// TODO: embed opts should be configurable
				var opts = '?' + [
					'title=0',		// Hide video title
					'portrait=0',	// Hide creator portrait
					'byline=0',		// Hide creater byline
					'color=dc5555',	// Set color to sites primary accent color. I ♥ Vimeo.
				].join('&');

				return '//player.vimeo.com/video/' + getVimeoVideoId(url) + opts;
			}
			else if (url.indexOf('youtube.com') !== -1)
			{
				// TODO: embed opts should be configurable
				var opts = '?' + [
					'showinfo=0',		// Hide video title
					'modestbranding=1',	// Hide YouTube logo on controls
					'rel=0'				// Don't show related video grid after video has finished
				].join('&');

				return '//www.youtube.com/embed/' + getYoutubeVideoId(url) + opts;
			}
			else
			{
				return '';
			}

		};

	// Vimeo URL Patterns:
	// 1. [http://]player.vimeo.com/video/VIDEOID : IFrame embed. Can have querystring options
	// 2. [http://]vimeo.com/VIDEOID : URL in address bar when watching on website

	// Extracts the id based on Vimeo URL patterns.
	var getVimeoVideoId = function(videoId) {
		var result = (videoId.indexOf('/') > -1) ?
		// Vimeo's urls all have the video id at the end of the path segment,
		// after the last '/' up to the end of the string (or '?' if pressent)
		videoId.match(/\/([^?\/]+)(?:\?|$)/i)[1] :
		// Not URL. Assume original value is the Id
		videoId;

		return result;
	};

	// YouTube URL Patterns:
	// 1. [http://]www.youtube.com/embed/VIDEOID : IFrame embed. Can have querystring options
	// 2. [http://]www.youtube.com/v/VIDEOID : AS3 embed. Can have querystring options
	// 3. [http://]www.youtube.com/watch?v=VIDEOID : URL in address bar when watching on website
	// 4. [http://]youtu.be/VIDEOID : Sharing URL. Can have querystring options

	// Extracts the id based on YouTube URL patterns.
	var getYoutubeVideoId = function(videoId) {
		var result = (videoId.indexOf('/') > -1) ?

		// This is a url
		(videoId.indexOf('/watch') > -1) ?

		// URL is pattern 3
		videoId.match(/v=([^&]+)(?:&|$)/i)[1] :

		// All other URL patterns have the video id at the end of the path segment,
		// after the last '/' up to the end of the string (or '?' if pressent)
		videoId.match(/\/([^?\/]+)(?:\?|$)/i)[1] :

		// Not URL. Assume original value is the id
		videoId;

		return result;
	};

	// CONSTRUCTOR
	function videoEmbed(options){
		var self = this;
		self.parent.constructor(options, defaults, embedName, self);
	};

	videoEmbed.inherits(EntityEmbed.embedTypes.genericEmbed);
	EntityEmbed.embedTypes[embedName] = videoEmbed;

	// PUBLIC
	videoEmbed.prototype.orderIndex = 4;

	videoEmbed.prototype.cleanModel = function(){
		return {
			title: null,
			url: null
		};
	};

	videoEmbed.prototype.init = function($el){
		var self = this;
		self.parent.init($el, self);

		$.validator.addMethod('validDomain', function(value, element, params) {
			var isValid = value.indexOf('youtube.com') != -1 || value.indexOf('vimeo.com') != -1;
			return this.optional(element) || isValid;
		}, 'The video must be from YouTube or Vimeo');
	};

	videoEmbed.prototype.parseForEditor = function(){
		var self = this;
		return '<div class="video-embed">' +
					'<div class="overlay">' +
						'<iframe src="' + makeVideoUrl(self.model.url) + '"	frameborder="0"></iframe>' +
					'</div>' +
				'</div>';
	};

})();
var EntityEmbed = EntityEmbed || {};

;(function(){
	// Creates an embed modal using the embedModalDefaults.js and any options that a user specifies
	$.embed_modal_create = function(options){
		var	defaults = {
			modalOptions: {
			},							//see modal.js to customize if embedModalDefaults.js is insufficient
			modalScope: {								// default scope to pass to the modal
				$embedTypeSelect: null,					// jQuery element for the embed type dropdown (<select> element)
				$modalBody: null,						// jQuery element for the modal body container element
				$abortEl: null							// jQuery element for the modal abort button
			},
			$modalEl: null,								// element that modal.js establishes a ctrl on
			modalHtmlLocation: 'modal/',				// file path to the modal HTML folder
			modalContainer: 'body',						// selector string for the element which will contain the modal
			modalFileName: 'modal_main.html',			// file name of the modal HTML file
			modalElId: 'embed-modal',
			modalBody: '.embed-modal-body',
			abortEl: '#btn-abort-modal',
			completeEl: '#btn-save-modal',
			embedTypeSelect: '#select-embed-type',
			authToken: null,							// auth_token for the apiService
			domainName: null,							// domainName for the apiService
			embedTypes:{								// specify all embed types and their options here
				image:{},								// TODO : allow global specification of embed types without hardcoding defaults
				slideshow: {},
				video:{},
				audio:{},
				twitter:{},
				instagram:{},
				facebook:{},
				relatedLink:{},
				externalLink:{},
				globalBuzz:{},
				newsletterSubscribe:{},
				iframe:{},
				customText:{}
			}
		};
		var embedTypes = [];
		var promise = $.Deferred();
		var modalScope, $modalContainer, $modalEl, $modalElTemp, templatePath, opts, parentModalEmbedType;

		function setUpModal(){
			var embedModalDefaults;

			// we cant specify certain elements as default options
			// because they may not be loaded until after the configured main tmeplate files is loaded
			// so if they are null, select them here

			// Embed Type Select Input
			if (!modalScope.$embedTypeSelect || !modalScope.$embedTypeSelect.length)
			{
				modalScope.$embedTypeSelect = $modalEl.find(options.embedTypeSelect);
			}

			// Modal Body Container
			if (!modalScope.$modalBody || !modalScope.$modalBody.length)
			{
				modalScope.$modalBody = $modalEl.find(options.modalBody);
			}

			// Modal Abort Button
			if (!options.modalOptions.$abortEl || !options.modalOptions.$abortEl.length)
			{
				options.modalOptions.$abortEl = $modalEl.find(options.abortEl);
			}

			// Modal Complete Button
			if (!options.modalOptions.$completeEl || !options.modalOptions.$completeEl.length)
			{
				options.modalOptions.$completeEl = $modalEl.find(options.completeEl);
			}

			embedModalDefaults = new EntityEmbed.embedModalDefaults();

			options.modalOptions = $.extend(true, {}, embedModalDefaults, options.modalOptions);

			// Setup modal on $modalEl with updated modalOptions and modalScope
			$modalEl.modal(options.modalOptions, modalScope);

			$modalEl.hide();

			// Modal elements is ready
			promise.resolve($modalEl);
		};

		// Extend default options with passed options
		opts = $.extend(true, {}, defaults, options);

		// Get parent modals current embed type
		if(opts.modalOptions && opts.modalOptions.parentModal)
		{
			parentModalEmbedType = opts.modalOptions.parentModal.scope.currentEmbedType;
		}

		// Make sure to only use embedTypes configed on options, if applicable.
		// Don't want to include all defaults in case this is a submodal, to prevent infinit init loop.
		opts.embedTypes = !!options && options.embedTypes;

		// if no options were configured, use the default types
		if(!opts.embedTypes)
		{
			opts.embedTypes = defaults.embedTypes;
		}

		// Remove parent modals embed type from local embed types to prevent modal-seption.
		if(!!parentModalEmbedType)
		{
			delete opts.embedTypes[parentModalEmbedType.name];
		}

		options = opts;

		// Establish modal container element
		$modalContainer = $(options.modalContainer);

		// Get modal element from:
		// 	1. options object
		// 	2. Query modal container for element with configured id
		$modalEl = options.$modalEl && options.$modalEl.length ? options.$modalEl : $modalContainer.find('#' + options.modalElId);

		if(!$modalEl.length)
		{
			// Generate a modal element when one was not found
			$modalEl = $('<div class="embed-modal" id="' + options.modalElId +'"></div>');
			// Append modal element to modal container
			$modalContainer.append($modalEl);
		}

		modalScope = $modalEl.data('scope');

		// Check our modalExists flag
		if(modalScope)
		{
			// Already created modal.
			// Resolve and return promise.
			promise.resolve($modalEl);
			return promise;
		}

		modalScope = {
			$modalEl: $modalEl
		};

		//// [1] Init embed types
		// Init each embed type and add to local embedTypes array
		for (var embedName in EntityEmbed.embedTypes)
		{
			if (!!options.embedTypes[embedName])
			{
				var embedObject = new EntityEmbed.embedTypes[embedName](options.embedTypes[embedName]);
				embedTypes.push(embedObject);

				if(options.modalOptions.embedTypeStr && options.modalOptions.embedTypeStr === embedName)
				{
					modalScope.currentEmbedType = embedObject;
				}
			}
		}

		// Sort mebed types by their orderIndex
		embedTypes.sort(function(l, r){
			return l.orderIndex - r.orderIndex;
		});

		// Attach embedTypes array to our various configs for use later on
		modalScope.embedTypes = embedTypes;
		//// END [1]

		//// [2] Establish modal containers
		// Extend options modalScope with local modalScope
		modalScope = $.extend(true, {}, options.modalScope, modalScope);
		modalScope.modalHtmlLocation = options.modalHtmlLocation;

		// Add reference to $modalEl to global EntityEmbed
		EntityEmbed.$embedModal = $modalEl;
		EntityEmbed.modalExists = true;

		if (!!options.authToken)
		{
			EntityEmbed.apiService.setAuthToken(options.authToken);
		}
		if (!!options.domainName)
		{
			EntityEmbed.apiService.setDomainName(options.domainName);
		}

		// Check to see if we need to load anything into $modalEl
		if(options.modalFileName)
		{
			templatePath = options.modalHtmlLocation + options.modalFileName;

			// Check to if there is a cached template for this template path
			if(EntityEmbed.templateCache && EntityEmbed.templateCache[templatePath])
			{
				// Set $modalEl html to the value of the template cache
				$modalEl.html( EntityEmbed.templateCache[templatePath] );

				setUpModal();
			}
			else
			{
				$modalEl.load(templatePath, function(responseText, textStatus, xhr){

					console.log('embed modal load completed with status: ' + textStatus);

					if (textStatus === 'error')
					{
						promise.reject();
						return;
					}

					// Add template to template cache
					EntityEmbed.templateCache = EntityEmbed.templateCache || {};
					EntityEmbed.templateCache[templatePath] = $(this).html();

					setUpModal();
				});
			}
		}
		else
		{
			setUpModal();
		}
		// END [2]

		return promise;
	};

	function embedModalOpenInternal($embedModal, options){
		var mType;

		if (!!options.id || options.embedData)
		{
			mType = EntityEmbed.embedModalTypes.edit;
		}
		else if (!!options.embedTypeStr)
		{
			if (options.selectExisting)
			{
				mType = EntityEmbed.embedModalTypes.selectExistingSingle;
			}
			else
			{
				mType = EntityEmbed.embedModalTypes.addSingle;
			}
		}
		else
		{
			if (options.selectExisting)
			{
				mType = EntityEmbed.embedModalTypes.selectExisting;
			}
			else
			{
				mType = EntityEmbed.embedModalTypes.add;
			}
		}

		var scope = {
			$currentEditorLocation: options.$currentEditorLocation,
			modalType: mType,
			addOnly: options.addOnly,
			embedId: options.id,
			embedType: options.embedTypeStr,
			parentModal: options.parentModal,
			buffered: options.bufferData,
			embedData: options.embedData,
			headerText: options.headerText
		};

		return $embedModal.openModal(scope);
	};

	$.embed_modal_open = function(options){
		var defaults = {
			$currentEditorLocation: $(''),		// selector for the current editor location (can be null or empty)
			embedTypeStr: null,					// string for the embed type (match object_type field) (can be null)
												//		null - add any
												//		not null - add single or edit (if id is also specified)
			id: null,
			selectExisting: false,
			addOnly: false
		};
		var promise = $.Deferred();

		$.embed_modal_create(options)
			.done(function($embedModal){
				embedModalOpenInternal($embedModal, $.extend(true, {}, defaults, options.modalOptions || {}))
					.done(function(data) {
						promise.resolve(data);
					})
					.fail(function() {
						promise.reject();
					});
			});

		return promise;
	};
})();
var EntityEmbed = EntityEmbed || {};

;(function ($, window, document, undefined) {

	'use strict';

	/** Default values */
	var pluginName = 'mediumInsert',
		addonName = 'EntityEmbeds', // name of the Medium Editor Insert Plugin
		activeEmbedClass = 'entity-embed-active',	// class name given to active (selected) embeds
		embedDragHandle = '',
		mediumEditorActiveSelector = '.medium-insert-active', // selector for the medium editor active class
		activeEmbedClass = 'entity-embed-active',	// class name given to active (selected) embeds
		entityEmbedEditorLineClass = 'entity-embed-editor-line', // class name given to a line (<p> element) in the editor on which an entity is embedded
		entityEmbedContainerClass = 'entity-embed-container', // class name given to the objects which contain entity embeds
		defaults = {
			label: '<span class="fa fa-code"></span>',
			authToken: null,	// for the apiService
			domainName: null,	// for the apiService
			styles: {
				left: {
					label: '<span class="fa fa-align-left"></span>',
					added: function ($el) {
						$el.addClass('clearfix');
					},
					removed: function ($el) {
						$el.removeClass('clearfix');
					}
				},
				center: {
					label: '<span class="fa fa-align-center"></span>'
					// added: function ($el) {},
					// removed: function ($el) {}
				},
				right: {
					label: '<span class="fa fa-align-right"></span>',
					added: function ($el) {
						$el.addClass('clearfix');
					},
					removed: function ($el) {
						$el.removeClass('clearfix');
					}
				},
				wide: {
					label: '<span class="fa fa-align-justify"></span>'
					// added: function ($el) {},
					// removed: function ($el) {}
				}
			},
			actions: {
				remove: {
					label: '<span class="fa fa-times"></span>',
					clicked: function (entityEmbed, $embed) {
						entityEmbed.removeEmbed($embed);
					}
				},
				edit:{
					label: '<span class="fa fa-cog"></span>',
					clicked: function(entityEmbed, $embed){
						entityEmbed.editEmbed($embed);
					}
				},
				newline:{
					label: '<span class="fa fa-i-cursor"></span>',
					clicked: function(entityEmbed, $embed){
						entityEmbed.addNewline($embed);
					}
				}
			}
		};

	/**
	 * Private method to generate unique placeholder string for serialization.
	 *  This string should:
	 *  		- be recreate able during deserialization using models in the embeds array.
	 *  		- be unique to the point that users would not accidentally enter content that could be interpreted as a placeholder.
	 *  		- namespace to our addon to not conflict with others that may have had the same idea.
	 *  		- provide an explicite identifier for the embed to be inserted.
	 *  		- provide index pointer so styling data can be preserved in cases where the same embed is place multiple times but styled differently.
	 * @param  {Object} embed Embed model data. Should contain keys:
	 *                        id - Embed's API object_id
	 *                        index: Nth position it was found in the content
	 * @return {String}       Placeholder string unique the the embed being serialized/inserted
	 */
	function generatePlaceholderString(embed) {
		var placeholder, placeholderKey,
			placeholderPrefix = '[[',
			placeholderSuffix = ']]';

		// Construct our placeholder key string
		placeholderKey = [
			addonName,
			embed.index,
			embed.id
		].join(':');

		// Construct placeholder by wrapping with prefix and suffix
		placeholder = [
			placeholderPrefix,
			placeholderKey,
			placeholderSuffix
		].join('');

		return placeholder;
	}

	/**
	 * Private function to get a clopy of an embed type object by object_type value.
	 * @param  {String} objectType API object_type name
	 * @return {Object}            Initialized embed type object from EntityEmbed.currentEmbedTypes or undefined if not found.
	 */
	function getEmbedTypeByObjectType(objectType, embedTypes) {
		var embedType = $.grep(embedTypes, function(et){
			return et.options.object_type == objectType;
		})[0];

		return embedType && $.extend(true, {}, embedType);
	}

	function getSelection() {
		var selection;

		if (window.getSelection)
		{
			selection = window.getSelection();
		}
		else if (document.getSelection)
		{
			selection = document.getSelection();
		}
		else if (document.selection)
		{
			selection = document.selection.createRange();
		}

		return selection;
	}

	function moveCaretToEdge(el, atStart) {
		var range, sel;

		el.focus();

		if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
			range = document.createRange();
			sel = window.getSelection();

			range.selectNodeContents(el);
			range.collapse(atStart);

			sel.removeAllRanges();
			sel.addRange(range);
		} else if (typeof document.body.createTextRange != "undefined") {
			range = document.body.createTextRange();

			range.moveToElementText(el);
			range.collapse(atStart);
			range.select();
		}
	}

	/**
	 * Custom Addon object
	 *
	 * Sets options, variables and calls init() function
	 *
	 * @constructor
	 * @param {DOM} el - DOM element to init the plugin on
	 * @param {object} options - Options to override defaults
	 * @return {void}
	 */

	function EntityEmbeds (el, options) {
		var self = this;

		self.el = el;
		self.$el = $(el);
		self.templates = window.MediumInsert.Templates;

		self.core = self.$el.data('plugin_'+ pluginName);

		self.options = $.extend(true, {}, defaults, options);

		self._defaults = defaults;
		self._name = pluginName;

		self.toolbarManager = new EntityEmbed.toolbarManager(self, self.options.styles, self.options.actions, activeEmbedClass);

		// Extend editor's functions
		if (self.core.getEditor())
		{
			// allow access the EntityEmbeds object by keeping the object on this prototype
			self.core.getEditor().get_content = function(){
				return self.getContent();
			};
			self.core.getEditor().load_content = function(contentData){
				self.loadContent(contentData);
			};
		}

		self.init();
	}

	/**
	 * initialization
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.init = function () {
		var self = this;

		if (!!self.options.authToken)
		{
			EntityEmbed.apiService.setAuthToken(self.options.authToken);
		}
		if (!!self.options.domainName)
		{
			EntityEmbed.apiService.setDomainName(self.options.domainName);
		}

		self.toolbarManager.createActionToolbar($('body'));

		self.$el.sortable({
			handle: '.entity-embed-blocker',
			placeholder: 'entity-embed-placeholder',
			distance: 5,
			start: function (event, ui) {
				var placeholderClasses = [
					ui.placeholder.attr('class'),
					ui.helper.attr('class')
				].join(' ');

				// Update placeholder styling and size to match dragged embed
				ui.placeholder.attr('class', placeholderClasses);
				ui.placeholder.height(ui.helper.outerHeight());
				ui.placeholder.width(ui.helper.width());

				// Hide embed toolbars
				self.toolbarManager.hideToolbar();
			},
			stop: function(event, ui) {
				var $fig = ui.item.find('figure');
				var embed = $fig.data('embed');
				var embedHtml = EntityEmbed.embedModalDefaults.prototype.generateEmbedHtml(embed);
				var $embed = $(embedHtml);

				ui.item.height(ui.placeholder.height());
				$fig.html($embed.html());

				self.activateEmbed(embed);

				// Let listeners know content has changed
				self.core.triggerInput();

				window.setTimeout(function() {
					ui.item.removeAttr('style');
				}, 2000);
			},
			change: function() {
				// Update position of active MEIP toolbar
				self.core.positionButtons();
				// Updated postion of active ME toolbar
				self.core.getEditor().checkSelection();
			}
		});

		self.events();

		$.embed_modal_create().done(function($embedModal){
			var modalScope = $embedModal.data('scope');

			self.$embedModal = $embedModal;
			self.embedTypes = modalScope.embedTypes;

			for (var i = 0, m = self.embedTypes.length; i < m; i++)
			{
				self.toolbarManager.createStyleToolbar($('body'), self.embedTypes[i]);
			}
		});
	};

	/**
	 * Event listeners
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.events = function () {
		var self = this;
		var editor = editor = self.core.getEditor();

		function findTopParent($elm) {
			var $parent = $elm.parent();
			if($parent[0] !== self.el)
			{
				return findTopParent($parent);
			}

			return $elm;
		}

		editor.subscribe('editableInput', function(data, editableElm) {
			var badMarkup = [
				'p > ol',
				'p > ul',
				'p > p',
				'p > div'
			].join(',');
			var badStyleSttr = [
				'li > span[style]'
			].join(',');
			var emptyP = '<p><br></p>';
			var $elm = $(editableElm);
			var $badMarkup = $elm.find(badMarkup);
			var $hasStyleAttr = $elm.find(badStyleSttr);

			$badMarkup.each(function() {
				var $this = $(this);
				$this.unwrap();
				editor.selectElement(this);
			});

			$hasStyleAttr.removeAttr('style');

			$elm.find('div > br:only-child').parent().replaceWith(emptyP);

			if( !$elm.children().not('.medium-insert-buttons').length )
			{
				$elm.prepend(emptyP);
			}
		});

		$(window).on('resize', function() {
			var $currentActiveEmbed = $('.' + activeEmbedClass);
			self.toolbarManager.positionToolbars($currentActiveEmbed);
		});

		$(document)
			// hide toolbar (if active) when clicking anywhere except for toolbar elements
			.on('click', function(e){
				if (!$(e.target).is('.medium-editor-action') &&
					!$(e.target.parentElement).is('.medium-editor-action') &&
					self.$el.find('.' + activeEmbedClass).length != 0)
				{
					$('.' + activeEmbedClass).removeClass(activeEmbedClass);
					self.toolbarManager.hideToolbar();
				}
			});

		self.$el
			// toggle select embed when embed is clicked
			.on('click', '.' + entityEmbedContainerClass, function(e){
				self.toggleSelectEmbed($(this));
				e.stopPropagation(); // done allow the first onClick event to propagate
			})
			// prevent user from destroying modal functionality when deleting first element
			.on('keydown', function(e){
				var selection, range, textLength, selectionLength, numChildren, isEmptyAnchor, siblingIsEmbed, $anchor, $sibling, $base;
				var protectedElms = ['.entity-embed-container', '[contenteditable]'].join(',');
				var notProtectedElms = ':not(' + protectedElms + ')';

				// Don't do anything if key is not backspace (8) or delete (46)
				// or if caret is in a ext node of editor.
				if(e.which !== 8 && e.which !== 46)
				{
					return;
				}

				selection = getSelection(); // Get current selection

				if(!selection.rangeCount)
				{
					return;
				}

				range = selection.getRangeAt(0); // Get current selected range
				selectionLength = range.endOffset - range.startOffset; // Get length of current selection
				$anchor = $(selection.anchorNode); // Get the element the selection is currently originating from
				textLength = $anchor.text().length;
				numChildren = self.$el.children().not('.medium-insert-buttons').length; // Get number of editors children that are not UI for MEIP
				isEmptyAnchor = false;
				siblingIsEmbed = false;

				if (selectionLength > 0)
				{
					// When removing a range of charcters, the caret doesn't move positions.
					// We don't have to worry about removing a sibling embed now.
					return;
				}

				// If anchor is a text node, query for closest usable parent
				if($anchor[0].nodeType === 3)
				{
					$anchor = $anchor.closest(notProtectedElms);
				}

				$anchor = findTopParent($anchor);

				// Check to see if our anchor element is a p tag with no text
				isEmptyAnchor = $anchor.is(notProtectedElms) && !$anchor.text().length;

				// Get the previous sibling when
				// 	- Backspace is pressed
				// 	- Caret is at the begining of text
				// Get the next sibling when
				// 	- Delete is pressed
				// 	- Caret is at the end of text
				if (e.which === 8 && selection.anchorOffset === 0)
				{
					$sibling = $anchor.prev();
				}
				else if (e.which === 46 && selection.anchorOffset === textLength)
				{
					$sibling = $anchor.next();
				}

				// If we found a sibling, check to see if it is an embed wrapper
				if(!!$sibling)
				{
					siblingIsEmbed = $sibling.is('.' + entityEmbedContainerClass);
					// Make sure sibling has content. MeduimEditor will remove any empty elements up to and including
					if(!$sibling.children().length && !$sibling.text().length)
					{
						$sibling.append('<br>');
					}
				}

				// Prevent default when:
				// 	- Anchor is the last empty p tag
				// 	- A sipling element was found and is and embed
				if ( (isEmptyAnchor && numChildren <= 1) || siblingIsEmbed)
				{
					e.preventDefault();
				}

				//
				if(isEmptyAnchor && numChildren > 1)
				{
					e.preventDefault();

					if(e.which === 8)
					{
						$base = $anchor.prevAll(notProtectedElms).first();
					}
					else if(e.which === 46)
					{
						$base = $anchor.nextAll(notProtectedElms).first();
					}

					// Make sure base element has content so selection process works.
					if(!$base.children().length && !$base.text().length)
					{
						$base.append('<br>');
					}

					// Select the prev/next p's content
					editor.selectElement($base[0]);
					// Move caret to selection edge opision of caret movement from keypress
					moveCaretToEdge($base[0], e.which === 46);
					// Updated editors toolbar state
					editor.checkSelection();

					// Remove empty anchor element
					$anchor.remove();

					// Trigger input event
					self.core.triggerInput();
				}

			})
			// conditionally remove embed
			.on('keydown', function(e){
				// TODO : this will not be fired if the user highlights content and begins typing
				//			could use JQuery UI 'remove' event
				//			or we could just hide the toolbar on any key press
				if (e.which == 8 || e.which == 46) // backspace or delete
				{
					// TODO : this could hide toolbar on another selected embed
					if (self.$el.find('.' + activeEmbedClass).length != 0)
					{
						self.toolbarManager.hideToolbar();
					}
				}
			});
	};

	/**
	 * Get the Core object
	 *
	 * @return {object} Core object
	 */

	EntityEmbeds.prototype.getCore = function () {
		return this.core;
	};


	/**
	 * Get the story data from the editor and serialize it
     *
     * @return {object} Serialized data
     */

	EntityEmbeds.prototype.getContent = function() {
		var self = this;
		var data = self.core.getEditor().serialize();
		var cleanedData = {
			html: '',
			embeds: []
		};

		$.each(data, function(key){
			var $data, $embedContainers;

			$data = $('<div />').html(data[key].value);

			$embedContainers = $data.find('.entity-embed-container', $data);

			// Make sure active class from embed containers before serialization.
			$embedContainers.removeClass(activeEmbedClass);

			// jQuery has a builtin method to iterate over all match elements.
			// Callback is fired in the context of the current element, so the
			// keyword 'this' refers to the element, in this case our embed container.
			$embedContainers.each(function(index) {
				var $this, $embed, embed, placeholder;

				$this = $(this);

				// Find child figure element, which should hold embed's data attributes
				$embed = $this.find('figure');

				// jQuery.each() iteration loop can be stop by returning false. There is no continue equivelant,
				// so we nest our found embed logic in a truthy condition.
				if(!!$embed)
				{
					// Establish embed model
					embed = {
						// Include index expclicitly so reordering of the embeds array doesn't affect insertion.
						index: index,
						// API object_id used to look up complete data for the embed
						id: $embed.attr('id'),
						// Inlcude embed type name so embed can be rendered correctly during deserialization
						type: $embed.attr('data-embed-type')
					};

					// Add embed model to embeds list to be returned
					cleanedData.embeds.push(embed);

					// Construct our placeholder
					placeholder = generatePlaceholderString(embed);

					// Repace container's HTML with placeholder
					$this.html(placeholder);
				} else {
					// This container is missing a figure element and no longer has data to store.
					// Probably occured when a script error prevented proper serialization of embed.
					// Remove from data HTML to clean up DOM and save serilization steps and/or
					// errors later on.
					$this.remove();
				}
			});

			// Append resulting HTML to our returned model
			cleanedData.html += $data.html();
		});

		return cleanedData;
	 };

 	/**
	 * Extend editor to allow dynamic loading of content
	 *
	 * retrieves story by id and loads content into editor
     *
     * @return {void}
     */

	EntityEmbeds.prototype.loadContent = function(contentData) {
		var self = this,
			isString = (typeof contentData === 'string'),
			isHtml = isString && (/<[^>]>/g).test(contentData),
			fullHtml, embedType, usableEmbeds;

		function updateHtml(data) {
			var deferreds;

			if(!data)
			{
				setEditorHtml();
				return;
			}

			fullHtml = data.html || '';

			if(!data.embeds)
			{
				setEditorHtml();
				return;
			}

			usableEmbeds = [];
			deferreds = [];

			// Iterate over returned embeds
			for (var i = 0; i < data.embeds.length; i++)
			{
				// Convert returned type name to a useful embedType object
				embedType = getEmbedTypeByObjectType(data.embeds[i].type, self.embedTypes);

				if(!embedType)
				{
					// An embedType could not be found for this embed.
					// Skip this embed since it is unusable.
					continue;
				}

				embedType.model = embedType.cleanModel();

				data.embeds[i].embedType = embedType;

				// Send request for complete emebed data
				var promise = EntityEmbed.apiService.get({
					path: data.embeds[i].embedType.options.httpPaths.get,
					data: {
						object_id: data.embeds[i].id
					}
				});

				// associate callback to promise
				promise.done((function(embed) {
						// Encapsulate embed data by passing data.embeds[i] into self invoking function (See **EMBED** below).
						// The embed parameter should retain it's reference when the returned async function is fired.
						// Changes made to embed should bind out of the async function, but that is not required
						// since we append the modified embed object to our list of usable embeds to render once the
						// editors inner DOM has been created later on.
						return function(request){
							var embedHtml, placeholder;

							if (request.status === 'ERROR')
							{
								console.log('failed to get embed object!');
								return request;
							}

							// Update embed model with API data
							embed.embedType.model = request.response;

							// Add embed to our list of usable embeds
							usableEmbeds.push(embed);

							// Construct placeholder string
							placeholder = generatePlaceholderString(embed);

							// Generate the embed HTML
							embedHtml = EntityEmbed.embedModalDefaults.prototype.generateEmbedHtml(embed.embedType, false);

							// Replace placeholder string in full story HTML with the embed HTML
							// A quick split and join should work since our placeholder string is unique to:
							// 		- our addon (eg. addonName)
							// 		- the embed being inserted (eg. embed.id)
							// 		- the position the embed is inserted (embed.index)
							fullHtml = fullHtml.split(placeholder).join(embedHtml);
						};
					})(data.embeds[i])); // **EMBED**

				// add the promise to our deferreds list.
				deferreds.push(promise);
			}

			// execute this function when all the AJAX calls to get embed types are done
			$.when.apply($, deferreds).done(function(){
				var embed, $embed, innerHtml;
				var done = {};

				// Each of our deferreds should have updated the full story HTML with embed HTML.
				// Set editor content to establish a DOM tree to work with.
				setEditorHtml();

				// Fix for Issue #164: Reattach embed HTML to an existing DOM, similar to adding/editing an embed while editing.
				// Iterate over usable embeds
				for (var i = 0; i < usableEmbeds.length; i++)
				{
					// Get reference to embed at this index
					embed = usableEmbeds[i];

					// We only need to do reattach HTML once for embed id. Make sure an embed with this id
					// hasn't already been reattached.
					if(!done[embed.id])
					{
						// Set a flag to skip id's that have already been reattached.
						done[embed.id] = true;

						// Find all embed wrapper elements with this ID.
						$embed = self.$el.find('[id="' + embed.id + '"]');

						innerHtml = $embed.html();

						// Find embeds placeholder element and replcae it with embed HTML
						$embed.html(innerHtml);

						// Fire embedType's activateEmbed method
						self.addEmbed($embed, embed.embedType, true);
					}
				}
			});
		}

		function setEditorHtml() {
			self.core.getEditor().setContent(fullHtml);
			self.$el.sortable('refresh');
		}

		if(!contentData)
		{
			console.log('Must provide either story id or serialized story data.');
			return;
		}

		fullHtml = !isString ? contentData.html : isHtml ? contentData : '';

		if(isString && !isHtml)
		{
			EntityEmbed.apiService.get({
					path: 'admin/embed/edit', // TODO : not hardcode
					data: {
						object_id : contentData
					}
				})
				.done(function(data){
					if (data.status === 'ERROR')
					{
						console.log('Failed to get story with id ' + contentData);
						return;
					}

					updateHtml(data.repsonse);
				})
				.fail(function(data){
					console.log('Failed to get story with id ' + contentData);
				});
		}
		else
		{
			updateHtml(contentData);
		}
	};


	/**
	 * Add embed
	 *
	 * This function is called when a user click on the + icon
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.add = function () {
		var self = this;
		var addToScope = {
			modalOptions: {
				$currentEditorLocation: $(mediumEditorActiveSelector)
			}
		};
		$.embed_modal_open(addToScope)
			.done(function(respData) {
				self.addEmbed(respData.$embed, respData.embedType);
			});
	};

	/**
	 * Edit embed
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.editEmbed = function ($embed) {
		var self = this;
		var embedId = $embed.find('figure').attr('id');
		var scope = {
			modalOptions: {
				$currentEditorLocation: $('.' + activeEmbedClass),
				id: embedId,
				embedTypeStr: $embed.find('[data-embed-type]').attr('data-embed-type')
			}
		};

		self.toolbarManager.hideToolbar();

		$.embed_modal_open(scope)
			.done(function(respData) {
				var $embeds = $('[id=' + embedId + ']', self.$el);
				var embed = $.extend(true, {}, respData.embedType);

				$embeds.each(function() {
					var $this = $(this);
					var embedHtml = EntityEmbed.embedModalDefaults.prototype.generateEmbedHtml(embed);
					var $embed = $(embedHtml);

					$this.data('embed', embed);

					$this.html($embed.html());
				});

				self.activateEmbed(embed);

				self.core.triggerInput();
			});
	};

	/**
	 * Remove custom content
	 *
	 * This function is called when a user removes an entity embed
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.removeEmbed = function ($embed) {
		var self = this;
		self.toolbarManager.hideToolbar();
		$embed.remove();
		self.core.triggerInput();
	};

	/**
	 * Add a new line before and after an embed
	 *
	 * Sometimes this cannot be done with the cursor, so this toolbar button is important
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.addNewline = function ($embed) {
		var self = this;
		var newline = '<p><br></p>';
		// TODO : check if there is already a newline before / after
		$embed.before(newline);
		$embed.after(newline);
		self.toolbarManager.positionToolbars($embed);
	};

	/**
	 * Toggles embed selection
	 *
	 * Selected embeds have a toolbar over them
	 *
	 * @returns {void}
	 */

	EntityEmbeds.prototype.toggleSelectEmbed = function ($embed) {
		var self = this;
		var $currentActiveEmbed = $('.' + activeEmbedClass);
		var embedObjectType = $embed.find('[data-embed-type]').attr('data-embed-type');
		var embedType = getEmbedTypeByObjectType(embedObjectType, self.embedTypes);

		// hide current toolbars and deactive any active embed
		self.toolbarManager.hideToolbar();
		$currentActiveEmbed.toggleClass(activeEmbedClass);

		// activate this embed
		$embed.toggleClass(activeEmbedClass);

		if (!!self.options.actions)
		{
			if ($embed.hasClass(activeEmbedClass))
			{
				self.toolbarManager.showToolbars($embed, embedType.name);
			}
			else
			{
				self.toolbarManager.hideToolbar();
			}
		}
	};

	/**
	 * Add custom content
	 *
	 * This function is called when a user completes the entity embed modal
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.addEmbed = function ($embedContainer, embed, skipInputEvent) {
		var self = this;
		var buttonAction = embed.defaultStyle.replace('entity-embed-', '');
		var $embed;

		if($embedContainer.is('figure'))
		{
			$embedContainer = $embedContainer.closest('.' + entityEmbedContainerClass);
		}

		$embed = $embedContainer.find('figure');

		// apply the default styling to the embed that was just added
		self.toolbarManager.addStyle($embedContainer, embed.defaultStyle, buttonAction, false);

		$('[id="' + embed.model.object_id + '"]', self.$el).data('embed', $.extend(true, {}, embed));

		self.activateEmbed(embed);

		self.$el.sortable('refresh');

		self.core.hideButtons();

		if(!skipInputEvent)
		{
			self.core.triggerInput();
		}
	};

	/**
	 * Run an embed's acticateEMbed method if it has one.
	 *
	 * This function should be called after embed HTML has been inserted into the editor content.
	 *
	 * @return {void}
	 */

	EntityEmbeds.prototype.activateEmbed = function(embed) {
		var embedType = embed.embedType || embed;

		// Make sure activeEmbed is a function
		if(typeof embedType.activateEmbed === 'function')
		{
			embedType.activateEmbed();
		}
	}

	/** Addon initialization */

	$.fn[pluginName + addonName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName + addonName)) {
				$.data(this, 'plugin_' + pluginName + addonName, new EntityEmbeds(this, options));
			}
		});
	};

})(jQuery, window, document);
/*
 * easy-autocomplete
 * jQuery plugin for autocompletion
 * 
 * @author Łukasz Pawełczak (http://github.com/pawelczak)
 * @version 1.3.5
 * Copyright  License: 
 */

var EasyAutocomplete=function(a){return a.Configuration=function(a){function b(){if("xml"===a.dataType&&(a.getValue||(a.getValue=function(a){return $(a).text()}),a.list||(a.list={}),a.list.sort||(a.list.sort={}),a.list.sort.method=function(b,c){return b=a.getValue(b),c=a.getValue(c),c>b?-1:b>c?1:0},a.list.match||(a.list.match={}),a.list.match.method=function(a,b){return a.search(b)>-1}),void 0!==a.categories&&a.categories instanceof Array){for(var b=[],c=0,d=a.categories.length;d>c;c+=1){var e=a.categories[c];for(var f in h.categories[0])void 0===e[f]&&(e[f]=h.categories[0][f]);b.push(e)}a.categories=b}}function c(){function b(a,c){var d=a||{};for(var e in a)void 0!==c[e]&&null!==c[e]&&("object"!=typeof c[e]||c[e]instanceof Array?d[e]=c[e]:b(a[e],c[e]));return void 0!==c.data&&null!==c.data&&"object"==typeof c.data&&(d.data=c.data),d}h=b(h,a)}function d(){if("list-required"!==h.url&&"function"!=typeof h.url){var b=h.url;h.url=function(){return b}}if(void 0!==h.ajaxSettings.url&&"function"!=typeof h.ajaxSettings.url){var b=h.ajaxSettings.url;h.ajaxSettings.url=function(){return b}}if("string"==typeof h.listLocation){var c=h.listLocation;"XML"===h.dataType.toUpperCase()?h.listLocation=function(a){return $(a).find(c)}:h.listLocation=function(a){return a[c]}}if("string"==typeof h.getValue){var d=h.getValue;h.getValue=function(a){return a[d]}}void 0!==a.categories&&(h.categoriesAssigned=!0)}function e(){void 0!==a.ajaxSettings&&"object"==typeof a.ajaxSettings?h.ajaxSettings=a.ajaxSettings:h.ajaxSettings={}}function f(a){return void 0!==h[a]&&null!==h[a]}function g(a,b){function c(b,d){for(var e in d)void 0===b[e]&&a.log("Property '"+e+"' does not exist in EasyAutocomplete options API."),"object"==typeof b[e]&&-1===$.inArray(e,i)&&c(b[e],d[e])}c(h,b)}var h={data:"list-required",url:"list-required",dataType:"json",listLocation:function(a){return a},xmlElementName:"",getValue:function(a){return a},autocompleteOff:!0,placeholder:!1,ajaxCallback:function(){},matchResponseProperty:!1,list:{sort:{enabled:!1,method:function(a,b){return a=h.getValue(a),b=h.getValue(b),b>a?-1:a>b?1:0}},maxNumberOfElements:6,hideOnEmptyPhrase:!0,match:{enabled:!1,caseSensitive:!1,method:function(a,b){return a.search(b)>-1}},showAnimation:{type:"normal",time:400,callback:function(){}},hideAnimation:{type:"normal",time:400,callback:function(){}},onClickEvent:function(){},onSelectItemEvent:function(){},onLoadEvent:function(){},onChooseEvent:function(){},onKeyEnterEvent:function(){},onMouseOverEvent:function(){},onMouseOutEvent:function(){},onShowListEvent:function(){},onHideListEvent:function(){}},highlightPhrase:!0,theme:"",cssClasses:"",minCharNumber:0,requestDelay:0,adjustWidth:!0,ajaxSettings:{},preparePostData:function(a,b){return a},loggerEnabled:!0,template:"",categoriesAssigned:!1,categories:[{maxNumberOfElements:4}]},i=["ajaxSettings","template"];this.get=function(a){return h[a]},this.equals=function(a,b){return!(!f(a)||h[a]!==b)},this.checkDataUrlProperties=function(){return"list-required"!==h.url||"list-required"!==h.data},this.checkRequiredProperties=function(){for(var a in h)if("required"===h[a])return logger.error("Option "+a+" must be defined"),!1;return!0},this.printPropertiesThatDoesntExist=function(a,b){g(a,b)},b(),c(),h.loggerEnabled===!0&&g(console,a),e(),d()},a}(EasyAutocomplete||{}),EasyAutocomplete=function(a){return a.Logger=function(){this.error=function(a){console.log("ERROR: "+a)},this.warning=function(a){console.log("WARNING: "+a)}},a}(EasyAutocomplete||{}),EasyAutocomplete=function(a){return a.Constans=function(){var a={CONTAINER_CLASS:"easy-autocomplete-container",CONTAINER_ID:"eac-container-",WRAPPER_CSS_CLASS:"easy-autocomplete"};this.getValue=function(b){return a[b]}},a}(EasyAutocomplete||{}),EasyAutocomplete=function(a){return a.ListBuilderService=function(a,b){function c(b,c){function d(){var d,e={};return void 0!==b.xmlElementName&&(e.xmlElementName=b.xmlElementName),void 0!==b.listLocation?d=b.listLocation:void 0!==a.get("listLocation")&&(d=a.get("listLocation")),void 0!==d?"string"==typeof d?e.data=$(c).find(d):"function"==typeof d&&(e.data=d(c)):e.data=c,e}function e(){var a={};return void 0!==b.listLocation?"string"==typeof b.listLocation?a.data=c[b.listLocation]:"function"==typeof b.listLocation&&(a.data=b.listLocation(c)):a.data=c,a}var f={};if(f="XML"===a.get("dataType").toUpperCase()?d():e(),void 0!==b.header&&(f.header=b.header),void 0!==b.maxNumberOfElements&&(f.maxNumberOfElements=b.maxNumberOfElements),void 0!==a.get("list").maxNumberOfElements&&(f.maxListSize=a.get("list").maxNumberOfElements),void 0!==b.getValue)if("string"==typeof b.getValue){var g=b.getValue;f.getValue=function(a){return a[g]}}else"function"==typeof b.getValue&&(f.getValue=b.getValue);else f.getValue=a.get("getValue");return f}function d(b){var c=[];return void 0===b.xmlElementName&&(b.xmlElementName=a.get("xmlElementName")),$(b.data).find(b.xmlElementName).each(function(){c.push(this)}),c}this.init=function(b){var c=[],d={};return d.data=a.get("listLocation")(b),d.getValue=a.get("getValue"),d.maxListSize=a.get("list").maxNumberOfElements,c.push(d),c},this.updateCategories=function(b,d){if(a.get("categoriesAssigned")){b=[];for(var e=0;e<a.get("categories").length;e+=1){var f=c(a.get("categories")[e],d);b.push(f)}}return b},this.convertXml=function(b){if("XML"===a.get("dataType").toUpperCase())for(var c=0;c<b.length;c+=1)b[c].data=d(b[c]);return b},this.processData=function(c,d){for(var e=0,f=c.length;f>e;e+=1)c[e].data=b(a,c[e],d);return c},this.checkIfDataExists=function(a){for(var b=0,c=a.length;c>b;b+=1)if(void 0!==a[b].data&&a[b].data instanceof Array&&a[b].data.length>0)return!0;return!1}},a}(EasyAutocomplete||{}),EasyAutocomplete=function(a){return a.proccess=function(b,c,d){function e(a,c){var d=[],e="";if(b.get("list").match.enabled)for(var g=0,h=a.length;h>g;g+=1)e=b.get("getValue")(a[g]),f(e,c)&&d.push(a[g]);else d=a;return d}function f(a,c){return b.get("list").match.caseSensitive||("string"==typeof a&&(a=a.toLowerCase()),c=c.toLowerCase()),!!b.get("list").match.method(a,c)}function g(a){return void 0!==c.maxNumberOfElements&&a.length>c.maxNumberOfElements&&(a=a.slice(0,c.maxNumberOfElements)),a}function h(a){return b.get("list").sort.enabled&&a.sort(b.get("list").sort.method),a}a.proccess.match=f;var i=c.data,j=d;return i=e(i,j),i=g(i),i=h(i)},a}(EasyAutocomplete||{}),EasyAutocomplete=function(a){return a.Template=function(a){var b={basic:{type:"basic",method:function(a){return a},cssClass:""},description:{type:"description",fields:{description:"description"},method:function(a){return a+" - description"},cssClass:"eac-description"},iconLeft:{type:"iconLeft",fields:{icon:""},method:function(a){return a},cssClass:"eac-icon-left"},iconRight:{type:"iconRight",fields:{iconSrc:""},method:function(a){return a},cssClass:"eac-icon-right"},links:{type:"links",fields:{link:""},method:function(a){return a},cssClass:""},custom:{type:"custom",method:function(){},cssClass:""}},c=function(a){var c,d=a.fields;return"description"===a.type?(c=b.description.method,"string"==typeof d.description?c=function(a,b){return a+" - <span>"+b[d.description]+"</span>"}:"function"==typeof d.description&&(c=function(a,b){return a+" - <span>"+d.description(b)+"</span>"}),c):"iconRight"===a.type?("string"==typeof d.iconSrc?c=function(a,b){return a+"<img class='eac-icon' src='"+b[d.iconSrc]+"' />"}:"function"==typeof d.iconSrc&&(c=function(a,b){return a+"<img class='eac-icon' src='"+d.iconSrc(b)+"' />"}),c):"iconLeft"===a.type?("string"==typeof d.iconSrc?c=function(a,b){return"<img class='eac-icon' src='"+b[d.iconSrc]+"' />"+a}:"function"==typeof d.iconSrc&&(c=function(a,b){return"<img class='eac-icon' src='"+d.iconSrc(b)+"' />"+a}),c):"links"===a.type?("string"==typeof d.link?c=function(a,b){return"<a href='"+b[d.link]+"' >"+a+"</a>"}:"function"==typeof d.link&&(c=function(a,b){return"<a href='"+d.link(b)+"' >"+a+"</a>"}),c):"custom"===a.type?a.method:b.basic.method},d=function(a){return a&&a.type&&a.type&&b[a.type]?c(a):b.basic.method},e=function(a){var c=function(){return""};return a&&a.type&&a.type&&b[a.type]?function(){var c=b[a.type].cssClass;return function(){return c}}():c};this.getTemplateClass=e(a),this.build=d(a)},a}(EasyAutocomplete||{}),EasyAutocomplete=function(a){return a.main=function(b,c){function d(){return 0===t.length?void p.error("Input field doesn't exist."):o.checkDataUrlProperties()?o.checkRequiredProperties()?(e(),void g()):void p.error("Will not work without mentioned properties."):void p.error("One of options variables 'data' or 'url' must be defined.")}function e(){function a(){var a=$("<div>"),c=n.getValue("WRAPPER_CSS_CLASS");o.get("theme")&&""!==o.get("theme")&&(c+=" eac-"+o.get("theme")),o.get("cssClasses")&&""!==o.get("cssClasses")&&(c+=" "+o.get("cssClasses")),""!==q.getTemplateClass()&&(c+=" "+q.getTemplateClass()),a.addClass(c),t.wrap(a),o.get("adjustWidth")===!0&&b()}function b(){var a=t.outerWidth();t.parent().css("width",a)}function c(){t.unwrap()}function d(){var a=$("<div>").addClass(n.getValue("CONTAINER_CLASS"));a.attr("id",f()).prepend($("<ul>")),function(){a.on("show.eac",function(){switch(o.get("list").showAnimation.type){case"slide":var b=o.get("list").showAnimation.time,c=o.get("list").showAnimation.callback;a.find("ul").slideDown(b,c);break;case"fade":var b=o.get("list").showAnimation.time,c=o.get("list").showAnimation.callback;a.find("ul").fadeIn(b),c;break;default:a.find("ul").show()}o.get("list").onShowListEvent()}).on("hide.eac",function(){switch(o.get("list").hideAnimation.type){case"slide":var b=o.get("list").hideAnimation.time,c=o.get("list").hideAnimation.callback;a.find("ul").slideUp(b,c);break;case"fade":var b=o.get("list").hideAnimation.time,c=o.get("list").hideAnimation.callback;a.find("ul").fadeOut(b,c);break;default:a.find("ul").hide()}o.get("list").onHideListEvent()}).on("selectElement.eac",function(){a.find("ul li").removeClass("selected"),a.find("ul li").eq(w).addClass("selected"),o.get("list").onSelectItemEvent()}).on("loadElements.eac",function(b,c,d){var e="",f=a.find("ul");f.empty().detach(),v=[];for(var h=0,i=0,k=c.length;k>i;i+=1){var l=c[i].data;if(0!==l.length){void 0!==c[i].header&&c[i].header.length>0&&f.append("<div class='eac-category' >"+c[i].header+"</div>");for(var m=0,n=l.length;n>m&&h<c[i].maxListSize;m+=1)e=$("<li><div class='eac-item'></div></li>"),function(){var a=m,b=h,f=c[i].getValue(l[a]);e.find(" > div").on("click",function(){t.val(f).trigger("change"),w=b,j(b),o.get("list").onClickEvent(),o.get("list").onChooseEvent()}).mouseover(function(){w=b,j(b),o.get("list").onMouseOverEvent()}).mouseout(function(){o.get("list").onMouseOutEvent()}).html(q.build(g(f,d),l[a]))}(),f.append(e),v.push(l[m]),h+=1}}a.append(f),o.get("list").onLoadEvent()})}(),t.after(a)}function e(){t.next("."+n.getValue("CONTAINER_CLASS")).remove()}function g(a,b){return o.get("highlightPhrase")&&""!==b?i(a,b):a}function h(a){return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}function i(a,b){var c=h(b);return(a+"").replace(new RegExp("("+c+")","gi"),"<b>$1</b>")}t.parent().hasClass(n.getValue("WRAPPER_CSS_CLASS"))&&(e(),c()),a(),d(),u=$("#"+f()),o.get("placeholder")&&t.attr("placeholder",o.get("placeholder"))}function f(){var a=t.attr("id");return a=n.getValue("CONTAINER_ID")+a}function g(){function a(){s("autocompleteOff",!0)&&n(),b(),c(),d(),e(),f(),g()}function b(){t.focusout(function(){var a,b=t.val();o.get("list").match.caseSensitive||(b=b.toLowerCase());for(var c=0,d=v.length;d>c;c+=1)if(a=o.get("getValue")(v[c]),o.get("list").match.caseSensitive||(a=a.toLowerCase()),a===b)return w=c,void j(w)})}function c(){t.off("keyup").keyup(function(a){function b(a){function b(){var a={},b=o.get("ajaxSettings")||{};for(var c in b)a[c]=b[c];return a}function c(a,b){return o.get("matchResponseProperty")!==!1?"string"==typeof o.get("matchResponseProperty")?b[o.get("matchResponseProperty")]===a:"function"==typeof o.get("matchResponseProperty")?o.get("matchResponseProperty")(b)===a:!0:!0}if(!(a.length<o.get("minCharNumber"))){if("list-required"!==o.get("data")){var d=o.get("data"),e=r.init(d);e=r.updateCategories(e,d),e=r.processData(e,a),k(e,a),t.parent().find("li").length>0?h():i()}var f=b();void 0!==f.url&&""!==f.url||(f.url=o.get("url")),void 0!==f.dataType&&""!==f.dataType||(f.dataType=o.get("dataType")),void 0!==f.url&&"list-required"!==f.url&&(f.url=f.url(a),f.data=o.get("preparePostData")(f.data,a),$.ajax(f).done(function(b){var d=r.init(b);d=r.updateCategories(d,b),d=r.convertXml(d),c(a,b)&&(d=r.processData(d,a),k(d,a)),r.checkIfDataExists(d)&&t.parent().find("li").length>0?h():i(),o.get("ajaxCallback")()}).fail(function(){p.warning("Fail to load response data")}).always(function(){}))}}switch(a.keyCode){case 27:i(),l();break;case 38:a.preventDefault(),v.length>0&&w>0&&(w-=1,t.val(o.get("getValue")(v[w])),j(w));break;case 40:a.preventDefault(),v.length>0&&w<v.length-1&&(w+=1,t.val(o.get("getValue")(v[w])),j(w));break;default:if(a.keyCode>40||8===a.keyCode){var c=t.val();o.get("list").hideOnEmptyPhrase!==!0||8!==a.keyCode||""!==c?o.get("requestDelay")>0?(void 0!==m&&clearTimeout(m),m=setTimeout(function(){b(c)},o.get("requestDelay"))):b(c):i()}}})}function d(){t.on("keydown",function(a){a=a||window.event;var b=a.keyCode;return 38===b?(suppressKeypress=!0,!1):void 0}).keydown(function(a){13===a.keyCode&&w>-1&&(t.val(o.get("getValue")(v[w])),o.get("list").onKeyEnterEvent(),o.get("list").onChooseEvent(),w=-1,i(),a.preventDefault())})}function e(){t.off("keypress")}function f(){t.focus(function(){""!==t.val()&&v.length>0&&(w=-1,h())})}function g(){t.blur(function(){setTimeout(function(){w=-1,i()},250)})}function n(){t.attr("autocomplete","off")}a()}function h(){u.trigger("show.eac")}function i(){u.trigger("hide.eac")}function j(a){u.trigger("selectElement.eac",a)}function k(a,b){u.trigger("loadElements.eac",[a,b])}function l(){t.trigger("blur")}var m,n=new a.Constans,o=new a.Configuration(c),p=new a.Logger,q=new a.Template(c.template),r=new a.ListBuilderService(o,a.proccess),s=o.equals,t=b,u="",v=[],w=-1;a.consts=n,this.getConstants=function(){return n},this.getConfiguration=function(){return o},this.getContainer=function(){return u},this.getSelectedItemIndex=function(){return w},this.getItems=function(){return v},this.getItemData=function(a){return v.length<a||void 0===v[a]?-1:v[a]},this.getSelectedItemData=function(){return this.getItemData(w)},this.build=function(){e()},this.init=function(){d()}},a.eacHandles=[],a.getHandle=function(b){return a.eacHandles[b]},a.inputHasId=function(a){return void 0!==$(a).attr("id")&&$(a).attr("id").length>0},a.assignRandomId=function(b){var c="";do c="eac-"+Math.floor(1e4*Math.random());while(0!==$("#"+c).length);elementId=a.consts.getValue("CONTAINER_ID")+c,$(b).attr("id",c)},a.setHandle=function(b,c){a.eacHandles[c]=b},a}(EasyAutocomplete||{});!function(a){a.fn.easyAutocomplete=function(b){return this.each(function(){var c=a(this),d=new EasyAutocomplete.main(c,b);EasyAutocomplete.inputHasId(c)||EasyAutocomplete.assignRandomId(c),d.init(),EasyAutocomplete.setHandle(d,c.attr("id"))})},a.fn.getSelectedItemIndex=function(){var b=a(this).attr("id");return void 0!==b?EasyAutocomplete.getHandle(b).getSelectedItemIndex():-1},a.fn.getItems=function(){var b=a(this).attr("id");return void 0!==b?EasyAutocomplete.getHandle(b).getItems():-1},a.fn.getItemData=function(b){var c=a(this).attr("id");return void 0!==c&&b>-1?EasyAutocomplete.getHandle(c).getItemData(b):-1},a.fn.getSelectedItemData=function(){var b=a(this).attr("id");return void 0!==b?EasyAutocomplete.getHandle(b).getSelectedItemData():-1}}(jQuery);