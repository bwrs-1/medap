# Backend実装サマリー v0.1

## 実装済み

### 1. プロジェクト基盤
- Node.js + Express 初期化
- 依存関係: Express, googleapis, jsonwebtoken, cors, dotenv
- ディレクトリ構成: lib, middleware, routes
- 環境変数テンプレート: .env.example
- .gitignore

### 2. Google Sheets APIクライアント
- `lib/sheetsClient.js` - CRUD操作
  - サービスアカウント認証
  - 行データの取得/追加/更新/削除
  - ヘッダー取得

### 3. 認証・認可
- `middleware/auth.js` - JWT認証
  - Google OAuth IDトークン検証
  - 初回ログイン時にViewer登録
  - JWT発行・検証
  - 権限チェック（Viewer/Editor/Admin）

### 4. APIルート

#### 4.1 認証
- POST `/v1/auth/login` - Google OAuthログイン

#### 4.2 品種
- GET `/v1/varieties`
- GET `/v1/varieties/:id`
- POST `/v1/varieties`（Editor以上）
- PUT `/v1/varieties/:id`（Editor以上）
- DELETE `/v1/varieties/:id`（Adminのみ）

#### 4.3 容器
- GET `/v1/containers`（自分の容器のみ、Adminは全て）
- GET `/v1/containers/:id`
- POST `/v1/containers`
- PUT `/v1/containers/:id`
- DELETE `/v1/containers/:id`
- POST `/v1/containers/:id/varieties`
- PUT `/v1/containers/:id/varieties/:vid`
- DELETE `/v1/containers/:id/varieties/:vid`

#### 4.4 監査ログ
- GET `/v1/audit-logs`（Adminのみ）

---

## 実装済みの機能

- JWT認証（7日）
- 権限管理（Viewer/Editor/Admin）
- Google OAuth IDトークン検証
- 楽観ロック（versionカラム）
- 削除制限（紐付きチェック）
- 監査ログ自動記録

---

## 次のステップ

1. Google Sheetsセットアップ（`backend/SHEETS_SETUP.md`）
2. 環境変数設定（`backend/.env`）
3. ローカル起動: `cd backend && npm run dev`
4. Postmanテスト

---

## 未実装（MVP後）
- レート制限
- Backend APIテスト
- Backend単体テスト

---

**作成日**: 2026-01-08
**バージョン**: 0.1
**次回更新**: Flutter（iOS）実装完了時
