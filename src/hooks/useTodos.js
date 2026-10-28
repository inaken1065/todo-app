import { useEffect, useState } from 'react';
import { isSection } from '../lib/sections.js';

const STORAGE_KEY = 'todo-app.todos';

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(data)) return [];
    return data
      .filter((todo) => todo && typeof todo.text === 'string')
      .map((todo) => {
        const done = todo.done === true;
        return {
          id: typeof todo.id === 'string' ? todo.id : crypto.randomUUID(),
          text: todo.text,
          done,
          due: typeof todo.due === 'string' ? todo.due : '',
          memo: typeof todo.memo === 'string' ? todo.memo : '',
          section: isSection(todo.section) ? todo.section : done ? 'done' : 'todo',
        };
      });
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
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text, done: false, due, memo: '', section: 'todo' }]);

  // done の切り替えは「完了」セクションとの出入りに連動させる
  const withSection = (todo, patch) => {
    if (patch.done === undefined || patch.section !== undefined) return patch;
    if (patch.done) return { ...patch, section: 'done' };
    return todo.section === 'done' ? { ...patch, section: 'todo' } : patch;
  };

  const updateTodo = (id, patch) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...withSection(t, patch) } : t)));

  const moveTodo = (id, section) => {
    if (!isSection(section)) return;
    updateTodo(id, { section, done: section === 'done' });
  };

  const removeTodo = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));

  const clearCompleted = () => setTodos((prev) => prev.filter((t) => !t.done));

  return { todos, addTodo, updateTodo, moveTodo, removeTodo, clearCompleted };
}
