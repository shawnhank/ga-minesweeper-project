# Minesweeper Pseudocode

## Game Setup

- Create a 10x10 grid (`board`)
- Each tile should be an object:
  - `isMine`: boolean
  - `isRevealed`: boolean
  - `isFlagged`: boolean
  - `surroundingMines`: number

## init()

1. Create an empty 10x10 board.
2. For each row (0 to 9):
    - Place a single mine at a random column.
3. Loop through each tile on the board:
    - Count how many of the 8 surrounding tiles contain mines.
    - Store that count in `surroundingMines`.
4. Initialize game state:
    - `minesLeft = 10`
    - `isGameOver = false`
    - `cellsRevealedCount = 0`

## handleClick(row, col)

1. If the tile is flagged or already revealed → return.
2. If the tile is a mine:
    - Reveal it
    - Set `isGameOver = true`
    - End the game
3. If the tile has `surroundingMines > 0`:
    - Reveal the tile
    - Stop
4. If surroundingMines = 0:
    - Call `floodReveal(row, col)` to reveal adjacent tiles
5. Check win condition

## handleRightClick(row, col)

1. If the tile is revealed → return.
2. If flagged → unflag and update `minesLeft++`
3. If unflagged → flag and update `minesLeft--`
4. Update UI accordingly

## floodReveal(row, col)

- Base case: if tile is out of bounds, flagged, revealed, or a mine → return
- Reveal the tile
- If `surroundingMines > 0` → stop
- Recursively call `floodReveal()` on all 8 neighbors

## checkWin()

- If all non-mine tiles are revealed → player wins

## render()

- Loop through board
    - Update tile classes based on tile state
- Update:
    - Mine counter
    - Restart button
    - Win/Loss display