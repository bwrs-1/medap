const express = require('express');
const router = express.Router();
const sheetsClient = require('../lib/sheetsClient');
const { authenticate, authorize } = require('../middleware/auth');

const SHEET_NAME = 'containers';
const CV_SHEET_NAME = 'container_varieties';

/**
 * GET /v1/containers
 * 容器一覧取得（自分の容器のみ、Adminは全て）
 */
router.get('/', authenticate, async (req, res, next) => {
    try {
        const headers = await sheetsClient.getHeaders(SHEET_NAME);
        const rows = await sheetsClient.getRows(SHEET_NAME);
        const dataRows = rows.slice(1);

        let containers = dataRows
            .map(row => sheetsClient.rowToObject(headers, row))
            .filter(c => c.id);

        // Adminでない場合は自分の容器のみ
        if (req.user.role !== 'admin') {
            containers = containers.filter(c => c.user_id === req.user.userId);
        }

        // 各容器の品種数を取得
        const cvHeaders = await sheetsClient.getHeaders(CV_SHEET_NAME);
        const cvRows = await sheetsClient.getRows(CV_SHEET_NAME);
        const cvDataRows = cvRows.slice(1);

        const response = containers.map(c => {
            const varietyCount = cvDataRows.filter(row => {
                const cv = sheetsClient.rowToObject(cvHeaders, row);
                return cv.container_id === c.id;
            }).length;

            return {
                id: c.id,
                name: c.name,
                size: c.size,
                location: c.location,
                variety_count: varietyCount,
                version: parseInt(c.version) || 1,
            };
        });

        res.json({ containers: response });
    } catch (error) {
        console.error('Get containers error:', error);
        next(error);
    }
});

/**
 * GET /v1/containers/:id
 * 容器詳細取得（飼育中の品種も含む）
 */
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;

        const headers = await sheetsClient.getHeaders(SHEET_NAME);
        const rows = await sheetsClient.getRows(SHEET_NAME);
        const dataRows = rows.slice(1);

        let container = null;
        for (const row of dataRows) {
            const c = sheetsClient.rowToObject(headers, row);
            if (c.id === id) {
                container = c;
                break;
            }
        }

        if (!container) {
            return res.status(404).json({
                error: 'not_found',
                message: '指定された容器が見つかりません',
            });
        }

        // 権限チェック（自分の容器またはAdmin）
        if (container.user_id !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({
                error: 'forbidden',
                message: 'この容器にアクセスする権限がありません',
            });
        }

        // 飼育中の品種を取得
        const cvHeaders = await sheetsClient.getHeaders(CV_SHEET_NAME);
        const cvRows = await sheetsClient.getRows(CV_SHEET_NAME);
        const cvDataRows = cvRows.slice(1);

        const varietyHeaders = await sheetsClient.getHeaders('varieties');
        const varietyRows = await sheetsClient.getRows('varieties');
        const varietyDataRows = varietyRows.slice(1);

        const varieties = [];
        for (const row of cvDataRows) {
            const cv = sheetsClient.rowToObject(cvHeaders, row);
            if (cv.container_id === id) {
                // 品種名を取得
                for (const vRow of varietyDataRows) {
                    const variety = sheetsClient.rowToObject(varietyHeaders, vRow);
                    if (variety.id === cv.variety_id) {
                        varieties.push({
                            variety_id: cv.variety_id,
                            variety_name: variety.name,
                            count: parseInt(cv.count) || 0,
                        });
                        break;
                    }
                }
            }
        }

        res.json({
            id: container.id,
            name: container.name,
            size: container.size,
            location: container.location,
            memo: container.memo,
            varieties,
            version: parseInt(container.version) || 1,
        });
    } catch (error) {
        console.error('Get container error:', error);
        next(error);
    }
});

/**
 * POST /v1/containers
 * 容器作成
 */
router.post('/', authenticate, async (req, res, next) => {
    try {
        const { name, size, location, memo } = req.body;

        if (!name) {
            return res.status(422).json({
                error: 'validation_error',
                message: '容器名は必須です',
            });
        }

        const headers = await sheetsClient.getHeaders(SHEET_NAME);

        const newContainer = {
            id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            user_id: req.user.userId,
            name,
            size: size || '',
            location: location || '',
            memo: memo || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            version: 1,
        };

        const rowData = sheetsClient.objectToRow(headers, newContainer);
        await sheetsClient.appendRow(SHEET_NAME, rowData);

        res.status(201).json({
            id: newContainer.id,
            version: newContainer.version,
        });
    } catch (error) {
        console.error('Create container error:', error);
        next(error);
    }
});

