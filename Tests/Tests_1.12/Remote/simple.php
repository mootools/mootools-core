<?php 
if (isset($_GET['sleep'])) sleep($_GET['sleep']);
if (isset($_GET['num'])){
	echo 'requested: '.$_GET['num'];
} else if (isset($_POST['num'])){
		echo 'requested: '.$_POST['num'];
} else {
	echo 'ajax request successful';
} ?>