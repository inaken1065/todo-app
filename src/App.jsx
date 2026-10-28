import { useState } from 'react';
import FilterTabs from './components/FilterTabs.jsx';
import TodoForm from './components/TodoForm.jsx';
import TodoSection from './components/TodoSection.jsx';
import ViewToggle from './components/ViewToggle.jsx';
import { useTodos } from './hooks/useTodos.js';
import { SECTIONS } from './lib/sections.js';

const EMPTY_MESSAGES = {
  all: 'タスクはまだありません。上のフォームから追加しましょう。',
  active: '未完了のタスクはありません 🎉',
  done: '完了したタスクはありません。',
};

export default function App() {
  const { todos, addTodo, updateTodo, moveTodo, removeTodo, clearCompleted } = useTodos();
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('list');

  const remaining = todos.filter((t) => !t.done).length;
  const completed = todos.length - remaining;
  const visible = todos.filter((t) =>
    filter === 'active' ? !t.done : filter === 'done' ? t.done : true,
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <main className={`mx-auto px-4 py-10 ${view === 'board' ? 'max-w-5xl' : 'max-w-xl'}`}>
        <h1 className="mb-6 text-center text-3xl font-bold tracking-tight">TODO</h1>

        <TodoForm onAdd={addTodo} />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <FilterTabs value={filter} onChange={setFilter} />
            <ViewToggle value={view} onChange={setView} />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400" aria-live="polite">
            残り {remaining} 件
          </p>
        </div>

        {visible.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500 dark:border-slate-700">
            {EMPTY_MESSAGES[filter]}
          </p>
        ) : (
          <div className={`mt-4 gap-3 ${view === 'board' ? 'grid items-start md:grid-cols-3' : 'space-y-3'}`}>
            {SECTIONS.map((section) => (
              <TodoSection
                key={section.id}
                section={section}
                todos={visible.filter((t) => t.section === section.id)}
                onMove={moveTodo}
                onChange={updateTodo}
                onRemove={removeTodo}
              />
            ))}
          </div>
        )}

        {completed > 0 && (
          <div className="mt-4 text-right">
            <button
              type="button"
              onClick={clearCompleted}
              className="text-sm text-slate-500 underline-offset-2 hover:text-red-600 hover:underline dark:hover:text-red-400"
            >
              完了済みを削除（{completed}件）
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
