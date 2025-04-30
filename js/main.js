/*-------------------------------- Constants --------------------------------*/
const BOARD_ROWS = 9;
const BOARD_COLS = 9;
const TOTAL_TILES = 81;
const TOTAL_MINES = 10;

/*---------------------------- Variables (state) ----------------------------*/

let board;
let isGameOver;
let tilesRevealedCount;
let bombCounter;
let firstClick = false;

/*------------------------ Cached Element References ------------------------*/

TODO: const boardEl = document.getElementById('game-board');
TODO: const faceBtnEl = document.getElementById('face-button');
TODO: const backBtnEl = document.getElementById('back-to-home');


/*----------------------------- Event Listeners -----------------------------*/
// 	addEventListener() is how we tell JavaScript to listen for an event happening.

// Attach a left-click event listener to the board container.
document.getElementById('game-board')
  .addEventListener('click', handleTileClick);

// Attach a right-click "contextmenu" event listener to the board container.
document.getElementById('game-board')
  .addEventListener('contextmenu', handleTileClick);

// left-click face-button: if the game is over, reset game/board. Otherwise, ignore.
document.getElementById('face-button')
  .addEventListener('click', function(evtObj) {
    if (isGameOver) {
      resetGame();
    }
  });

  // right-click face-button: pause the game
  // and prevent the browser menu from opening.
  document.getElementById('face-button')
  .addEventListener('contextmenu', function(evtObj) {
    evtObj.preventDefault();
    pauseGame();
  });

//left-click back-button to landing page
document.getElementById('back-to-home')
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
      //console.log(board);
    }
  };

  // Set the game over flag to false initially
  isGameOver = false;
  console.log(isGameOver);
  
  // Update the board's display on the screen
  renderBoard();
};

/*=====================*/
/*  RENDERING FUNCTIONS  */
/*=====================*/

function render() {
  renderBoard();
};

function renderBoard() {
  // Loop through each row in the board array
  // (2D array: rows and columns)
  board.forEach((rowArray, rowIdx) => {
    // Loop through each column in the current row
    rowArray.forEach((tileValue, colIdx) => {
      // Generate the cell's unique ID based on its row and column
      const tileId = `r${rowIdx}c${colIdx}`;
      // Target the DOM element for the current tile using its ID
      const tileElement = document.getElementById(tileId);
      // console.log(tileId, tileElement); 
      // Check if the tile is revealed
      if (tileValue.isRevealed) {
        tileElement.classList.add('revealed');      // removes tile
        // If isMine = true, show a bomb icon (💣)
        if (tileValue.isMine) {
          tileElement.innerHTML = '💣';
        } else {
          // Show adjacent mine count or leave blank
          // if no adjacent mines)
          tileElement.innerHTML = tileValue.adjMineCount || '';
        }
      } else {
        // If tile is not revealed, clear the tile content
        tileElement.innerHTML = '';
        tileElement.classList.remove('revealed'); 
      }
      // If mine is suspected, show a flag (🚩)
      if (tileValue.isFlagged) {
        tileElement.innerHTML = '🚩';
      }
    });
  });
};


function renderTile() {

};

function renderFlag() {

};

/*=====================*/
/*  EVENT HANDLERS     */
/*=====================*/

