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