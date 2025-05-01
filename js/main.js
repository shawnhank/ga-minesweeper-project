/*-------------------------------- Constants --------------------------------*/
const BOARD_ROWS = 9;
const BOARD_COLS = 9;
const TOTAL_TILES = BOARD_ROWS * BOARD_COLS;  // total number of tiles
const TOTAL_MINES = Math.floor(TOTAL_TILES * 0.2);  // 20% of tiles are mines

// Audio feedback
const explosionSound = new Audio('audio/explosion.mp3');
explosionSound.volume = 0.5;

const applauseSound = new Audio('audio/crowd-applause.mp3');
applauseSound.volume = 0.5;

const clickSound = new Audio('audio/mouse-click.mp3');
clickSound.volume = 0.25;

const flagSound = new Audio('audio/subtle-click.mp3');
flagSound.volume = 0.25;
/*---------------------------- Variables (state) ----------------------------*/

let board;                // set empty board
let isGameOver;           // Set game over status
let tilesRevealedCount;   // Set reveal tile
let bombCounter;          // Set bomb counter count
let firstClick = false;   // Set first click to false
let flagCount = 0;      // how many tiles are flagged
let timer = 0;          // current time in seconds
let timerInterval = null; // store timer loop ID so we can stop it
let isPaused = false;

/*------------------------ Cached Element References ------------------------*/

const boardEl = document.getElementById('game-board');  // Attach one event listener for all tiles (aka event delegation)
const faceBtnEl = document.getElementById('face-button');  //event listeners for click and contextmenu
const backBtnEl = document.getElementById('back-to-home');  //event listners for back to home button.
const flagCounterEl = document.getElementById('flag-counter');  // Red counter display for flags; increment on right click flag placement
const timerEl = document.getElementById('game-timer');  // Red counter display for time; start on first left click of gam



/*----------------------------- Event Listeners -----------------------------*/
// 	addEventListener() is how we tell JavaScript to listen for an event happening.

// Suppress right-click context menu on game tiles only
document.addEventListener('contextmenu', function (evt) {
  if (evt.target.classList.contains('tile')) {
    evt.preventDefault();
  }
});

// Attach a left-click event listener to the board container.
boardEl
  .addEventListener('click', handleTileClick);

// Attach a right-click "contextmenu" event listener to the board container.
boardEl
  .addEventListener('contextmenu', handleTileClick);

// LEFT-CLICK face button: pause/resume if game is running
faceBtnEl.addEventListener('click', function(evtObj) {
  if (isGameOver || !firstClick) return;  // only allow pause after first click, not after game over
  pauseGame();  // toggle pause/resume
});

// RIGHT-CLICK face button: reset the game if it's started (prevent browser menu)
faceBtnEl.addEventListener('contextmenu', function(evtObj) {
  evtObj.preventDefault();  // stop browser menu

  if (firstClick) {
    isPaused = false;
    resetGame();  // reset regardless of paused state
  }
});

//left-click back-button to landing page
backBtnEl
  .addEventListener('click', function() {
    window.location.href = '../landing/index.html';
  });

/*-------------------------------- Functions --------------------------------*/

/*=====================*/
/*    SETUP FUNCTIONS  */
/*=====================*/
function startGame() {
  board = [];
  // Create each row in the board.
  // Moved to 2D array from single to match connect four game
  for (let rowIdx = 0; rowIdx < BOARD_ROWS; rowIdx++) {
    // Initialize each row as an empty array
    board[rowIdx] = [];  
    // Create a column in the current row
    for (let colIdx = 0; colIdx < BOARD_COLS; colIdx++) {
      // Set each cell as an object with default values
      // Each cell will store properties like mine status, revealed status, etc.
      board[rowIdx][colIdx] = {
        isMine: false,          // Default is false
        isRevealed: false,      // Default is hidden
        isFlagged: false,       // Default is false
        adjMineCount: 0,        // Count of mines in adjacent tiles (starts at 0 )
        adjTiles: [],           // array of a tile's adjacent tiles (starts empty)
        rowIdx,
        colIdx 
      };
     
    }
  };
  firstClick = false;     // Ensure firstClick is reset
  tilesRevealedCount = 0; // Reset revealed counter 
  
  isGameOver = false;
  
  renderBoard();
};

/*=====================*/
/*  RENDERING FUNCTIONS  */
/*=====================*/

function render() {
  renderBoard();
};

function renderBoard() {
  

  board.forEach((rowArray, rowIdx) => {
    rowArray.forEach((tileValue, colIdx) => {
      renderTile(rowIdx, colIdx);
      renderFlag(rowIdx, colIdx);
    });
  });
};

