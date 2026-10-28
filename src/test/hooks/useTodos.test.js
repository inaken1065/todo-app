import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTodos } from '../../hooks/useTodos.js';

const KEY = 'todo-app.todos';

describe('useTodos', () => {
  it('初期状態は空', () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  it('追加・更新・削除ができる', () => {
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo('買い物', '2026-01-01'));
    const [todo] = result.current.todos;
    expect(todo).toMatchObject({ text: '買い物', done: false, due: '2026-01-01', memo: '', section: 'todo' });

    act(() => result.current.updateTodo(todo.id, { done: true }));
    expect(result.current.todos[0].done).toBe(true);

    act(() => result.current.removeTodo(todo.id));
    expect(result.current.todos).toEqual([]);
  });

  it('updateTodo は他の項目に影響しない', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo('a', '');
      result.current.addTodo('b', '');
    });
    const [a, b] = result.current.todos;
    act(() => result.current.updateTodo(a.id, { text: 'A' }));
    expect(result.current.todos[0].text).toBe('A');
    expect(result.current.todos[1]).toEqual(b);
  });

  it('clearCompleted は完了済みのみ削除する', () => {
    const { result } = renderHook(() => useTodos());
    act(() => {
      result.current.addTodo('a', '');
      result.current.addTodo('b', '');
    });
    act(() => result.current.updateTodo(result.current.todos[0].id, { done: true }));
    act(() => result.current.clearCompleted());
    expect(result.current.todos.map((t) => t.text)).toEqual(['b']);
  });

  it('変更を localStorage に保存する', () => {
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo('保存', ''));
    expect(JSON.parse(localStorage.getItem(KEY))[0].text).toBe('保存');
  });

  it('保存済みデータを復元し、不正な項目は補正・除外する', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify([
        { id: 'x', text: 'ok', done: true, due: '2026-01-01', memo: 'メモ' },
        { text: 'no-id', done: 'yes', due: 5, memo: 9 },
        { text: 123 },
        null,
      ]),
    );
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toHaveLength(2);
    expect(result.current.todos[0]).toEqual({ id: 'x', text: 'ok', done: true, due: '2026-01-01', memo: 'メモ', section: 'done' });
    expect(result.current.todos[1]).toMatchObject({ text: 'no-id', done: false, due: '' });
    expect(typeof result.current.todos[1].id).toBe('string');
  });

  it('保存済みの section を復元し、不正値は done に応じて補正する', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify([
        { id: 'a', text: 'a', section: 'doing' },
        { id: 'b', text: 'b', section: 'bogus' },
        { id: 'c', text: 'c', done: true, section: 'bogus' },
      ]),
    );
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos.map((t) => t.section)).toEqual(['doing', 'todo', 'done']);
  });

  it('moveTodo でセクションを移動し、完了セクションとの出入りで done が連動する', () => {
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo('a', ''));
    const id = result.current.todos[0].id;

    act(() => result.current.moveTodo(id, 'doing'));
    expect(result.current.todos[0]).toMatchObject({ section: 'doing', done: false });

    act(() => result.current.moveTodo(id, 'done'));
    expect(result.current.todos[0]).toMatchObject({ section: 'done', done: true });

    act(() => result.current.moveTodo(id, 'todo'));
    expect(result.current.todos[0]).toMatchObject({ section: 'todo', done: false });
  });

  it('moveTodo は未知のセクションを無視する', () => {
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo('a', ''));
    act(() => result.current.moveTodo(result.current.todos[0].id, 'nope'));
    expect(result.current.todos[0].section).toBe('todo');
  });

  it('done の切り替えでセクションが連動する', () => {
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo('a', ''));
    const id = result.current.todos[0].id;
    act(() => result.current.moveTodo(id, 'doing'));

    act(() => result.current.updateTodo(id, { done: true }));
    expect(result.current.todos[0].section).toBe('done');

    act(() => result.current.updateTodo(id, { done: false }));
    expect(result.current.todos[0].section).toBe('todo');
  });

  it('配列でない保存データは空として扱う', () => {
    localStorage.setItem(KEY, '{"a":1}');
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  it('壊れた JSON は空として扱う', () => {
    localStorage.setItem(KEY, '{broken');
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  it('保存に失敗しても操作は継続できる', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo('x', ''));
    expect(result.current.todos).toHaveLength(1);
    spy.mockRestore();
  });
});
