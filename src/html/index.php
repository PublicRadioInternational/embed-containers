<!DOCTYPE html>
<html>
	<head>
		<title>Entity Embed Demo</title>

		<!-- medium editor dependencies -->
		<link rel="stylesheet" href="lib/medium-editor/dist/css/medium-editor.css">
		<link rel="stylesheet" href="lib/medium-editor/dist/css/themes/default.css" id="medium-editor-theme">
		<link rel="stylesheet" href="lib/font-awesome/css/font-awesome.css">
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

		<!-- dependencies / code for Embed Containers -->
		<link rel="stylesheet" href="contents/main.css">
		<link rel="stylesheet" href="contents/priEntityEmbeds.css">
		<script src="js/main.js"></script>

		<!-- validator -->
		<script src="lib/jquery-validation/dist/jquery.validate.js"></script>
		<script src="lib/jquery-validation/dist/additional-methods.js"></script>

		<!-- JQuery Autocomplete Plugin -->
		<link rel="stylesheet" href="lib/EasyAutocomplete/dist/easy-autocomplete.min.css">
		<script src="lib/EasyAutocomplete/dist/jquery.easy-autocomplete.min.js"></script>
	</head>

	<body>

		<div class="container-fluid">
		  <div id="demo-wrapper" class="row">
				<fieldset class="editor-content">
					<legend>Story Editor</legend>
					<div class="editable editor">This is editable content. Try typing in here!</div>
				</fieldset>

				<button id="extract-story-content">Extract Story Content</button>

				<button id="load-default-story">Load Default Story</button>

				<fieldset class="story-content">
					<legend>Story Data</legend>
					<pre id="data"></pre>
				</fieldset>
			</div>
			<div id="space"></div>
			<div id="open-modal-info">
				<div>
					<p>open an embed modal to add a an embed of a specified type
					<button class="demo-button-open-modal open-add-single">Add Single Embed</button>
					</p>
				</div>

				<hr />
				
				<div>
					<p>open an embed modal to add an embed of any type
					<button class="demo-button-open-modal open-add-any">Add Any Embed</button>
					</p>
				</div>
				
				<hr />
			
				<div>
					<p>open an embed modal to edit a particular embed embed type
					<button class="demo-button-open-modal open-edit">Edit Embed</button>
					</p>
				</div>	
			</div>
		</div>

	</body>

</html>