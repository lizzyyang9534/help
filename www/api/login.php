<?php 
session_start();
include("db_conn.php");

$data = json_decode(file_get_contents("php://input"));
$account = mysql_real_escape_string($data->account);
$password = mysql_real_escape_string($data->password);


try{
	$result =  getMember($account);
	$rowResult = $result -> fetch();
	
	if($password == $rowResult["password"]){
				
		$_SESSION['login_id'] = $account;
		$_SESSION['user_name'] = $rowResult["name"];
		$_SESSION['password'] = $rowResult['password'];
		$_SESSION['phone'] = $rowResult['cellphone'];
		$_SESSION['email'] = $rowResult['email'];
		
		echo json_encode(array("account" => $account, "name" => $rowResult["name"], 
								"password" => $rowResult["password"], "cellphone" => $rowResult["cellphone"],
								"email" => $rowResult["email"], "result" => "login"));
	}
	else{
		echo "error";
	}
		
}
catch(PDOException $e) {
	echo $e->getMessage();
}

?>