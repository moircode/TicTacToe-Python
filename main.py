"""Self-contained Tic Tac Toe web server.

Serves the static front-end (index.html, style.css, script.js) and exposes a
tiny JSON API that computes the computer's move with a perfect minimax player.

Run:  python main.py   ->  open http://localhost:8000
"""

from __future__ import annotations

import json
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Timer

HOST = "127.0.0.1"
PORT = 8000
ROOT = Path(__file__).parent

STATIC_FILES = {
    "/": ("index.html", "text/html; charset=utf-8"),
    "/index.html": ("index.html", "text/html; charset=utf-8"),
    "/style.css": ("style.css", "text/css; charset=utf-8"),
    "/script.js": ("script.js", "application/javascript; charset=utf-8"),
}

WIN_LINES = (
    (0, 1, 2), (3, 4, 5), (6, 7, 8),  # rows
    (0, 3, 6), (1, 4, 7), (2, 5, 8),  # columns
    (0, 4, 8), (2, 4, 6),             # diagonals
)


def winner(board: list[str]) -> str | None:
    """Return 'X', 'O', 'draw', or None for a board of 9 cells (' ' = empty)."""
    for a, b, c in WIN_LINES:
        if board[a] != " " and board[a] == board[b] == board[c]:
            return board[a]
    if " " not in board:
        return "draw"
    return None


def minimax(board: list[str], player: str, ai: str) -> int:
    """Score the board from the AI's perspective (+ good, - bad)."""
    result = winner(board)
    if result == ai:
        return 10 - board.count(player)
    if result and result != "draw":
        return board.count(player) - 10
    if result == "draw":
        return 0

    scores = []
    for i in range(9):
        if board[i] == " ":
            board[i] = player
            scores.append(minimax(board, "O" if player == "X" else "X", ai))
            board[i] = " "
    return max(scores) if player == ai else min(scores)


def best_move(board: list[str], ai: str) -> int:
    """Index of the AI's optimal move, or -1 if the board is full."""
    best_score = -999
    move = -1
    for i in range(9):
        if board[i] == " ":
            board[i] = ai
            score = minimax(board, "O" if ai == "X" else "X", ai)
            board[i] = " "
            if score > best_score:
                best_score, move = score, i
    return move


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, *args):  # keep the console quiet
        pass

    def _send(self, status: int, body: bytes, content_type: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        entry = STATIC_FILES.get(self.path.split("?", 1)[0])
        if not entry:
            self._send(404, b"Not found", "text/plain; charset=utf-8")
            return
        filename, content_type = entry
        path = ROOT / filename
        if not path.is_file():
            self._send(404, b"Missing file", "text/plain; charset=utf-8")
            return
        self._send(200, path.read_bytes(), content_type)

    def do_POST(self) -> None:
        if self.path != "/api/move":
            self._send(404, b"Not found", "text/plain; charset=utf-8")
            return
        length = int(self.headers.get("Content-Length", 0))
        try:
            payload = json.loads(self.rfile.read(length) or b"{}")
            board = list(payload["board"])
            ai = payload.get("ai", "O")
            assert len(board) == 9 and ai in ("X", "O")
            board = [c if c in ("X", "O") else " " for c in board]
        except (ValueError, KeyError, AssertionError, TypeError):
            self._send(400, b'{"error":"bad request"}', "application/json")
            return

        result = winner(board)
        move = -1 if result else best_move(board, ai)
        if move != -1:
            board[move] = ai
            result = winner(board)

        body = json.dumps({
            "move": move,
            "board": board,
            "result": result,
        }).encode()
        self._send(200, body, "application/json; charset=utf-8")


def open_browser() -> None:
    webbrowser.open(f"http://{HOST}:{PORT}/")


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"  TIC-TAC-TOE online at http://{HOST}:{PORT}/")
    print("  Press Ctrl+C to stop.")
    Timer(0.6, open_browser).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Shutting down. GG.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
