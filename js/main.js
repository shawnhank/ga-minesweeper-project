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
// 	addEventListener() is how we tell JavaScript to listen for an event happening.

// Attach a left-click event listener to the board container.
document.getElementById('game-board')
  .addEventListener('click', handleTileClick);

// Attach a right-click "contextmenu" event listener to the board container.
document.getElementById('game-board')
  .addEventListener('contextmenu', handleTileClick);

// left-clicks the face, if the game is over, reset. Otherwise, ignore.


//eventListener for back-button to landing page



// document.getElementById('markers').addEventListener('click', handleDrop);
// function handleDrop(evt) {
//   // Get the clicked column marker
//   const markers = [...document.querySelectorAll('#markers > div')];
//   const colIdx = markers.indexOf(evt.target);
//   // Update game state based on which marker was clicked
//   // ...
//   // Render updated state
//   render();
//}


/*-------------------------------- Functions --------------------------------*/

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
        isMine: false,          // Default is not a mine
        isRevealed: false,      // Default is hidden
        isFlagged: false,       // Default is not flagged
        adjMineCount: null,     // Adjacent mine count (null initially)
        adjCells: [],            // List of adjacent cells (empty initially)
        neighbors: [],  // This will store neighboring cells
        rowIdx,
        colIdx 
      };
      //console.log(board);
    }
  };

  // Set the game over flag to false initially
  isGameOver = false;
  console.log(isGameOver);

  // Place the mines randomly on the board
  setMines();
  
  // Update the board's display on the screen
  renderBoard();
};

function render() {
  renderBoard();
  renderTile();
  renderFlag();
}

startGame();







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
}

// calculate adjacent mine counts after setting mines
function calculateAdjacentMines() {

}

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
};



function renderTile() {
  // reveals, shows, uncovers, unhides tile.
  // called by render().
};

function checkGameOver() {
  // checks to see if game is over 
  // did user click a tile with a mine - game over - lose
  // did user clear all tiles without clicking mine? game over - win
};

function renderFlag() {
  // flag/unflag (right click) tile to mark as mine
  // use contextMenu DOM property.
};

function checkWin() {

};


function resetGame() {
  startGame();
};


function handleTileClick(evtObj) {
    // will handle all the following
      // 1. Guard: If game is over, return immediately (aka ignore click).
      if (isGameOver) return;
      console.log(isGameOver);
      // 2. Guard: If click target is not a tile, return immediately (aka ignore click).
      if (!evtObj.target.classList.contains('tile')) return;
      // 3. Get row and column of clicked tile from evtObj.target.id
      const tileId = evtObj.target.id; //gets id of tile that was clicked -aka r3c7
      console.log(evtObj.target.id)
      // parseInt converts string to number. tileID. slice captures value at position in string
      // working inside out.... tileId.slice captures index position1 of each TileID (r3c7) aka '3"
      // parseInt converts "3" to 3 (number)
      // variable rowIdx / colIdx now makes sense! 
      const rowIdx = parseInt(tileId.slice(1, 2)); //1st index of r3c7 or 3.
      const colIdx = parseInt(tileId.slice(3, 4)); //3rd index of r3c7 or 7
      console.log(rowIdx, colIdx)
      // 4. If right-click (evtObj.button === 2):
      //    a. preventDefault()  //had to read about this.... 
      //    b. If tile already revealed, return.
      //    c. Toggle tile's isFlagged state.
      if (evtObj.button === 2) {
        evtObj.preventDefault();  // if right mouse button is clciked, don't open operating system context menu.
        const clickedTile = board[rowIdx][colIdx];
        console.log(clickedTile)
         if (clickedTile.isRevealed === true) return;
         else clickedTile.isFlagged = !clickedTile.isFlagged;    
        console.log(clickedTile.isFlagged);
        render();
      }  
      // 5. If left-click (evtObj.button === 0):
      //    a. If tile is flagged, return.
      //    b. If tile already revealed, return.
      //    c. Reveal the tile (call revealTile()).
      //    d. If tile is a mine, set game over.
      // 6. After action:
      //    a. Call render().
      //    b. Call checkWin().
      //     function revealTile() {
      
    }



function countMines() {
  // count mines in adjacent cells
};


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