<?php
	$audioDir = 'contents/audio/';
	$inputName = 'mp3File';
	
	$status = '';
	$error = '';
	$audioPath = '';

	if (!file_exists($audioDir))
	{
		mkdir($audioDir);
	}

	$acceptableTypes = array('mp3');

	if(isset($_FILES[$inputName]) && $_FILES[$inputName]['error'] == 0){
		$fileName = $_FILES[$inputName]['name'];
		$extension = pathinfo($fileName, PATHINFO_EXTENSION);
		if(in_array(strtolower($extension), $acceptableTypes)){
			
			//make folder for file types if they don't exist yet
			$newDir = $audioDir . $extension . '/';
			if(!file_exists($newDir))
			{
				mkdir($newDir);
			}

			if(move_uploaded_file($_FILES[$inputName]['tmp_name'], $newDir . $fileName)){
				$status = 'success';
				$audioPath = $newDir . $fileName;
			}
			else
			{
				$status = 'failure';
				$error = 'Could not move file: please verify that the file path specified is accurate.';			
			}
		}
		else{
			$status = 'failure';
			$error = 'File type not permitted.';
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