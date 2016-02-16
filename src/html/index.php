<!DOCTYPE html>
<html>
	<head>
		<title>Entity Embed Demo</title>

		<!-- medium editor dependencies -->
		<link rel="stylesheet" href="lib/medium-editor/dist/css/medium-editor.css">
		<link rel="stylesheet" href="lib/medium-editor/dist/css/themes/default.css" id="medium-editor-theme">
		<link rel="stylesheet" href="lib/components-font-awesome/css/font-awesome.css">
		<script src="lib/jquery/dist/jquery.js"></script>
		<script src="lib/medium-editor/dist/js/medium-editor.js"></script>
		<script src="lib/jquery-sortable/source/js/jquery-sortable.js"></script>

		<!-- jQuery File Upload dependencies -->
		<script src="lib/blueimp-file-upload/js/vendor/jquery.ui.widget.js"></script>
		<script src="lib/blueimp-file-upload/js/jquery.iframe-transport.js"></script>
		<script src="lib/blueimp-file-upload/js/jquery.fileupload.js"></script>
		
		<!-- medium editor insert plugin -->
		<link rel="stylesheet" href="lib/medium-editor-insert-plugin/dist/css/medium-editor-insert-plugin.min.css">
		<script src="lib/handlebars/handlebars.runtime.min.js"></script>
		<script src="lib/medium-editor-insert-plugin/dist/js/medium-editor-insert-plugin.min.js"></script>
		<script src="lib/medium-editor-insert-plugin/src/js/templates.js"></script>
		<script src="lib/medium-editor-insert-plugin/src/js/core.js"></script>
		<script src="lib/medium-editor-insert-plugin/src/js/embeds.js"></script>
		<script src="lib/medium-editor-insert-plugin/src/js/images.js"></script>
		
	
		<!-- dependencies / code for this project -->
		<link rel="stylesheet" href="contents/main.css">
		<link rel="stylesheet" href="contents/priEntityEmbeds.css">
		<script src="js/main.js"></script>
	</head>

	<body>
		<div class="editable editor">
			This is editable content - try typing in here!
		</div>
		

		<div id="embed-modal">
			<?php include "modal/modal_main.html"; ?>
		</div>
	</body>

</html>