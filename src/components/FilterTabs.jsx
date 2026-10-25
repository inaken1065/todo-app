export const FILTERS = [
  { key: 'all', label: 'すべて' },
  { key: 'active', label: '未完了' },
  { key: 'done', label: '完了' },
];

export default function FilterTabs({ value, onChange }) {
  return (
    <div role="group" aria-label="表示の絞り込み" className="inline-flex rounded-lg bg-slate-200 p-1 dark:bg-slate-800">
      {FILTERS.map(({ key, label }) => (
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
