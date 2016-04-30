<?php
include("db_conn.php");

try{
	$result =  getIncidentLocation();

  $allLocation = array();
	while ($rowResult = $result -> fetch()) {
		$id = $rowResult["ID"];
		$location = $rowResult["location"];
		$title = $rowResult["title"];
		$illust = $rowResult["illust"];
		$level = $rowResult["level"];
	  $oneLocation = array("ID" => $id, "location" => $location, "title" => $title, "illust" => $illust, "level" => $level);
    array_push($allLocation, $oneLocation);
	}
  echo json_encode($allLocation);
}
catch(PDOException $e) {
	echo $e->getMessage();
}
?>
