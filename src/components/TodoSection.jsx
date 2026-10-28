import { useState } from 'react';
import TodoItem from './TodoItem.jsx';

export default function TodoSection({ section, todos, onMove, onChange, onRemove, className = '' }) {
  const [over, setOver] = useState(false);
  const headingId = `section-${section.id}`;

  return (
    <section
      aria-labelledby={headingId}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const id = e.dataTransfer.getData('text/plain');
        if (id) onMove(id, section.id);
      }}
      className={`rounded-xl p-2 ring-1 transition ${
        over
          ? 'bg-blue-50 ring-blue-400 dark:bg-blue-950 dark:ring-blue-500'
          : 'bg-slate-200/60 ring-transparent dark:bg-slate-800/60'
      } ${className}`}
    >
      <h2 id={headingId} className="mb-2 px-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
        {section.label}
        <span aria-hidden="true" className="ml-2 font-normal text-slate-500 dark:text-slate-400">{todos.length}</span>
      </h2>
      <ul className="min-h-12 space-y-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onChange={(patch) => onChange(todo.id, patch)}
            onRemove={() => onRemove(todo.id)}
          />
        ))}
      </ul>
    </section>
  );
}
