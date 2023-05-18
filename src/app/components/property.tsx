import { useState } from 'react';
import './property.css';
import humanizeString from 'humanize-string';

export default function Property({ name, value, setValue }: { name: string, value: number, setValue: (value: number) => void }) {
  const [nextValueString, setNextValueString] = useState(value.toString());
  const [lastValidValue, setLastValidValue] = useState(value);

  return <>
    <td>
      <label htmlFor={name}>{humanizeString(name)}</label>
    </td>
    <td>
      <input
        name={name}
        type="number"
        value={nextValueString}
        onChange={e => setNextValueString(e.target.value)}
        onFocus={() => setLastValidValue(value)}
        onBlur={() => {
          let nextValue = parseFloat(nextValueString);
          if (!Number.isNaN(nextValue)) {
            setValue(nextValue);
            setLastValidValue(nextValue);
          } else {
            setNextValueString(lastValidValue.toString());
          }
        }}
        className="dark:text-slate-100 text-slate-800 dark:bg-slate-600 bg-gray-200 py-1 px-2 rounded-md" />
    </td>
  </>;
}