/**
 * PUT /v1/containers/:id
 * 容器更新
 */
router.put('/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, size, location, memo, version } = req.body;

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
            const container = sheetsClient.rowToObject(headers, dataRows[i]);

            if (container.id === id) {
                // 権限チェック
                if (container.user_id !== req.user.userId && req.user.role !== 'admin') {
                    return res.status(403).json({
                        error: 'forbidden',
                        message: 'この容器を編集する権限がありません',
                    });
                }

                // 楽観ロックチェック
                if (parseInt(container.version) !== parseInt(version)) {
                    return res.status(409).json({
                        error: 'conflict',
                        message: 'このレコードは他のユーザーにより更新されています',
                    });
                }

                // 更新
                const updatedContainer = {
                    ...container,
                    name: name !== undefined ? name : container.name,
                    size: size !== undefined ? size : container.size,
                    location: location !== undefined ? location : container.location,
                    memo: memo !== undefined ? memo : container.memo,
                    updated_at: new Date().toISOString(),
                    version: parseInt(container.version) + 1,
                };

                const rowIndex = i + 2;
                const rowData = sheetsClient.objectToRow(headers, updatedContainer);
                await sheetsClient.updateRow(SHEET_NAME, `A${rowIndex}:Z${rowIndex}`, rowData);

                return res.json({
                    id: updatedContainer.id,
                    version: updatedContainer.version,
                });
            }
        }

        res.status(404).json({
            error: 'not_found',
            message: '指定された容器が見つかりません',
        });
    } catch (error) {
        console.error('Update container error:', error);
        next(error);
    }
});

/**
 * DELETE /v1/containers/:id
 * 容器削除
 */
router.delete('/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;

        // 品種が紐付いているかチェック
        const cvHeaders = await sheetsClient.getHeaders(CV_SHEET_NAME);
        const cvRows = await sheetsClient.getRows(CV_SHEET_NAME);
        const cvDataRows = cvRows.slice(1);

        for (const row of cvDataRows) {
            const cv = sheetsClient.rowToObject(cvHeaders, row);
            if (cv.container_id === id) {
                return res.status(409).json({
                    error: 'conflict',
                    message: 'この容器には品種が紐付いているため削除できません',
                });
            }
        }

        const headers = await sheetsClient.getHeaders(SHEET_NAME);
        const rows = await sheetsClient.getRows(SHEET_NAME);
        const dataRows = rows.slice(1);

        for (let i = 0; i < dataRows.length; i++) {
            const container = sheetsClient.rowToObject(headers, dataRows[i]);

            if (container.id === id) {
                // 権限チェック
                if (container.user_id !== req.user.userId && req.user.role !== 'admin') {
                    return res.status(403).json({
                        error: 'forbidden',
                        message: 'この容器を削除する権限がありません',
                    });
                }

                const rowIndex = i + 2;
                await sheetsClient.deleteRow(SHEET_NAME, rowIndex);

                return res.status(204).send();
            }
        }

        res.status(404).json({
            error: 'not_found',
            message: '指定された容器が見つかりません',
        });
    } catch (error) {
        console.error('Delete container error:', error);
        next(error);
    }
});

/**
 * POST /v1/containers/:container_id/varieties
 * 品種を容器に追加
 */
