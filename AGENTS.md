# AGENT INSTRUCTIONS

このリポジトリは Tauri + React + TypeScript を使ったデスクトップ向け音楽プレーヤーです。新規参加者向けにプロジェクトの概要や開発指針をまとめます。

## リポジトリ概要
- フロントエンドは React (TypeScript) と TanStack Router を使用。
- UI コンポーネントは shadcn/ui をベースに tailwindcss v4 でスタイリング。
- バックエンドは Rust 製の Tauri アプリ (`src-tauri/`)。

## ディレクトリ構成 (抜粋)
```
/src
  assets/           画像などの静的ファイル
  components/       UI コンポーネント
    player/         プレーヤー関連コンポーネント
    ui/             shadcn/ui 由来の汎用コンポーネント
  contexts/         React Context 定義 (AudioPlayer など)
  hooks/            カスタムフック
  lib/              補助的ユーティリティ
  routes/           TanStack Router による画面定義
  global.css        デザインシステムと Tailwind 設定
  main.tsx          React エントリポイント
/src-tauri          Rust バックエンド
```

主要なルートは `/` (ホーム画面) と `/player` (プレーヤー画面) です。`src/contexts/audio-player-context.tsx` で再生状態やイコライザを管理しています。

## 開発・品質チェック
- 開発サーバー起動: `bun run dev`
- ビルド: `bun run build`
- フォーマットとLint: `bun run check:write`
- 型チェック: `bun run typecheck`
- テスト実行: `bun run test:ci`

実装後は次のコマンドで品質確認を行ってください。
```sh
bun run check:write && bun run typecheck && bun run test:ci
```

## スタイルガイド (抜粋)
- コミットメッセージは Conventional Commits に従い英語で書く。
- ソースコード内のコメントも英語で記述する。
- 関数はアロー関数を利用し、`return` を省略できる場合は省略する。
- import には `@/` エイリアスを使う。
- `interface` より `type` を使用する。
- 基本的に named export を用いる。
- ファイル名はすべて kebab-case とする。

## 次に学ぶと良いトピック
1. TanStack Router の詳細な使い方
2. Web Audio API とイコライザ実装
3. shadcn/ui のコンポーネント活用方法
4. Tauri の基本構造

以上を把握しておくと、コードベースの理解がスムーズになります。
