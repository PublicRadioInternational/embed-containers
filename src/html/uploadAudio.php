<?php
	$audioDir = 'contents/audio/';
	$firstInputName = 'wavFile';
	$secondInputName ='mp3File';
	$status = '';
	$error = '';
	$audioPath = '';
	$errorCode = '';


	if (!file_exists($audioDir))
	{
		mkdir($audioDir);
	}

	$acceptableTypes = array('mp3', 'wav');
	$fileFound = false;
	if(isset($_FILES[$firstInputName]) && $_FILES[$firstInputName]['error'] == 0)
	{
		$currentInputName = $firstInputName;
		$fileFound = true; 
	}
	elseif(isset($_FILES[$secondInputName]) && $_FILES[$secondInputName]['error'] == 0)
	{
		$currentInputName = $secondInputName;
		$fileFound = true;
	}
	else
	{
		$status = 'failure';
		$error = 'Could not find file: please verify that the form is configured accurately.';
	}

	if($fileFound)
	{
		$fileName = $_FILES[$currentInputName]['name'];
		$errorCode = $_FILES[$currentInputName]['error'];
		$extension = pathinfo($fileName, PATHINFO_EXTENSION);
		if(in_array(strtolower($extension), $acceptableTypes)){
			
			//make folder for file types if they don't exist yet
			$newDir = $audioDir . $extension . '/';
			if(!file_exists($newDir))
			{
				mkdir($newDir);
			}

			if(move_uploaded_file($_FILES[$currentInputName]['tmp_name'], $newDir . $fileName)){
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
			$error = 'File type not permitted: ' . $extension;
		}	
	}

	

	echo'{"status":"'. $status . '",'
		. '"errorCode": '. $errorCode .','
		. '"error":"' . $error . '",'
		. '"path":"'  . $audioPath . '"}';
	exit;
?>