router.post('/:container_id/varieties', authenticate, async (req, res, next) => {
    try {
        const { container_id } = req.params;
        const { variety_id, count } = req.body;

        if (!variety_id || !count) {
            return res.status(422).json({
                error: 'validation_error',
                message: 'variety_idとcountは必須です',
            });
        }

        // 容器の所有権チェック
        const containerHeaders = await sheetsClient.getHeaders(SHEET_NAME);
        const containerRows = await sheetsClient.getRows(SHEET_NAME);
        const containerDataRows = containerRows.slice(1);

        let containerFound = false;
        for (const row of containerDataRows) {
            const container = sheetsClient.rowToObject(containerHeaders, row);
            if (container.id === container_id) {
                if (container.user_id !== req.user.userId && req.user.role !== 'admin') {
                    return res.status(403).json({
                        error: 'forbidden',
                        message: 'この容器を編集する権限がありません',
                    });
                }
                containerFound = true;
                break;
            }
        }

        if (!containerFound) {
            return res.status(404).json({
                error: 'not_found',
                message: '指定された容器が見つかりません',
            });
        }

        // 重複チェック
        const cvHeaders = await sheetsClient.getHeaders(CV_SHEET_NAME);
        const cvRows = await sheetsClient.getRows(CV_SHEET_NAME);
        const cvDataRows = cvRows.slice(1);

        for (const row of cvDataRows) {
            const cv = sheetsClient.rowToObject(cvHeaders, row);
            if (cv.container_id === container_id && cv.variety_id === variety_id) {
                return res.status(409).json({
                    error: 'conflict',
                    message: 'この品種は既に容器に追加されています',
                });
            }
        }

        // 追加
        const newCV = {
            id: `cv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            container_id,
            variety_id,
            count,
            added_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            version: 1,
        };

        const rowData = sheetsClient.objectToRow(cvHeaders, newCV);
        await sheetsClient.appendRow(CV_SHEET_NAME, rowData);

        res.status(201).json({
            id: newCV.id,
            version: newCV.version,
        });
    } catch (error) {
        console.error('Add variety to container error:', error);
        next(error);
    }
});

/**
 * PUT /v1/containers/:container_id/varieties/:variety_id
 * 個体数を更新
 */
router.put('/:container_id/varieties/:variety_id', authenticate, async (req, res, next) => {
    try {
        const { container_id, variety_id } = req.params;
        const { count, version } = req.body;

        if (count === undefined || version === undefined) {
            return res.status(422).json({
                error: 'validation_error',
                message: 'countとversionは必須です',
            });
        }

        const cvHeaders = await sheetsClient.getHeaders(CV_SHEET_NAME);
        const cvRows = await sheetsClient.getRows(CV_SHEET_NAME);
        const cvDataRows = cvRows.slice(1);

        for (let i = 0; i < cvDataRows.length; i++) {
            const cv = sheetsClient.rowToObject(cvHeaders, cvDataRows[i]);

            if (cv.container_id === container_id && cv.variety_id === variety_id) {
                // 楽観ロックチェック
                if (parseInt(cv.version) !== parseInt(version)) {
                    return res.status(409).json({
                        error: 'conflict',
                        message: 'このレコードは他のユーザーにより更新されています',
                    });
                }

                // 更新
                const updatedCV = {
                    ...cv,
                    count,
                    updated_at: new Date().toISOString(),
                    version: parseInt(cv.version) + 1,
                };

                const rowIndex = i + 2;
                const rowData = sheetsClient.objectToRow(cvHeaders, updatedCV);
                await sheetsClient.updateRow(CV_SHEET_NAME, `A${rowIndex}:Z${rowIndex}`, rowData);

                return res.json({
                    id: updatedCV.id,
                    version: updatedCV.version,
                });
            }
        }

        res.status(404).json({
            error: 'not_found',
            message: '指定された紐付けが見つかりません',
        });
    } catch (error) {
        console.error('Update container variety error:', error);
        next(error);
    }
});

/**
 * DELETE /v1/containers/:container_id/varieties/:variety_id
 * 品種を容器から削除
 */
router.delete('/:container_id/varieties/:variety_id', authenticate, async (req, res, next) => {
    try {
        const { container_id, variety_id } = req.params;

        const cvHeaders = await sheetsClient.getHeaders(CV_SHEET_NAME);
        const cvRows = await sheetsClient.getRows(CV_SHEET_NAME);
        const cvDataRows = cvRows.slice(1);

        for (let i = 0; i < cvDataRows.length; i++) {
            const cv = sheetsClient.rowToObject(cvHeaders, cvDataRows[i]);

            if (cv.container_id === container_id && cv.variety_id === variety_id) {
                const rowIndex = i + 2;
                await sheetsClient.deleteRow(CV_SHEET_NAME, rowIndex);

                return res.status(204).send();
            }
        }

        res.status(404).json({
            error: 'not_found',
            message: '指定された紐付けが見つかりません',
        });
    } catch (error) {
        console.error('Delete container variety error:', error);
        next(error);
    }
});

module.exports = router;
