import { useState } from 'react';
import './menu.css';

export default function Menu({ children }: { children: React.ReactNode }) {
  const [expanded, setExpaned] = useState(false);
  
  return (
    <aside>
      <button onClick={() => setExpaned(true)} className={`${expanded ? 'menu-button-hide' : ''} menu cursor-pointer dark:bg-slate-700 bg-white text-slate-500 dark:text-slate-200 hover:scale-110 shadow rounded transition`}>≡</button>
      <div className={`${expanded ? 'menu-content-show' : ''} menu-content dark:bg-slate-800 bg-white shadow-lg`}>
        <div onClick={() => setExpaned(false)} className='flex flex-row pt-4 pl-4 pr-5 pb-3'>
          <div className='text-2xl cursor-pointer text-slate-800 dark:text-slate-100 transition hover:scale-125 mr-2'>🞪</div>
          <h2 className='font-extrabold text-2xl text-slate-800 dark:text-slate-100'>Minesweeper</h2>
        </div>
        <hr className='ml-4 mr-4 mb-2 border-0 h-px bg-slate-300 dark:bg-slate-600' />
        { children }
      </div>
    </aside>
  );
} 