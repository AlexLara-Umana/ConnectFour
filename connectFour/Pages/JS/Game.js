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
    // This would indicate that the move trying to be used would be invalid
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
          
          // add discs to cell if needed
          if (this.grid[i][j] == 0) td.classList.add('p0');
          else if (this.grid[i][j] == 1) td.classList.add('p1');
          
          row.appendChild(td);
      }
      tablehtml.appendChild(row);
    }
  }

  inBounds(row, col) {
    return row >= 0 && col >= 0 && row < this.numrows && col < this.numcols;
  }

  checkWin(row, col) {
    // Here we'll be checking every direction (left, right, up, down, diagonal) for win
    let moves = [[0,1], [1,0], [1,1], [1,-1]];
    let player = this.grid[row][col];
    if (player == undefined)
      return false;

    for (let move of moves) {
      let count = 1

      // Here we'll check in one direction, then in the opposite direction while tracking the count of nodes from current player
      for (let mult of [-1,1]) {
        // We'll start from the starting node
        let rowcur = row;
        let colcur = col;

        let rowdir = move[0] * mult;
        let coldir = move[1] * mult;
        while (this.inBounds(rowcur + rowdir, colcur + coldir)) {
          rowcur += rowdir;
          colcur += coldir;
  
          if (this.grid[rowcur][colcur] == player) {
            count += 1;
          } else {
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

    // Here we'll make sure the move is valid
    if (row == -1) {
      alerthtml.innerText = "You can't make that move!";
      return;
    }
    alerthtml.innerText = "";

    // Here we'll check whos turn it currently is
    let player = this.#getPlayerToMove();
    
    // In order to move as the current player
    this.grid[row][col] = player;
    let cell = document.getElementById(row+"-"+col);
    cell.classList.add("p"+player);
    this.#nummoves += 1;
    
    // Here we'll just update the hud
    moveplayer.innerText = this.colors[this.playerMove];
    movecount.innerText = this.#nummoves;

    // We'll be checking for draws
    if (this.#nummoves == 42) {
      result = -1;
      alerthtml.innerText = "It's a Draw!";
      return true;
    }

    //  Then we'll be checking for wins as well
    if (this.checkWin(row, col)) {
      result = player;
      alerthtml.innerText = this.colors[player] + " Wins!";
      return true;
    }

    return false;
  }

  flip() {
    let NewBoard = new Board(this.numrows, this.numcols, this.color0, this.color1);
    
    // This will flip the board by placing the discs into the new board from the top of each column to the bottom
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

  countDiscSequences(player, size) {
    let sequences = 0;

    // This is for our horizontal sequences
    for (let i = 0; i < this.numrows; i++) {
      let count = 0;
      for (let j = 0; j < this.numcols; j++) {
        if (this.grid[i][j] != player) {
          count = 0;
          continue;
        }
        count += 1
        if (count >= size) {
          sequences += 1;
        }
      }
    }

    // This is for our vertical sequences
    for (let j = 0; j < this.numcols; j++) {
      let count = 0;
      for (let i = 0; i < this.numrows; i++) {
        if (this.grid[i][j] != player) {
          count = 0;
          continue;
        }
        count += 1
        if (count >= size) {
          sequences += 1;
        }
      }
    }

    const dirs = [[1,1],[1,-1]];

    // Here we'll check the top row in both diagonal directions
    for (let dir of dirs) {
      for (let col = 0; col <= this.numcols; col++) {
        let count = 0;
        let currow = 0;
        let curcol = col;
        if (this.grid[currow][curcol] == player) // We'll start the count at 1 if we're starting on the player's tile
          count++;
        while (this.inBounds(currow + dir[0], curcol + dir[1])) {
          currow += dir[0];
          curcol += dir[1];

          if (this.grid[currow][curcol] == player) {
            count += 1;
            if (count >= size) {
              sequences += 1;
              count = 0;
            }
          } else {
            count = 0;
          }
        }
      }
    }

    let rows = [];  // Here we'll get the row which needs to be checked on the left and right side of our grid
    for (let i = 1; i <= this.grid[0].length - size; i++) {
      rows.push(i);
    }

    for (let row of rows) { // Here we'll count the diagonals starting from the left side of the grid
      let dir = [1,1];
      let currow = row;
      let curcol = 0;
      let count = 0;
      if (this.grid[currow][curcol] == player) {
        count += 1;
      }
      while (this.inBounds(currow + dir[0], curcol + dir[1])) {
        currow += dir[0];
        curcol += dir[1];

        if (this.grid[currow][curcol] == player) {
          count += 1;
          if (count >= size) {
            sequences += 1;
            count = 0;
          }
        } else {
          count = 0;
        }
      }
    }

    for (let row of rows) { // We'll count the diagonals starting from the right side of the grid
      let dir = [1,-1];
      let currow = row;
      let curcol = this.numcols - 1;
      let count = 0;
      if (this.grid[currow][curcol] == player) {
        count += 1;
      }
      while (this.inBounds(currow + dir[0], curcol + dir[1])) {
        currow += dir[0];
        curcol += dir[1];

        if (this.grid[currow][curcol] == player) {
          count += 1;
          if (count >= size) {
            sequences += 1;
            count = 0;
          }
        } else {
          count = 0;
        }
      }
    }
    return sequences;
  }
}

var gameOver = false;
let result;
const board_size = board_sizes[localStorage.getItem("board-size")].split('x');
const color0 = colors[localStorage.getItem("p0-color")];
const color1 = colors[localStorage.getItem("p1-color")];
const three_count_labels = document.getElementsByClassName('three-count-label');
three_count_labels[0].innerText = '# of Potential Fours: ' + color0;
three_count_labels[1].innerText = '# of Potential Fours: ' + color1;
const GameBoard = new Board(parseInt(board_size[0]), parseInt(board_size[1]), color0, color1);
GameBoard.init();
flipbutton.addEventListener('click', handleFlip);

function handleGameOver() {
  // This will stop the timer
  clearInterval(gametime);
  // show button to play again
  replay.innerText = "If you'd like to Play Again, Click Here!";
  replay.onclick = function() { window.location.reload(); }

  // This will remove the event listeners once the game is over by cloning and replacing cells, this is done by this method so as to prevent the need to know the exact function called by each event listener
  let cells = document.getElementsByClassName('cell');
  for (let cell of cells) {
    let newcell = cell.cloneNode(true);
    cell.parentNode.replaceChild(newcell, cell);
  }
  let newflipbutton = flipbutton.cloneNode(true);
  flipbutton.parentNode.replaceChild(newflipbutton, flipbutton);
  updateDBStats();
}

function handleClick(eventid) {
  if (!gameOver) {
    let coords = eventid.split("-");
    gameOver = GameBoard.move(parseInt(coords[1]));
    const three_counts = document.getElementsByClassName('three-count');
    three_counts[0].innerText = GameBoard.countDiscSequences(0, 3);
    three_counts[1].innerText = GameBoard.countDiscSequences(1, 3);
    
    if (!gameOver) handleHint(GameBoard.peekPlayerToMove());

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

function handleHint(player) {
  function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function expandBoardStates(boardStateList, curplayer) {
    let newBoards = [];
    let moves = [];
    for (let board of boardStateList) {
      let copiedBoard = deepCopy(board.grid); // A deep copy of our board is made to ensure we don't break the original board
      for (let i = 0; i < board_size[1]; i++) {
        let newBoardObj = new Board(board_size[0], board_size[1], color0, color1);
        newBoardObj.grid = deepCopy(copiedBoard);  // A deep copy is done so again to ensure separate board instances
        let row = newBoardObj.findMoveRow(i);
        if (row == -1)  // If the move is invalid then we don't check it
        continue;
        newBoardObj.grid[row][i] = curplayer;
        newBoards.push(newBoardObj);
        moves.push(i);
      }
    }
    return [newBoards, moves];
  }

  function findHint(boardStateList, moves) {
    let hint = -1;
    for (let i = 0; i < boardStateList.length; i++) {
      if (hint != -1) break;  // Here we'll end early if a hint is found
      for (let row = 0; row < boardStateList[i].numrows; row++) {
        if (hint != -1) break;
        for (let col = 0; col < boardStateList[i].numcols; col++) {
          if (boardStateList[i].checkWin(row, col)) {
            hint = moves[i];
            break;
          }
        }
      }
    }
    return hint;
  }

  function displayHint(hint){
    if (hint != -1) {
      let playerStr;
      if (player == 0)
        playerStr = color0;
      else
        playerStr = color1;
      alerthtml.innerHTML = playerStr + ' Hint: Perhaps check column ' + (hint + 1);
      return true;
    }
    return false;
  }

  // For a winning hint
  let newBoards;
  let moves;
  [newBoards, moves] = expandBoardStates([GameBoard], player);
  let hint = findHint(newBoards, moves);  
  if (displayHint(hint)) return;

  // For a blocking hint
  let opponent = Math.abs(player - 1);
  [newBoards, moves] = expandBoardStates([GameBoard], opponent);
  hint = findHint(newBoards, moves);
  if (displayHint(hint)) return;
}

function handleFlip() {
  let player = GameBoard.peekPlayerToMove();
  if (player == 0) { // Initial Player
    if (!GameBoard.p0flip) { // Verify if the powerup has been used
      alerthtml.innerHTML = "Player " + GameBoard.colors[player] + " has already utilized their Power-Up!";
      return;
    }
    GameBoard.p0flip = false; // Here we'll set the powerup as used
  } else { // The Second Player
    if (!GameBoard.p1flip) {
      alerthtml.innerHTML = "Player " + GameBoard.colors[player] + " has already utilized their Power-Up!";
      return;
    }
    GameBoard.p1flip = false;
  }
  GameBoard.flip();
  flipbutton.style.opacity = '50%';
  alerthtml.innerHTML = "Player " + GameBoard.colors[player] + " activated the Power-Up!";
  const three_counts = document.getElementsByClassName('three-count');
  three_counts[0].innerText = GameBoard.countDiscSequences(0, 3);
  three_counts[1].innerText = GameBoard.countDiscSequences(1, 3);

  let winners = [false, false];

  // This will check the entire board for wins due to using the flip
  for (let i = 0; i < GameBoard.numrows; i++) {
    for (let j = 0; j < GameBoard.numcols; j++) {
      // Here we skip empty cells
      if (GameBoard.grid[i][j] == undefined) continue;
      // And here we check for wins in the populated cells
      if (GameBoard.checkWin(i, j)) {
        winners[GameBoard.grid[i][j]] = true;
      }
    }
  }

  // If neither player wins then we terminate early
  if (!(winners[0] || winners[1])) {
    handleHint(GameBoard.peekPlayerToMove());
    return;
  }

  // Here we'll be checking for draws first, then for a  winner
  if (winners[0] && winners[1]) {
    alerthtml.innerText = "It's a Tie!";
    result = -1;
  } else if (winners[0]) {
    alerthtml.innerText = GameBoard.colors[0] + " has Won!";
    result = 0;
  } else {
    alerthtml.innerText = GameBoard.colors[1] + " has Won!";
    result = 1;
  }
  gameOver = true;
  handleGameOver();
}

function showPlacement(elemId) {
  // This will create div, showing where our current move will be played
  const moveindicator = document.createElement("div");
  moveindicator.style.borderRadius = "inherit";
  moveindicator.style.opacity = 0.25;
  moveindicator.style.backgroundColor = GameBoard.colors[GameBoard.peekPlayerToMove()];
  moveindicator.style.height = "inherit"
  moveindicator.style.width = "inherit"

  // Here we'll get our move placements
  let col = elemId.split('-')[1];
  let row = GameBoard.findMoveRow(parseInt(col));

  // Then here we put indicators in the target cell
  const targethtml = document.getElementById(row + "-" + col);
  if (targethtml == null) return;

  targethtml.replaceChildren(moveindicator);
}

function hidePlacement(elemId) { 
  let col = elemId.split('-')[1];
  let row = GameBoard.findMoveRow(parseInt(col));

  // remove move indicator
  const targethtml = document.getElementById(row + "-" + col)
  if (targethtml == null) return;
  
  targethtml.innerHTML = "";
}

async function updateDBStats() {

  // Here we simply check if the user is logged in
  let isLoggedIn = await fetch('../PHP/Loggedin.php', {
    method: 'GET'
  }).then((response => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  }));

  // If not, then we won't update the stats if user isn't logged in
  if (isLoggedIn == 0) return;

  // Here we'll calculate how many seconds elapsed during the game
  let time_elapsed = timecount.innerText.split(':');
  let seconds = parseInt(time_elapsed[0]) * 60 + parseInt(time_elapsed[1]);
  // We'll also add the seconds to the user's time played

  // Then we update the stats in our DB
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