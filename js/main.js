/*-------------------------------- Constants --------------------------------*/
const BOARD_ROWS = 9;
const BOARD_COLS = 9;
const TOTAL_TILES = BOARD_ROWS * BOARD_COLS;  
const TOTAL_MINES = Math.floor(TOTAL_TILES * 0.2);  

/*-------------------------------- Audio Resources --------------------------*/
const explosionSound = new Audio('audio/explosion.mp3');
explosionSound.volume = 0.1;

const applauseSound = new Audio('audio/crowd-applause.mp3');
applauseSound.volume = 0.6;

const clickSound = new Audio('audio/mouse-click.mp3');
clickSound.volume = 0.25;

const flagSound = new Audio('audio/subtle-click.mp3');
flagSound.volume = 0.25;
/*---------------------------- Variables (state) ----------------------------*/

let board;                
let isGameOver;           
let tilesRevealedCount;   
let bombCounter;          
let firstClick = false;   
let flagCount = 0;      
let timer = 0;          
let timerInterval = null; 
let isPaused = false;

/*------------------------ Cached Element References ------------------------*/

const boardEl = document.getElementById('game-board');  
const faceBtnEl = document.getElementById('face-button');  
const resetBtnEl = document.getElementById('reset-button'); 
const flagCounterEl = document.getElementById('flag-counter'); 
const timerEl = document.getElementById('game-timer');  
const msgPanel = document.getElementById('message-panel');
const expandPanelBtn = document.getElementById('expand-panel-btn');


/*----------------------------- Event Listeners -----------------------------*/

document.addEventListener('contextmenu', function (evt) {
  if (evt.target.classList.contains('tile')) {
    evt.preventDefault();
  }
});

boardEl
  .addEventListener('click', handleTileClick);

boardEl
  .addEventListener('contextmenu', handleTileClick);

faceBtnEl.addEventListener('click', function(evtObj) {
  if (isGameOver || !firstClick) return;  
  pauseGame();  // toggle pause/resume
});

faceBtnEl.addEventListener('contextmenu', function(evtObj) {
  evtObj.preventDefault();

  if (firstClick) {
    isPaused = false;
    resetGame();
  }
});

expandPanelBtn.addEventListener('click', () => {
  const isOpen = msgPanel.classList.toggle('open');
  expandPanelBtn.textContent = isOpen ? '<' : '>';
});

resetBtnEl.addEventListener('click', function () {
  if (firstClick) {
    isPaused = false;
    resetGame();
  }
});


/*-------------------------------- Functions --------------------------------*/

/*=====================*/
/*    SETUP FUNCTIONS  */
/*=====================*/

function startGame() {
  board = [];
  
  for (let rowIdx = 0; rowIdx < BOARD_ROWS; rowIdx++) {
    
    board[rowIdx] = [];  
    
    for (let colIdx = 0; colIdx < BOARD_COLS; colIdx++) {
      
      board[rowIdx][colIdx] = {
        isMine: false,          
        isRevealed: false,      
        isFlagged: false,       
        adjMineCount: 0,        
        adjTiles: [],           
        rowIdx,
        colIdx 
      };
     
    }
  };
  firstClick = false;     
  tilesRevealedCount = 0; 
  isGameOver = false;
  
  renderBoard();
  updateDisplays(); 

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
  const tile = board[rowIdx][colIdx];                            
  const tileEl = document.getElementById(`r${rowIdx}c${colIdx}`); 
  tileEl.classList.remove('revealed', 'mine-hit');
  tileEl.innerHTML = '';

  if (tile.isRevealed) {
    tileEl.classList.add('revealed');

    if (tile.isMine) {
      tileEl.innerHTML = '<img src="images/mine.svg" alt="Mine" class="icon">';
      tileEl.classList.add('mine-hit');
    } else if (!isGameOver && tile.adjMineCount > 0) {
      tileEl.innerHTML = `<img src="images/${tile.adjMineCount}.svg" class="icon" alt="${tile.adjMineCount}">`;
    }
  }
};

function renderFlag(rowIdx, colIdx) {  
  const tile = board[rowIdx][colIdx];
  const tileEl = document.getElementById(`r${rowIdx}c${colIdx}`);
  if (!tile.isRevealed && tile.isFlagged) {
    tileEl.innerHTML = '<img src="images/red_flag.svg" class="icon" alt="Flag">';
  }
};

function updateDisplays() {
  flagCounterEl.textContent = String(flagCount).padStart(3, '0');
  timerEl.textContent = String(timer).padStart(3, '0');
};

