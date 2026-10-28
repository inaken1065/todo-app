export const VIEWS = [
  { key: 'list', label: 'リスト' },
  { key: 'board', label: '看板' },
];

export default function ViewToggle({ value, onChange }) {
  return (
    <div role="group" aria-label="表示形式" className="inline-flex rounded-lg bg-slate-200 p-1 dark:bg-slate-800">
      {VIEWS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          aria-pressed={value === key}
          onClick={() => onChange(key)}
          className={`rounded-md px-3 py-1 text-sm transition ${
            value === key
              ? 'bg-white font-medium shadow-sm dark:bg-slate-600'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
