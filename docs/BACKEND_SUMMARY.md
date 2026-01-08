# Backend螳溯｣・し繝槭Μ繝ｼ v0.1

## 笨・螳溯｣・ｮ御ｺ・・岼

### 1. 繝励Ο繧ｸ繧ｧ繧ｯ繝亥渕逶､
- 笨・Node.js + Express繝励Ο繧ｸ繧ｧ繧ｯ繝亥・譛溷喧
- 笨・萓晏ｭ倬未菫ゅう繝ｳ繧ｹ繝医・繝ｫ・・xpress, googleapis, jsonwebtoken, cors, dotenv・・
- 笨・繝・ぅ繝ｬ繧ｯ繝医Μ讒矩菴懈・・・ib, middleware, routes・・
- 笨・迺ｰ蠅・､画焚繝・Φ繝励Ξ繝ｼ繝茨ｼ・env.example・・
- 笨・.gitignore險ｭ螳・

### 2. Google Sheets API繧ｯ繝ｩ繧､繧｢繝ｳ繝・
- 笨・`lib/sheetsClient.js` - CRUD謫堺ｽ・
  - 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝郁ｪ崎ｨｼ
  - 陦後ョ繝ｼ繧ｿ縺ｮ蜿門ｾ励・霑ｽ蜉繝ｻ譖ｴ譁ｰ繝ｻ蜑企勁
  - 繧ｪ繝悶ず繧ｧ繧ｯ繝遺∑陦後ョ繝ｼ繧ｿ縺ｮ逶ｸ莠貞､画鋤
  - 繝倥ャ繝繝ｼ蜿門ｾ玲ｩ溯・

### 3. 隱崎ｨｼ繝ｻ隱榊庄
- 笨・`middleware/auth.js` - JWT隱崎ｨｼ繝溘ラ繝ｫ繧ｦ繧ｧ繧｢
  - Google OAuth ID繝医・繧ｯ繝ｳ讀懆ｨｼ
  - 繝ｦ繝ｼ繧ｶ繝ｼ閾ｪ蜍穂ｽ懈・・亥・蝗槭Ο繧ｰ繧､繝ｳ譎ゅ・Viewer・・
  - JWT逕滓・繝ｻ讀懆ｨｼ
  - 讓ｩ髯舌メ繧ｧ繝・け・・iewer/Editor/Admin・・

### 4. API繝ｫ繝ｼ繝・

#### 4.1 隱崎ｨｼ
- 笨・`routes/auth.js`
  - POST `/v1/auth/login` - Google OAuth繝ｭ繧ｰ繧､繝ｳ

#### 4.2 蜩∫ｨｮ
- 笨・`routes/varieties.js`
  - GET `/v1/varieties` - 荳隕ｧ蜿門ｾ暦ｼ域､懃ｴ｢蟇ｾ蠢懶ｼ・
  - GET `/v1/varieties/:id` - 隧ｳ邏ｰ蜿門ｾ・
  - POST `/v1/varieties` - 菴懈・・・ditor莉･荳奇ｼ・
  - PUT `/v1/varieties/:id` - 譖ｴ譁ｰ・・ditor莉･荳翫∵･ｽ隕ｳ繝ｭ繝・け・・
  - DELETE `/v1/varieties/:id` - 蜑企勁・・dmin縲∝宛邏・メ繧ｧ繝・け・・

#### 4.3 螳ｹ蝎ｨ
- 笨・`routes/containers.js`
  - GET `/v1/containers` - 荳隕ｧ蜿門ｾ暦ｼ郁・蛻・・螳ｹ蝎ｨ縺ｮ縺ｿ・・
  - GET `/v1/containers/:id` - 隧ｳ邏ｰ蜿門ｾ暦ｼ亥刀遞ｮ繝ｪ繧ｹ繝亥性繧・・
  - POST `/v1/containers` - 菴懈・
  - PUT `/v1/containers/:id` - 譖ｴ譁ｰ・域･ｽ隕ｳ繝ｭ繝・け・・
  - DELETE `/v1/containers/:id` - 蜑企勁・亥宛邏・メ繧ｧ繝・け・・
  - POST `/v1/containers/:id/varieties` - 蜩∫ｨｮ霑ｽ蜉
  - PUT `/v1/containers/:id/varieties/:vid` - 蛟倶ｽ捺焚譖ｴ譁ｰ
  - DELETE `/v1/containers/:id/varieties/:vid` - 蜩∫ｨｮ蜑企勁

#### 4.4 逶｣譟ｻ繝ｭ繧ｰ
- 笨・`routes/auditLogs.js`
  - GET `/v1/audit-logs` - 繝ｭ繧ｰ蜿門ｾ暦ｼ・dmin 縺ｮ縺ｿ・・

### 5. 繝峨く繝･繝｡繝ｳ繝・
- 笨・`backend/README.md` - 繧ｻ繝・ヨ繧｢繝・・謇矩・・API莉墓ｧ・
- 笨・`backend/SHEETS_SETUP.md` - Google Sheets蛻晄悄險ｭ螳壹ぎ繧､繝・

---

## 搭 螳溯｣・＠縺滓ｩ溯・

### 繧ｻ繧ｭ繝･繝ｪ繝・ぅ
- 笨・JWT隱崎ｨｼ・・譌･髢捺怏蜉ｹ・・
- 笨・3谿ｵ髫取ｨｩ髯千ｮ｡逅・ｼ・iewer/Editor/Admin・・
- 笨・Google OAuth ID繝医・繧ｯ繝ｳ讀懆ｨｼ
- 笨・CORS險ｭ螳・

