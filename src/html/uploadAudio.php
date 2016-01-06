<?php
	$audioDir = 'contents/audio/';
	$inputName = 'audioFile';
	
	$status = '';
	$error = '';
	$audioPath = '';

	if (!file_exists($audioDir))
	{
		mkdir($audioDir);
	}

		$acceptableTypes = array('mp3', 'mpeg', 'wav', 'flac','m4a');

	if(isset($_FILES[$inputName]) && $_FILES[$inputName]['error'] == 0){
		$fileName = $_FILES[$inputName]['name'];
		$extension = pathinfo($fileName, PATHINFO_EXTENSION);

		if(!in_array(strtolower($extension), $acceptableTypes)){
			$status = 'failure';
			$error = 'File type not permitted.';
		}
		elseif(move_uploaded_file($_FILES[$inputName]['tmp_name'], $audioDir . $fileName)){
			$status = 'success';
			$audioPath = $audioDir . $fileName;
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

	echo '{"status":"'. $status . '",'
		. '"error":"' . $error . '",'
		. '"path":"'  . $audioPath . '"}';
	exit;
?>