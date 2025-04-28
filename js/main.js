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

/*------------------------ Cached Element References ------------------------*/



/*----------------------------- Event Listeners -----------------------------*/



/*-------------------------------- Functions --------------------------------*/

function startGame() {
  board = [];
  // Create each row in the board (2D array structure)
  for (let rowIdx = 0; rowIdx < BOARD_ROWS; rowIdx++) {
    // Initialize each row as an empty array
    board[rowIdx] = [];  
    // Create a column in the current row
    for (let colIdx = 0; colIdx < BOARD_COLS; colIdx++) {
      // Set each cell as an object with default values
      // Each cell will store properties like mine status, revealed status, etc.
      board[rowIdx][colIdx] = {
        isMine: false,          // Default is not a mine
        isRevealed: false,      // Default is hidden
        isFlagged: false,       // Default is not flagged
        adjMineCount: null,     // Adjacent mine count (null initially)
        adjCells: []            // List of adjacent cells (empty initially)
      };
    }
  }
  // Set the game over flag to false initially
  isGameOver = false;
  
  // Place the mines randomly on the board
  setMines();
  
  // Update the board's display on the screen
  renderBoard();
}

function render() {
  renderBoard();
  renderTile();
  renderFlag();
}

startGame();

function setMines() {
  // place mines into board array by setting mine = true.
  // board tracks mine positions directly. no need for array
  // in this function. 
  let mineCounter = 0;
  // while mineCounter is less than 10
  while (mineCounter < TOTAL_MINES) {
    // randomly select board[i] tile
    let randomIndex = Math.floor(Math.random() * board.length);
    // check/compare if isMine is false/empty
    if (board[randomIndex].isMine === false) {
      // set isMine to true
      board[randomIndex].isMine = true;
      // increment mineCounter by 1
      mineCounter++;
    }
  }
}

function renderBoard() {
  // Loop through each row in the board array
  // (2D array: rows and columns)
  board.forEach((rowArray, rowIdx) => {
    // Loop through each column in the current row
    rowArray.forEach((tileValue, colIdx) => {
      // Generate the cell's unique ID based on its row and column
      const tileId = `c${colIdx}r${rowIdx}`;
      // Target the DOM element for the current tile using its ID
      const tileElement = document.getElementById(tileId);
      // Check if the tile is revealed
      if (tileValue.isRevealed) {
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
      }
      // If mine is suspected, show a flag (🚩)
      if (tileValue.isFlagged) {
        tileElement.innerHTML = '🚩';
      }
    });
  });
}


function renderTile() {
  // reveals, shows, uncovers, unhides tile.
  // called by render().
}

function checkGameOver() {
  // checks to see if game is over 
  // did user click a tile with a mine - game over - lose
  // did user clear all tiles without clicking mine? game over - win
}

function renderFlag() {
  // flag/unflag (right click) tile to mark as mine
  // use contextMenu DOM property.
}

function checkWin() {

}


function resetGame() {
  startGame();
}


function handleTileClick() {
    // handles left and right mouse clicks on tiles
    function revealTile() {

    }
}


function countMines() {
  // count mines in adjacent cells
}


/* TODO list of functions

[X] init ... startGame
[X] render  ... renderBoard
[X] place mines randomly ... setMines
[] click tiles ... handleTileClick
[] show/reveal tile ... renderTile
[] game over check ...checkGameOver
[] caclulate/locate mines countMines
[] right click flag to indicate bomb location  ... renderFlag
[] win/lose  ... checkWin (checks win/lose status) isGameOver state v
[X] reset game  ... resetGame to init  aka start over aka StartGame

============
Icebox features/function
[] countFlag (for diplay flag ui element)

*/

