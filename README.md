# TIC-TAC-TOE // ARCADE TERMINAL

A vintage arcade-style Tic Tac Toe game with a glowing CRT aesthetic —
phosphor-green text, scanlines, chromatic drift, and a screen flicker.
You play **X** against a CPU that never loses: every computer move is
computed by a perfect [minimax](https://en.wikipedia.org/wiki/Minimax)
player running on a tiny Python server.

```
 :: INSERT COIN — 1P vs CPU ::
```

## Features

- Retro CRT cabinet styling with animated scanlines and neon glow
- Unbeatable AI (minimax) served from a lightweight Python backend
- Choose who moves first — player or CPU
- Running scoreboard for wins, losses, and draws
- Works offline: if the server is unreachable, an in-browser minimax
  fallback keeps the game playable

## Prerequisites

- **Python 3** (3.8 or newer). Check with:

  ```bash
  python --version
  ```

- A modern web browser.

No third-party packages are required — the server uses only the Python
standard library.

## Installation

Clone the repository and enter the project directory:

```bash
git clone https://github.com/<your-username>/TicTacToe-Python.git
cd TicTacToe-Python
```

## How to Run

Start the game server:

```bash
python main.py
```

You should see:

```
  TIC-TAC-TOE online at http://127.0.0.1:8000/
  Press Ctrl+C to stop.
```

The game opens in your default browser automatically. If it doesn't,
open this link manually:

**http://localhost:8000**

Press `Ctrl+C` in the terminal to stop the server.

## How to Play

1. You are **Player X**. Click any empty cell to make your move.
2. The CPU (**O**) responds with its optimal move.
3. Get three in a row to win — though against a perfect player, a draw
   is the best you can hope for.
4. Use **FIRST MOVE** to pick who starts, and **NEW GAME** to reset the
   board.

## Project Structure

| File         | Purpose                                             |
| ------------ | --------------------------------------------------- |
| `main.py`    | HTTP server + JSON API with the minimax AI          |
| `index.html` | Game markup                                         |
| `style.css`  | CRT / arcade styling                                |
| `script.js`  | Board logic, rendering, and API calls               |
