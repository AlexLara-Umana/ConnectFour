import { colors, board_sizes } from './SetUp.js';

const tablehtml = document.getElementById("board");
const moveplayer = document.getElementById("move-player");
const movecount = document.getElementById("move-count");
const alerthtml = document.getElementById("alert");
const timecount = document.getElementById("time-count");
const replay = document.getElementById("replay");
const flipbutton = document.getElementById("flip-button");

class Board {
  #nummoves = 0;
  
  constructor(row, col, color0, color1, winnum = 4) {
    this.numrows = row;
    this.numcols = col;
    this.grid = Array.from(Array(row), () => new Array(col));
    this.colors = [color0, color1];
    this.winnum = winnum;
    this.p0flip = true;
    this.p1flip = true;
    this.playerMove = 0;
  }

  init() {
    moveplayer.innerText = this.colors[this.playerMove];
    this.#setColors();
    this.drawBoard();
  }

  #setColors() {
    let stylesheet = document.styleSheets[0];

    stylesheet.insertRule(".p0 { background-color: " + this.colors[0] +"; }", stylesheet.cssRules.length);
    stylesheet.insertRule(".p1 { background-color: " + this.colors[1] +"; }", stylesheet.cssRules.length);
    stylesheet.insertRule(".cell { border: 3px " + colors[localStorage.getItem("board-color")] + " solid; }", stylesheet.cssRules.length);
    
  }

  #getPlayerToMove() {
    this.playerMove = Math.abs(this.playerMove - 1);
    return Math.abs(this.playerMove - 1);
  }

  peekPlayerToMove() {
    return this.playerMove;
  }
  
  findMoveRow(col) {
    for (let i = this.numrows - 1; i >=0; i--) {
      if (this.grid[i][col] != undefined) {
        continue;
      }
      return i;
    }
    // You wouldn't be able to make this move
    return -1;
  }

  drawBoard() {
    for (let i = 0; i < this.numrows; i++) {
      let row = document.createElement("tr");
      for (let j = 0; j < this.numcols; j++) {
          let td = document.createElement("td");
          td.classList.add("cell");
          td.id = i+"-"+j;
          td.addEventListener('click', function() { handleClick(this.id); showPlacement(this.id); });
          td.onmouseenter = function() { showPlacement(this.id); }
          td.onmouseleave = function() { hidePlacement(this.id); }
          
          // Adds discs to the cells if applicable
          if (this.grid[i][j] == 0) td.classList.add('p0');
          else if (this.grid[i][j] == 1) td.classList.add('p1');
          
          row.appendChild(td);
      }
      tablehtml.appendChild(row);
    }
  }

  #inBounds(row, col) {
    return row >= 0 && col >= 0 && row < this.numrows && col < this.numcols;
  }

  checkWin(row, col) {
    // Checks every direction (left, right, up, down, diagonal) for win condition
    let moves = [[0,1], [1,0], [1,1], [1,-1]];
    let player = this.grid[row][col];

    for (let move of moves) {
      let count = 1

      // Checks in one direction, then the opposite direction while tracking the count of nodes from the current player
      for (let mult of [-1,1]) {
        // Starts from the starting node
        let rowcur = row;
        let colcur = col;

        let rowdir = move[0] * mult;
        let coldir = move[1] * mult;
        while (this.#inBounds(rowcur + rowdir, colcur + coldir)) {
          rowcur += rowdir;
          colcur += coldir;
  
          if (this.grid[rowcur][colcur] == player) {
            count += 1;
            alerthtml.innerText = this.colors[player] + " has a Win Condition!";
          } 
          else {
            break;
          }
        }
      }
      if (count >= 4) {
        return true;
      }
    }
    return false;
  }

  move(col) {
    let row = this.findMoveRow(col);

    // Verifies if the move is valid
    if (row == -1) {
      alerthtml.innerText = this.colors[player] + " can't make that move!";
      return;
    }
    alerthtml.innerText = "";

    // Gets whos turn it is at the moment
    let player = this.#getPlayerToMove();
    
    // Plays the move as the current player
    this.grid[row][col] = player;
    let cell = document.getElementById(row+"-"+col);
    cell.classList.add("p"+player);
    this.#nummoves += 1;
    
    // Updates the hud
    moveplayer.innerText = this.colors[this.playerMove];
    movecount.innerText = this.#nummoves;

    // Checks for a draw
    if (this.#nummoves == 42) {
      result = -1;
      alerthtml.innerText = "It's a Draw!";
      return true;
    }

    // Checks for a win
    if (this.checkWin(row, col)) {
      result = player;
      alerthtml.innerText = this.colors[player] + " Wins!";
      return true;
    }

    return false;
  }

  flip() {
    let NewBoard = new Board(this.numrows, this.numcols, this.color0, this.color1);
    
    // flip board by playing moves in new board from top of each column to bottom
    for (let i = 0; i < this.numrows; i++) {
      for (let j = 0; j < this.numcols; j++) {
        if (this.grid[i][j] == undefined) continue;

        NewBoard.playerMove = this.grid[i][j];
        NewBoard.move(j);
      }
    }

    this.grid = NewBoard.grid;
    tablehtml.innerHTML = "";
    this.drawBoard();
    moveplayer.innerText = this.colors[this.playerMove];
  }
}