function renderTile(rowIdx, colIdx) {
  const tile = board[rowIdx][colIdx];                            // Get tile object from board
  const tileEl = document.getElementById(`r${rowIdx}c${colIdx}`); // Get matching DOM element
  tileEl.classList.remove('revealed', 'mine-hit');
  tileEl.innerHTML = '';  // Always reset tile content
  console.log(`renderTile [${rowIdx}, ${colIdx}] | Revealed: ${tile.isRevealed}, Flagged: ${tile.isFlagged}`);

  if (tile.isRevealed) {
    tileEl.classList.add('revealed');

    if (tile.isMine) {
      tileEl.innerHTML = '<img src="images/mine.svg" alt="Mine" class="icon">';
      tileEl.classList.add('mine-hit');
    } else if (!isGameOver && tile.adjMineCount > 0) {
      // 👈 Only show numbers if game is NOT over
      tileEl.innerHTML = `<img src="images/${tile.adjMineCount}.svg" class="icon" alt="${tile.adjMineCount}">`;
    }
  }
};

function renderFlag(rowIdx, colIdx) {
  console.log('renderFlag: updating all flagged tile elements...');
    const tile = board[rowIdx][colIdx];
    const tileEl = document.getElementById(`r${rowIdx}c${colIdx}`);
    if (!tile.isRevealed && tile.isFlagged) {
      tileEl.innerHTML = '<img src="images/red_flag.svg" class="icon" alt="Flag">';
    console.log(`Flag rendered at [${rowIdx}, ${colIdx}]`);     
  }
  console.log(`renderFlag complete.`); 
};



// Updates flag counter and timer display on the board
function updateDisplays() {
  // Convert flag count to a 3-digit string (e.g. 5 → "005")
  flagCounterEl.textContent = String(flagCount).padStart(3, '0');

  // Convert timer value to 3-digit string (e.g. 42 → "042")
  timerEl.textContent = String(timer).padStart(3, '0');
};

// Starts game timer and updates every second
function startTimer() {
  timerInterval = setInterval(() => {
    if (!isPaused) {        // if isPaused is not false
      timer++;              // increment timer each second
      updateDisplays();     // update UI to reflect new time
    }
  }, 1000);
};

function launchPauseEmojis() {
  const overlay = document.getElementById('pause-overlay');
  overlay.innerHTML = ''; // clear any old emojis

  const numEmojis = 40; // ← this must be inside here

  for (let i = 0; i < numEmojis; i++) {
    const emoji = document.createElement('div');
    emoji.classList.add('floating-emoji');
    emoji.textContent = '😴';

    emoji.style.left = Math.random() * 100 + 'vw';
    emoji.style.top = Math.random() * 100 + 'vh';

    emoji.style.setProperty('--x-move', `${(Math.random() - 0.5) * 200}vw`);
    emoji.style.setProperty('--y-move', `${(Math.random() - 0.5) * 200}vh`);

    const size = (Math.random() * 4 + 3).toFixed(2); // NEW: 4vmin to 10vmin
    emoji.style.setProperty('--size', `${size}vmin`);
    emoji.style.setProperty('--scale', size); // ← THIS is what was missing

    emoji.style.animationDelay = Math.random() * 0.5 + 's';

    overlay.appendChild(emoji);
  }

  setTimeout(() => {
    overlay.innerHTML = '';
  }, 5000);
};

function launchLoseEmojis() {
  const overlay = document.getElementById('pause-overlay');
  overlay.innerHTML = ''; // clear any old emojis

  const numEmojis = 40; // ← this must be inside here

  for (let i = 0; i < numEmojis; i++) {
    const emoji = document.createElement('div');
    emoji.classList.add('floating-emoji');
    emoji.textContent = '😭';

    emoji.style.left = Math.random() * 100 + 'vw';
    emoji.style.top = Math.random() * 100 + 'vh';

    emoji.style.setProperty('--x-move', `${(Math.random() - 0.5) * 200}vw`);
    emoji.style.setProperty('--y-move', `${(Math.random() - 0.5) * 200}vh`);

    const size = (Math.random() * 4 + 3).toFixed(2); // NEW: 4vmin to 10vmin
    emoji.style.setProperty('--size', `${size}vmin`);
    emoji.style.setProperty('--scale', size); // ← THIS is what was missing

    emoji.style.animationDelay = Math.random() * 0.5 + 's';

    overlay.appendChild(emoji);
  }

  setTimeout(() => {
    overlay.innerHTML = '';
  }, 5000);
};



function revealAllTiles() {
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      board[row][col].isRevealed = true;
    }
  }
};

/*=====================*/
/*  EVENT HANDLERS     */
/*=====================*/

