<?php
include("db_conn.php");

$data = json_decode(file_get_contents("php://input"));
$email = mysql_real_escape_string($data->email);
$new_password = substr(md5(rand()),0,6);

try{
	$result = checkEmail($email);
	$rowResult = $result -> fetch();
	
	if($rowResult["email"]){
		//email存在
		resetPassword($email, $new_password);
		
		require_once('/phpmailer/PHPMailerAutoload.php');  
		$mail= new PHPMailer();								//建立新物件  
		
		//$mail->SMTPDebug = 2;								//Enable SMTP debugging	// 0 = off (for production use)	// 1 = client messages	// 2 = client and server messages
		$mail->IsSMTP();									//設定使用SMTP方式寄信  
		$mail->SMTPAuth = true;								//設定SMTP需要驗證  
		$mail->SMTPSecure = "ssl";							//Gmail的SMTP主機需要使用SSL連線  
		$mail->Host = "smtp.gmail.com";						//Gamil的SMTP主機  
		$mail->Port = 465;									//Gamil的SMTP主機的埠號(Gmail為465)。  
		$mail->CharSet = "utf-8";							//郵件編碼  
		$mail->Username = "lizzyyang9534@gmail.com";		//Gamil帳號  
		$mail->Password = "miko3426";						//Gmail密碼  
		$mail->From = "lizzyyang9534@gmail.com";			//寄件者信箱  
		$mail->FromName = "大屁APP";						//寄件者姓名  
		$mail->Subject ="【大屁】忘記密碼回覆";				//郵件標題  
		$mail->Body =										//郵件內容
		"<html>
			<head>
				<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">
			</head>
			<body>
				<div>親愛的使用者您好，</div>
				<div></br>我們已將您的密碼更改為：".$new_password."</div>
				<div>請您登入後盡速修改您的密碼。</div>
			</body>
		</html>";
		$mail->IsHTML(true);								//郵件內容為html  
		$mail->AddAddress($rowResult["email"]);				//收件者郵件及名稱  
		if(!$mail->Send()){  
			echo "Error: " . $mail->ErrorInfo;  
		}else{  
			echo "done";  
		}
	}
	else{
		//email不存在
		echo "none";
	}
}
catch(PDOException $e) {
	echo $e->getMessage();
}
?>