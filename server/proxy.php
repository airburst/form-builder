<?php

    $url = ( isset( $_GET[ 'url' ] ) ? $_GET[ 'url' ] : null );  
    
    $ch = curl_init();

    curl_setopt ($ch, CURLOPT_URL, $url);
    curl_setopt ($ch, CURLOPT_HEADER, 1);

    // POST
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        curl_setopt ($ch, CURLOPT_POST, 1);
        curl_setopt ($ch, CURLOPT_POSTFIELDS, file_get_contents("php://input"));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    }

	// Show response
	$response = curl_exec($ch);
	echo $response;

    curl_close( $ch );
?>
