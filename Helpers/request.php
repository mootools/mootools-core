<?php

function check_special_parameter($name, $default){
	global $$name;
	$__name = "__$name";
	if (isset($_REQUEST[$__name])){
		$$name = $_REQUEST[$__name];
		unset($_GET[$__name]);
		unset($_POST[$__name]);
	} else {
		$$name = $default;
	}
};

$content_types = array(
	'html'	=> 'text/html',
	'xml'	=> 'application/xml',
	'json'	=> 'application/json'
);

// you can defined the default sleep time by passing the '__sleep' variable (get or post)
check_special_parameter('sleep', 0);
check_special_parameter('response', false);
check_special_parameter('type', 'html');

header('Content-Type: ' . (isset($content_types[$type]) ? $content_types[$type] : $type));

sleep($sleep);

if ($response !== false){
	echo $response;
	die();
}

echo json_encode(array(
	'method'	=> strtolower($_SERVER['REQUEST_METHOD']),
	'get'		=> $_GET,
	'post'		=> $_POST
));

?>