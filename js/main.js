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
function init() {
  // setting up board 2D array with empty data/values
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
  isGameOver = false;
  }
};

init();

