const express = require('express');
const router = express.Router();
const sheetsClient = require('../lib/sheetsClient');
const { authenticate, authorize } = require('../middleware/auth');

const SHEET_NAME = 'varieties';

/**
 * GET /v1/varieties
 * 品種一覧取得（検索対応）
 */
router.get('/', authenticate, async (req, res, next) => {
    try {
        const { search, lineage } = req.query;

        const headers = await sheetsClient.getHeaders(SHEET_NAME);
        const rows = await sheetsClient.getRows(SHEET_NAME);

        // ヘッダー行を除外
        const dataRows = rows.slice(1);

        let varieties = dataRows
            .map(row => sheetsClient.rowToObject(headers, row))
            .filter(v => v.id); // 空行を除外

        // 検索フィルタ
        if (search) {
            const searchLower = search.toLowerCase();
            varieties = varieties.filter(v =>
                v.name.toLowerCase().includes(searchLower) ||
                v.lineage.toLowerCase().includes(searchLower)
            );
        }

        // 系統フィルタ
        if (lineage) {
            varieties = varieties.filter(v => v.lineage === lineage);
        }

        // レスポンス用に整形（version以外の情報を返す）
        const response = varieties.map(v => ({
            id: v.id,
            name: v.name,
            lineage: v.lineage,
            image_url: v.image_url,
            difficulty: parseInt(v.difficulty) || 0,
            version: parseInt(v.version) || 1,
        }));

        res.json({ varieties: response });
    } catch (error) {
        console.error('Get varieties error:', error);
        next(error);
    }
});

/**
 * GET /v1/varieties/:id
 * 品種詳細取得
 */
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;

        const headers = await sheetsClient.getHeaders(SHEET_NAME);
        const rows = await sheetsClient.getRows(SHEET_NAME);

        const dataRows = rows.slice(1);

        for (const row of dataRows) {
            const variety = sheetsClient.rowToObject(headers, row);
            if (variety.id === id) {
                // 特徴をカンマ区切りから配列に変換
                const features = variety.features ? variety.features.split(',').map(f => f.trim()) : [];

                return res.json({
                    id: variety.id,
                    name: variety.name,
                    lineage: variety.lineage,
                    description: variety.description,
                    image_url: variety.image_url,
                    features,
                    difficulty: parseInt(variety.difficulty) || 0,
                    price_range: variety.price_range,
                    version: parseInt(variety.version) || 1,
                });
            }
        }

        res.status(404).json({
            error: 'not_found',
            message: '指定された品種が見つかりません',
        });
    } catch (error) {
        console.error('Get variety error:', error);
        next(error);
    }
});

/**
 * POST /v1/varieties
 * 品種作成（Editor以上）
 */
