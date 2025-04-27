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
  // iterate through each tile 0 to 80 in the board
  for (let i = 0; i < TOTAL_TILES; i++) {
    // create an object for each board position/tile
    // and set values for each postion
    board[i] = {
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjMineCount: null,   // mines in adjacent cells
      adjCells:[],         // all neighboring cells of selected cell
    };
  }

  isGameOver = false;
  setMines();
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
  // Iterates/loops over the board array and updates
  // matching HTML tiles via DOM interaction
  // Sets up the initial hidden state for each tile
  // TODO: update tiles when they are revealed or flagged)
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