function handleTileClick(evtObj) {
  if (isGameOver) return;
  if (isPaused) return;
  const tileEl = evtObj.target.closest('.tile');
  if (!tileEl) return;
  const tileId = tileEl.id;
  const coords = tileId.slice(1).split('c');  // removes "r" and splits at "c"
  const rowIdx = parseInt(coords[0]);         // e.g. from "r10c5" → [10, 5]
  const colIdx = parseInt(coords[1]);
  const clickedTile = board[rowIdx][colIdx];

  // Right-click (flag)
  if (evtObj.button === 2) {
    evtObj.preventDefault(); //disables browser context menu
    if (!firstClick) return;
    if (clickedTile.isRevealed) return;
    // Toggle flag state: flag / unflag
    if (clickedTile.isFlagged) {
      flagCount--;
    } else {
      flagCount++;
    }
    clickedTile.isFlagged = !clickedTile.isFlagged;
    updateDisplays();
    render();
    return;
  }

  // Left-click
  if (evtObj.button === 0) {
    if (!firstClick) {
      setMines(rowIdx, colIdx);
      assignAdjTilesAndCounts();
      firstClick = true;
      startTimer();
    }

    if (clickedTile.isFlagged || clickedTile.isRevealed) return;

    revealTile(rowIdx, colIdx);

    if (clickedTile.isMine) {
      explosionSound.currentTime = 0;
      explosionSound.play();
      isGameOver = true;
      clearInterval(timerInterval);
      revealAllTiles();
      launchLoseEmojis();
      const faceBtn = document.getElementById('face-button');
      faceBtn.textContent = '😭';
    }

    render();
    checkGameOver();
  }
  //console.log('Cascade complete!');
}


/*=====================*/
/*  GAME LOGIC         */
/*=====================*/

function setMines(rowIdx, colIdx) {
  let mineCounter = 0;
  // Loop until all mines (10) are placed 
  while (mineCounter < TOTAL_MINES) {
    // Randomly select a row and column.
    // fixed code to be 2D array like connect four game.
    const randomRow = Math.floor(Math.random() * BOARD_ROWS);
    const randomCol = Math.floor(Math.random() * BOARD_COLS);
    if (!board[randomRow][randomCol].isMine &&               // if tile does not already contain a mine AND
      !(randomRow === rowIdx && randomCol === colIdx)) {     // tile is not the one the user clicked on first
      // If it's not a mine, place the mine
      board[randomRow][randomCol].isMine = true;
      mineCounter++;  // Increment the mine counter
    }
    //console.log(mineCounter);
  }
};

// Returns an array of the 8 surrounding tiles of the selected tile to
// count how many have mines, cascase reveal empty tiles. using this once and
// storing information in global variable board[]. using another 2d array just like in the
// startGame function.
function getAdjTiles(rowIdx, colIdx) {
  // if (rowIdx < 0 || rowIdx >= BOARD_ROWS || colIdx < 0 || colIdx >= BOARD_COLS) {   // guard if testing manaully in the console.
  //   return [];                                                                      // getAdjTiles(4, 4) is inbounds. getAdjTiles(8, 9) is OOB
  // }
  const adjTiles = [];        // array to hold all 8 neighboring tile locations
  const directions = [        // locations of the 8 neighboring tiles of selected tile. Each entry represents: [row offset, col offset] from the current tile.  
    [-1, -1], [-1, 0], [-1, 1], [ 0, -1], [ 0, 1], [ 1, -1], [ 1, 0], [ 1, 1] ];   // starting at upper left corner, left to right, row by row, top to bottom.

  for (let i = 0; i < directions.length; i++) {
    const dRow = directions[i][0];        // vertical direction: -1, 0, or 1
    const dCol = directions[i][1];        // horizontal direction: -1, 0, or 1
    // console.log(`checking adjacent tiles: dRow=${dRow}, dCol=${dCol}`);
    const r = rowIdx + dRow;              // new row index to check
    const c = colIdx + dCol;              // new column index to check
    //console.log(`validating ajdacent tile at r=${r}, c=${c}`);
   
    if (r >= 0 && r < BOARD_ROWS && c >= 0 && c < BOARD_COLS) {         // make sure row & column is not out of bounds
    adjTiles.push(board[r][c]);           // valid tile — add to adjTiles array
    }
  }
    return adjTiles;                      // just return empty for now
};


  // Sets tile.adjMineCount by counting how many .adjTiles are mines
  function countAdjMines(rowIdx, colIdx) {
    const tile = board[rowIdx][colIdx];                   // Get the current tile from the board
    let count = 0;                                        // counter for mines in adjacent tiles
    for (let neighbor of tile.adjTiles) {                 // Loop through each tile in adjTiles (array of ajdacent tiles)
      if (neighbor.isMine) count++;                       // If this neighbor is a mine, +1 to count
      //console.log(`Mine count subtotal ${count}`);
    }
    tile.adjMineCount = count;                            // total mines in neighboring tiles
    //console.log(`mine count total: ${tile.adjMineCount}`);
  };



  // a wrapper function that combines getAdjacentTiles and countAdjMines into one call
