'use client';

import { useState } from "react";
import Board from "./components/board";
import Menu from "./components/menu";
import Property from "./components/property";
import { useImmer } from "use-immer";
import { isNumber } from "lodash";
import PropertyList from "./components/propertyList";

export default function Home() {
  const [config, updateConfig] = useImmer({
    size: 9,
    mineDensity: 0.125,
  });

  const [gameProps, setGameProps] = useState({...config });
  const [gameKey, setGameKey] = useState(0);

  return <>
    <main className='w-full h-full flex flex-col justify-center items-center'>
      <div className='board'>
        <Board key={gameKey} {...gameProps} />
      </div>
    </main>
    <Menu>
      <div className="flex flex-col items-center gap-x-2 gap-y-1.5 px-3">
        <PropertyList properties={config} updateProperty={(key, nextValue) => {
          updateConfig(draft => {
            if (!Number.isNaN(nextValue)) {
              draft[key as keyof typeof config] = nextValue;
            }
          });
        }} />
        <button
          onClick={() => {
            setGameProps({...config });
            setGameKey(gameKey + 1);
          }}
          className="px-4 py-2 font-semibold text-sm bg-sky-400 dark:bg-sky-500 text-white rounded-full tracking-widest px-6 shadow-sm transition hover:scale-110"
        >
          New Game
        </button>
      </div>
    </Menu>
  </>;
}

