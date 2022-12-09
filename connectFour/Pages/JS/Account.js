const logout_button = document.getElementById('logout');
logout_button.addEventListener('click', logout);

function configureLoginPage() {
  fetch('../PHP/Loggedin.php', {
    method: 'GET'
  })
  .then((response) => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  }).then((json) => {
    if (json == 0) {
      // Shows the forms for registration and login if the user isn't logged in
      showForms();
    } 
    else if (json == 1) {
      // Shows the user's stats if the user is logged in
      displayUserStats();
    }
  }).catch((err) => {
    console.error(err);
  });
}

function showForms() {
  const forms = document.getElementsByClassName('loggedout');
  for (let form of forms)
    form.hidden = 0;
}

function getUsername() {
  return fetch('../PHP/getUser.php', {
    method: 'GET'
  })
  .then((response) => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  }).then((json) => {
    return json;
  }).catch((err) => {
    console.error(err);
  });
}

async function displayUserStats() {
  // Shows the user's stats
  const user_stats = document.getElementsByClassName('user-stats');
  for (let stat of user_stats) stat.hidden = 0;

  const user_welcome = document.getElementById('user-welcome');
  const user_wins = document.getElementById('user-wins');
  const user_losses = document.getElementById('user-losses');
  const user_draws = document.getElementById('user-draws');
  const user_time_played = document.getElementById('user-time-played');

  user_welcome.placeholder = await getUsername();
  let stats = await getStats();
  // Displays the user's stats
  user_wins.placeholder = 'wins: ' + stats['wins'];
  user_losses.placeholder = 'losses: ' + stats['losses'];
  user_draws.placeholder = 'draws: ' + stats['draws'];
  
  // Calculates the time in hour-minute-second format and then display's them to the user
  let seconds = stats['time_played'];
  let hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  let minutes = Math.floor(seconds / 60);
  seconds %= 60;
  user_time_played.placeholder = `Duration: ${hours}h${minutes}m${seconds}s`;
}

async function logout() {
  await fetch('../PHP/Logout.php', {
    method: 'GET'
  });
  location.reload();
}

function getStats() {
  return fetch('../PHP/getStats.php', {
    method: 'GET'
  })
  .then((response) => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  }).then((json) => {
    return json;
  }).catch((err) => {
    console.error(err);
  });
}

configureLoginPage();