function assignAdjTilesAndCounts() {
  for (let rowIdx = 0; rowIdx < BOARD_ROWS; rowIdx++) {       // Loop through each row index
    for (let colIdx = 0; colIdx < BOARD_COLS; colIdx++) {     // Loop through each column index
      const tile = board[rowIdx][colIdx];             // current tile on the board
      tile.adjTiles = getAdjTiles(rowIdx, colIdx);    // get and store surrounding tiles
      countAdjMines(rowIdx, colIdx);                  // calculate how many are mines
    }
  }
};

// sets isRevealed = true for the given tile
function revealTile(rowIdx, colIdx) {   
  //console.log(`Entering revealTile() for tile [${rowIdx}, ${colIdx}]`);         // entering the function for this tile
  const tile = board[rowIdx][colIdx];   // tile location on board at coordinates
  // Skip this tile if it's already revealed or flagged
  if (tile.isRevealed || tile.isFlagged) {
    //console.log(`Skipping tile [${rowIdx}, ${colIdx}] — already revealed or flagged`);
    return;
  }
  // Mark this tile as revealed
  tile.isRevealed = true;
  //console.log(`Revealed tile [${rowIdx}, ${colIdx}] — adjMineCount: ${tile.adjMineCount}`);
  // console.log(tile.isRevealed, board[rowIdx][colIdx]);
  // Cascade reveal: if this tile has zero adjacent mines
  if (tile.adjMineCount === 0) {
    // Loop through each neighboring tile (precomputed in adjTiles)
    for (let neighbor of tile.adjTiles) {
      // Recursively reveal each neighbor
    //  console.log(`Cascading to neighbor at [${neighbor.rowIdx}, ${neighbor.colIdx}]`);
      revealTile(neighbor.rowIdx, neighbor.colIdx);
    }
    //console.log('Cascade complete!');
  }
  renderTile(rowIdx, colIdx);
  renderFlag(rowIdx, colIdx);  // optional cleanup in case tile was flagged
};

  // checks to see if game is over 
  // did user click a tile with a mine - game over - lose
  // did user clear all tiles without clicking mine? game over - win
function checkGameOver() {
  if (isGameOver) return;  // Game is already lost — don't check for win
  let revealedCount = 0;                // counter for all revealed tiles
  for (let rowIdx = 0; rowIdx < board.length; rowIdx++) {              // loop through each row in the board
    // console.log(`Checking row ${rowIdx}...`);
    for (let colIdx = 0; colIdx < board[rowIdx].length; colIdx++) {    // loop through each column in the row
      const tile = board[rowIdx][colIdx];                              // pulling data from global board[] variable.
      //console.log(`Checking tile at row=${rowIdx}, col=${colIdx}`);
      //console.log(`Total Revealed Tiles: ${tile.isRevealed}`);
      //console.log(`Total Mine Tiles: ${tile.isMine}`);  
      if (tile.isRevealed && !tile.isMine) revealedCount++;           // if the tile is revealed and not a mine increment by 1
  }
};
  //console.log(`Total Safe Tiles Revealed: ${revealedCount} / ${TOTAL_TILES - TOTAL_MINES}`);

  if (revealedCount === TOTAL_TILES - TOTAL_MINES) {                  // // total revealed tiles - mine tiles = total safe tiles
    isGameOver = true;                       // mark game as won
    applauseSound.currentTime = 0;  // reset playback to start
    applauseSound.play();          // play crowd cheer
    const faceBtn = document.getElementById('face-button');
    faceBtn.textContent = '😎';  // WIN: sunglasses emoji
    // console.log('You Win! 🎉 ');              // placeholder for win message
  }
};
  
function pauseGame() {
  isPaused = !isPaused; // toggle pause state

  const faceBtn = document.getElementById('face-button');
  faceBtn.textContent = isPaused ? '😴' : '😀';  // Optional: show pause indicator

  if (isPaused) {
    launchPauseEmojis();
  }
  
  console.log(isPaused ? 'Game paused.' : 'Game resumed.');
}


function resetGame() {
  clearInterval(timerInterval);  // stop the previous timer
  timer = 0;                     // reset timer value
  flagCount = 0;                 // reset flag count
  updateDisplays();              // refresh the UI
  startGame();                   // start new game board
  const faceBtn = document.getElementById('face-button');
  faceBtn.textContent = '😀';
};
    
/*=====================*/
/*  GAME STARTUP       */
/*=====================*/

// start new game
startGame();    

// Place the mines randomly on the board
//setMines();


