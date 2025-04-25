# Minesweeper Planning Document


# 0. Overview
This Planning Document defines:
* What data needs to exist.
* What events/actions happen.
* What page elements must be built.
* What a tile shows when revealed.
* How the basic game flow will run.
* How win and loss conditions are explicitly handled.

# 1. Data Structures
Each tile (square on the grid) must track:
* isBomb (boolean):
  * True if this tile has a bomb, false otherwise.
* isRevealed (boolean):
  * True if the tile has been clicked (revealed).
* isFlagged (boolean):
  * True if the player flagged this tile.
* adjacentBombs (number, 0–8):
  * How many bombs are in the 8 neighboring tiles.

⠀The board (the full grid) is a 2D array (array of arrays) containing all tiles.

# 2. Main User Events
* Left-Click on a Tile
  * If the tile is flagged, do nothing.
  * If the tile has a bomb:
    * Reveal all bombs.
    * Enter "freeze" state.
    * Change face to sad.
  * If the tile does not have a bomb:
    * Reveal the tile.
    * If adjacentBombs = 0, recursively reveal adjacent tiles.
    * Check win condition (after every reveal).
* Right-Click on a Tile
  * If tile is already revealed, do nothing.
  * Toggle the tile's flagged status.
* Click on Face Button
  * Reset the game completely:
    * Create a new board.
    * Randomly place 10 bombs.
    * Reset face to happy.
    * Clear any win/loss state.

⠀
# 3.5 Tile Reveal Outcomes 
When a tile is revealed:
* If the tile has a bomb:
  * Display bomb symbol (💣).
  * (Trigger game over immediately.)
* If the tile does NOT have a bomb:
  * If adjacentBombs > 0:
    * Display the number (1–8) indicating how many bombs are nearby.
  * If adjacentBombs = 0:
    * Display a blank or cleared tile (no number or symbol).

⠀
# 4. Page Elements
* Game Board:
  * 9x9 grid of clickable tiles.
* Face Button:
  * Smiley face at game start.
  * Sad face on loss.
  * Cool face on win.
  * Clickable to reset the game.

⠀(Note: Bomb counter and timer are stretch goals and are NOT needed for MVP.)

# 5. Overall Game Flow
1 Game Start
	* Generate a 9x9 grid.
	* Randomly place 10 bombs.
	* Initialize all tiles as hidden, unflagged.
	* Set face to happy.
2 During Play
	* Player left-clicks or right-clicks on tiles.
	* Game responds to clicks according to rules.
	* After each reveal, check if win condition is met.
3 Game Over (Win or Lose)
	* Freeze the board (no more clicks allowed).
	* Update face accordingly (sad or cool).
4 Game Reset
	* Clicking face button resets everything.
	* New grid, new bombs, fresh game.

⠀
# 6. Win and Lose Conditions
Win Condition
* After any tile reveal, check if every non-bomb tile is revealed.
* If yes:
  * Freeze the board (no further clicks allowed).
  * Change the face to cool 😎.

⠀Lose Condition
* If a player clicks a bomb:
  * Reveal all bombs on the board.
  * Freeze the board (no further clicks allowed).
  * Change the face to sad ☹️.

⠀
