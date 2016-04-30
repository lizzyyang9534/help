<?php
if(!isset($_SESSION))
	session_start();//have to start the session before you can unset or destroy it.
session_unset();
session_destroy();
//$_SESSION = array();
//header( 'Location: login.php' );
?>