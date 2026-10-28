import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../App.jsx';

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

  describe('セクションと看板表示', () => {
    const dt = () => ({ data: {}, setData(k, v) { this.data[k] = v; }, getData(k) { return this.data[k]; }, effectAllowed: '' });

    function drag(card, sectionName) {
      const dataTransfer = dt();
      fireEvent.dragStart(card, { dataTransfer });
      const target = screen.getByRole('region', { name: sectionName });
      fireEvent.dragOver(target, { dataTransfer });
      fireEvent.drop(target, { dataTransfer });
    }

    it('リスト表示では3つのセクションにタスクが振り分けられる', async () => {
      render(<App />);
      await add('A');
      expect(within(screen.getByRole('region', { name: '未着手' })).getByText('A')).toBeInTheDocument();
      expect(within(screen.getByRole('region', { name: '進行中' })).queryByText('A')).not.toBeInTheDocument();
      expect(screen.getByRole('region', { name: '完了' })).toBeInTheDocument();
    });

    it('リストでドラッグしてセクションを移動できる', async () => {
      render(<App />);
      await add('A');
      drag(screen.getByText('A').closest('li'), '進行中');
      expect(within(screen.getByRole('region', { name: '進行中' })).getByText('A')).toBeInTheDocument();
    });

    it('完了セクションへ移動すると完了扱いになり残り件数が減る', async () => {
      render(<App />);
      await add('A');
      drag(screen.getByText('A').closest('li'), '完了');
      expect(screen.getByLabelText('完了にする')).toBeChecked();
      expect(screen.getByText('残り 0 件')).toBeInTheDocument();
    });

    it('チェックを入れると完了セクションへ移る', async () => {
      render(<App />);
      await add('A');
      await userEvent.click(screen.getByLabelText('完了にする'));
      expect(within(screen.getByRole('region', { name: '完了' })).getByText('A')).toBeInTheDocument();
    });

    it('看板表示に切り替えてもドラッグで移動できる', async () => {
      render(<App />);
      await add('A');
      await userEvent.click(screen.getByRole('button', { name: '看板' }));
      expect(screen.getByRole('button', { name: '看板' })).toHaveAttribute('aria-pressed', 'true');
      drag(screen.getByText('A').closest('li'), '進行中');
      expect(within(screen.getByRole('region', { name: '進行中' })).getByText('A')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: 'リスト' }));
      expect(within(screen.getByRole('region', { name: '進行中' })).getByText('A')).toBeInTheDocument();
    });

    it('フィルタは看板表示にも効く', async () => {
      render(<App />);
      await add('A');
      await add('B');
      await userEvent.click(screen.getAllByLabelText('完了にする')[0]);
      await userEvent.click(screen.getByRole('button', { name: '看板' }));
      await userEvent.click(screen.getByRole('button', { name: '未完了' }));
      expect(screen.queryByText('A')).not.toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
    });
  });
});
