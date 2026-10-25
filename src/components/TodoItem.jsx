import { dueStatus } from '../lib/date.js';

const DUE_STYLES = {
  none: 'text-slate-500 dark:text-slate-400',
  upcoming: 'text-slate-500 dark:text-slate-400',
  today: 'font-semibold text-amber-600 dark:text-amber-400',
  overdue: 'font-semibold text-red-600 dark:text-red-400',
};

const DUE_BADGE = { today: '今日', overdue: '期限切れ' };

export default function TodoItem({ todo, onChange, onRemove }) {
  const status = dueStatus(todo);

  return (
    <li className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200 transition dark:bg-slate-800 dark:ring-slate-700">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={(e) => onChange({ done: e.target.checked })}
        aria-label="完了にする"
        className="size-5 shrink-0 cursor-pointer accent-blue-600"
      />
      <span
        className={`min-w-0 flex-1 break-words ${
          todo.done ? 'text-slate-400 line-through dark:text-slate-500' : ''
        }`}
      >
        {todo.text}
      </span>
      {DUE_BADGE[status] && (
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${
            status === 'overdue'
              ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
          }`}
        >
          {DUE_BADGE[status]}
        </span>
      )}
      <input
        type="date"
        value={todo.due}
        onChange={(e) => onChange({ due: e.target.value })}
        aria-label="期日"
        className={`rounded-md border border-slate-200 bg-transparent px-1.5 py-0.5 text-sm dark:border-slate-700 ${DUE_STYLES[status]}`}
      />
      <button
        type="button"
        onClick={onRemove}
        aria-label={`「${todo.text}」を削除`}
        className="rounded-md px-2 py-1 text-sm text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
      >
        削除
      </button>
    </li>
  );
}
