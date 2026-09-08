"use strict";

const HUMAN = "X";
const CPU = "O";

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const cells = [...document.querySelectorAll(".cell")];
const scoreEls = {
  X: document.getElementById("score-x"),
  O: document.getElementById("score-o"),
  draw: document.getElementById("score-d"),
};
const firstSel = document.getElementById("first");
const resetBtn = document.getElementById("reset");

let board = Array(9).fill(" ");
let scores = { X: 0, O: 0, draw: 0 };
let locked = false;
let gameOver = false;

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function winnerOf(b) {
  for (const [a, c, d] of WIN_LINES) {
    if (b[a] !== " " && b[a] === b[c] && b[a] === b[d]) return { who: b[a], line: [a, c, d] };
  }
  if (!b.includes(" ")) return { who: "draw", line: [] };
  return null;
}

function render() {
  cells.forEach((cell, i) => {
    cell.textContent = board[i] === " " ? "" : board[i];
    cell.disabled = locked || gameOver || board[i] !== " ";
  });
}

function setStatus(text) {
  statusEl.textContent = text;
}

function updateScores() {
  scoreEls.X.textContent = scores.X;
  scoreEls.O.textContent = scores.O;
  scoreEls.draw.textContent = scores.draw;
}

function finish(result) {
  gameOver = true;
  locked = false;
  if (result.line.length) {
    result.line.forEach((i) => cells[i].classList.add("win"));
  }
  if (result.who === "draw") {
    scores.draw++;
    setStatus("STALEMATE — NOBODY WINS");
  } else if (result.who === HUMAN) {
    scores.X++;
    setStatus("PLAYER X WINS! IMPOSSIBLE...");
  } else {
    scores.O++;
    setStatus("CPU WINS. GAME OVER.");
  }
  updateScores();
  render();
}

async function cpuMove() {
  locked = true;
  render();
  setStatus("CPU IS THINKING...");
  try {
    const res = await fetch("/api/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ board, ai: CPU }),
    });
    if (!res.ok) throw new Error("bad response");
    const data = await res.json();
    board = data.board.map((c) => (c === "X" || c === "O" ? c : " "));
  } catch (err) {
    // Fallback: play locally so the game still works offline.
    board = localCpuMove(board);
  }
  locked = false;
  const result = winnerOf(board);
  if (result) {
    finish(result);
  } else {
    render();
    setStatus("YOUR MOVE, PLAYER X");
  }
}

// --- minimal local minimax fallback ---
function localCpuMove(b) {
  let bestScore = -Infinity;
  let move = -1;
  for (let i = 0; i < 9; i++) {
    if (b[i] === " ") {
      b[i] = CPU;
      const s = mm(b, HUMAN);
      b[i] = " ";
      if (s > bestScore) { bestScore = s; move = i; }
    }
  }
  if (move !== -1) b[move] = CPU;
  return b;
}

function mm(b, player) {
  const w = winnerOf(b);
  if (w && w.who === CPU) return 10;
  if (w && w.who === HUMAN) return -10;
  if (w) return 0;
  const scoresList = [];
  for (let i = 0; i < 9; i++) {
    if (b[i] === " ") {
      b[i] = player;
      scoresList.push(mm(b, player === HUMAN ? CPU : HUMAN));
      b[i] = " ";
    }
  }
  return player === CPU ? Math.max(...scoresList) : Math.min(...scoresList);
}

function handleClick(e) {
  const i = Number(e.currentTarget.dataset.i);
  if (locked || gameOver || board[i] !== " ") return;
  board[i] = HUMAN;
  const result = winnerOf(board);
  if (result) {
    finish(result);
    return;
  }
  render();
  cpuMove();
}

function newGame() {
  board = Array(9).fill(" ");
  gameOver = false;
  locked = false;
  cells.forEach((c) => c.classList.remove("win"));
  render();
  if (firstSel.value === CPU) {
    setStatus("CPU OPENS...");
    cpuMove();
  } else {
    setStatus("YOUR MOVE, PLAYER X");
  }
}

cells.forEach((cell) => cell.addEventListener("click", handleClick));
resetBtn.addEventListener("click", newGame);
firstSel.addEventListener("change", newGame);

newGame();
