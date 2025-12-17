# Medaka Social (ひな型)

メダカ専用のSNSを作るための最小限のスターターです。FastAPI バックエンドと、シンプルな HTML/CSS/JS のフロントエンドを同梱しています。投稿・プロフィールの取得や追加を想定した API と、サンプルデータを表示する UI を用意しています。

## ディレクトリ構成

```
backend/
  app/
    main.py        # FastAPI アプリ。健康チェック、プロフィール、投稿 API を提供
    models.py      # Pydantic モデル
    data.py        # インメモリのサンプルデータ
  requirements.txt
frontend/
  index.html      # サンプル UI。バックエンドの /posts /profiles を取得して表示
  main.js
  styles.css
```

## セットアップと起動

### 1. バックエンド (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

エンドポイント例:
- `GET /health` … 起動確認
- `GET /profiles` … サンプルプロフィール一覧
- `GET /posts` … 投稿フィード (作成日時の降順)
- `POST /posts` … 投稿追加 (インメモリに追記)

### 2. フロントエンド (スタティック)

別ターミナルで下記を実行して静的ファイルを配信します。CORS は許可済みなので FastAPI と同一マシンであればそのまま動作します。

```bash
cd frontend
python -m http.server 5173
```

ブラウザで http://localhost:5173/ にアクセスするとサンプル UI が表示され、バックエンドから投稿とプロフィールを取得して一覧化します。

### 3. GitHub Pages へデプロイして確認する

このリポジトリには GitHub Pages へ `frontend/` ディレクトリをそのまま公開する CI を用意しています。バックエンドを別ホストに置く場合は、ページ読み込み時にグローバル変数 `window.MEDAKA_API_BASE` で API のベース URL を上書きしてください（例: `<script>window.MEDAKA_API_BASE = "https://your-api.example.com";</script>` を `index.html` の先頭に追加）。未指定の場合は `http://localhost:8000` を参照します。

1. GitHub のリポジトリ設定で Pages のビルド元を **GitHub Actions** に変更します。
2. メインブランチに push すると、`.github/workflows/pages.yml` が発火し、`frontend/` が自動でデプロイされます。
3. Actions の `Deploy frontend to GitHub Pages` の run が完了すると、Pages の URL が `github-pages` 環境に記録されます。

バックエンドを用意していない状態でも、フロントエンドはサンプルデータで表示されるため動作確認が可能です。

## 開発フローのメモ
- このレポジトリでは作業が完了したら `git status` で変更を確認し、`git add` → `git commit` を行ってください。
- リモートへ反映する際は `git push origin <ブランチ名>` を実行します。GitHub Actions の Pages デプロイは `main` への push をトリガーとして動きます。
- CI が成功すると Pages のプレビュー URL が `github-pages` 環境に記録されるため、ブラウザから最新のビルドを確認できます。

## 拡張のヒント
- 投稿/プロフィールを DB へ永続化するには、`backend/app/data.py` をリポジトリ層に置き換え、`create_post` などに保存処理を組み込んでください。
- 認証や通知などの機能追加も FastAPI ルーターを分割して進めやすい構成です。
- フロントエンドを React/Vue などへ差し替える場合も、API のエンドポイントはそのまま利用できます。
