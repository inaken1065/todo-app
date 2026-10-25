export function today() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function dueStatus(todo, todayStr = today()) {
  if (todo.done || todo.due === '') return 'none';
  if (todo.due < todayStr) return 'overdue';
  if (todo.due === todayStr) return 'today';
  return 'upcoming';
}
