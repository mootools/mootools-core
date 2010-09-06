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
	'text'	=> 'text/plain',
	'html'	=> 'text/html',
	'xml'	=> 'application/xml',
	'json'	=> 'application/json',
	'script' => 'application/javascript'
);
$content_types['javascript'] = $content_types['script'];

check_special_parameter('sleep', 0); // you can define the default sleep time by passing the '__sleep' variable (get or post)
check_special_parameter('response', NULL);
check_special_parameter('type', NULL);
check_special_parameter('retrieve', NULL);

if ($type !== NULL) header('Content-Type: ' . (isset($content_types[$type]) ? $content_types[$type] : $type));

sleep($sleep);

if ($response !== NULL){
	echo $response;
	die();
}

$info = array('method' => strtolower($_SERVER['REQUEST_METHOD']));
if (!empty($_GET)) $info['get'] = $_GET;
if (!empty($_POST)) $info['post'] = $_POST;

if ($retrieve !== NULL){
	echo json_encode(isset($info[$retrieve]) ? $info[$retrieve] : '');
	die();
}

echo json_encode($info);