function handleTileClick(evtObj) {
  // will handle all the following
    // 1. Guard: If game is over, return immediately (aka ignore click).
    if (isGameOver) return;
    // console.log("Game Status: ", isGameOver);
    // 2. Guard: If click target is not a tile, return immediately (aka ignore click).
    if (!evtObj.target.classList.contains('tile')) return;
    // 3. Get row and column of clicked tile from evtObj.target.id
    const tileId = evtObj.target.id; //gets id of tile that was clicked -aka r3c7
    // console.log("tileID: ",evtObj.target.id);
    // parseInt converts string to number. tileID. slice captures value at position in string
    // working inside out.... tileId.slice captures index position1 of each TileID (r3c7) aka '3"
    // parseInt converts "3" to 3 (number)
    // variable rowIdx / colIdx now makes sense! 
    const rowIdx = parseInt(tileId.slice(1, 2)); //1st index of r3c7 or 3
    const colIdx = parseInt(tileId.slice(3, 4)); //3rd index of r3c7 or 7
    // console.log("Parsed Row:", rowIdx, "Parsed Col:", colIdx);
    // grab location of clicked tile for either left or right click
    const clickedTile = board[rowIdx][colIdx];
    // console.log(clickedTile);
    // 4. If right-click (evtObj.button === 2):
    //    a. preventDefault()  //had to read about this.... 
    //    b. If tile already revealed, return.
    //    c. Toggle tile's isFlagged state.
    if (evtObj.button === 2) {  // if right mouse button is clicked.
      evtObj.preventDefault();  //don't open operating system context menu.
      if (!firstClick) {
        console.log("Right-click can't start game. Use left-click starts game.");
        return;  // right-click as first click of game ignored. right click never starts game.
      }
      if (clickedTile.isRevealed === true) return; // if the clicked tile is already revealed, ignore
       clickedTile.isFlagged = !clickedTile.isFlagged; // if clicked tile is flagged, ignore
      render();   //update board to show flags
      return;
    }  
    if (evtObj.button === 0) {  // if left mouse button is clicked on
      // first left click of game should never reveal a mine. 
      if (!firstClick) {       // has first click occured true or false
        setMines(rowIdx, colIdx);         // call/run setMines function 
        assignAdjTilesAndCounts();         // TODO
        firstClick = true;                // set firstClick to true.
      }
      if (clickedTile.isFlagged) {  // if tile marked with flag
        console.log(clickedTile.isFlagged);
        return;     // do nothing. tile is flagged, don't reveal
      }         
      if (clickedTile.isRevealed) {    // if tile is already revealed do nothing.
        console.log(clickedTile.isRevealed);
        return;
      }
      revealTile(rowIdx, colIdx); // <- TODO:  build this function separately later
      
      if (clickedTile.isMine) {   // if clicked tile is a mine
        isGameOver = true;
      }
      render();       // update board
      checkGameOver();     // check for win/loss
      // console.log(checkWin);
    }
  };

/*=====================*/
/*  GAME LOGIC         */
/*=====================*/

function setMines() {
  let mineCounter = 0;
  // Loop until all mines (10) are placed 
  while (mineCounter < TOTAL_MINES) {
    // Randomly select a row and column.
    // fixed code to be 2D array like connect four game.
    const randomRow = Math.floor(Math.random() * BOARD_ROWS);
    const randomCol = Math.floor(Math.random() * BOARD_COLS);
    // Check if the selected tile is not already a mine
    if (!board[randomRow][randomCol].isMine) {
      // If it's not a mine, place the mine
      board[randomRow][randomCol].isMine = true;
      mineCounter++;  // Increment the mine counter
    }
    //console.log(mineCounter);
  }
};


// Returns an array of the 8 surrounding tiles of the selected tile
function getAdjTiles() {
  const adjTiles = [];        // array to hold all 8 neighboring tile locations
  const directions = [        // locations of the 8 neighboring tiles of selected tile. Each entry represents: [row offset, col offset] from the current tile.  
    [-1, -1], [-1, 0], [-1, 1], [ 0, -1], [ 0, 1], [ 1, -1], [ 1, 0], [ 1, 1] ];   // starting in top left and working clockwise around selected tile
};

// Sets tile.adjMineCount by counting how many .adjTiles are mines
function countAdjMines(rowIdx, colIdx) {

};

function assignAdjTilesAndCounts() {

};


// sets isRevealed = true for the given tile
function revealTile(rowIdx, colIdx) {   
  const tile = board[rowIdx][colIdx];   // tile location on board
  tile.isRevealed = true;               
  // console.log(tile.isRevealed, board[rowIdx][colIdx]);
};

    
function checkGameOver() {
  // checks to see if game is over 
  // did user click a tile with a mine - game over - lose
  // did user clear all tiles without clicking mine? game over - win
};
  

