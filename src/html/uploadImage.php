<?php
	//$imagesDir = 'contents/images/';
	$inputName = 'imageFile';
	
	$status = '';
	$error = '';
	$imagePath = '';
	$response = '';
	$url = 'https://test-services.pri.org/admin/embed/file-upload';
	$acceptableTypes = array('png', 'jpg', 'jpeg', 'gif');

	if(isset($_FILES[$inputName]) && $_FILES[$inputName]['error'] == 0){
		$fileName = $_FILES[$inputName]['name'];
		$extension = pathinfo($fileName, PATHINFO_EXTENSION);

		// $header=['x-auth-token'=>'abc123', 
		// 		 'x-object-id'=>'be645896c98e49e589fa0e9aa12ac4e2', 
		// 		 'x-debug'=>1];

		// $defaults = array(
		// 	CURLOPT_URL => $url,
		// 	CURLOPT_POST => true,
		// 	CURLOPT_POSTFIELDS => $params,
		// 	CURLOPT_RETURNTRANSFER => true,
		// 	CURLOPT_HEADER => true
		// );
		// $fp = fopen( $fileName, "w");
		// $ch = curl_init($url);

		// curl_setopt_array($ch, $defaults);

		// curl_setopt($ch, CURLOPT_FILE, $fp);
		
		// $response = curl_exec($ch);
		// curl_close($ch);
		// fclose($fp);
		// $status = "made it through curl";




		
		$options = array(
		    'http' => array(
		        'header'  => array(
		        				'x-auth-token' => "abc123",
		        				'x-object-id' => "be645896c98e49e589fa0e9aa12ac4e2",
		        				'x-debug' => '1'
		        			),
		        'method'  => 'POST',
		        'content' => http_build_query(array(
		        				'upload' => $fileName
		        				))
		    )
		);
		$context  = stream_context_create($options);
		$result = file_get_contents($url, false, $context);

			/*
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
		*/
	}
	else
	{
		$status = 'failure';
		$error = 'Could not find file: please verify that the form is configured accurately.';
	}

	echo '{"status":"'. $status . '",'
		. '"error":"' . $error . '",'
		. '"VALUEEEE":"' . $result . '",'
		. '"path":"'  . $imagePath . '"}';
	exit;
?>