# データ設計 v0.1 - Google Sheets構成

## 1. シート構成

Google Spreadsheetに以下の4シートを作成:

1. **varieties** - 品種マスタ
2. **containers** - 容器マスタ
3. **container_varieties** - 容器×品種の紐付け
4. **audit_log** - 監査ログ

---

## 2. シート定義

### 2.1 varieties（品種マスタ）

| 列名 | 型 | 必須 | 説明 | 例 |
|------|-----|------|------|-----|
| id | string | ✅ | UUID（主キー） | `v_abc123` |
| name | string | ✅ | 品種名 | `幹之メダカ` |
| lineage | string | ✅ | 系統 | `ヒカリ体型` |
| description | text | | 説明文 | `背中が光る人気品種` |
| image_url | string | | 画像URL | `https://...` |
| features | string | | 特徴（カンマ区切り） | `光体型,青系` |
| difficulty | integer | | 飼育難易度（1-5） | `3` |
| price_range | string | | 価格帯 | `500-1000円/匹` |
| created_at | datetime | ✅ | 作成日時 | `2026-01-08T10:00:00Z` |
| updated_at | datetime | ✅ | 更新日時 | `2026-01-08T10:00:00Z` |
| created_by | string | ✅ | 作成者ID | `user_xyz` |
| version | integer | ✅ | 楽観ロック用 | `1` |

**主キー**: `id`  
**インデックス**: `name`, `lineage`（検索用）

---

### 2.2 containers（容器マスタ）

| 列名 | 型 | 必須 | 説明 | 例 |
|------|-----|------|------|-----|
| id | string | ✅ | UUID（主キー） | `c_def456` |
| user_id | string | ✅ | 所有者ID | `user_xyz` |
| name | string | ✅ | 容器名 | `玄関の睡蓮鉢` |
| size | string | | サイズ | `60cm水槽` |
| location | string | | 設置場所 | `玄関` |
| memo | text | | メモ | `日当たり良好` |
| created_at | datetime | ✅ | 作成日時 | `2026-01-08T10:00:00Z` |
| updated_at | datetime | ✅ | 更新日時 | `2026-01-08T10:00:00Z` |
| version | integer | ✅ | 楽観ロック用 | `1` |

**主キー**: `id`  
**インデックス**: `user_id`（ユーザーごとの容器取得用）

---

### 2.3 container_varieties（容器×品種紐付け）

| 列名 | 型 | 必須 | 説明 | 例 |
|------|-----|------|------|-----|
| id | string | ✅ | UUID（主キー） | `cv_ghi789` |
| container_id | string | ✅ | 容器ID（外部キー） | `c_def456` |
| variety_id | string | ✅ | 品種ID（外部キー） | `v_abc123` |
| count | integer | ✅ | 個体数 | `5` |
| added_at | datetime | ✅ | 追加日時 | `2026-01-08T10:00:00Z` |
| updated_at | datetime | ✅ | 更新日時 | `2026-01-08T10:00:00Z` |
| version | integer | ✅ | 楽観ロック用 | `1` |

**主キー**: `id`  
**複合ユニーク制約**: `(container_id, variety_id)`（同じ容器に同じ品種は1レコードのみ）  
**インデックス**: `container_id`, `variety_id`

---

### 2.4 audit_log（監査ログ）

| 列名 | 型 | 必須 | 説明 | 例 |
|------|-----|------|------|-----|
| id | string | ✅ | UUID（主キー） | `log_jkl012` |
| timestamp | datetime | ✅ | 操作日時 | `2026-01-08T10:00:00Z` |
| user_id | string | ✅ | 操作者ID | `user_xyz` |
| action | string | ✅ | 操作種別 | `CREATE`, `UPDATE`, `DELETE` |
| target_type | string | ✅ | 対象テーブル | `varieties`, `containers` |
| target_id | string | ✅ | 対象レコードID | `v_abc123` |
| changes | text | | 変更内容（JSON） | `{"name": {"old": "A", "new": "B"}}` |

**主キー**: `id`  
**インデックス**: `timestamp`, `user_id`, `target_type`

---

## 3. 楽観ロック方針

### 3.1 更新フロー
1. クライアントがレコード取得時に`version`を保持
2. 更新リクエスト時に`version`を送信
3. API側で以下をチェック:
   ```
   WHERE id = ? AND version = ?
   ```
4. マッチしたら`version`をインクリメントして更新
5. マッチしなければ`409 Conflict`を返す

### 3.2 対象テーブル
- ✅ varieties
- ✅ containers
- ✅ container_varieties
- ❌ audit_log（追記のみ、更新なし）

---

## 4. データ制約

### 4.1 文字数制限
- `name`: 最大50文字
- `description`, `memo`: 最大500文字
- `image_url`: 最大200文字

### 4.2 バリデーション
- `difficulty`: 1-5の整数
- `count`: 1以上の整数
- `action`: `CREATE`, `UPDATE`, `DELETE`のいずれか

---

## 5. 初期データ例

### varieties（サンプル3件）
```
id,name,lineage,description,difficulty,created_at,version
v_001,幹之メダカ,ヒカリ体型,背中が光る人気品種,3,2026-01-08T00:00:00Z,1
v_002,楊貴妃,普通体型,赤みが強い定番品種,2,2026-01-08T00:00:00Z,1
v_003,オロチ,ダルマ体型,真っ黒な体色,4,2026-01-08T00:00:00Z,1
```

---

**作成日**: 2026-01-08  
**バージョン**: 0.1  
**次回更新**: API設計完了時
