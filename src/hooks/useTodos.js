import { useEffect, useState } from 'react';

const STORAGE_KEY = 'todo-app.todos';

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(data)) return [];
    return data
      .filter((todo) => todo && typeof todo.text === 'string')
      .map((todo) => ({
        id: typeof todo.id === 'string' ? todo.id : crypto.randomUUID(),
        text: todo.text,
        done: todo.done === true,
        due: typeof todo.due === 'string' ? todo.due : '',
        memo: typeof todo.memo === 'string' ? todo.memo : '',
      }));
  } catch {
    return [];
  }
}

export function useTodos() {
  const [todos, setTodos] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // 保存できない環境（プライベートモードなど）でも操作は継続する
    }
  }, [todos]);

  const addTodo = (text, due) =>
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text, done: false, due, memo: '' }]);

  const updateTodo = (id, patch) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const removeTodo = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));

  const clearCompleted = () => setTodos((prev) => prev.filter((t) => !t.done));

  return { todos, addTodo, updateTodo, removeTodo, clearCompleted };
}
