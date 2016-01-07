<?php
	$imagesDir = 'contents/images/';
	$inputName = 'imageFile';
	
	$status = '';
	$error = '';
	$imagePath = '';

	if (!file_exists($imagesDir))
	{
		mkdir($imagesDir);
	}

	$acceptableTypes = array('png', 'jpg', 'jpeg', 'gif');

	if(isset($_FILES[$inputName]) && $_FILES[$inputName]['error'] == 0){
		$fileName = $_FILES[$inputName]['name'];
		$extension = pathinfo($fileName, PATHINFO_EXTENSION);

		if(!in_array(strtolower($extension), $acceptableTypes)){
			$status = 'failure';
			$error = 'File type not permitted.';
		}
		elseif(move_uploaded_file($_FILES[$inputName]['tmp_name'], $imagesDir . $fileName)){
			$status = 'success';
			$imagePath = $imagesDir . $fileName;
		}
		else
		{
			$status = 'failure';
			$error = 'Could not move file: please verify that the file path specified is accurate.';			
		}
	}
	else
	{
		$status = 'failure';
		$error = 'Could not find file: please verify that the form is configured accurately.';
	}

	echo'{"status":"'. $status . '",'
		. '"errorCode":"' . $_FILES[$inputName]['error'] . '",'
		. '"error":"' . $error . '",'
		. '"path":"'  . $audioPath . '"}';
	exit;
?>