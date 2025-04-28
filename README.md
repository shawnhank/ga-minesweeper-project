
# Minesweeper Clone Project

A classic Minesweeper game built with HTML, CSS, and JavaScript. The game is designed to work with a grid of tiles, where users can click to reveal tiles, flag mines, and try to win by uncovering all non-mine tiles.

## Table of Contents
- [Minesweeper Clone Project](#minesweeper-clone-project)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Features](#features)
    - [MVP Features:](#mvp-features)
    - [Stretch/Icebox Features:](#stretchicebox-features)
  - [Tech Stack](#tech-stack)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Game Logic](#game-logic)
    - [1. Tile Representation](#1-tile-representation)
- [Minesweeper Game](#minesweeper-game)
  - [Table of Contents](#table-of-contents-1)
  - [Project Overview](#project-overview-1)
  - [Features](#features-1)
    - [MVP Features:](#mvp-features-1)
    - [Stretch/Icebox Features:](#stretchicebox-features-1)
  - [Tech Stack](#tech-stack-1)
  - [Installation](#installation-1)
  - [Usage](#usage-1)
  - [License](#license)

## Project Overview

This project is a Minesweeper clone built as part of a hands-on coding lab to practice and reinforce understanding of JavaScript, DOM manipulation, and event handling. The game includes key features like:

- Tile interactions (revealing tiles, flagging mines)
- Mine placement and adjacent mine counting
- Win/loss detection
- A simple grid-based UI built with HTML, CSS Grid, and JavaScript

## Features

### MVP Features:
- Grid Layout: 9x9 grid of tiles that can be clicked or flagged.
- Mines: Randomly placed mines that the player needs to avoid.
- Revealing Tiles: When a tile is clicked, it reveals either the adjacent mine count or a bomb.
- Flagging: Right-click to flag a tile as a suspected mine.
- Win Condition: The game ends successfully when all non-mine tiles are revealed.
- Game Over: The game ends if a mine is clicked.
- Event Listeners: Uses event delegation to handle left-click and right-click interactions with tiles.
- Basic Tile Rendering: Displays mine, flag, or adjacent mine count based on tile state.

### Stretch/Icebox Features:
- Flag Counter: Displays the number of flags left to be placed.
- Countdown Timer: Adds a countdown timer for the game duration.
- Difficulty Levels: Allows users to choose different difficulty levels with increased grid sizes.
- Sound Effects: Adds sounds for actions like clicking, flagging, or hitting a mine.
- Reset Button: Adds a button to restart the game without refreshing the page.
- Save/Load Game: Allows users to save and load game states for later continuation.
- Mobile Responsiveness: Optimizes the layout for smaller screen sizes.

## Tech Stack

- HTML: Structuring the basic layout of the game board and tiles.
- CSS: Styling the grid and individual tiles, including hover and flag interactions.
- JavaScript: Managing game logic such as tile interactions, mine placement, and win/loss conditions.

## Installation

To run the game locally, you need to follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/minesweeper.git
   ```
2. Navigate to the project folder:
   ```bash
   cd minesweeper
   ```
3. Open the `index.html` file in your browser:
   - Double-click the `index.html` file, or open it using your preferred browser to play the game.

## Usage

1. Click to reveal tiles: Left-click on tiles to uncover them. If a tile contains a mine, the game ends (game over).
2. Flag potential mines: Right-click on a tile to flag it as a suspected mine.
3. Win condition: The game is won if all non-mine tiles are revealed before any mines are clicked.
4. Restart the game: Refresh the page to reset the game board and start over.

## Game Logic

### 1. Tile Representation
Each tile on the game board is represented by an object containing the following state variables:

```
{
  isMine: false,          // Default is not a mine
  isRevealed: false,      // Default is hidden
  isFlagged: false,       // Default is not flagged
  adjMineCount: null,     // Adjacent mine count (null initially)
  adjCells: [],           // List of adjacent cells (empty initially)
  neighbors: [],          // This will store neighboring cells
  rowIdx,                 // Row index for the tile (dynamically set)
  colIdx                  // Column index for the tile (dynamically set)
}

```

#ga/seb/projects/minesweeper

---

# Minesweeper Game

A classic Minesweeper game built with HTML, CSS, and JavaScript. The game is designed to work with a grid of tiles, where users can click to reveal tiles, flag mines, and try to win by uncovering all non-mine tiles.

## Table of Contents
- [Minesweeper Clone Project](#minesweeper-clone-project)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Features](#features)
    - [MVP Features:](#mvp-features)
    - [Stretch/Icebox Features:](#stretchicebox-features)
  - [Tech Stack](#tech-stack)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Game Logic](#game-logic)
    - [1. Tile Representation](#1-tile-representation)
- [Minesweeper Game](#minesweeper-game)
  - [Table of Contents](#table-of-contents-1)
  - [Project Overview](#project-overview-1)
  - [Features](#features-1)
    - [MVP Features:](#mvp-features-1)
    - [Stretch/Icebox Features:](#stretchicebox-features-1)
  - [Tech Stack](#tech-stack-1)
  - [Installation](#installation-1)
  - [Usage](#usage-1)
  - [License](#license)

## Project Overview

This project is a Minesweeper clone built as part of a hands-on coding lab to practice and reinforce understanding of JavaScript, DOM manipulation, and event handling. The game includes key features like:

- Tile interactions (revealing tiles, flagging mines)
- Mine placement and adjacent mine counting
- Win/loss detection
- A simple grid-based UI built with HTML, CSS Grid, and JavaScript

## Features

### MVP Features:
- Grid Layout: 9x9 grid of tiles that can be clicked or flagged.
- Mines: Randomly placed mines that the player needs to avoid.
- Revealing Tiles: When a tile is clicked, it reveals either the adjacent mine count or a bomb.
- Flagging: Right-click to flag a tile as a suspected mine.
- Win Condition: The game ends successfully when all non-mine tiles are revealed.
- Game Over: The game ends if a mine is clicked.
- Event Listeners: Uses event delegation to handle left-click and right-click interactions with tiles.
- Basic Tile Rendering: Displays mine, flag, or adjacent mine count based on tile state.

### Stretch/Icebox Features:
- Flag Counter: Displays the number of flags left to be placed.
- Countdown Timer: Adds a countdown timer for the game duration.
- Difficulty Levels: Allows users to choose different grid sizes (e.g., 8x8, 16x16).
- Sound Effects: Adds sounds for actions like clicking, flagging, or hitting a mine.
- Reset Button: Adds a button to restart the game without refreshing the page.
- Save/Load Game: Allows users to save and load game states for later continuation.
- Mobile Responsiveness: Optimizes the layout for smaller screen sizes.

## Tech Stack

- HTML: Structuring the basic layout of the game board and tiles.
- CSS: Styling the grid and individual tiles, including hover and flag interactions.
- JavaScript: Managing game logic such as tile interactions, mine placement, and win/loss conditions.

## Installation

To run the game locally, you need to follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/shawnhank/minesweeper.git
   ```
2. Navigate to the project folder:
   ```bash
   cd minesweeper
   ```
3. Open the `index.html` file in your browser:
   - Double-click the `index.html` file, or open it using your preferred browser to play the game.

## Usage

1. Click to reveal tiles: Left-click on tiles to uncover them. If a tile contains a mine, the game ends (game over).
2. Flag potential mines: Right-click on a tile to flag it as a suspected mine.
3. Win condition: The game is won if all non-mine tiles are revealed before any mines are clicked.
4. Restart the game: Refresh the page to reset the game board and start over.

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.