function startTimer() {
  timerInterval = setInterval(() => {
    if (!isPaused) {       
      timer++;              
      updateDisplays();  
    }
  }, 1000);
};

function launchPauseEmojis() {
  const overlay = document.getElementById('pause-overlay');
  overlay.innerHTML = '';

  const numEmojis = 40;

  for (let i = 0; i < numEmojis; i++) {
    const emoji = document.createElement('div');
    emoji.classList.add('floating-emoji');
    emoji.textContent = '😴';

    emoji.style.left = Math.random() * 100 + 'vw';
    emoji.style.top = Math.random() * 100 + 'vh';

    emoji.style.setProperty('--x-move', `${(Math.random() - 0.5) * 200}vw`);
    emoji.style.setProperty('--y-move', `${(Math.random() - 0.5) * 200}vh`);

    const size = (Math.random() * 4 + 3).toFixed(2);
    emoji.style.setProperty('--size', `${size}vmin`);
    emoji.style.setProperty('--scale', size);

    emoji.style.animationDelay = Math.random() * 0.5 + 's';

    overlay.appendChild(emoji);
  }

  setTimeout(() => {
    overlay.innerHTML = '';
  }, 5000);
};

function launchLoseEmojis() {
  const overlay = document.getElementById('pause-overlay');
  overlay.innerHTML = ''; 

  const numEmojis = 40;

  for (let i = 0; i < numEmojis; i++) {
    const emoji = document.createElement('div');
    emoji.classList.add('floating-emoji');
    emoji.textContent = '😭';

    emoji.style.left = Math.random() * 100 + 'vw';
    emoji.style.top = Math.random() * 100 + 'vh';

    emoji.style.setProperty('--x-move', `${(Math.random() - 0.5) * 200}vw`);
    emoji.style.setProperty('--y-move', `${(Math.random() - 0.5) * 200}vh`);

    const size = (Math.random() * 4 + 3).toFixed(2);
    emoji.style.setProperty('--size', `${size}vmin`);
    emoji.style.setProperty('--scale', size);

    emoji.style.animationDelay = Math.random() * 0.5 + 's';

    overlay.appendChild(emoji);
  }

  setTimeout(() => {
    overlay.innerHTML = '';
  }, 5000);
};

function launchWinEmojis() {
  const overlay = document.getElementById('pause-overlay');
  overlay.innerHTML = '';

  const numEmojis = 40;

  for (let i = 0; i < numEmojis; i++) {
    const emoji = document.createElement('div');
    emoji.classList.add('floating-emoji');
    emoji.textContent = '😎';

    emoji.style.left = Math.random() * 100 + 'vw';
    emoji.style.top = Math.random() * 100 + 'vh';

    emoji.style.setProperty('--x-move', `${(Math.random() - 0.5) * 200}vw`);
    emoji.style.setProperty('--y-move', `${(Math.random() - 0.5) * 200}vh`);

    const size = (Math.random() * 4 + 3).toFixed(2);
    emoji.style.setProperty('--size', `${size}vmin`);
    emoji.style.setProperty('--scale', size);
    emoji.style.animationDelay = Math.random() * 0.5 + 's';

    overlay.appendChild(emoji);
  }

  setTimeout(() => {
    overlay.innerHTML = '';
  }, 5000);
}

function showPanelMessage(title, message, autoClose = false) {
  document.getElementById('panel-title').textContent = title;
  document.getElementById('panel-message').innerHTML = message;

  // msgPanel.classList.add('open');  //show message panel immediately
  // expandPanelBtn.textContent = '<';

  if (autoClose) {
    setTimeout(() => {            // auto close panel after x seconds
      msgPanel.classList.remove('open');
      expandPanelBtn.textContent = '>';
    }, 7000); 
  }
}

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
  const coords = tileId.slice(1).split('c');
  const rowIdx = parseInt(coords[0]);       
  const colIdx = parseInt(coords[1]);
  if (!board[rowIdx] || !board[rowIdx][colIdx]) return;
  const clickedTile = board[rowIdx][colIdx];

  if (evtObj.button === 2) {
    evtObj.preventDefault();
    if (!firstClick) return;
    if (clickedTile.isRevealed) return;
    if (clickedTile.isFlagged) {
      flagCount--;
    } else {
      flagCount++;
    }
    clickedTile.isFlagged = !clickedTile.isFlagged;

    flagSound.currentTime = 0;
    flagSound.play();
    
    updateDisplays();
    render();
    return;
  }

  if (evtObj.button === 0) {
    if (!firstClick) {
      setMines(rowIdx, colIdx);
      assignAdjTilesAndCounts();
      firstClick = true;
      startTimer();
    }
    if (clickedTile.isFlagged || clickedTile.isRevealed) return;
    clickSound.currentTime = 0;
    clickSound.play();
    revealTile(rowIdx, colIdx);

    if (clickedTile.isMine) {
      explosionSound.currentTime = 0;
      explosionSound.play();
      isGameOver = true;
      clearInterval(timerInterval);
      revealAllTiles();
      launchLoseEmojis();
      showPanelMessage("Game Over", "You clicked a mine! 😞 😭 Want to try again?");
      const faceBtn = document.getElementById('face-button');
      faceBtn.textContent = '😭';
    }
    render();
    checkGameOver();
  }
};

