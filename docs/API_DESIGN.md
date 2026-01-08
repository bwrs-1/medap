# API設計 v0.1

## 1. 認証・認可

### 1.1 認証フロー
1. クライアントがGoogle OAuth経由でログイン
2. バックエンドがIDトークンを検証
3. JWT（有効期限7日）を発行
4. 以降のリクエストは`Authorization: Bearer <JWT>`ヘッダーで認証

### 1.2 権限レベル
| Role | 品種閲覧 | 品種編集 | 容器CRUD | ユーザー管理 | 監査ログ閲覧 |
|------|---------|---------|---------|------------|------------|
| Viewer | ✅ | ❌ | 自分のみ | ❌ | ❌ |
| Editor | ✅ | ✅ | 自分のみ | ❌ | ❌ |
| Admin | ✅ | ✅ | 全て | ✅ | ✅ |

---

## 2. エンドポイント一覧

### ベースURL
```
https://medaka-api-xxxxxx.run.app/v1
```

---

## 3. 品種（Varieties）

### 3.1 GET /varieties
品種一覧取得

**Query Parameters**:
- `search` (optional): 品種名・系統で部分一致検索
- `lineage` (optional): 系統でフィルタ

**Response 200**:
```json
{
  "varieties": [
    {
      "id": "v_001",
      "name": "幹之メダカ",
      "lineage": "ヒカリ体型",
      "image_url": "https://...",
      "difficulty": 3,
      "version": 1
    }
  ]
}
```

---

### 3.2 GET /varieties/{id}
品種詳細取得

**Response 200**:
```json
{
  "id": "v_001",
  "name": "幹之メダカ",
  "lineage": "ヒカリ体型",
  "description": "背中が光る人気品種",
  "image_url": "https://...",
  "features": ["光体型", "青系"],
  "difficulty": 3,
  "price_range": "500-1000円/匹",
  "version": 1
}
```

---

### 3.3 POST /varieties
品種作成（Editor以上）

**Request Body**:
```json
{
  "name": "幹之メダカ",
  "lineage": "ヒカリ体型",
  "description": "背中が光る人気品種",
  "image_url": "https://...",
  "features": ["光体型", "青系"],
  "difficulty": 3,
  "price_range": "500-1000円/匹"
}
```

**Response 201**:
```json
{
  "id": "v_001",
  "version": 1
}
```

---

### 3.4 PUT /varieties/{id}
品種更新（Editor以上）

**Request Body**:
```json
{
  "name": "幹之メダカ（改）",
  "version": 1
}
```

**Response 200**:
```json
{
  "id": "v_001",
  "version": 2
}
```

**Response 409** (楽観ロック失敗):
```json
{
  "error": "conflict",
  "message": "このレコードは他のユーザーにより更新されています"
}
```

---

### 3.5 DELETE /varieties/{id}
品種削除（Admin のみ）

**Response 204**: No Content

---

## 4. 容器（Containers）

### 4.1 GET /containers
容器一覧取得（自分の容器のみ、Adminは全て）

**Response 200**:
```json
{
  "containers": [
    {
      "id": "c_001",
      "name": "玄関の睡蓮鉢",
      "size": "60cm水槽",
      "location": "玄関",
      "variety_count": 2,
      "version": 1
    }
  ]
}
```

---

### 4.2 GET /containers/{id}
容器詳細取得（飼育中の品種も含む）

**Response 200**:
```json
{
  "id": "c_001",
  "name": "玄関の睡蓮鉢",
  "size": "60cm水槽",
  "location": "玄関",
  "memo": "日当たり良好",
  "varieties": [
    {
      "variety_id": "v_001",
      "variety_name": "幹之メダカ",
      "count": 5
    }
  ],
  "version": 1
}
```

---

### 4.3 POST /containers
容器作成

**Request Body**:
```json
{
  "name": "玄関の睡蓮鉢",
  "size": "60cm水槽",
  "location": "玄関",
  "memo": "日当たり良好"
}
```

**Response 201**:
```json
{
  "id": "c_001",
  "version": 1
}
```

---

### 4.4 PUT /containers/{id}
容器更新

**Request Body**:
```json
{
  "name": "玄関の睡蓮鉢（改）",
  "version": 1
}
```

**Response 200**:
```json
{
  "id": "c_001",
  "version": 2
}
```

---

### 4.5 DELETE /containers/{id}
容器削除

**Response 204**: No Content

---

## 5. 容器×品種紐付け

### 5.1 POST /containers/{container_id}/varieties
品種を容器に追加

**Request Body**:
```json
{
  "variety_id": "v_001",
  "count": 5
}
```

**Response 201**:
```json
{
  "id": "cv_001",
  "version": 1
}
```

---

### 5.2 PUT /containers/{container_id}/varieties/{variety_id}
個体数を更新

**Request Body**:
```json
{
  "count": 10,
  "version": 1
}
```

**Response 200**:
```json
{
  "id": "cv_001",
  "version": 2
}
```

---

### 5.3 DELETE /containers/{container_id}/varieties/{variety_id}
品種を容器から削除

**Response 204**: No Content

---

## 6. 監査ログ

### 6.1 GET /audit-logs
監査ログ取得（Admin のみ）

**Query Parameters**:
- `target_type` (optional): `varieties`, `containers`
- `user_id` (optional): ユーザーIDでフィルタ
- `limit` (default: 50): 取得件数

**Response 200**:
```json
{
  "logs": [
    {
      "id": "log_001",
      "timestamp": "2026-01-08T10:00:00Z",
      "user_id": "user_xyz",
      "action": "UPDATE",
      "target_type": "varieties",
      "target_id": "v_001",
      "changes": {
        "name": {
          "old": "幹之メダカ",
          "new": "幹之メダカ（改）"
        }
      }
    }
  ]
}
```

---

## 7. エラーレスポンス

### 共通エラー形式
```json
{
  "error": "error_code",
  "message": "人間が読めるエラーメッセージ"
}
```

### エラーコード
| Code | HTTP Status | 説明 |
|------|------------|------|
| `unauthorized` | 401 | JWT未提供または無効 |
| `forbidden` | 403 | 権限不足 |
| `not_found` | 404 | リソースが存在しない |
| `conflict` | 409 | 楽観ロック失敗 |
| `validation_error` | 422 | リクエストボディのバリデーションエラー |
| `internal_error` | 500 | サーバー内部エラー |

---

## 8. レート制限

- **制限**: 1ユーザーあたり100リクエスト/分
- **超過時**: `429 Too Many Requests`

---

**作成日**: 2026-01-08  
**バージョン**: 0.1  
**次回更新**: 実装開始時
