import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import FilterTabs from './FilterTabs.jsx';

describe('FilterTabs', () => {
  it('選択中のタブが aria-pressed になる', () => {
    render(<FilterTabs value="active" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: '未完了' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'すべて' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('クリックで onChange にキーを渡す', async () => {
    const onChange = vi.fn();
    render(<FilterTabs value="all" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: '完了' }));
    expect(onChange).toHaveBeenCalledWith('done');
  });
});
