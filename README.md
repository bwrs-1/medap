# メダカ品種図鑑＋容器管理アプリ

メダカ愛好家が品種情報を参照・編集し、飼育容器を管理できるアプリ（MVP v0.1）。
Flutter（iOSのみ）+ Google Sheets + Node.js/Expressで構成します。

---

## 目的
- 品種図鑑: 共有・参照・検索ができる図鑑機能
- 容器管理: どの容器にどの品種がいるかを記録
- 共同編集: Viewer/Editor/Adminの権限管理

## 対象ユーザー
- Primary: 50-70代のメダカ愛好家（アクセシビリティ重視）
- Secondary: 若年層の品種コレクター

---

## スコープ

### MVP（v0.1）
- 品種図鑑（一覧・詳細・検索）
- 容器CRUD、容器×品種の紐付け
- Google OAuthログイン → JWT発行
- 権限管理（Viewer/Editor/Admin）
- オフライン閲覧（キャッシュ）
- 監査ログ

### MVP外（v1以降）
- SNSタイムライン
- 画像アップロード（v0.1は外部URLのみ）
- プッシュ通知
- 統計/グラフ

---

## 機能要件（要約）

### 品種図鑑
- 一覧: サムネイル・品種名・系統のカード表示
- 検索: 品種名・系統でフィルタ
- 詳細: 写真・説明・特徴・難易度・価格帯
- 編集: Editor以上が追加/更新（楽観ロック）

### 容器管理
- CRUD: 容器名/サイズ/設置場所/メモ
- 紐付け: 1容器に複数品種、個体数を記録
- 一覧: 容器ごとに飼育中品種を表示

### 認証/権限
- Google OAuthでログイン、JWT（7日）発行
- Viewer: 閲覧のみ
- Editor: 品種/容器の追加・編集
- Admin: ユーザー権限、監査ログ

---

## 非機能要件（要約）
- 品種一覧初回表示: 3秒以内
- 検索結果: 1秒以内
- アクセシビリティ: 最小16pt、タップ44x44pt、WCAG AA、VoiceOver
- セキュリティ: HTTPS、JWT 7日、Sheets直アクセス禁止

---

## 設計決定（抜粋）
- 画像は外部URL参照のみ
- 検索対象は品種名/系統のみ
- 容器に紐付いている品種/容器は削除不可（409）
- 個体数0は紐付け保持、削除は明示操作

---

## 技術スタック

### フロントエンド（iOS）
- Flutter（iOSのみ）
- Riverpod / go_router / dio
- google_sign_in + flutter_secure_storage
- Hive（キャッシュ） / cached_network_image

### バックエンド
- Node.js + Express
- Google Sheets API
- JWT / CORS
- Cloud Run

### データ
- Google Sheets（varieties, containers, container_varieties, audit_log, users）
- 楽観ロック: versionカラム

---

## API（概要）
- 認証: POST `/v1/auth/login`
- 品種: GET/POST/PUT/DELETE `/v1/varieties`
- 容器: GET/POST/PUT/DELETE `/v1/containers`
- 紐付け: POST/PUT/DELETE `/v1/containers/{id}/varieties`
- 監査ログ: GET `/v1/audit-logs`（Adminのみ）

---

## ディレクトリ構成

```
.
├─ backend/          # Express API
├─ docs/             # 設計/計画/ガイド
├─ frontend/         # Flutter（iOS）
└─ README.md
```

---

## セットアップ（要約）

### Backend
1. `backend/SHEETS_SETUP.md` に従いSheetsを準備
2. `backend/.env.example` を `backend/.env` にコピーして設定
3. `cd backend && npm run dev`

### Flutter（iOS）
1. Flutter SDKをインストール済みであることを確認
2. `cd frontend && flutter pub get`
3. iOS実行はmacOS + Xcodeが必要

---

## リリース
AltStore/SideStore配布（詳細: `docs/RELEASE_GUIDE.md`）

---

## 進捗

### 完了
- Backend実装（認証・品種/容器API・監査ログ）
- 設計ドキュメント整備
- Flutterプロジェクトの骨組み作成

### 残タスク（抜粋）
- Google Sign-In → JWT交換の実装
- API CRUDの画面連携
- 画面UI実装（`docs/SCREEN_DESIGN.md`）
- Hiveキャッシュ
- iOS実機/シミュレータテスト

---

## ドキュメント一覧
- `docs/PRD_v0.1.md`
- `docs/API_DESIGN.md`
- `docs/DATA_DESIGN.md`
- `docs/SCREEN_DESIGN.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/DECISIONS.md`
- `docs/RELEASE_GUIDE.md`
- `docs/QUESTIONS.md`
- `docs/NEXT_PROMPTS.md`

---

## ライセンス
MIT予定（`docs/DECISIONS.md` 参照）
