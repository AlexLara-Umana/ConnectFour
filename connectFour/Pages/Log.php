<!DOCTYPE html>
<html>
  <head>
    <meta lang="en">
    <meta charset="utf-8">
    <link rel="stylesheet" href="./CSS/Account.css">
    <link rel="stylesheet" href="./../Index.css">
    <title>Connect 4 - Log In</title>
  </head>
  <body>
  <div class="bg"></div>
    <div class="bg bg2"></div>
    <div class="bg bg3"></div>
    <div id="title">Log In</div>
<form action="./../PHP/Login.php" class="loggedout" method="POST">
      <table id="menu">
          <tr><td> <p style="color:yellow; font-size: 30px;">Please fill in your credentials to login.</p> </tr></td>
          <tr><td><input name="login" type="text" class="menu-button" placeholder="Username"></td></tr>
            <span><?php echo $username_err; ?></span>
          <tr><td><input name="password" type="password" class="menu-button" placeholder="Password"></td></tr>
            <span><?php echo $password_err; ?></span>
          <tr><td><input type="submit" value="Login" class="menu-button"></input></td></tr>
          <tr><td> <input type="reset" value="Reset"  class="menu-button"> </td></tr>
            </div>
            <tr><td><p style="color:yellow; font-size: 20px;">Don't have an account? <a href="Reg.php">Sign up now</a>.</p> </td></tr>
      </table>
    </form>
    <div><a href="../Index.html"><img id="back-button" src="../IMG/back.webp"></a></div>
    <script src="./JS/Account.js"></script>
  </body>
</html>
