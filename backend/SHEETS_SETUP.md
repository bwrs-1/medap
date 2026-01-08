# Google Sheets初期設定ガイド

## 1. スプレッドシート作成

1. [Google Sheets](https://sheets.google.com/)で新しいスプレッドシートを作成
2. スプレッドシート名: `メダカ品種図鑑DB`

## 2. シート作成とヘッダー設定

### 2.1 varieties（品種マスタ）

シート名: `varieties`

**ヘッダー行（A1:L1）**:
```
id	name	lineage	description	image_url	features	difficulty	price_range	created_at	updated_at	created_by	version
```

**サンプルデータ（A2:L4）**:
```
v_001	幹之メダカ	ヒカリ体型	背中が光る人気品種	https://images.unsplash.com/photo-1520990269108-4f2e3c2c0f5e	光体型,青系	3	500-1000円/匹	2026-01-08T00:00:00Z	2026-01-08T00:00:00Z	user_admin	1
v_002	楊貴妃	普通体型	赤みが強い定番品種	https://images.unsplash.com/photo-1524704654690-b56c05c78a00	赤系	2	300-800円/匹	2026-01-08T00:00:00Z	2026-01-08T00:00:00Z	user_admin	1
v_003	オロチ	ダルマ体型	真っ黒な体色	https://images.unsplash.com/photo-1535591273668-578e31182c4f	黒系	4	1000-2000円/匹	2026-01-08T00:00:00Z	2026-01-08T00:00:00Z	user_admin	1
```

---

### 2.2 containers（容器マスタ）

シート名: `containers`

**ヘッダー行（A1:H1）**:
```
id	user_id	name	size	location	memo	created_at	updated_at	version
```

**サンプルデータ（A2:H2）**:
```
c_001	user_admin	玄関の睡蓮鉢	60cm水槽	玄関	日当たり良好	2026-01-08T00:00:00Z	2026-01-08T00:00:00Z	1
```

---

### 2.3 container_varieties（容器×品種紐付け）

シート名: `container_varieties`

**ヘッダー行（A1:G1）**:
```
id	container_id	variety_id	count	added_at	updated_at	version
```

**サンプルデータ（A2:G2）**:
```
cv_001	c_001	v_001	5	2026-01-08T00:00:00Z	2026-01-08T00:00:00Z	1
```

---

### 2.4 audit_log（監査ログ）

シート名: `audit_log`

**ヘッダー行（A1:G1）**:
```
id	timestamp	user_id	action	target_type	target_id	changes
```

**サンプルデータ（A2:G2）**:
```
log_001	2026-01-08T00:00:00Z	user_admin	CREATE	varieties	v_001	
```

---

### 2.5 users（ユーザー管理）

シート名: `users`

**ヘッダー行（A1:F1）**:
```
id	email	name	role	created_at	last_login
```

**サンプルデータ（A2:F2）**:
```
user_admin	your_email@example.com	管理者	admin	2026-01-08T00:00:00Z	2026-01-08T00:00:00Z
```

**重要**: `your_email@example.com`を実際のGoogleアカウントのメールアドレスに変更してください。

---

## 3. サービスアカウントに共有権限を付与

1. スプレッドシート右上の「共有」ボタンをクリック
2. サービスアカウントのメールアドレス（例: `xxx@xxx.iam.gserviceaccount.com`）を入力
3. 権限を「編集者」に設定
4. 「送信」をクリック

---

## 4. スプレッドシートIDを取得

URLから取得:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
                                        ^^^^^^^^^^^^^^
```

このIDを`.env`の`SPREADSHEET_ID`に設定してください。

---

## 5. 確認

1. Backend APIを起動: `npm run dev`
2. ヘルスチェック: `curl http://localhost:3000/health`
3. 品種一覧取得（要JWT）: `curl -H "Authorization: Bearer <JWT>" http://localhost:3000/v1/varieties`

---

**作成日**: 2026-01-08  
**バージョン**: 0.1
