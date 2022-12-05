<!DOCTYPE html>
<html>
  <head>
    <meta lang="en">
    <meta charset="utf-8">
    <link rel="stylesheet" href="./../Index.css">
    <title>Connect 4 - Register</title>
  </head>
  <body>
    <div class="bg"></div>
    <div class="bg bg2"></div>
    <div class="bg bg3"></div>
    <div id="title">Register</div>
<form action="./../PHP/Register.php" class="loggedout" method="POST">
      <table id="menu" class="register">
      <tr><td> <p style="color:yellow; font-size: 30px;"> Please fill this form to create an account. </p> </tr></td>
        <tr><td><input name="login" type="text" class="menu-button" placeholder="Username"></td></tr>                 
          <span><?php echo $username_err; ?></span>
        <tr><td><input name="password" type="password" class="menu-button" placeholder="Password"></td></tr>
          <span><?php echo $password_err; ?></span>
        <tr><td><input name="password-confirm" type="password" class="menu-button" placeholder="Confirm Password"></td></tr>
          <span><?php echo $confirm_password_err; ?></span>
        <tr><td><input type="submit" value="Register" class="menu-button"></input></td></tr>
        <tr><td> <input type="reset" value="Reset"  class="menu-button"> </td></tr>
            </div>
          <tr><td> <p style="color:yellow; font-size: 20px;">Already have an account? <a href="Log.php">Login here</a>.</p> </td></tr>
      </table>
    </form>
    <div><a href="../Index.html"><img id="back-button" src="../IMG/back.webp"></a></div>
    <script src="./JS/Account.js"></script>
  </body>
</html>
