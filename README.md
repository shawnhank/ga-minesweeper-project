
# Minesweeper Game 

A classic Minesweeper game built with HTML, CSS, and JavaScript. The game is designed to work with a grid of tiles, where users can click to reveal tiles, flag mines, and try to win by uncovering all non-mine tiles.


## Table of Contents
- [Minesweeper Game](#minesweeper-game)
  - [Table of Contents](#table-of-contents)
  - [Screenshots](#screenshots)
  - [Tech Stack](#tech-stack)
  - [Project Overview](#project-overview)
  - [Features](#features)
    - [MVP Features:](#mvp-features)
    - [Stretch/Icebox Features:](#stretchicebox-features)
  - [Future Improvements](#future-improvements)
  - [Installation](#installation)
  - [Usage / Gameplay](#usage--gameplay)
  - [Gameplay](#gameplay)
  - [License](#license)
  - [Attributions](#attributions)


## Screenshots

![New Game](https://github.com/shawnhank/ga-minesweeper-project/blob/main/app_shots/ms2.png)
![A Game in Progress](https://github.com/shawnhank/ga-minesweeper-project/blob/main/app_shots/ms5.png)
![A Winning Board](https://github.com/shawnhank/ga-minesweeper-project/blob/main/app_shots/ms7.png)
![A Mine Field](https://github.com/shawnhank/ga-minesweeper-project/blob/main/app_shots/%20ms1.png)
![Losing Animation](https://github.com/shawnhank/ga-minesweeper-project/blob/main/app_shots/ms3.png)
![Pause Game](https://github.com/shawnhank/ga-minesweeper-project/blob/main/app_shots/ms6.png)



## Tech Stack

<img src="https://github.com/shawnhank/ga-minesweeper-project/blob/main/images/HTML.png" alt="HTML Logo" width="120" /> <img src="https://github.com/shawnhank/ga-minesweeper-project/blob/main/images/CSS.svg" alt="CSS Logo" width="120" /> <img src="https://github.com/shawnhank/ga-minesweeper-project/blob/main/images/JS.png" alt="JavaScript Logo" width="120" />



- HTML: Structuring the basic layout of the game board and tiles.

- CSS: Build the board grid with CSS Grid and used Flexbox for positioning.
 
- JavaScript: Managing game logic such as tile interactions, mine placement, and win/loss conditions.


## Project Overview

This project is a Minesweeper clone built as part of a hands-on coding lab to practice and reinforce understanding of HTML, CSS and JavaScript (DOM manipulation, event handling, etc.) 

The game includes key features like:

- A simple grid-based UI built with HTML, CSS Grid, Flexbox and JavaScript
- Tile interactions (revealing tiles, flagging mines)
- Random mine placement and adjacent mine counting
- Individual tile and flag rendering
- Win/loss detection


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

## Future Improvements

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

## Usage / Gameplay

1. Click to reveal tiles: Left-click on tiles to uncover them. If a tile contains a mine, the game ends (game over).
2. Flag potential mines: Right-click on a tile to flag it as a suspected mine.
3. Win condition: The game is won if all non-mine tiles are revealed before any mines are clicked.
4. Restart the game: Refresh the page to reset the game board and start over.

## [Gameplay](https://en.wikipedia.org/wiki/Microsoft_Minesweeper)
The goal of Minesweeper is to uncover all the squares on a grid that do not contain mines without being "blown up" by clicking on a square with a mine underneath. The location of most mines is discovered through a logical process, but some require guessing, usually with a 50-50 chance of being correct. Clicking on the game board will reveal what is hidden underneath the chosen square or squares (a large number of blank squares [bordering 0 mines] may be revealed in one go if they are adjacent to each other). Some squares are blank while others contain numbers (from 1 to 8), with each number being the number of mines adjacent to the uncovered square.

To help the player avoid hitting a mine, the location of a suspected mine can be marked by flagging it with the right mouse button. The game is won once all blank or numbered squares have been uncovered without hitting a mine.


## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

## Attributions
<sub><i>
   - Background image generated using [Hero Patterns](https://heropatterns.com/)
   - Board Images courtesy of [Wikipedia - Category Minesweeper](https://commons.wikimedia.org/wiki/Category:Minesweeper)
   - Mine icon courtesy of [The Noun Project](https://thenounproject.com/icon/mine-965385/)
   - Favicon courtesy of [Jaumes Segarra on GitHub](https://jaumesegarra.github.io/minesweeper/favicon.ico)
   - Badges courtesty of [Vecteezy](https://www.vecteezy.com/vector-art/14030181-programming-language-icons-set-css-html-javascript-isolated-editorial-illustration-on-white)
   - Applause Effect courtesy of Sound Effect by [u_1s41v2luip](https://pixabay.com/users/u_1s41v2luip-28204898/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=113728) from [Pixabay](https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=113728)
   - Explosion Effect courtesy of [freesound_community](https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=6288) from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=6288)
   - Tile Click Sound Effect courtesy [kakaist](https://pixabay.com/users/kakaist-48093450/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=323775)  from [Pixabay](https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=323775)
   - Flag Click Sound Effect courtesy of [Envato Elements](https://elements.envato.com/sound-effects/mouse+click)</i></sub>