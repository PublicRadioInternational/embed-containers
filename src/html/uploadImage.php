<?php
	//$imagesDir = 'contents/images/';
	$inputName = 'upload';
	
	$status = '';
	$error = '';
	$imagePath = '';
	$response = '';
	$url = 'https://test-services.pri.org/admin/embed/file-upload';
	$acceptableTypes = array('png', 'jpg', 'jpeg', 'gif');

	if(isset($_FILES[$inputName]) && $_FILES[$inputName]['error'] == 0){
		$fileName = $_FILES[$inputName]['name'];
		$extension = pathinfo($fileName, PATHINFO_EXTENSION);

		$options = array(
			'http' => array(
				'header' => "Content-type: json\r\n" .
							"x-auth-token: abc123\r\n" .
							"x-object-id: 9e8c680248224fb58fba9b4916bbc7e5\r\n" .
							"x-debug: 1\r\n",
				'method'  => 'POST',
				'content' => http_build_query(array(
								'upload' => $fileName
								)),
				'ignore_errors' => true
			)
		);
		$context  = stream_context_create($options);
		$result = file_get_contents($url, false, $context);
		echo $result;
		exit;
	}

	$status = 'failure';
	$error = 'Could not find file: please verify that the form is configured accurately.';

	echo '{"status":"'. $status . '",' .
		'"error":"' . $error . '"}';
	exit;
	
?>