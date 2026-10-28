# todo-app

React 19 + Vite + Tailwind CSS v4 で作られた、小さなシングルページの TODO アプリです。

## 機能

- TODO の追加・完了切り替え・削除
- 期限日の設定と期限状態の表示（期限切れ / 今日 / 期限前）
- タスクごとのメモ
- フィルター（すべて / 未完了 / 完了）と件数表示
- `localStorage` への自動保存（ストレージが使えなくても動作）
- ダークモード対応

## 必要環境

- Node.js 22 以上（CI は Node 22 で実行）

## セットアップ

```bash
npm install
npm run dev
```

開発サーバーが起動します。表示された URL をブラウザで開いてください。

## コマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | Vite 開発サーバーを起動 |
| `npm run build` | 本番ビルド（`dist/` に出力） |
| `npm run preview` | ビルド結果をローカルで確認 |
| `npm test` | テストを1回実行 |
| `npm run test:watch` | テストをウォッチモードで実行 |
| `npm run coverage` | カバレッジ付きでテストを実行 |

## ディレクトリ構成

```
src/
├── App.jsx          # フィルター状態と画面全体の組み立て
├── components/      # TodoForm / FilterTabs / TodoItem
├── hooks/useTodos.js # TODO の状態管理と localStorage 永続化
├── lib/date.js      # 期限判定などの日付ヘルパー
└── test/            # テスト（src と同じ構成）
```

## テスト

Vitest と Testing Library（jsdom）を使用しています。テストは `src/test/` 配下に `src` と同じ構成で置きます。

```bash
npx vitest run src/test/lib/date.test.js
```

## CI

GitHub Actions（`.github/workflows/ci.yml`）が、PR と `main` への push でカバレッジ測定とビルドを実行します。
