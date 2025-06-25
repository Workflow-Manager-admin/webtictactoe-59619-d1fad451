import React, { useState } from "react";
import "./App.css";

// COLORS from palette
const PALETTE = {
  accent: "#ffeb3b",
  primary: "#1976d2",
  secondary: "#424242"
};

// Utility: check for a winner
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /**
   * Checks board for a winner.
   * Returns 'X', 'O', or null.
   */
  // All lines to check
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function isBoardFull(squares) {
  /** Returns true if no nulls in squares (all filled) */
  return squares.every(cell => cell);
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Main React SPA for Tic Tac Toe
   * - Renders header, centered game board, status, scoreboard and reset
   * - Two players (X, O) take turns
   * - Shows winner/draw, can reset game
   * - Minimalistic, accesible, light-themed UI
   */
  // State: game board, turn, outcome, stats
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const winner = calculateWinner(squares);
  const isDraw = !winner && isBoardFull(squares);

  // Scoreboard: session only
  const [score, setScore] = useState({ X: 0, O: 0 });

  // PUBLIC_INTERFACE
  const handleSquareClick = idx => {
    /**
     * Handles a user click on a square.
     * - If the square already filled or game over, ignore.
     */
    if (squares[idx] || winner || isDraw) return;
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
    // If they just played and won, update score
    const nextWinner = calculateWinner(nextSquares);
    if (nextWinner) {
      setScore(prev => ({
        ...prev,
        [nextWinner]: prev[nextWinner] + 1
      }));
    }
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    /**
     * Resets the game board/state for a new game.
     * Does not reset the scoreboard.
     */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  // UI helpers
  let status;
  if (winner) {
    status = (
      <span>
        <span className="winner" style={{ color: PALETTE.accent }}>
          {winner}
        </span>{" "}
        wins!
      </span>
    );
  } else if (isDraw) {
    status = (
      <span>
        <span className="draw" style={{ color: PALETTE.secondary }}>
          Draw
        </span>
        !
      </span>
    );
  } else {
    status = (
      <span>
        Next:{" "}
        <span
          className={xIsNext ? "x-turn" : "o-turn"}
          style={{ color: xIsNext ? PALETTE.primary : PALETTE.secondary }}
        >
          {xIsNext ? "X" : "O"}
        </span>
      </span>
    );
  }

  return (
    <div className="ttt-root">
      <header className="ttt-header">
        <h1
          className="ttt-title"
          style={{
            color: PALETTE.primary,
            marginBottom: "0.35em"
          }}
        >
          Tic Tac Toe
        </h1>
        <div className="ttt-subtitle" style={{ color: PALETTE.secondary }}>
          Two Players · Minimalistic React SPA
        </div>
      </header>

      <main className="ttt-content">
        <div className="ttt-scoreboard" aria-label="Score board">
          <span
            className="x-score sb-chip"
            style={{
              background: "rgba(25, 118, 210, 0.1)",
              color: PALETTE.primary
            }}
          >
            X&nbsp;{score.X}
          </span>
          <span
            className="o-score sb-chip"
            style={{
              background: "rgba(66,66,66,0.07)",
              color: PALETTE.secondary
            }}
          >
            O&nbsp;{score.O}
          </span>
        </div>
        <div className="ttt-status" role="status" aria-live="polite">
          {status}
        </div>
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          disabled={!!winner || isDraw}
        />
        <button
          className="ttt-reset-btn"
          aria-label="Restart game"
          onClick={handleRestart}
        >
          Restart
        </button>
      </main>
      <footer className="ttt-footer">
        <span>
          <a
            href="https://react.dev/"
            rel="noopener noreferrer"
            target="_blank"
            style={{ color: PALETTE.primary, textDecoration: "none" }}
          >
            React
          </a>{" "}
          SPA &mdash; 
          <span style={{ color: PALETTE.accent }}>Light Theme</span>
        </span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, disabled }) {
  /**
   * Renders a 3x3 tic-tac-toe board.
   * - `squares`: array of 9 cells ("X", "O", or null)
   * - `onSquareClick(idx)` - called when a cell is clicked
   * - `disabled`: disables clicking if true
   */
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      {[0, 1, 2].map(row => (
        <div key={row} className="ttt-row" role="row">
          {[0, 1, 2].map(col => {
            const idx = row * 3 + col;
            return (
              <Square
                key={idx}
                value={squares[idx]}
                onClick={() => onSquareClick(idx)}
                disabled={disabled || !!squares[idx]}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Square({ value, onClick, disabled }) {
  /**
   * A single tic-tac-toe square/cell.
   * - Renders 'X', 'O', or nothing
   */
  let fg;
  if (value === "X") fg = PALETTE.primary;
  else if (value === "O") fg = PALETTE.secondary;
  else fg = "#bdbdbd";

  return (
    <button
      className="ttt-square"
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Cell filled with ${value}` : "Empty cell"}
      tabIndex={0}
      style={{
        color: fg,
        cursor: disabled ? "not-allowed" : "pointer"
      }}
    >
      {value || ""}
    </button>
  );
}

export default App;
