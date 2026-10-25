import { useRef, useState } from 'react';

export default function TodoForm({ onAdd }) {
  const [text, setText] = useState('');
  const [due, setDue] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (trimmed === '') return;
    onAdd(trimmed, due);
    setText('');
    setDue('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="やることを入力"
        aria-label="やること"
        autoComplete="off"
        required
        className="min-w-0 flex-1 basis-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:focus:ring-blue-900"
      />
      <input
        type="date"
        value={due}
        onChange={(e) => setDue(e.target.value)}
        aria-label="期日"
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:focus:ring-blue-900"
      />
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
      >
        追加
      </button>
    </form>
  );
}
