import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TodoItem from '../../components/TodoItem.jsx';

const base = { id: '1', text: '掃除', done: false, due: '' };

function setup(todo = {}) {
  const onChange = vi.fn();
  const onRemove = vi.fn();
  render(<TodoItem todo={{ ...base, ...todo }} onChange={onChange} onRemove={onRemove} />);
  return { onChange, onRemove };
}

afterEach(() => vi.useRealTimers());

describe('TodoItem', () => {
  it('テキストを表示する', () => {
    setup();
    expect(screen.getByText('掃除')).toBeInTheDocument();
  });

  it('チェックで done を通知する', async () => {
    const { onChange } = setup();
    await userEvent.click(screen.getByLabelText('完了にする'));
    expect(onChange).toHaveBeenCalledWith({ done: true });
  });

  it('完了済みは取り消し線で表示される', () => {
    setup({ done: true });
    expect(screen.getByText('掃除')).toHaveClass('line-through');
    expect(screen.getByLabelText('完了にする')).toBeChecked();
  });

  it('期日変更を通知する', () => {
    const { onChange } = setup();
    // type="date" は fireEvent 相当で値を設定する
    const input = screen.getByLabelText('期日');
    return userEvent.type(input, '2026-05-06').then(() =>
      expect(onChange).toHaveBeenLastCalledWith({ due: '2026-05-06' }),
    );
  });

  it('削除ボタンで onRemove を呼ぶ', async () => {
    const { onRemove } = setup();
    await userEvent.click(screen.getByRole('button', { name: '「掃除」を削除' }));
    expect(onRemove).toHaveBeenCalled();
  });

  it.each([
    ['2000-01-01', '期限切れ'],
    ['2999-01-01', null],
    ['', null],
  ])('期日 %s のバッジ: %s', (due, badge) => {
    setup({ due });
    if (badge) expect(screen.getByText(badge)).toBeInTheDocument();
    else expect(screen.queryByText(/期限切れ|今日/)).not.toBeInTheDocument();
  });

  it('当日は「今日」バッジが出る', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 5, 15));
    setup({ due: '2026-06-15' });
    expect(screen.getByText('今日')).toBeInTheDocument();
  });

  it('完了済みなら期限切れでもバッジを出さない', () => {
    setup({ due: '2000-01-01', done: true });
    expect(screen.queryByText('期限切れ')).not.toBeInTheDocument();
  });
});
