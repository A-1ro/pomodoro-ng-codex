# Pomodoro NG

Angular + NgRx ポモドーロタイマー。`frontend/` にクライアント、`backend/` は今後追加予定の Python バックエンド用のスペースです。

## セットアップ (フロントエンド)

```bash
cd frontend
npm install
npm start
```

## 構成

- `frontend/` - Angular 17、NgRx、Angular Material で構成されたポモドーロタイマー
- `backend/` - Python バックエンドのためのプレースホルダ (FastAPI などを想定)

## 開発メモ

- 状態管理は `@ngrx/store` で実装。
- タイマーは 1 秒ごとに NgRx に `tick` を dispatch するシンプルな実装。途中で停止しても同じタスクを再開できます。
