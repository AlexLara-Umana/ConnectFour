<!DOCTYPE html>
<html>
  <head>
    <meta lang="en">
    <meta charset="utf-8">
    <link rel="stylesheet" href="./CSS/Account.css">
    <link rel="stylesheet" href="./../Index.css">
    <title>Connect 4 - Account</title>
  </head>
  <body>
    <div class="bg"></div>
    <div class="bg bg2"></div>
    <div class="bg bg3"></div>
    <div id="title">Your Profile</div>
    <form class="user-stats">
      <table id="menu">
        <tr><td><input id="user-welcome" class="menu-button loggedin" readonly="readonly"></td></tr>
        <tr><td><input id="user-time-played" class="menu-button loggedin" readonly="readonly"></td></tr>
        <tr><td><input id="user-wins" class="menu-button loggedin" readonly="readonly"></td></tr>
        <tr><td><input id="user-losses" class="menu-button loggedin" readonly="readonly"></td></tr>
        <tr><td><input id="user-draws" class="menu-button loggedin" readonly="readonly"></td></tr>
        <tr><td><input id="logout" class="menu-button loggedin" readonly="readonly" placeholder="Logout"></td></tr>
      </table>
    </form>
    <div><a href="../Index.html"><img id="back-button" src="../IMG/back.webp"></a></div>
    <script src="./JS/Account.js"></script>
  </body>
</html>
