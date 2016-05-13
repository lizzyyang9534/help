<?php

include("db_conn.php");
session_start();

$data = json_decode(file_get_contents("php://input"));
$level = mysql_real_escape_string($data->level);
$category = mysql_real_escape_string($data->category);
$ID= mysql_real_escape_string($data->id);
$title = mysql_real_escape_string($data->title);
$illust = mysql_real_escape_string($data->illust);
$date = mysql_real_escape_string($data->date);
$location = mysql_real_escape_string($data->location);


try{
	$sql = "insert into addincident (level,category,ID,title,illust,date,location) values(:level,:category,:ID,:title,:illust,:date,:location)";
	$statement = $dbh -> prepare($sql);
	$statement -> bindParam(':level', $level, PDO::PARAM_STR);
	$statement -> bindParam(':category', $category, PDO::PARAM_STR);
	$statement -> bindParam(':ID', $ID, PDO::PARAM_STR);
	$statement -> bindParam(':title', $title, PDO::PARAM_STR);
	$statement -> bindParam(':illust', $illust, PDO::PARAM_STR);
	$statement -> bindParam(':date', $date, PDO::PARAM_STR);
	$statement -> bindParam(':location', $location, PDO::PARAM_STR);
	$statement -> execute();

	echo $level.",".$category.",".$ID.",".$title.",".$illust.",".$date.",".$location;
}
catch(PDOException $e) {
	echo $e->getMessage();
}
?>
