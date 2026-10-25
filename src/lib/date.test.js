import { afterEach, describe, expect, it, vi } from 'vitest';
import { dueStatus, today } from './date.js';

afterEach(() => vi.useRealTimers());

describe('today', () => {
  it('ゼロ埋めした YYYY-MM-DD を返す', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 5, 12));
    expect(today()).toBe('2026-01-05');
  });
});

describe('dueStatus', () => {
  const t = '2026-06-15';
  it('完了済みは none', () => {
    expect(dueStatus({ done: true, due: '2020-01-01' }, t)).toBe('none');
  });
  it('期日なしは none', () => {
    expect(dueStatus({ done: false, due: '' }, t)).toBe('none');
  });
  it('過去は overdue', () => {
    expect(dueStatus({ done: false, due: '2026-06-14' }, t)).toBe('overdue');
  });
  it('当日は today', () => {
    expect(dueStatus({ done: false, due: t }, t)).toBe('today');
  });
  it('未来は upcoming', () => {
    expect(dueStatus({ done: false, due: '2026-06-16' }, t)).toBe('upcoming');
  });
  it('第2引数省略時は現在日付を使う', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 15));
    expect(dueStatus({ done: false, due: '2026-06-15' })).toBe('today');
  });
});