var gameOver = false;
let result;
const board_size = board_sizes[localStorage.getItem("board-size")].split('x');
const color0 = colors[localStorage.getItem("p0-color")];
const color1 = colors[localStorage.getItem("p1-color")];
const GameBoard = new Board(parseInt(board_size[0]), parseInt(board_size[1]), color0, color1);
GameBoard.init();
flipbutton.addEventListener('click', function() { handleFlip(); });

function handleGameOver() {
  // Stops the timer
  clearInterval(gametime);
  // Shows the button to play again
  replay.innerText = "Click here if you'd like to Play Again!";
  replay.onclick = function() { window.location.reload(); }

  // Removes the event listeners the moment the game is over by cloning and then replacing cells
  let cells = document.getElementsByClassName('cell');
  for (let cell of cells) {
    let newcell = cell.cloneNode(true);
    cell.parentNode.replaceChild(newcell, cell);
  }

  updateDBStats();
}

function handleClick(eventid) {
  if (!gameOver) {
    let coords = eventid.split("-");
    gameOver = GameBoard.move(parseInt(coords[1]));

    if (!GameBoard.p0flip && GameBoard.peekPlayerToMove() == 0) {
      flipbutton.style.opacity = '50%';
    } 
    else if (!GameBoard.p1flip && GameBoard.peekPlayerToMove() == 1) {
      flipbutton.style.opacity = '50%';
    } 
    else {
      flipbutton.style.opacity = '100%';
    }
  }
  if (gameOver) {
    handleGameOver();
  }
}

function handleFlip() {
  let player = GameBoard.peekPlayerToMove();
  if (player == 0) { // The initial player
    if (!GameBoard.p0flip) { // Checks if the powerup has been used yet
      alerthtml.innerHTML = "Player " + GameBoard.colors[player] + " Swtich already utilized!";
      return;
    }
    GameBoard.p0flip = false; // Sets the powerup as used
  } 
  else { // Player 2
    if (!GameBoard.p1flip) {
      alerthtml.innerHTML = "Player " + GameBoard.colors[player] + " Switch already utilized!";
      return;
    }
    GameBoard.p1flip = false;
  }
  GameBoard.flip();
  flipbutton.style.opacity = '50%';
  alerthtml.innerHTML = "Player " + GameBoard.colors[player] + " used Switch!";

  let winners = [false, false];

  // Checks the entire board for wins due to the flip ability
  for (let i = 0; i < GameBoard.numrows; i++) {
    for (let j = 0; j < GameBoard.numcols; j++) {
      // Skips the empty cells
      if (GameBoard.grid[i][j] == undefined) continue;
      // Checks for a win in the populated cells
      if (GameBoard.checkWin(i, j)) {
        winners[GameBoard.grid[i][j]] = true;
      }
    }
  }

  // If neither player wins then we terminate early
  if (!(winners[0] || winners[1])) return;

  // Checks for a draw then a winner
  if (winners[0] && winners[1]) {
    alerthtml.innerText = "Draw!";
    result = -1;
  } 
  else if (winners[0]) {
    alerthtml.innerText = GameBoard.colors[0] + " Wins!";
    result = 0;
  } 
  else {
    alerthtml.innerText = GameBoard.colors[1] + " Wins!";
    result = 1;
  }
  gameOver = true;
  handleGameOver();
}

function showPlacement(elemId) {
  // Creates the div showing where current move will be played
  const moveindicator = document.createElement("div");
  moveindicator.style.borderRadius = "inherit";
  moveindicator.style.opacity = 0.25;
  moveindicator.style.backgroundColor = GameBoard.colors[GameBoard.peekPlayerToMove()];
  moveindicator.style.height = "inherit"
  moveindicator.style.width = "inherit"

  // Gets the move placement
  let col = elemId.split('-')[1];
  let row = GameBoard.findMoveRow(parseInt(col));

  // Puts an indicator in our target cell
  const targethtml = document.getElementById(row + "-" + col);
  if (targethtml == null) return;

  targethtml.replaceChildren(moveindicator);
}

function hidePlacement(elemId) { 
  let col = elemId.split('-')[1];
  let row = GameBoard.findMoveRow(parseInt(col));

  // Takes away the move indicator
  const targethtml = document.getElementById(row + "-" + col)
  if (targethtml == null) return;
  
  targethtml.innerHTML = "";
}

async function updateDBStats() {

  // Checks if the user is logged in
  let isLoggedIn = await fetch('../PHP/Loggedin.php', {
    method: 'GET'
  }).then((response => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  }));

  // Doesn't make changes to stats if the user isn't logged in
  if (isLoggedIn == 0) return;

  // Checks how many seconds elapsed during the game
  let time_elapsed = timecount.innerText.split(':');
  let seconds = parseInt(time_elapsed[0]) * 60 + parseInt(time_elapsed[1]);
  // Adds seconds to user's time played

  // Updates the stats in our DB
  let url = '../PHP/upStat.php?result=' + result + '&time=' + seconds;

  let request = new XMLHttpRequest();
  request.open('GET', url);
  request.send();
}

var pageloadtime = new Date();
let gametime = setInterval(function() {
  let now = new Date();
  let secs = (now.getTime() - pageloadtime.getTime()) / 1000;
  let strMins = String(Math.floor(secs / 60)).padStart(2, '0');
  let strSecs = String(Math.floor(secs % 60)).padStart(2, '0');
  timecount.innerText = strMins + ":" + strSecs;
}, 1000);