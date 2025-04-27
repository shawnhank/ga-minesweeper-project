/*-------------------------------- Constants --------------------------------*/
const BOARD_ROWS = 9;
const BOARD_COLS = 9;
const TOTAL_TILES = 81;
const TOTAL_MINES = 10;

/*---------------------------- Variables (state) ----------------------------*/

let board;
let isGameOver;
// let tilesRevealedCount;
// let bombCounter;

/*------------------------ Cached Element References ------------------------*/



/*----------------------------- Event Listeners -----------------------------*/



/*-------------------------------- Functions --------------------------------*/
// function startGame() {
//   // setting up board 2D array with empty cells
//   board = [];
//     // outer loop adding 9 rows to board
//     for(let row = 0; row < BOARD_ROWS; row++) {
//       // assign empty value to each row index position
//       board[row] =[];
//       // inner loop to add 9 columns
//       for(let col = 0; col < BOARD_COLS; col++) {
//         //for each cell position in the board sett intial values
//         board[row][col] = {
//           isMine: false,
//           isRevealed: false,
//           isFlagged: false,
//           adjMineCount: null,   // mines in adjacent cells
//           adjCells: [],         // all neighboring cells of selected cell
//           rowIdx: row,
//           colIdx: col
//         };
//     }
//   }
//   isGameOver = false;
//   setMines();
//   drawBoard();

// };

function startGame() {
  board = [];
  // iterate through each tile 0 to 80 in the board
  for (let i = 0; i < TOTAL_TILES; i++) {
    // create an object for each board position/tile
    // and set values for each postion
    board[i] = {
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjMineCount: null,   // mines in adjacent cells
      adjCells: [],         // all neighboring cells of selected cell
    };
  }

  isGameOver = false;
  setMines();
  drawBoard();
}






startGame();


function drawBoard() {
  // Iterates/loops over the board array and updates
  // matching HTML tiles via DOM interaction
  // Sets up the initial hidden state for each tile
  // TODO: update tiles when they are revealed or flagged)
}

function resetGame() {
  startGame();
}


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


function handleTileClick() {
    // handles left and right mouse clicks on tiles
}

function revealTile() {
  // reveals, shows, uncovers, unhides tile
}

function checkGameOver() {
  // checks to see if game is over 
  // did user click a tile with a mine - game over - lose
  // did user clear all tiles without clicking mine? game over - win
}

function countMines() {
  // count mines in adjacent cells
}

function flagTile() {
  // flag/unflag (right click) tile to mark as mine
}

/* TODO list of functions

[X] init ... startGame
[X] render  ... drawBoard
[ ] place mines randomly ... setMines
[ ] click tiles ... handleTileClick
[ ] show/reveal tile ... revealTile
[ ] game over check ...checkGameOver
[ ] caclulate/locate mines countMines
[ ] right click flag to indicate bomb location  ... flagTile
[ ] win/lose  ... checkWin (checks win/lose status) isGameOver state v
[X] reset game  ... resetGame to init  aka start over aka StartGame

*/