router.post('/', authenticate, authorize('editor', 'admin'), async (req, res, next) => {
    try {
        const { name, lineage, description, image_url, features, difficulty, price_range } = req.body;

        // バリデーション
        if (!name || !lineage) {
            return res.status(422).json({
                error: 'validation_error',
                message: '品種名と系統は必須です',
            });
        }

        const headers = await sheetsClient.getHeaders(SHEET_NAME);

        const newVariety = {
            id: `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            lineage,
            description: description || '',
            image_url: image_url || '',
            features: Array.isArray(features) ? features.join(',') : '',
            difficulty: difficulty || 3,
            price_range: price_range || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: req.user.userId,
            version: 1,
        };

        const rowData = sheetsClient.objectToRow(headers, newVariety);
        await sheetsClient.appendRow(SHEET_NAME, rowData);

        // 監査ログ記録
        await logAudit(req.user.userId, 'CREATE', 'varieties', newVariety.id, null);

        res.status(201).json({
            id: newVariety.id,
            version: newVariety.version,
        });
    } catch (error) {
        console.error('Create variety error:', error);
        next(error);
    }
});

/**
 * PUT /v1/varieties/:id
 * 品種更新（Editor以上）
 */
router.put('/:id', authenticate, authorize('editor', 'admin'), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, lineage, description, image_url, features, difficulty, price_range, version } = req.body;

        if (version === undefined) {
            return res.status(422).json({
                error: 'validation_error',
                message: 'versionは必須です（楽観ロック）',
            });
        }

        const headers = await sheetsClient.getHeaders(SHEET_NAME);
        const rows = await sheetsClient.getRows(SHEET_NAME);
        const dataRows = rows.slice(1);

        for (let i = 0; i < dataRows.length; i++) {
            const variety = sheetsClient.rowToObject(headers, dataRows[i]);

            if (variety.id === id) {
                // 楽観ロックチェック
                if (parseInt(variety.version) !== parseInt(version)) {
                    return res.status(409).json({
                        error: 'conflict',
                        message: 'このレコードは他のユーザーにより更新されています',
                    });
                }

                // 更新
                const updatedVariety = {
                    ...variety,
                    name: name !== undefined ? name : variety.name,
                    lineage: lineage !== undefined ? lineage : variety.lineage,
                    description: description !== undefined ? description : variety.description,
                    image_url: image_url !== undefined ? image_url : variety.image_url,
                    features: features !== undefined ? (Array.isArray(features) ? features.join(',') : features) : variety.features,
                    difficulty: difficulty !== undefined ? difficulty : variety.difficulty,
                    price_range: price_range !== undefined ? price_range : variety.price_range,
                    updated_at: new Date().toISOString(),
                    version: parseInt(variety.version) + 1,
                };

                const rowIndex = i + 2; // ヘッダー行 + 0始まり調整
                const rowData = sheetsClient.objectToRow(headers, updatedVariety);
                await sheetsClient.updateRow(SHEET_NAME, `A${rowIndex}:Z${rowIndex}`, rowData);

                // 監査ログ記録
                await logAudit(req.user.userId, 'UPDATE', 'varieties', id, { name, lineage });

                return res.json({
                    id: updatedVariety.id,
                    version: updatedVariety.version,
                });
            }
        }

        res.status(404).json({
            error: 'not_found',
            message: '指定された品種が見つかりません',
        });
    } catch (error) {
        console.error('Update variety error:', error);
        next(error);
    }
});

/**
 * DELETE /v1/varieties/:id
 * 品種削除（Admin のみ）
 */
router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
    try {
        const { id } = req.params;

        // 容器に紐付いているかチェック
        const cvHeaders = await sheetsClient.getHeaders('container_varieties');
        const cvRows = await sheetsClient.getRows('container_varieties');
        const cvDataRows = cvRows.slice(1);

        for (const row of cvDataRows) {
            const cv = sheetsClient.rowToObject(cvHeaders, row);
            if (cv.variety_id === id) {
                return res.status(409).json({
                    error: 'conflict',
                    message: 'この品種は容器に紐付いているため削除できません',
                });
            }
        }

        // 削除実行
        const headers = await sheetsClient.getHeaders(SHEET_NAME);
        const rows = await sheetsClient.getRows(SHEET_NAME);
        const dataRows = rows.slice(1);

        for (let i = 0; i < dataRows.length; i++) {
            const variety = sheetsClient.rowToObject(headers, dataRows[i]);
            if (variety.id === id) {
                const rowIndex = i + 2;
                await sheetsClient.deleteRow(SHEET_NAME, rowIndex);

                // 監査ログ記録
                await logAudit(req.user.userId, 'DELETE', 'varieties', id, null);

                return res.status(204).send();
            }
        }

        res.status(404).json({
            error: 'not_found',
            message: '指定された品種が見つかりません',
        });
    } catch (error) {
        console.error('Delete variety error:', error);
        next(error);
    }
});

/**
 * 監査ログ記録ヘルパー
 */
async function logAudit(userId, action, targetType, targetId, changes) {
    try {
        const headers = await sheetsClient.getHeaders('audit_log');
        const log = {
            id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            user_id: userId,
            action,
            target_type: targetType,
            target_id: targetId,
            changes: changes ? JSON.stringify(changes) : '',
        };

        const rowData = sheetsClient.objectToRow(headers, log);
        await sheetsClient.appendRow('audit_log', rowData);
    } catch (error) {
        console.error('Audit log error:', error);
        // 監査ログのエラーは本処理に影響させない
    }
}

module.exports = router;
