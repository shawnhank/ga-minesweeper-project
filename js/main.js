/*-------------------------------- Constants --------------------------------*/
const BOARD_ROWS = 9;
const BOARD_COLS = 9;
const TOTAL_TILES = 81;
const TOTAL_MINES = 10;

// Audio feedback
const explosionSound = new Audio('audio/explosion.mp3');
explosionSound.volume = 0.8;

const applauseSound = new Audio('audio/crowd-applause.mp3');
applauseSound.volume = 0.8;


/*---------------------------- Variables (state) ----------------------------*/

let board;
let isGameOver;
let tilesRevealedCount;
let bombCounter;
let firstClick = false;

/*------------------------ Cached Element References ------------------------*/

const boardEl = document.getElementById('game-board');  // Attach one event listener for all tiles (aka event delegation)
const faceBtnEl = document.getElementById('face-button');  //event listeners for click and contextmenu
const backBtnEl = document.getElementById('back-to-home');


/*----------------------------- Event Listeners -----------------------------*/
// 	addEventListener() is how we tell JavaScript to listen for an event happening.

// Attach a left-click event listener to the board container.
boardEl
  .addEventListener('click', handleTileClick);

// Attach a right-click "contextmenu" event listener to the board container.
boardEl
  .addEventListener('contextmenu', handleTileClick);

// left-click face-button: if the game is over, reset game/board. Otherwise, ignore.
faceBtnEl
  .addEventListener('click', function(evtObj) {
    if (isGameOver) {
      resetGame();
    }
  });

  // right-click face-button: pause the game
  // and prevent the browser menu from opening.
faceBtnEl
  .addEventListener('contextmenu', function(evtObj) {
    evtObj.preventDefault();
    pauseGame();
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
      // console.log(board[rowIdx][colIdx]);
    }
  };

  // Set the game over flag to false initially
  isGameOver = false;
  // console.log(isGameOver);
  
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
          tileElement.innerHTML = '<img src="images/mine.svg" alt="Mine" class="icon">';
          tileElement.classList.add('mine-hit'); // highlight tile red
        } else if (tileValue.adjMineCount > 0) {
          // tile is a number (1–8) — show number image that matches adjMineCount
          tileElement.innerHTML = `<img src="images/${tileValue.adjMineCount}.svg" class="icon" alt="${tileValue.adjMineCount}">`;
        } else {
          // Show adjacent mine count or leave blank
          // if no adjacent mines)
          // tile has no nearby mines — show nothing (blank)
          tileElement.innerHTML = '';
        }
      } else {
        // If tile is not revealed, clear the tile content
        tileElement.innerHTML = '';
        tileElement.classList.remove('revealed'); 
      }
      // If mine is suspected, show a flag (🚩)
      if (tileValue.isFlagged) {
        tileElement.innerHTML = `<img src="images/red_flag.svg" class="icon" alt="Flag">`; // display red flag image
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
    // console.log('Tile 4,4 →', clickedTile);
    // 4. If right-click (evtObj.button === 2):
    //    a. preventDefault()  //had to read about this.... 
    //    b. If tile already revealed, return.
    //    c. Toggle tile's isFlagged state.
    if (evtObj.button === 2) {  // if right mouse button is clicked.
      evtObj.preventDefault();  //don't open operating system context menu.
      if (!firstClick) {
        // console.log("Right-click can't start game. Use left-click starts game.");
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
        assignAdjTilesAndCounts();        // call/run assignAdjTilesAndCounts()
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
        explosionSound.currentTime = 0;  // reset playback to start
        explosionSound.play();          // play explosion sound
        isGameOver = true;
        // TODO: make mine tile red in css/html
      }
      render();       // update board
      checkGameOver();     // check for win/loss
      // console.log(checkGameOver);
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
      console.log(`Mine count subtotal ${count}`);
    }
    tile.adjMineCount = count;                            // total mines in neighboring tiles
    console.log(`mine count total: ${tile.adjMineCount}`);
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
  const tile = board[rowIdx][colIdx];   // tile location on board
  tile.isRevealed = true;               
  // console.log(tile.isRevealed, board[rowIdx][colIdx]);
};

  // checks to see if game is over 
  // did user click a tile with a mine - game over - lose
  // did user clear all tiles without clicking mine? game over - win
function checkGameOver() {
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
  console.log(`Total Safe Tiles Revealed: ${revealedCount} / ${TOTAL_TILES - TOTAL_MINES}`);

  if (revealedCount === TOTAL_TILES - TOTAL_MINES) {                  // // total revealed tiles - mine tiles = total safe tiles
    isGameOver = true;                       // mark game as won
    applauseSound.currentTime = 0;  // reset playback to start
    applauseSound.play();          // play crowd cheer
    console.log('You Win! 🎉 ');              // placeholder for win message
    // TODO: update face icon or message area
  }
};
  
function pauseGame() {
  // TODO: Add game timer and pause logic
  console.log('Game paused (stub) — implement timer logic and clock timer later');
}

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
// [X] getAdjTiles(rowIdx, colIdx) — returns array of 8 valid tiles surrounding the given tile
// [X] .adjTiles — property in each tile; holds 8 surrounding tiles; filled after first click using getAdjTiles(rowIdx, colIdx)
// [X] countAdjMines(rowIdx, colIdx) — sets adjMineCount based on .adjTiles
// [X] checkGameOver() — lose on mine click; win when all safe tiles are revealed
// [X] assignAdjTilesAndCounts() — helper called by handleTileClick after first click; fills adjTiles & sets adjMineCount
// [X] right-click flag to indicate bomb location ... renderFlag
// [] renderTile(rowIdx, colIdx) — updates a single tile after a user makes a move, used with cascade reveals
// [] renderFlags() — updates flag icon on tile based on state (adds or removes flag)
// [X] reset game — resetGame to init aka start over aka startGame
// [] Add question mark state (right-click cycles: blank → flag → question → blank)

// ⸻
// Visual Fixes

// [] Bomb icon centered in tile
// [X] Bomb tile background turns red on explosion
// [] Remove bevel from revealed tiles (flat style via .revealed class)
// [] Face-button changes to crying face on game over
// [X] Add hover effects for unrevealed tiles
// [X] Disable board interaction after game ends

// ⸻
// Image Integration (UI Icon Replacements)

// [] Use tile.svg as background for all unrevealed tiles
// [] Use 1.svg through 8.svg to display adjMineCount visually
// [X] Replace 💣 with mine.svg or mine.png
// [X] Replace 🚩 with red_flag.svg
// [] Display qmark.svg as third right-click state

// ⸻
// First Click Rules

// [X] Delay mine placement until first left-click
// [X] Ensure first-clicked tile is never a mine
// [X] Block right-click before first click (no flagging before game starts)

// [] break handleTileClick into smaller components
//      [] getClickedCoords(evtObj)
//      [] getClickedTile(rowIdx, colIdx)
//      [] handleRightClick(tile)
//      [] handleLeftClick(tile, rowIdx, colIdx)
//      [] 


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
// [X] Add explosion sound when mine is triggered
// [] (Stretch) Add click / flag sound effects
// [X] Add victory sound or win jingle

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
