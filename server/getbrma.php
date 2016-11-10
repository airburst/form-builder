<?php
	// Execute a POST to a url and return the resulting HTML page as a string
	function doPost($url) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POST, 1);
		// receive server response
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec ($ch);
		curl_close ($ch);
		return $response;
	}

	// Write output in appropriate format
	function writeResponse($data, $format) {
		if($format == 'json') {
			header('Content-Type: application/json');
			header('Cache-Control: no-cache  must-revalidate');
			header('Expires: Mon  26 Jul 1997 05:00:00 GMT');
			echo json_encode(array('brma'=>$data));
		}
		else {
			header('Content-type: text/xml');
			header('Cache-Control: no-cache  must-revalidate');
			header('Expires: Mon  26 Jul 1997 05:00:00 GMT');
			echo '<response>';
			foreach($data as $index=>$item) {
				if(is_array($item)) {
					foreach($item as $key=>$value) {
						echo '<'.$key.'>';
						if(is_array($value)) {
							foreach($value as $tag=>$val) {
								echo '<'.$tag.'>'.htmlentities($val).'</'.$tag.'>';
							}
						}
						echo '</'.$key.'>';
					}
				}
			}
			echo '</response>';
		}
	}

	// Business Logic to execute remote search on website
	// and parse the returned html for BRMA values
	function processBRMA($html) {
		// Array for results
		$brma = array();

		// Cast the html string as a DOM document
		$dom = new DOMDocument;
		$dom->loadHTML($html);

		// Search for class="scl_complex brma-rates"
		$classname = "scl_complex brma-rates";
		$xpath = new DOMXPath($dom);
		$results = $xpath->query("//*[@class='" . $classname . "']");

		foreach ($results as $result) {
			foreach ($result->childNodes as $child) {
				// Filter H3 elements (where BRMA titles are held)
				if ($child->nodeName == "h3") {
					// Remove " BRMA" text
					$item = trim(str_replace(" BRMA", "", $child->nodeValue));
					array_push($brma, $item);
				}
			}
		}

		return $brma;
	}

	function main() {
		// Set CORS Header
		header("Access-Control-Allow-Origin: *");

		// Parse input values from GET / POST
		$postcode = "";
		// The VOA server expects %2b for a space
		if (isset($_REQUEST["postcode"])) { $postcode = str_replace(" ", "%2b", $_REQUEST["postcode"]); }

		$format = "json";
		if (isset($_REQUEST["format"])) { $format = strtolower($_REQUEST["format"]); } 	//json is the default

		// Error checking on postcode
		if ($postcode == "") { 
			echo json_encode(array("Error"=>"No postcode provided"));
		}
		else {
			if (strlen($postcode) > 10) { 
				echo json_encode(array("Error"=>"Postcode too long"));
			}
			else {
				// Get current month and year values
				$month = date("n");
				$year = date("Y");
				$url = "http://lha-direct.voa.gov.uk/SearchResults.aspx?Postcode=".$postcode."&LHACategory=999&Month=".$month."&Year=".$year."&SearchPageParameters=true";

				// Post to server
				$html = doPost($url);

				// Process
				$data = processBRMA($html);

				// Write output
				writeResponse($data, $format);
			}
		}
	}

	main();	
?> 
