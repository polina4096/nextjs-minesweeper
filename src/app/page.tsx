'use client';

import { useState, MouseEvent } from 'react'
import './board.css';
import _ from 'lodash';

export default function Home() {
  const boardSize = 9;
  const mineDensity = 0.1;

  // Current board state:
  //  -2 => exploded
  //  -1 => unrevealed
  // >=0 => neighbor mines
  const [board, setBoard] = useState(
    Array.from({ length: boardSize * boardSize }, () => -1)
  );

  // Mine placement:
  // true  => mine
  // false => clear
  const [mines, setMines] = useState(
    Array.from({ length: boardSize * boardSize }, () => Math.random() > mineDensity ? false : true)
  );

  const [revealed, setRevealed] = useState(
    new Set()
  );

  function inbounds(x: number, y: number, size: number) {
    return x >= 0 && x < size && y >= 0 && y < size;
  }

  function revealCell(idx: number) {
    let neighbors = calculateNeighbors(idx);
    board[idx] = neighbors;

    function revealSide(x: number, y: number) {
      let idx = x + y * boardSize;
      if (!revealed.has(idx) && inbounds(x, y, boardSize)) {
        revealed.add(idx);
  
        let neighbors = calculateNeighbors(idx);
        if (neighbors == 0)
          revealCell(idx);
        else
          board[idx] = neighbors;
      }
    }

    if (neighbors == 0) {
      let x = idx % boardSize;
      let y = Math.floor(idx / boardSize);

      // Cross
      revealSide(x - 1, y);
      revealSide(x + 1, y);
      revealSide(x, y - 1);
      revealSide(x, y + 1);

      // Diagonal
      revealSide(x + 1, y + 1);
      revealSide(x + 1, y - 1);
      revealSide(x - 1, y + 1);
      revealSide(x - 1, y - 1);
    }
  }

  function onCellRightClick(e: MouseEvent, idx: number) {
    e.preventDefault();

    if (board[idx] == -1) {
      board[idx] = -3;
      setBoard([...board]);
    } else if (board[idx] == -3) {
      board[idx] = -1;
      setBoard([...board]);
    }
  }

  function onCellClick(idx: number) {
    if (board[idx] == -3) return;

    if (mines[idx]) {
      board[idx] = -2;
      setBoard([...board]);
    } else {
      revealCell(idx);
      setBoard([...board]);
    }
  }

  function calculateNeighbors(idx: number) {
    let x = idx % boardSize;
    let y = Math.floor(idx / boardSize);

    let neighborMines = 0;

    function mineAt(x: number, y: number): boolean {
      return inbounds(x, y, boardSize) && mines[x + y * boardSize];
    }

    // Mid
    if (mineAt(x    , y)) neighborMines++;
    if (mineAt(x + 1, y)) neighborMines++;
    if (mineAt(x - 1, y)) neighborMines++;
    
    // Top
    if (mineAt(x    , y - 1)) neighborMines++;
    if (mineAt(x + 1, y - 1)) neighborMines++;
    if (mineAt(x - 1, y - 1)) neighborMines++;
    
    // Bottom
    if (mineAt(x    , y + 1)) neighborMines++;
    if (mineAt(x + 1, y + 1)) neighborMines++;
    if (mineAt(x - 1, y + 1)) neighborMines++;

    return neighborMines;
  }

  let gridElement = _.chunk(board, boardSize).map((cells, i) =>
    <div key={i} className='flex flex-row'>
      {
        cells.map((cell, j) => {
          let cellClass;

          switch(board[i + j * boardSize]) {
            // Flag
            case -3: {
              cellClass = 'bg-slate-400 flag';

              break;
            }

            // Explosion
            case -2: {
              cellClass = 'bg-rose-200';

              break;
            }

            // Unrevealed
            case -1: {
              cellClass = 'bg-slate-300';

              break;
            }

            // Clear
            default: {
              cellClass = 'bg-slate-500';

              break;
            }
          }
          
          return <div
            key={i + j * boardSize}
            onContextMenu={(e) => onCellRightClick(e, i + j * boardSize)}
            onClick={() => onCellClick(i + j * boardSize)}
            className={`${cellClass} cell text-slate-200 shadow-md shadow-slate-500/25 rounded transition hover:scale-110 cursor-pointer flex items-center justify-center`}
          >
            {board[i + j * boardSize] > 0 && board[i + j * boardSize]}
          </div>;
        })
      }
    </div>
  );

  return (
    <main className='w-full h-full flex flex-col justify-center items-center'>
      <div className='board'>
        {gridElement}
      </div>
    </main>
  )
}
