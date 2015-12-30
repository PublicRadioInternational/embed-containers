<div class="row em-row">
	<div class="col-xs-6">
		<form action="upload.php" method="post" enctype="multipart/form-data">
			<input id="imageUpload" type="file" name="imageFile" />
		</form>
	</div>
	<div class="col-xs-6">
		<ul id="imagesList">
		</ul>
	</div>
</div>

<div class="row em-row">
	<div class="col-xs-6">
		<div class="form-group">
			<label for="altText" class="em-label">Alt Text</label>
			<input class="em-input form-control" type="text" name="altText" />
		</div>
	</div>
	<div class="col-xs-6">
		<div class="form-group">
			<label for="titleText" class="em-label">Title Text</label>
			<input class="em-input form-control" type="text" name="titleText" />
		</div>
	</div>
</div>

<div class="row em-row">
	<div class="form-group">
		<div class="col-xs-6">
			<label for="credit" class="em-label">Credit</label>
			<input class="em-input form-control" type="text" name="credit" />
		</div>	
		<div class="col-xs-6">
			<label for="creditLink" class="em-label">Credit Link</label>
			<input class="em-input form-control" type="text" name="creditLink" />
		</div>
	</div>
</div>

<div class="row em-row">
	<div class="col-xs-6">
		<div class="form-group">
			<label for="caption" class="em-label">Caption</label>
			<input class="em-input form-control" type="text" name="caption" />
		</div>
	</div>
	<div class="col-xs-6">
		<div class="form-group">
			<label for="license" class="em-label">License</label>
			<select class="form-control" type="text" name="license">
				<option>license 1</option>
				<option>license 2</option>
				<option>license 3</option>
			</select>
		</div>
	</div>
</div>

<script type="text/javascript">
	$(document).ready(function(){
		var formatFileSize = function (bytes) {
			if (typeof bytes !== 'number') {
				return '';
			}

			if (bytes >= 100000000) {
				return (bytes / 1000000000).toFixed(2) + ' GB';
			}

			if (bytes >= 1000000) {
				return (bytes / 1000000).toFixed(2) + ' MB';
			}
			return (bytes / 1000).toFixed(2) + ' KB';
		};

		$('#imageUpload').fileupload({
			dataType: 'json',
			add: function(e, data){
				var listItem = $('<li id="' + data.files[0].name + '"><span></span></li>');
				
				listItem.find('span').html(data.files[0].name + ' - ' + 
					'<i>' + formatFileSize(data.files[0].size) + '</i>');
				
				data.context = listItem.appendTo($('#imagesList'));
				
				data.submit().complete(function (result, textStatus, jqXHR) {
					if (!!result && !!result.responseJSON && !!result.responseJSON.path)
					{
						$('#imageUpload').data('imagePath', result.responseJSON.path);
					}
				});
			}
		});
	});
</script>
