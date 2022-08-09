<?php
 header("Access-Control-Allow-Origin: *");
 header("Access-Control-Allow-Headers: Content-Type, Accept");
 
if($_POST)
{
    //check $_POST vars are set, exit if any missing
    if(!isset($_POST["agree"]) || !isset($_POST["first_name"]) || !isset($_POST["last_name"]) || !isset($_POST["country"]) || !isset($_POST["zip"]) || !isset($_POST["email"]) || !isset($_POST["linking_from"]) || !isset($_POST["linking_to"]) )
    {
        $output = json_encode(array('type'=>'error', 'text' => 'Hay campos necesarios que están vacios!'));
        die($output);
    }

    //Sanitize input data using PHP filter_var().
    $email       = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    $first_name        = filter_var($_POST["first_name"], FILTER_SANITIZE_STRING);
    $last_name        = filter_var($_POST["last_name"], FILTER_SANITIZE_STRING);
    $country        = filter_var($_POST["country"], FILTER_SANITIZE_STRING);
    $zip        = filter_var($_POST["zip"], FILTER_SANITIZE_STRING);
    $linking_from        = filter_var($_POST["linking_from"], FILTER_SANITIZE_STRING);
    $linking_to        = filter_var($_POST["linking_to"], FILTER_SANITIZE_STRING);
    
    $phone          = (isset($_POST["phone"]) ? $_POST["phone"] : "");
    $mobile_phone   = (isset($_POST["mobile_phone"]) ? $_POST["mobile_phone"] : "");
    $address1       = (isset($_POST["address1"]) ? $_POST["address1"] : "");
    $address2       = (isset($_POST["address2"]) ? $_POST["address2"] : "");
    $birth_day      = (isset($_POST["birth_day"]) ? $_POST["birth_day"] : "");
    $birth_month      = (isset($_POST["birth_month"]) ? $_POST["birth_month"] : "");
    $birth_year      = (isset($_POST["birth_year"]) ? $_POST["birth_year"] : "");
    $agree          = (isset($_POST["agree"]) ? $_POST["agree"] : "");
    //proceed with PHP email.
    $data = array(
        'agree' => $agree,
        'email' => $email,
        'first_name' => $first_name,
        'last_name' => $last_name,
        'country' => $country,
        'zip' => $zip,
        'linking_from' => $linking_from,
        'linking_to' => $linking_to,
        'phone' => $phone,
        'mobile_phone' => $mobile_phone,
        'address1' => $address1,
        'address2' => $address2,
        'birth_day' => $birth_day,
        'birth_month' => $birth_month,
        'birth_year' => $birth_year,
    );
    // $message = json_encode($data, JSON_PRETTY_PRINT);
    $message = '
    <table style="font-size: 16px;font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;border-collapse: collapse;border-spacing: 0;width: 100%;">
        <tbody>
            <tr>
              <th style="padding-top: 11px;padding-bottom: 11px;background-color: #4CAF50;color: white;">
                Record Info
              </th>
            </tr>
            ';
    foreach ($data as $clave => $valor) {
        $message .= '
        <tr style="background-color: #f2f2f2;">
            <td style="border: 1px solid #ddd;text-align: left;padding: 8px;">
                '. $clave .'
            </td>
            <td style="border: 1px solid #ddd;text-align: left;padding: 8px;">
                '. $valor .'
            </td>
        </tr>'
        ;
    }
            
    $message .= '</tbody></table>';
    $subject = '[Redescubre el Tequila] New Record from Linking Policy Form';

    //$to_Email = "julie_allen@b-f.com";
    $to_Email = "seba.sch999@gmail.com";

    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
    $headers .= 'Reply-To: '.$email.'' . "\r\n";
    $headers .= 'X-Mailer: PHP/' . phpversion();

    //$headers .= 'To: Julie Allen <julie_allen@b-f.com>' . "\r\n";
    //$headers .= 'Cc: omar@grupoespinaca.cl' . "\r\n";
    $headers .= 'From: Redescubre El Tequila LP <no-reply@redescubreeltequila.cl>' . "\r\n";


        // send mail
    $sentMail = @mail($to_Email, $subject, $message, $headers);
    
    if(!$sentMail)
    {
        $output = json_encode(array('type'=>'error', 'text' => 'No se pudo registrar. Por Favor reintenta'));
        die($output);
    }else{
        $output = json_encode(array('type'=>'message', 'text' => ' El registro ha sido efectuado.'));
        die($output);
    }
}
?>