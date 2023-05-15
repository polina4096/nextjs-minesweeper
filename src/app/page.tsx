'use client';

import Board from "./components/board";

export default function Home() {
  return (
    <main className='w-full h-full flex flex-col justify-center items-center'>
      <div className='board'>
        <Board />
      </div>
    </main>
  )
}