### 繝・・繧ｿ謨ｴ蜷域ｧ
- 笨・讌ｽ隕ｳ繝ｭ繝・け・・ersion繧ｫ繝ｩ繝・・
- 笨・蜑企勁蛻ｶ邏・メ繧ｧ繝・け・亥刀遞ｮ繝ｻ螳ｹ蝎ｨ縺ｮ邏蝉ｻ倥″遒ｺ隱搾ｼ・
- 笨・繝舌Μ繝・・繧ｷ繝ｧ繝ｳ・亥ｿ・磯・岼繝√ぉ繝・け・・

### 逶｣譟ｻ
- 笨・逶｣譟ｻ繝ｭ繧ｰ閾ｪ蜍戊ｨ倬鹸・・REATE/UPDATE/DELETE・・
- 笨・繝ｦ繝ｼ繧ｶ繝ｼ謫堺ｽ懷ｱ･豁ｴ縺ｮ霑ｽ霍｡

### 讀懃ｴ｢繝ｻ繝輔ぅ繝ｫ繧ｿ
- 笨・蜩∫ｨｮ讀懃ｴ｢・亥錐蜑阪・邉ｻ邨ｱ・・
- 笨・逶｣譟ｻ繝ｭ繧ｰ繝輔ぅ繝ｫ繧ｿ・・arget_type, user_id・・

---

## 噫 谺｡縺ｮ繧ｹ繝・ャ繝・

### 1. Google Sheets繧ｻ繝・ヨ繧｢繝・・・亥ｿ・茨ｼ・
1. 繧ｹ繝励Ξ繝・ラ繧ｷ繝ｼ繝井ｽ懈・
2. 5縺､縺ｮ繧ｷ繝ｼ繝井ｽ懈・・・arieties, containers, container_varieties, audit_log, users・・
3. 繝倥ャ繝繝ｼ陦瑚ｨｭ螳・
4. 繧ｵ繝ｳ繝励Ν繝・・繧ｿ謚募・
5. 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝医↓蜈ｱ譛画ｨｩ髯蝉ｻ倅ｸ・

隧ｳ邏ｰ: `backend/SHEETS_SETUP.md`

### 2. 迺ｰ蠅・､画焚險ｭ螳・
1. `.env.example`繧偵さ繝斐・縺励※`.env`菴懈・
2. 莉･荳九ｒ險ｭ螳・
   - `SPREADSHEET_ID`: 繧ｹ繝励Ξ繝・ラ繧ｷ繝ｼ繝・D
   - `GOOGLE_APPLICATION_CREDENTIALS`: 繧ｵ繝ｼ繝薙せ繧｢繧ｫ繧ｦ繝ｳ繝・SON繝代せ
   - `JWT_SECRET`: 繝ｩ繝ｳ繝繝縺ｪ遘伜ｯ・嵯
   - `GOOGLE_CLIENT_ID`: OAuth Client ID

### 3. 繝ｭ繝ｼ繧ｫ繝ｫ繝・せ繝・
```bash
cd backend
npm run dev
```

繝倥Ν繧ｹ繝√ぉ繝・け:
```bash
curl http://localhost:3000/health
```

### 4. Postman繝・せ繝・
1. 繝ｭ繧ｰ繧､繝ｳ縺励※JWT蜿門ｾ・
2. 蜩∫ｨｮ荳隕ｧ蜿門ｾ・
3. 螳ｹ蝎ｨ菴懈・
4. 蜩∫ｨｮ邏蝉ｻ倥￠

---

## 投 螳溯｣・ち繧ｹ繧ｯ螳御ｺ・憾豕・

IMPLEMENTATION_PLAN.md縺ｨ縺ｮ蟇ｾ蠢・

- 笨・P0-4: 繝励Ο繧ｸ繧ｧ繧ｯ繝亥・譛溷喧
- 笨・P0-5: Sheets CRUD蝓ｺ逶､螳溯｣・
- 笨・P0-6: 蜩∫ｨｮAPI螳溯｣・ｼ・ET・・
- 笨・P0-7: 蜩∫ｨｮAPI螳溯｣・ｼ・OST/PUT/DELETE・・
- 笨・P0-8: 螳ｹ蝎ｨAPI螳溯｣・ｼ亥・CRUD・・
- 笨・P0-9: 螳ｹ蝎ｨﾃ怜刀遞ｮ邏蝉ｻ倥￠API螳溯｣・
- 笨・P0-10: 隱崎ｨｼ螳溯｣・ｼ・WT逋ｺ陦後・讀懆ｨｼ・・
- 笨・P0-11: 讓ｩ髯舌メ繧ｧ繝・け螳溯｣・
- 笨・P1-2: 逶｣譟ｻ繝ｭ繧ｰ螳溯｣・

**螳御ｺ・*: 9繧ｿ繧ｹ繧ｯ / 9繧ｿ繧ｹ繧ｯ・・00%・・

---

## 識 譛ｪ螳溯｣・・岼・・VP螟厄ｼ・

- 竢ｸ・・P1-3: 繝ｬ繝ｼ繝亥宛髯撰ｼ・00req/蛻・ｼ・
- 竢ｸ・・P0-24: Backend API繝・せ繝茨ｼ・ostman・・
- 竢ｸ・・P1-7: Backend蜊倅ｽ薙ユ繧ｹ繝茨ｼ・est・・

縺薙ｌ繧峨・MVP螳梧・蠕後↓螳溯｣・ｺ亥ｮ壹・

---

**菴懈・譌･**: 2026-01-08  
**繝舌・繧ｸ繝ｧ繝ｳ**: 0.1  
**谺｡蝗樊峩譁ｰ**: iOS螳溯｣・ｮ御ｺ・凾

