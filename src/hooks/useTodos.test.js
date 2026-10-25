import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTodos } from './useTodos.js';

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
    expect(todo).toMatchObject({ text: '買い物', done: false, due: '2026-01-01' });

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
        { id: 'x', text: 'ok', done: true, due: '2026-01-01' },
        { text: 'no-id', done: 'yes', due: 5 },
        { text: 123 },
        null,
      ]),
    );
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toHaveLength(2);
    expect(result.current.todos[0]).toEqual({ id: 'x', text: 'ok', done: true, due: '2026-01-01' });
    expect(result.current.todos[1]).toMatchObject({ text: 'no-id', done: false, due: '' });
    expect(typeof result.current.todos[1].id).toBe('string');
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
