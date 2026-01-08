# Backend API - メダカ品種図鑑＋容器管理

> Node.js + Express + Google Sheets API

## 📋 概要

このBackendは、Google Sheetsを"実質DB"として使用し、メダカ品種図鑑と容器管理のREST APIを提供します。

## 🛠 技術スタック

- **Runtime**: Node.js 18+
- **Framework**: Express 5
- **Database**: Google Sheets API
- **認証**: Google OAuth + JWT
- **デプロイ**: Google Cloud Run

## 📁 ディレクトリ構造

```
backend/
├── index.js                 # エントリーポイント
├── lib/
│   └── sheetsClient.js      # Google Sheets APIクライアント
├── middleware/
│   └── auth.js              # JWT認証・認可ミドルウェア
├── routes/
│   ├── auth.js              # 認証ルート
│   ├── varieties.js         # 品種CRUD
│   ├── containers.js        # 容器CRUD
│   └── auditLogs.js         # 監査ログ
├── .env.example             # 環境変数テンプレート
└── package.json
```

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Google Cloud設定

#### 2.1 Google Sheetsの準備
1. Google Sheetsで新しいスプレッドシートを作成
2. 以下のシートを作成:
   - `varieties`
   - `containers`
   - `container_varieties`
   - `audit_log`
   - `users`
3. 各シートの1行目にヘッダーを追加（`docs/DATA_DESIGN.md`参照）

#### 2.2 サービスアカウント作成
1. [Google Cloud Console](https://console.cloud.google.com/)でプロジェクト作成
2. **APIs & Services > Credentials**でサービスアカウント作成
3. **Sheets API**を有効化
4. サービスアカウントのJSONキーをダウンロード
5. JSONファイルを`backend/`に配置（例: `service-account.json`）
6. Google Sheetsの共有設定で、サービスアカウントのメールアドレスに編集権限を付与

#### 2.3 OAuth Client ID作成
1. **APIs & Services > Credentials**で**OAuth 2.0 Client ID**作成
2. **Application type**: Web application
3. Client IDをコピー

### 3. 環境変数の設定

`.env.example`をコピーして`.env`を作成:

```bash
cp .env.example .env
```

`.env`を編集:

```env
PORT=3000
NODE_ENV=development

# Google Sheets設定
SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json

# JWT設定
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRES_IN=7d

# Google OAuth設定
GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 4. 起動

```bash
npm run dev
```

サーバーが起動したら、`http://localhost:3000/health`にアクセスして動作確認。

## 📡 API仕様

詳細は`docs/API_DESIGN.md`を参照。

### エンドポイント一覧

| Method | Path | 説明 | 権限 |
|--------|------|------|------|
| POST | `/v1/auth/login` | ログイン | - |
| GET | `/v1/varieties` | 品種一覧 | 認証必須 |
| GET | `/v1/varieties/:id` | 品種詳細 | 認証必須 |
| POST | `/v1/varieties` | 品種作成 | Editor以上 |
| PUT | `/v1/varieties/:id` | 品種更新 | Editor以上 |
| DELETE | `/v1/varieties/:id` | 品種削除 | Admin |
| GET | `/v1/containers` | 容器一覧 | 認証必須 |
| GET | `/v1/containers/:id` | 容器詳細 | 認証必須 |
| POST | `/v1/containers` | 容器作成 | 認証必須 |
| PUT | `/v1/containers/:id` | 容器更新 | 認証必須 |
| DELETE | `/v1/containers/:id` | 容器削除 | 認証必須 |
| POST | `/v1/containers/:id/varieties` | 品種追加 | 認証必須 |
| PUT | `/v1/containers/:id/varieties/:vid` | 個体数更新 | 認証必須 |
| DELETE | `/v1/containers/:id/varieties/:vid` | 品種削除 | 認証必須 |
| GET | `/v1/audit-logs` | 監査ログ | Admin |

## 🧪 テスト

### Postmanでテスト

1. **ログイン**:
   ```
   POST http://localhost:3000/v1/auth/login
   Body: { "idToken": "google_id_token_here" }
   ```

2. **品種一覧取得**:
   ```
   GET http://localhost:3000/v1/varieties
   Headers: Authorization: Bearer <JWT>
   ```

## 🚢 デプロイ（Google Cloud Run）

### 1. Dockerfileを作成

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### 2. デプロイ

```bash
gcloud run deploy medaka-api \
  --source . \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --set-env-vars SPREADSHEET_ID=xxx,JWT_SECRET=xxx,GOOGLE_CLIENT_ID=xxx
```

## 📝 ライセンス

MIT License

---

**作成日**: 2026-01-08  
**バージョン**: 0.1
