/*-------------------------------- Constants --------------------------------*/
const BOARD_ROWS = 9;
const BOARD_COLS = 9;
const TOTAL_TILES = 81;
const TOTAL_BOMBS = 10;

/*---------------------------- Variables (state) ----------------------------*/

let board;
let isGameOver;
// let tilesRevealedCount;
// let bombCounter;

/*------------------------ Cached Element References ------------------------*/



/*----------------------------- Event Listeners -----------------------------*/



/*-------------------------------- Functions --------------------------------*/
function startGame() {
  // setting up board 2D array with empty cells
  board = [];
    // outer loop adding 9 rows to board
    for(let row = 0; row < BOARD_ROWS; row++) {
      // assign empty value to each row index position
      board[row] =[];
      // inner loop to add 9 columns
      for(let col = 0; col < BOARD_COLS; col++) {
        //for each cell position in the board sett intial values
        board[row][col] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjMineCount: null,   // mines in adjacent cells
          adjCells: [],         // all neighboring cells of selected cell
          rowIdx: row,
          colIdx: col
        };
    }
  }
  isGameOver = false;
  setMines();
  drawBoard();

};

startGame();


function drawBoard() {

}

function resetGame() {
  startGame();
}


function setMines() {

}

function handleTileClick() {

}

function revealTile() {

}

function checkGameOver() {

}

function countMines() {

}

function flagTile() {

}

function isGameOver() {

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

