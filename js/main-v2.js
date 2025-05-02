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
let gameCount = 0;
let panelCloseTimeout = null;

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

boardEl.addEventListener('click', handleTileClick);
boardEl.addEventListener('contextmenu', handleTileClick);

faceBtnEl.addEventListener('click', function (evtObj) {
  if (isGameOver || !firstClick) return;
  pauseGame();
});

faceBtnEl.addEventListener('contextmenu', function (evtObj) {
  evtObj.preventDefault();
  if (firstClick) {
    isPaused = false;
    resetGame();
  }
});

expandPanelBtn.addEventListener('click', () => {
  if (msgPanel.classList.contains('open')) {
    msgPanel.classList.remove('open');
  } else {
    msgPanel.classList.add('open');
  }
  updateExpandPanelArrow();
});

resetBtnEl.addEventListener('click', function () {
  if (firstClick) {
    isPaused = false;
    resetGame();
  }
});

/*-------------------------------- Functions --------------------------------*/
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
  }
  firstClick = false;
  tilesRevealedCount = 0;
  isGameOver = false;

  renderBoard();
  updateDisplays();

  msgPanel.classList.add('open');
  updateExpandPanelArrow();

  if (panelCloseTimeout) clearTimeout(panelCloseTimeout);
  if (gameCount > 0) {
    panelCloseTimeout = setTimeout(() => {
      msgPanel.classList.remove('open');
      updateExpandPanelArrow();
    }, 3000);
  }
  gameCount++;
}

function render() {
  renderBoard();
}

function renderBoard() {
  board.forEach((rowArray, rowIdx) => {
    rowArray.forEach((tileValue, colIdx) => {
      renderTile(rowIdx, colIdx);
      renderFlag(rowIdx, colIdx);
    });
  });
}

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
}

function renderFlag(rowIdx, colIdx) {
  const tile = board[rowIdx][colIdx];
  const tileEl = document.getElementById(`r${rowIdx}c${colIdx}`);
  if (!tile.isRevealed && tile.isFlagged) {
    tileEl.innerHTML = '<img src="images/red_flag.svg" class="icon" alt="Flag">';
  }
}

function updateDisplays() {
  flagCounterEl.textContent = String(flagCount).padStart(3, '0');
  timerEl.textContent = String(timer).padStart(3, '0');
}

function startTimer() {
  timerInterval = setInterval(() => {
    if (!isPaused) {
      timer++;
      updateDisplays();
    }
  }, 1000);
}

function updateExpandPanelArrow() {
  expandPanelBtn.textContent = msgPanel.classList.contains('open') ? '<' : '>';
}

function showPanelMessage(title, message) {
  document.getElementById('panel-title').textContent = title;
  document.getElementById('panel-message').innerHTML = message;
}

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
      if (gameCount === 1 && msgPanel.classList.contains('open')) {
        msgPanel.classList.remove('open');
        updateExpandPanelArrow();
      }
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
      msgPanel.classList.add('open');
      updateExpandPanelArrow();
      revealAllTiles();
      launchLoseEmojis();
      showPanelMessage("Game Over", `
        <p>Oh No! Want to try again?</p>
        <p class="emoji-line">😞 🤨 🥺</p>
      `);
      const faceBtn = document.getElementById('face-button');
      faceBtn.textContent = '😭';
    }
    render();
    checkGameOver();
  }
}

function setMines(rowIdx, colIdx) {
  let mineCounter = 0;
  while (mineCounter < TOTAL_MINES) {
    const randomRow = Math.floor(Math.random() * BOARD_ROWS);
    const randomCol = Math.floor(Math.random() * BOARD_COLS);
    if (!board[randomRow][randomCol].isMine && !(randomRow === rowIdx && randomCol === colIdx)) {
      board[randomRow][randomCol].isMine = true;
      mineCounter++;
    }
  }
}

function getAdjTiles(rowIdx, colIdx) {
  const adjTiles = [];
  const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
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
}

function countAdjMines(rowIdx, colIdx) {
  const tile = board[rowIdx][colIdx];
  let count = 0;
  for (let neighbor of tile.adjTiles) {
    if (neighbor.isMine) count++;
  }
  tile.adjMineCount = count;
}

function assignAdjTilesAndCounts() {
  for (let rowIdx = 0; rowIdx < BOARD_ROWS; rowIdx++) {
    for (let colIdx = 0; colIdx < BOARD_COLS; colIdx++) {
      const tile = board[rowIdx][colIdx];
      tile.adjTiles = getAdjTiles(rowIdx, colIdx);
      countAdjMines(rowIdx, colIdx);
    }
  }
}

function revealTile(rowIdx, colIdx) {
  const tile = board[rowIdx][colIdx];
  if (tile.isRevealed || tile.isFlagged) return;
  tile.isRevealed = true;
  if (tile.adjMineCount === 0) {
    for (let neighbor of tile.adjTiles) {
      revealTile(neighbor.rowIdx, neighbor.colIdx);
    }
  }
  renderTile(rowIdx, colIdx);
  renderFlag(rowIdx, colIdx);
}

function revealAllTiles() {
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      board[row][col].isRevealed = true;
    }
  }
}

function checkGameOver() {
  if (isGameOver) return;
  let revealedCount = 0;
  for (let rowIdx = 0; rowIdx < board.length; rowIdx++) {
    for (let colIdx = 0; colIdx < board[rowIdx].length; colIdx++) {
      const tile = board[rowIdx][colIdx];
      if (tile.isRevealed && !tile.isMine) revealedCount++;
    }
  }
  if (revealedCount === TOTAL_TILES - TOTAL_MINES) {
    isGameOver = true;
    applauseSound.currentTime = 0;
    applauseSound.play();
    clearInterval(timerInterval);
    msgPanel.classList.add('open');
    updateExpandPanelArrow();
    const faceBtn = document.getElementById('face-button');
    faceBtn.textContent = '😎';
    launchWinEmojis();
    showPanelMessage("You Won!", `
      <p>Nice! You cleared all<br>the tiles!</p>
      <p class="emoji-line">🙌🏻 👏🏻 🤘🏼 😎</p>
    `);
  }
}

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
  msgPanel.classList.add('open');
  updateExpandPanelArrow();
}

function createWin() {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const tile = board[row][col];
      if (!tile.isMine) {
        tile.isRevealed = true;
      }
    }
  }
  renderBoard();
  checkGameOver();
}

function createLoss() {
  let safeClickCount = 0;
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const tile = board[row][col];
      if (!tile.isMine && safeClickCount < 10) {
        tile.isRevealed = true;
        safeClickCount++;
      }
    }
  }
  renderBoard();
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const tile = board[row][col];
      if (tile.isMine) {
        const tileId = `r${row}c${col}`;
        const tileEl = document.getElementById(tileId);
        if (tileEl) {
          const fakeEvent = {
            button: 0,
            target: tileEl
          };
          handleTileClick(fakeEvent);
        }
        return;
      }
    }
  }
}

window.createWin = createWin;
window.createLoss = createLoss;

startGame();
