<?php 
if (isset($_GET['sleep'])) sleep($_GET['sleep']);
if (isset($_GET['num'])){
	echo 'requested: '.$_GET['num'];
} else {
	echo 'ajax request successful';
} ?>