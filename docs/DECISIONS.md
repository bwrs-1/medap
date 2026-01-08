# 設計決定事項 v0.1

> QUESTIONS.mdの確認事項に対する決定内容

## 1. インフラ・配布

### 1.1 Google Cloud
- **Cloud Run使用**: Node.js + Expressで実装
- **リージョン**: asia-northeast1（東京）
- **料金**: 無料枠で運用（~月100万リクエスト）

### 1.2 Apple Developer
- **Bundle ID**: `com.medaka.app`（仮）
- **署名**: 無料Apple ID（7日有効）
- **TestFlight**: MVP後に検討

---

## 2. 認証・セキュリティ

### 2.1 Google OAuth
- **OAuth Client ID**: iOS用とBackend用の2つを作成
- **スコープ**: `profile`, `email`
- **リダイレクトURI**: `com.medaka.app:/oauth2callback`（iOS）

### 2.2 JWT
- **秘密鍵**: Cloud Secret Managerで管理（本番）
- **有効期限**: 7日（リフレッシュトークンなし）

### 2.3 権限管理
- **初期権限**: 初回ログイン時はViewer
- **Admin作成**: 最初のAdminは手動で`users`シートに追加
- **権限変更**: AdminがSettingsから変更

---

## 3. データ設計

### 3.1 Google Sheets
- **シート構成**: varieties / containers / container_varieties / audit_log / users
- **バックアップ**: Google Driveのバージョン履歴を使用
- **スケーラビリティ**: MVPは1000件まで

### 3.2 画像管理
- **保存**: 外部URL参照のみ
- **サムネイル**: アプリ側でキャッシュ・リサイズ
- **Cloud Storage移行**: v1以降

---

## 4. 機能仕様

### 4.1 品種図鑑
- **系統マスタ**: 固定リスト
- **特徴タグ**: プリセットから複数選択
- **削除制限**: 容器に紐付いている品種は削除不可（409）

### 4.2 容器管理
- **削除制限**: 品種が紐付いている容器は削除不可（409）
- **個体数0**: 紐付けは残す（削除は明示操作）

### 4.3 検索
- **対象**: 品種名・系統のみ
- **ソート**: 作成日時の降順

---

## 5. UI/UX

### 5.1 アクセシビリティ
- **文字サイズ**: 16pt固定（Dynamic Typeはv1以降）
- **ダークモード**: 非対応

### 5.2 デザイン
- **カラー**: 青系（メダカの水をイメージ）
- **アイコン**: 仮アイコンで進行

---

## 6. テスト

- **初期データ**: 品種10件・容器3件
- **テストユーザー**: 開発者アカウントのみ
- **開発環境**: 本番と同じSheetsを使用
- **CI/CD**: MVP後に検討

---

## 7. その他

- **ユーザーマニュアル**: READMEに簡易版を記載
- **OpenAPI**: MVP後に検討
- **ライセンス**: MIT
- **サンプル画像**: Unsplash

---

## 8. Flutter実装方針

- **対象**: Flutter（iOSのみ）
- **状態管理**: Riverpod
- **ルーティング**: go_router
- **HTTP**: dio
- **認証**: google_sign_inでGoogleログイン、JWTはflutter_secure_storageに保存
- **オフラインキャッシュ**: Hive（varieties/containers/container_varieties）
- **画像キャッシュ**: cached_network_image

---

**作成日**: 2026-01-08
**バージョン**: 0.1
**次回更新**: 実装に追加決定があれば随時更新