function resetGame() {
  startGame();
};
    
/*=====================*/
/*  GAME STARTUP       */
/*=====================*/

// start new game
startGame();    

// Place the mines randomly on the board
//setMines();


// Core Gameplay Features

// [X] init ... startGame
// [X] render  ... renderBoard
// [X] setMines(rowIdx, colIdx) - randomly places mines after first left-click (never on first tile)  - TODO: move out of handleTileClick.
// [X] handleTileClick - processes left/right clicks on tiles; triggers game actions
// [X] revealTile -  uncovers tile and starts revealing nearby empty tiles : TODO adjacent reveal logic
// [] getAdjTiles(rowIdx, colIdx) — returns array of 8 valid tiles surrounding the given tile
// [] .adjTiles — property in each tile; holds 8 surrounding tiles; filled after first click using getAdjTiles(rowIdx, colIdx)
// [] countAdjMines(rowIdx, colIdx) — sets adjMineCount based on .adjTiles
// [] checkGameOver() — lose on mine click; win when all safe tiles are revealed
// [] assignAdjTilesAndCounts() — helper called by handleTileClick after first click; fills adjTiles & sets adjMineCount
// [] countMines — (clarify or merge with countAdjMines or TOTAL_MINES logic)
// [X] right-click flag to indicate bomb location ... renderFlag
// [] renderTile(rowIdx, colIdx) — updates a single tile after a user makes a move, used with cascade reveals
// [] renderFlags() — updates flag icon on tile based on state (adds or removes flag)
// [X] reset game — resetGame to init aka start over aka startGame
// [] Add question mark state (right-click cycles: blank → flag → question → blank)

// ⸻
// Visual Fixes

// [X] Bomb icon centered in tile
// [] Bomb tile background turns red on explosion
// [] Remove bevel from revealed tiles (flat style via .revealed class)
// [] Face-button changes to crying face on game over
// [X] Add hover effects for unrevealed tiles
// [X] Disable board interaction after game ends

// ⸻
// Image Integration (UI Icon Replacements)

// [] Use tile.svg as background for all unrevealed tiles
// [] Use 1.svg through 8.svg to display adjMineCount visually
// [] Replace 💣 with mine.svg or mine.png
// [] Replace 🚩 with red_flag.svg
// [] Display qmark.svg as third right-click state

// ⸻
// First Click Rules

// [] Delay mine placement until first left-click
// [] Ensure first-clicked tile is never a mine
// [] Block right-click before first click (no flagging before game starts)

// [] break handleTileClick into smaller components
//     - renderTile
//     - renderFlag

// ⸻
// Icebox / Stretch Features

// UI & Visual Enhancements
// [] Show number of adjacent bombs (adjMineCount) on revealed tiles
// [] Add message area for win/loss status
// [] Display of flagged tiles (counter)
// [] Timer clock: 3 digits, counts up (elapsed time)
// [] Dynamically generate board HTML from JS (no static markup)
// [] Show “You Win!” or “Game Over” text overlay

// Audio / Feedback
// [] Add explosion sound when mine is triggered
// [] (Stretch) Add click / flag sound effects
// [] Add victory sound or win jingle

// UI Counters & Dynamic Gameplay Values
// [] Replace TOTAL_MINES with dynamic mine count = 20% of board
// [] Show total mines in UI (from 20% rule)
// [] Show count of placed flags
// [] Add game timer in seconds

// Advanced Gameplay / Mechanics
// [] Cascade reveal for empty tiles
// [] Recursive reveal using adjTiles
// [] Chording (click on revealed number with correct flags around it)
// [] Undo last move
// [] Hint button (safe tile reveal)
// [] Replay button

// Difficulty Modes
// [] Easy / Medium / Hard modes
// [] Adjust board size and mine count per difficulty


