<?php 
include("db_conn.php");

$data = json_decode(file_get_contents("php://input"));
$account = mysql_real_escape_string($data->account);
$passwd = mysql_real_escape_string($data->passwd);
$name = mysql_real_escape_string($data->name);
$cel = mysql_real_escape_string($data->cel);
$email = mysql_real_escape_string($data->email);

try{
	$result1 = checkAccount($account);
	$rowResult1 = $result1 -> fetch();
	$result2 = checkEmail($email);
	$rowResult2 = $result2 -> fetch();
	
	if(empty($rowResult1["account"]) == false || (empty($rowResult1["account"]) == false && empty($rowResult2["email"]) == false)){
		echo "exist";
	}
	else if(empty($rowResult2["email"]) == false){
		echo "email_exist";
	}
	else{
		$sql = "insert into member (account,password,name,cellphone,email) values(:account,:password,:name,:cellphone,:email)";
		$statement = $dbh -> prepare($sql);
		$statement -> bindParam(':account', $account, PDO::PARAM_STR); 
		$statement -> bindParam(':password', $passwd, PDO::PARAM_STR);		
		$statement -> bindParam(':name', $name, PDO::PARAM_STR);		
		$statement -> bindParam(':cellphone', $cel, PDO::PARAM_STR);
		$statement -> bindParam(':email', $email, PDO::PARAM_STR);
		$statement -> execute();
	
		$result = getMember($account);
		$rowResult = $result -> fetch();
		echo "Hi,".$rowResult["name"];
	
		//echo $account.",".$passwd.",".$name.",".$cel.",".$email;
	}
}
catch(PDOException $e) {
	echo $e->getMessage();
}

?>