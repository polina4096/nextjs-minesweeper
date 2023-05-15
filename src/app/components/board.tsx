import { useImmer } from 'use-immer';
import { useState, MouseEvent } from 'react';
import './board.css';
import _ from 'lodash';

enum BaseCell {
  Flagged    = -3,
  Exploded   = -2,
  Unrevealed = -1,
}

type Cell = BaseCell | number;

export default function Board({ size = 9, mineDensity = 0.125 }) {
  const [board, updateBoard] = useImmer(
    Array.from({ length: size * size }, () => -1)
  );

  const [mines, setMines] = useState(
    Array.from({ length: size * size }, () => Math.random() > mineDensity ? false : true)
  );

  const [revealed, setRevealed] = useState(
    new Set()
  );

  function inbounds(x: number, y: number, size: number) {
    return x >= 0 && x < size && y >= 0 && y < size;
  }

  function revealCell(idx: number) {
    let neighbors = calculateNeighbors(idx);
    updateBoard((b: number[]) => { b[idx] = neighbors; });

    function revealSide(x: number, y: number) {
      let idx = x + y * size;
      if (!revealed.has(idx) && inbounds(x, y, size)) {
        revealed.add(idx);
  
        let neighbors = calculateNeighbors(idx);
        if (neighbors == 0)
          revealCell(idx);
        else
          updateBoard((b: number[]) => { b[idx] = neighbors; });
      }
    }

    if (neighbors == 0) {
      let x = idx % size;
      let y = Math.floor(idx / size);

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

    if (board[idx] == BaseCell.Unrevealed) {
      updateBoard((b: number[]) => { b[idx] = BaseCell.Flagged; });
      return;
    }
    
    if (board[idx] == BaseCell.Flagged) {
      updateBoard((b: number[]) => { b[idx] = BaseCell.Unrevealed; });
      return;
    }
  }

  function onCellClick(idx: number) {
    if (board[idx] == BaseCell.Flagged) return;

    if (mines[idx]) {
      updateBoard((b: number[]) => { b[idx] = BaseCell.Exploded; });
    } else {
      revealCell(idx);
    }
  }

  function calculateNeighbors(idx: number) {
    let x = idx % size;
    let y = Math.floor(idx / size);

    let neighborMines = 0;

    function mineAt(x: number, y: number): boolean {
      return inbounds(x, y, size) && mines[x + y * size];
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

  return <>
    {_.chunk(board, size).map((cells, i) =>
      <div key={i} className='flex flex-row'>
        {
          cells.map((cell, j) => {
            let cellClass;

            switch(board[i + j * size]) {
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
              key={i + j * size}
              onContextMenu={(e) => onCellRightClick(e, i + j * size)}
              onClick={() => onCellClick(i + j * size)}
              className={`${cellClass} cell text-slate-200 shadow-md shadow-slate-500/25 rounded transition hover:scale-110 cursor-pointer flex items-center justify-center`}
            >
              {board[i + j * size] > 0 && board[i + j * size]}
            </div>;
          })
        }
      </div>
    )}
  </>;
}