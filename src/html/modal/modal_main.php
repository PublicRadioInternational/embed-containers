<div class="modal-content">
	<div class="modal-header">
		<h2 class="header-text">Embed Content</h2>
	
		<select id="select-embed-type">
			<option value="image">Image(s)</option>
			<option value="video">Video</option>
			<option value="audio">Audio</option>
			<option value="twitter">Tweet</option>
			<option value="instagram">Instagram Image</option>
			<option value="facebook">Facebook Status</option>
			<option value="relatedLink">Related link</option>
			<option value="externalLink">External link</option>
			<option value="globalBuzz">Global Buzz</option>
			<option value="newsletterSubscribe">Newsletter Subscribe form</option>
			<option value="iframe">iFrame</option>
			<option value="customText">Custom Text</option>
		</select>
	</div>

	<div id="image">
		<?php include 'modal_image.html'; ?>
	</div>

	<div id="video">
		<?php include 'modal_video.html'; ?>
	</div>
	
	<div id="audio">
		<?php include 'modal_audio.html'; ?>
	</div>
	
	<div id="twitter">
		<?php include 'modal_twitter.html'; ?>
	</div>
	
	<div id="instagram">
		<?php include 'modal_instagram.html'; ?>
	</div>
	
	<div id="facebook">
		<?php include 'modal_facebook.html'; ?>
	</div>
	
	<div id="relatedLink">
		<?php include 'modal_relatedLink.html'; ?>
	</div>
	
	<div id="externalLink">
		<?php include 'modal_externalLink.html'; ?>
	</div>
	
	<div id="globalBuzz">
		<?php include 'modal_globalBuzz.html'; ?>
	</div>
	
	<div id="newsletterSubscribe">
		<?php include 'modal_newsletterSubscribe.html'; ?>
	</div>
	
	<div id="iframe">
		<?php include 'modal_iframe.html'; ?>
	</div>
	
	<div id="customText">
		<?php include 'modal_customText.html'; ?>
	</div>
	
	<br />
	<div class="modal-footer">
		<button id="btn-complete-modal" class="btn btn-primary">OK</button>
		<button id="btn-abort-modal" class="btn btn-secondary">cancel</button>
	</div>
</div>