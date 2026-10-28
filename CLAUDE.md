# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ワークフローのルール

- 変更を加えるときは、必ず先にブランチを作成してから作業する（`main` に直接コミットしない）。
- 機能変更は、先にテストを作成してから実装する（テストファースト）。

## コマンド

- `npm run dev` — Vite 開発サーバーを起動
- `npm run build` — 本番ビルド（`dist/` に出力）
- `npm test` — 全テストを1回実行（`vitest run`）
- `npm run test:watch` — Vitest のウォッチモード
- `npx vitest run src/test/lib/date.test.js` — 単一のテストファイルを実行（`-t "テスト名"` を付けるとテスト名で絞り込み）
- `npm run coverage` — v8 カバレッジ付きでテスト実行（CI はこれを実行した後に `npm run build` を実行）

リンターは設定されていない。

## アーキテクチャ

React 19 + Vite + Tailwind CSS v4（`@tailwindcss/vite` 経由）による小規模なシングルページの TODO アプリ。素の JS/JSX で書かれており（TypeScript なし）、UI の文言は日本語。

- `src/hooks/useTodos.js` — 状態管理と永続化を担う唯一のレイヤー。TODO 一覧を保持し、`localStorage` の `todo-app.todos` キーに保存する。`load()` は保存データを検証・正規化し（欠けた `id`/`done`/`due` を補完）、読み込みと保存の両方でストレージのエラーを握りつぶすため、ストレージが使えなくてもアプリは動作する。TODO の形は `{ id, text, done, due }` で、`due` は `YYYY-MM-DD` 形式の文字列か空文字。
- `src/App.jsx` — フィルター状態（`all` / `active` / `done`）を持ち、`TodoForm`・`FilterTabs`・`TodoItem` を組み合わせる。絞り込みと件数はここで算出する。
- `src/lib/date.js` — ローカル時刻を使う日付ヘルパー。`dueStatus(todo, todayStr)` は `YYYY-MM-DD` 文字列の比較で `none | overdue | today | upcoming` を返す（テスト用に今日の日付を注入できる）。
- ダークモードは Tailwind の `dark:` クラスで対応している。

## テスト

Vitest + Testing Library を jsdom・globals 有効で使用（設定は `vite.config.js`、セットアップは `src/test/setup.js`）。テストはソースの隣ではなく `src/test/` 配下に、`src` と同じ構成（`components/`、`hooks/`、`lib/`、および `App.test.jsx`）で置く。

## CI

`.github/workflows/ci.yml` は PR と `main` への push でカバレッジ測定とビルドを実行する（Node 22）。`claude.yml` はコメント内の `@claude` メンションに応答する。
