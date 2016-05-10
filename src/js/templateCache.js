(function(){EntityEmbed = EntityEmbed || {}; var templateCache = {};templateCache["modal"] = "null";
templateCache["modal/modal_audio.html"] = "<form method=\"post\" enctype=\"multipart/form-data\"><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"upload\">MP3 File</label><input class=\"embed-modal-input embed-modal-file-input\" type=\"file\" name=\"upload\"> <span class=\"fa fa-times cancel-upload-file-btn\"></span> <span class=\"fa fa-cog edit-chosen-file-btn\"></span> <span class=\"uploaded-audio-file\"></span></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title\" class=\"embed-modal-input embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div id=\"audio-credits\" class=\"embed-modal-form\"><div class=\"embed-modal-half-column\"><label for=\"credit\" class=\"embed-modal-label\">Credit</label><input id=\"credit\" class=\"embed-modal-form-control embed-modal-input\" type=\"text\" name=\"credit\"></div><div class=\"embed-modal-half-column\"><label for=\"creditLink\" class=\"embed-modal-label\">Credit Link</label><input id=\"creditLink\" class=\"embed-modal-form-control embed-modal-input\" type=\"url\" name=\"creditLink\"></div></div></div></form>";
templateCache["modal/modal_confirmation.html"] = "<div class=\"embed-modal-content\"><div class=\"embed-modal-header\"><h3>Are you sure you want to leave?</h3></div><div class=\"embed-modal-body\"><h4>All your changes will be lost if you leave this window!</h4></div><div class=\"embed-modal-footer\"><button id=\"btn-confirm-leave\">Yes - Leave</button> <button id=\"btn-cancel-leave\">No - Stay</button></div></div>";
templateCache["modal/modal_customText.html"] = "<form><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"control-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title for internal use\" class=\"embed-modal-form-control embed-modal-input\"></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"control-label\" for=\"displayTitle\">Display Title</label><input name=\"displayTitle\" type=\"text\" placeholder=\"Enter a title for display purposes\" class=\"embed-modal-form-control embed-modal-input\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"control-label\" for=\"customText\">Text</label><div name=\"customText\" type=\"text\" placeholder=\"Type your text. Highlight words to trigger the styles editor\" class=\"embed-modal-form-control\" id=\"custom-text-editor\"></div></div></div></div></form>";
templateCache["modal/modal_externalLink.html"] = "<form method=\"post\" enctype=\"multipart/form-data\"><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"upload\">Image Thumbnail File</label><input class=\"embed-modal-input embed-modal-file-input\" type=\"file\" name=\"upload\" accept=\"image/*\"> <span class=\"fa fa-times cancel-upload-image-btn\"></span> <span class=\"fa fa-cog edit-chosen-file-btn\"></span><div class=\"uploaded-image-file\"></div></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title for internal use\" class=\"embed-modal-form-control\"></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"displayTitle\">Display Title</label><input name=\"displayTitle\" type=\"text\" placeholder=\"Enter a title for display purposes\" class=\"embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"linkText\">External Link Text</label><input name=\"linkText\" type=\"text\" placeholder=\"Enter link text\" class=\"embed-modal-form-control\"></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"url\">External Link Url</label><input name=\"url\" type=\"url\" placeholder=\"Enter URL\" class=\"embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"teaser\">Teaser</label><textarea name=\"teaser\" type=\"text\" placeholder=\"Enter teaser\" rows=\"3\" class=\"embed-modal-form-control\"></textarea></div></div></div></form>";
templateCache["modal/modal_facebook.html"] = "<form><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title\" class=\"embed-modal-input embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form has-error\"><label class=\"embed-modal-label\" for=\"url\">Facebook Status</label><input name=\"url\" type=\"url\" placeholder=\"Enter URL to status\" class=\"embed-modal-form-control\"></div></div></div></form>";
templateCache["modal/modal_globalBuzz.html"] = "<form><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title for internal use\" class=\"embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"quote\">Quote</label><textarea name=\"quote\" type=\"text\" placeholder=\"Enter quote\" rows=\"5\" class=\"embed-modal-form-control\"></textarea></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label clas=\"embed-modal-label\" for=\"quoteText\">Quote Url Text</label><input name=\"quoteUrlText\" type=\"text\" placeholder=\"Enter URL label\" class=\"embed-modal-form-control\"></div><div class=\"embed-modal-form\"><label clas=\"embed-modal-label\" for=\"quoteUrl\">Quote Url</label><input name=\"quoteUrl\" type=\"url\" placeholder=\"Enter URL\" class=\"embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"credit\">Credit</label><input name=\"credit\" type=\"text\" placeholder=\"Attribute the source\" class=\"embed-modal-form-control\"></div></div></div></form>";
templateCache["modal/modal_iframe.html"] = "<form><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title\" class=\"embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"url\">Source</label><input name=\"url\" type=\"text\" placeholder=\"Enter URL or iframe source code\" class=\"embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"allowsScroll\">Scroll</label><select name=\"allowsScroll\" class=\"embed-modal-form-control\"><option>No</option><option>Yes</option></select></div></div></div></form>";
templateCache["modal/modal_image.html"] = "<form method=\"post\" enctype=\"multipart/form-data\"><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><label class=\"embed-modal-label\" for=\"upload\">Image File</label><input class=\"embed-modal-input embed-modal-file-input\" type=\"file\" name=\"upload\" accept=\"image/*\"> <span class=\"fa fa-times cancel-upload-image-btn\"></span> <span class=\"fa fa-cog edit-chosen-file-btn\"></span><div class=\"uploaded-image-file\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label for=\"title\" class=\"embed-modal-label\">Title</label><input class=\"embed-modal-input embed-modal-form-control\" type=\"text\" name=\"title\"></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label for=\"altText\" class=\"embed-modal-label\">Alt Text</label><input class=\"embed-modal-input embed-modal-form-control\" type=\"text\" name=\"altText\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-form\"><div class=\"embed-modal-half-column\"><label for=\"credit\" class=\"embed-modal-label\">Credit</label><input class=\"embed-modal-input embed-modal-form-control\" type=\"text\" name=\"credit\"></div><div class=\"embed-modal-half-column\"><label for=\"creditLink\" class=\"embed-modal-label\">Credit Link</label><input class=\"embed-modal-input embed-modal-form-control\" type=\"url\" name=\"creditLink\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label for=\"caption\" class=\"embed-modal-label\">Caption</label><input class=\"embed-modal-input embed-modal-form-control\" type=\"text\" name=\"caption\"></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label for=\"license\" class=\"embed-modal-label\">License</label><select class=\"embed-modal-form-control\" type=\"text\" name=\"license\"></select></div></div></div></form>";
templateCache["modal/modal_instagram.html"] = "<form><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title\" class=\"embed-modal-input embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"url\">Insert Instagram URL</label><input name=\"url\" type=\"url\" placeholder=\"Enter URL to instagram post\" class=\"embed-modal-input embed-modal-form-control\"></div></div></div></form>";
templateCache["modal/modal_main.html"] = "<div class=\"embed-modal-content\"><div class=\"embed-modal-header\"><div class=\"embed-modal-half-column\"><h2 class=\"header-text\"></h2></div><div class=\"embed-modal-half-column\"><select class=\"embed-modal-form-control\" id=\"select-embed-type\"></select></div></div><div class=\"embed-modal-body\"><div id=\"embed-modal-create-new\"></div><div id=\"embed-modal-select-existing\"></div></div><div class=\"embed-modal-footer\"><div id=\"embed-modal-buttons-create\"><button id=\"btn-show-select-existing\">Select Existing Embed</button><!-- TODO : add publishing state dropdown --><!-- TODO : publishing state dropdown affects Save button text --> <i class=\"fa fa-spinner fa-spin\" id=\"embed-modal-spinner\"></i> <button id=\"btn-save-modal\">Save</button> <button id=\"btn-abort-modal\">Close</button></div><div id=\"embed-modal-buttons-select\"><button id=\"btn-cancel-select-existing\">Cancel</button></div></div><!-- the leave confirmation modal will be loaded here --><div id=\"leave-confirmation-modal\"><div></div></div></div>";
templateCache["modal/modal_newsletterSubscribe.html"] = "<form><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title for internal use\" class=\"embed-modal-form-control embed-modal-input\"></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"displayTitle\">Display Title</label><input name=\"displayTitle\" type=\"text\" placeholder=\"Enter a title for display purposes\" class=\"embed-modal-input embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"teaser\">Teaser</label><textarea name=\"teaser\" type=\"text\" placeholder=\"Enter teaser\" rows=\"3\" class=\"embed-modal-form-control\"></textarea></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"newsletter\">Select Newsletter</label><select name=\"newsletter\" class=\"embed-modal-form-control\"></select></div></div></div></form>";
templateCache["modal/modal_relatedLink.html"] = "<form><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title for internal use\" class=\"embed-modal-form-control\"></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"displayTitle\">Display Title</label><input name=\"displayTitle\" type=\"text\" placeholder=\"Enter a title to display\" class=\"embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><label class=\"embed-modal-label\">Links</label><div class=\"progress\"><div id=\"related-links-progress\" class=\"progress-bar progress-bar-info\"></div></div><ul id=\"related-link-list\"></ul></div></div><hr><div class=\"embed-modal-row\"><div class=\"related-link-add\"><input name=\"linkInput\" type=\"text\" id=\"add-link-eac\" placeholder=\"Begin typing a title. Select one to add link.\" class=\"embed-modal-form-control\"></div></div></form>";
templateCache["modal/modal_slideshow.html"] = "<form method=\"post\" enctype=\"multipart/form-data\"><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label for=\"slideshowTitle\" class=\"embed-modal-label\">Slideshow Title</label><input class=\"embed-modal-input embed-modal-form-control\" placeholder=\"Enter a title for internal use\" type=\"text\" name=\"slideshowTitle\"></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label for=\"displayTitle\" class=\"embed-modal-label\">Display Title</label><input class=\"embed-modal-input embed-modal-form-control\" placeholder=\"Enter a title to display\" type=\"text\" name=\"displayTitle\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column image-list-container\"><label>Image List</label><div class=\"slideshow-image-add\"><i class=\"fa fa-plus\"></i></div><div class=\"slideshow-image-select-existing\"><i class=\"fa fa-search-plus\"></i></div><div class=\"embed-modal-slideshow-image-list\"><p class=\"radio-option-placeholder\">click <i class=\"fa fa-plus\"></i> to add an image</p><p class=\"radio-option-placeholder\">click <i class=\"fa fa-search-plus\"></i> to select an existing image</p></div></div></div></form><hr><div class=\"embed-modal-row\" id=\"embed-modal-slideshow-image-select-existing\"><div class=\"simg-query-container\"><label class=\"embed-modal-label\" for=\"simg-query\">Search for Image(s)</label><input type=\"text\" class=\"embed-modal-form-control\" name=\"simg-query\" placeholder=\"begin typing image title \"></div><div id=\"slideshow-image-select-btns\"><button id=\"btn-cancel-select-existing-simg\">Cancel</button></div></div><div id=\"embed-modal-slideshow-image\"><form method=\"post\" enctype=\"multipart/form-data\"><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><input class=\"embed-modal-input embed-modal-file-input\" type=\"file\" name=\"upload\" accept=\"image/*\"> <span class=\"fa fa-times cancel-upload-image-btn\"></span><div class=\"uploaded-image-file\"><div><label>Chosen Image</label><span class=\"fa fa-cog edit-chosen-file-btn\"></span></div></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label for=\"title\" class=\"embed-modal-label\">Title</label><input class=\"embed-modal-input embed-modal-form-control\" type=\"text\" name=\"title\"></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label for=\"altText\" class=\"embed-modal-label\">Alt Text</label><input class=\"embed-modal-input embed-modal-form-control\" type=\"text\" name=\"altText\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-form\"><div class=\"embed-modal-half-column\"><label for=\"credit\" class=\"embed-modal-label\">Credit</label><input class=\"embed-modal-input embed-modal-form-control\" type=\"text\" name=\"credit\"></div><div class=\"embed-modal-half-column\"><label for=\"creditLink\" class=\"embed-modal-label\">Credit Link</label><input class=\"embed-modal-input embed-modal-form-control\" type=\"url\" name=\"creditLink\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label for=\"caption\" class=\"embed-modal-label\">Caption</label><input class=\"embed-modal-input embed-modal-form-control\" type=\"text\" name=\"caption\"></div></div><div class=\"embed-modal-half-column\"><div class=\"embed-modal-form\"><label for=\"license\" class=\"embed-modal-label\">License</label><select class=\"embed-modal-form-control\" type=\"text\" name=\"license\" id=\"license\"></select></div></div></div></form></div>";
templateCache["modal/modal_twitter.html"] = "<form><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title\" class=\"embed-modal-input embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"tweetUrl\">Tweet URL</label><input name=\"url\" type=\"url\" placeholder=\"Enter URL to tweet\" class=\"embed-modal-input embed-modal-form-control\"></div></div></div></form>";
templateCache["modal/modal_video.html"] = "<form><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"title\">Title</label><input name=\"title\" type=\"text\" placeholder=\"Enter a title\" class=\"embed-modal-input embed-modal-form-control\"></div></div></div><div class=\"embed-modal-row\"><div class=\"embed-modal-full-column\"><div class=\"embed-modal-form\"><label class=\"embed-modal-label\" for=\"url\">Video URL</label><input name=\"url\" type=\"url\" placeholder=\"Enter URL to video\" class=\"embed-modal-input embed-modal-form-control\"></div></div></div></form>";EntityEmbed.templateCache = templateCache;})();