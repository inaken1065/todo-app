import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';

async function add(text) {
  await userEvent.type(screen.getByLabelText('やること'), text);
  await userEvent.click(screen.getByRole('button', { name: '追加' }));
}

describe('App', () => {
  it('空のとき案内メッセージと残り0件を表示する', () => {
    render(<App />);
    expect(screen.getByText(/タスクはまだありません/)).toBeInTheDocument();
    expect(screen.getByText('残り 0 件')).toBeInTheDocument();
  });

  it('タスクを追加すると一覧と残り件数に反映される', async () => {
    render(<App />);
    await add('A');
    await add('B');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('残り 2 件')).toBeInTheDocument();
  });

  it('フィルタで表示を切り替え、空メッセージも切り替わる', async () => {
    render(<App />);
    await add('A');
    await add('B');
    await userEvent.click(screen.getAllByLabelText('完了にする')[0]);

    await userEvent.click(screen.getByRole('button', { name: '未完了' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('B')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '完了' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('A')).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('完了にする'));
    expect(screen.getByText('完了したタスクはありません。')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '未完了' }));
    await userEvent.click(screen.getAllByLabelText('完了にする')[0]);
    await userEvent.click(screen.getAllByLabelText('完了にする')[0]);
    expect(screen.getByText(/未完了のタスクはありません/)).toBeInTheDocument();
  });

  it('個別削除ができる', async () => {
    render(<App />);
    await add('A');
    await userEvent.click(screen.getByRole('button', { name: '「A」を削除' }));
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('完了済みを一括削除できる', async () => {
    render(<App />);
    await add('A');
    await add('B');
    expect(screen.queryByText(/完了済みを削除/)).not.toBeInTheDocument();
    await userEvent.click(screen.getAllByLabelText('完了にする')[0]);
    await userEvent.click(screen.getByRole('button', { name: '完了済みを削除（1件）' }));
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(1);
    expect(within(items[0]).getByText('B')).toBeInTheDocument();
  });

  it('再マウントしても localStorage から復元される', async () => {
    const { unmount } = render(<App />);
    await add('永続');
    unmount();
    render(<App />);
    expect(screen.getByText('永続')).toBeInTheDocument();
  });
});