/*=====================*/
/*  GAME LOGIC         */
/*=====================*/

function setMines(rowIdx, colIdx) {
  let mineCounter = 0;
  while (mineCounter < TOTAL_MINES) {
    const randomRow = Math.floor(Math.random() * BOARD_ROWS);
    const randomCol = Math.floor(Math.random() * BOARD_COLS);
    if (!board[randomRow][randomCol].isMine &&
      !(randomRow === rowIdx && randomCol === colIdx)) {
      board[randomRow][randomCol].isMine = true;
      mineCounter++;
    }
  }
};

function getAdjTiles(rowIdx, colIdx) {
  const adjTiles = [];       
  const directions = [ [-1, -1], [-1, 0], [-1, 1], [ 0, -1], [ 0, 1],[ 1, -1], [ 1, 0], [ 1, 1] ];

  for (let i = 0; i < directions.length; i++) {
    const dRow = directions[i][0];        
    const dCol = directions[i][1];
    const r = rowIdx + dRow;
    const c = colIdx + dCol;
   
    if (r >= 0 && r < BOARD_ROWS && c >= 0 && c < BOARD_COLS) { 
    adjTiles.push(board[r][c]); 
    }
  }
    return adjTiles;  
};

function countAdjMines(rowIdx, colIdx) {
  const tile = board[rowIdx][colIdx];                   
  let count = 0;                                        
  for (let neighbor of tile.adjTiles) {                 
    if (neighbor.isMine) count++;                      
  }
  tile.adjMineCount = count;                           
};

function assignAdjTilesAndCounts() {
  for (let rowIdx = 0; rowIdx < BOARD_ROWS; rowIdx++) {
    for (let colIdx = 0; colIdx < BOARD_COLS; colIdx++) {
      const tile = board[rowIdx][colIdx];             
      tile.adjTiles = getAdjTiles(rowIdx, colIdx);    
      countAdjMines(rowIdx, colIdx);                 
    }
  }
};

function revealTile(rowIdx, colIdx) {   

  const tile = board[rowIdx][colIdx];
  if (tile.isRevealed || tile.isFlagged) {
    return;
  }
  tile.isRevealed = true;

  if (tile.adjMineCount === 0) {
    for (let neighbor of tile.adjTiles) {
      revealTile(neighbor.rowIdx, neighbor.colIdx);
    }
  }
  renderTile(rowIdx, colIdx);
  renderFlag(rowIdx, colIdx);
};

function checkGameOver() {
  if (isGameOver) return;  
  let revealedCount = 0;             
  for (let rowIdx = 0; rowIdx < board.length; rowIdx++) {   
    for (let colIdx = 0; colIdx < board[rowIdx].length; colIdx++) {   
      const tile = board[rowIdx][colIdx];                             
      if (tile.isRevealed && !tile.isMine) revealedCount++;           
  }
};
  if (revealedCount === TOTAL_TILES - TOTAL_MINES) {                 
    isGameOver = true;                      
    applauseSound.currentTime = 0; 
    applauseSound.play();         
    const faceBtn = document.getElementById('face-button');
    faceBtn.textContent = '😎';
    launchWinEmojis();
    showPanelMessage("You Win!", "All safe tiles cleared! 🙌🏻 👏🏻 🤘🏼 😎");
  }
};
  
function pauseGame() {
  isPaused = !isPaused; 

  const faceBtn = document.getElementById('face-button');
  faceBtn.textContent = isPaused ? '😴' : '😀'; 

  if (isPaused) {
    launchPauseEmojis();
  }
}

function resetGame() {
  clearInterval(timerInterval);  
  timer = 0;                     
  flagCount = 0;                
  updateDisplays();              
  startGame();                   
  const faceBtn = document.getElementById('face-button');
  faceBtn.textContent = '😀';
};

/*=====================*/
/*  GAME STARTUP       */
/*=====================*/

startGame();    