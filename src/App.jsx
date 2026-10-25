import { useState } from 'react';
import FilterTabs from './components/FilterTabs.jsx';
import TodoForm from './components/TodoForm.jsx';
import TodoItem from './components/TodoItem.jsx';
import { useTodos } from './hooks/useTodos.js';

const EMPTY_MESSAGES = {
  all: 'タスクはまだありません。上のフォームから追加しましょう。',
  active: '未完了のタスクはありません 🎉',
  done: '完了したタスクはありません。',
};

export default function App() {
  const { todos, addTodo, updateTodo, removeTodo, clearCompleted } = useTodos();
  const [filter, setFilter] = useState('all');

  const remaining = todos.filter((t) => !t.done).length;
  const completed = todos.length - remaining;
  const visible = todos.filter((t) =>
    filter === 'active' ? !t.done : filter === 'done' ? t.done : true,
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <main className="mx-auto max-w-xl px-4 py-10">
        <h1 className="mb-6 text-center text-3xl font-bold tracking-tight">TODO</h1>

        <TodoForm onAdd={addTodo} />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          <FilterTabs value={filter} onChange={setFilter} />
          <p className="text-sm text-slate-600 dark:text-slate-400" aria-live="polite">
            残り {remaining} 件
          </p>
        </div>

        {visible.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500 dark:border-slate-700">
            {EMPTY_MESSAGES[filter]}
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {visible.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onChange={(patch) => updateTodo(todo.id, patch)}
                onRemove={() => removeTodo(todo.id)}
              />
            ))}
          </ul>
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
