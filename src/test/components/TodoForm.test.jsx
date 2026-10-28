import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import TodoForm from '../../components/TodoForm.jsx';

describe('TodoForm', () => {
  it('前後の空白を除去して追加し、入力をクリアしてフォーカスを戻す', async () => {
    const onAdd = vi.fn();
    render(<TodoForm onAdd={onAdd} />);
    const input = screen.getByLabelText('やること');
    await userEvent.type(input, '  牛乳  ');
    await userEvent.type(screen.getByLabelText('期日'), '2026-03-04');
    await userEvent.click(screen.getByRole('button', { name: '追加' }));
    expect(onAdd).toHaveBeenCalledWith('牛乳', '2026-03-04');
    expect(input).toHaveValue('');
    expect(screen.getByLabelText('期日')).toHaveValue('');
    expect(input).toHaveFocus();
  });

  it('空白のみでは追加されない', async () => {
    const onAdd = vi.fn();
    render(<TodoForm onAdd={onAdd} />);
    await userEvent.type(screen.getByLabelText('やること'), '   {Enter}');
    expect(onAdd).not.toHaveBeenCalled();
  });
});
