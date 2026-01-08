# データ設計 v0.1 - Google Sheets構成

## 1. シート構成

Google Spreadsheetに以下の5シートを作成:

1. **varieties** - 品種マスタ
2. **containers** - 容器マスタ
3. **container_varieties** - 容器×品種の紐付け
4. **audit_log** - 監査ログ
5. **users** - ユーザー管理

---

## 2. シート定義

### 2.1 varieties（品種マスタ）

| 列名 | 型 | 必須 | 説明 | 例 |
|------|----|------|------|----|
| id | string | ✓ | UUID（主キー） | `v_abc123` |
| name | string | ✓ | 品種名 | `幹之メダカ` |
| lineage | string | ✓ | 系統 | `ヒカリ体型` |
| description | text | | 説明文 | `背中が光る人気品種` |
| image_url | string | | 画像URL | `https://...` |
| features | string | | 特徴（カンマ区切り） | `光体型,青系` |
| difficulty | integer | | 飼育難易度（1-5） | `3` |
| price_range | string | | 価格帯 | `500-1000円/匹` |
| created_at | datetime | ✓ | 作成日時 | `2026-01-08T10:00:00Z` |
| updated_at | datetime | ✓ | 更新日時 | `2026-01-08T10:00:00Z` |
| created_by | string | ✓ | 作成者ID | `user_xyz` |
| version | integer | ✓ | 楽観ロック用 | `1` |

**主キー**: `id`

---

### 2.2 containers（容器マスタ）

| 列名 | 型 | 必須 | 説明 | 例 |
|------|----|------|------|----|
| id | string | ✓ | UUID（主キー） | `c_def456` |
| user_id | string | ✓ | 所有者ID | `user_xyz` |
| name | string | ✓ | 容器名 | `庭の睡蓮鉢` |
| size | string | | サイズ | `60cm水槽` |
| location | string | | 設置場所 | `庭` |
| memo | text | | メモ | `日当たり良好` |
| created_at | datetime | ✓ | 作成日時 | `2026-01-08T10:00:00Z` |
| updated_at | datetime | ✓ | 更新日時 | `2026-01-08T10:00:00Z` |
| version | integer | ✓ | 楽観ロック用 | `1` |

**主キー**: `id`

---

### 2.3 container_varieties（容器×品種紐付け）

| 列名 | 型 | 必須 | 説明 | 例 |
|------|----|------|------|----|
| id | string | ✓ | UUID（主キー） | `cv_ghi789` |
| container_id | string | ✓ | 容器ID | `c_def456` |
| variety_id | string | ✓ | 品種ID | `v_abc123` |
| count | integer | ✓ | 個体数 | `5` |
| added_at | datetime | ✓ | 追加日時 | `2026-01-08T10:00:00Z` |
| updated_at | datetime | ✓ | 更新日時 | `2026-01-08T10:00:00Z` |
| version | integer | ✓ | 楽観ロック用 | `1` |

**主キー**: `id`
**複合ユニーク**: `(container_id, variety_id)`

---

### 2.4 audit_log（監査ログ）

| 列名 | 型 | 必須 | 説明 | 例 |
|------|----|------|------|----|
| id | string | ✓ | UUID（主キー） | `log_jkl012` |
| timestamp | datetime | ✓ | 操作日時 | `2026-01-08T10:00:00Z` |
| user_id | string | ✓ | 操作者ID | `user_xyz` |
| action | string | ✓ | 操作種別 | `CREATE`, `UPDATE`, `DELETE` |
| target_type | string | ✓ | 対象テーブル | `varieties`, `containers` |
| target_id | string | ✓ | 対象レコードID | `v_abc123` |
| changes | text | | 変更内容（JSON） | `{"name": {"old": "A", "new": "B"}}` |

**主キー**: `id`

---

### 2.5 users（ユーザー）

| 列名 | 型 | 必須 | 説明 | 例 |
|------|----|------|------|----|
| id | string | ✓ | UUID | `user_abc123` |
| email | string | ✓ | Googleアカウント | `user@example.com` |
| name | string | ✓ | 表示名 | `田中太郎` |
| role | string | ✓ | 権限 | `viewer`, `editor`, `admin` |
| created_at | datetime | ✓ | 登録日時 | `2026-01-08T10:00:00Z` |
| last_login | datetime | ✓ | 最終ログイン | `2026-01-08T10:00:00Z` |

---

## 3. 楽観ロック方針

1. レコード取得時に`version`を保持
2. 更新時に`version`を送信
3. `id`と`version`が一致した場合のみ更新
4. 不一致時は`409 Conflict`

対象: varieties / containers / container_varieties

---

## 4. データ制約

### 4.1 文字数制限
- `name`: 最大50文字
- `description`, `memo`: 最大500文字
- `image_url`: 最大200文字

### 4.2 バリデーション
- `difficulty`: 1-5
- `count`: 1以上
- `action`: `CREATE`, `UPDATE`, `DELETE`

---

## 5. 初期データ例

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
