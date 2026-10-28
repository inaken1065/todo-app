export const SECTIONS = [
  { id: 'todo', label: '未着手' },
  { id: 'doing', label: '進行中' },
  { id: 'done', label: '完了' },
];

export const isSection = (id) => SECTIONS.some((s) => s.id === id);
