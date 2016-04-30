<?php
function connectDB()
{
	$dbname = 'help';
	$host = 'localhost';
	$username = 'root';
	$password = '135793';

	$dbh = new PDO("mysql:dbname=$dbname;host=$host", $username, $password );
	return $dbh;
}

$dbh = connectDB();

function getMember($account){
	$dbh = connectDB();
	$sql = "select * from member where account = :account";
	$statement = $dbh -> prepare($sql);
	$statement -> bindParam(':account', $account, PDO::PARAM_STR);
	$statement -> execute();
	return $statement;
}
function checkAccount($account){
	$dbh = connectDB();
	$sql = "select account from member where account = :account";
	$statement = $dbh -> prepare($sql);
	$statement -> bindParam(':account', $account, PDO::PARAM_STR);
	$statement -> execute();
	return $statement;
}
function checkEmail($email){
	$dbh = connectDB();
	$sql = "select email from member where email = :email";
	$statement = $dbh -> prepare($sql);
	$statement -> bindParam(':email', $email, PDO::PARAM_STR);
	$statement -> execute();
	return $statement;
}
function resetPassword($email,$new_password){
	$dbh = connectDB();
	$sql = "update member set password = :new_password where email = :email";
	$statement = $dbh -> prepare($sql);
	$statement -> bindParam(':new_password', $new_password, PDO::PARAM_STR);
	$statement -> bindParam(':email', $email, PDO::PARAM_STR);
	$statement -> execute();
}
function getIncidentLocation(){
	$dbh = connectDB();
	$sql = "select * from addincident";
	$statement = $dbh -> prepare($sql);
	$statement -> execute();
	return $statement;
}
function getMissionLocation($ID,$title){
	$dbh = connectDB();
	$sql = "select ID, title from member where ID = :ID and title = :title";
	$statement = $dbh -> prepare($sql);
	$statement -> bindParam(':ID', $ID, PDO::PARAM_STR);
	$statement -> bindParam(':title', $title, PDO::PARAM_STR);
	$statement -> execute();
	return $statement;
}
?>
