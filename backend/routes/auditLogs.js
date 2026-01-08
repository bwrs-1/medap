const express = require('express');
const router = express.Router();
const sheetsClient = require('../lib/sheetsClient');
const { authenticate, authorize } = require('../middleware/auth');

const SHEET_NAME = 'audit_log';

/**
 * GET /v1/audit-logs
 * 監査ログ取得（Admin のみ）
 */
router.get('/', authenticate, authorize('admin'), async (req, res, next) => {
    try {
        const { target_type, user_id, limit = 50 } = req.query;

        const headers = await sheetsClient.getHeaders(SHEET_NAME);
        const rows = await sheetsClient.getRows(SHEET_NAME);
        const dataRows = rows.slice(1);

        let logs = dataRows
            .map(row => sheetsClient.rowToObject(headers, row))
            .filter(log => log.id);

        // フィルタ
        if (target_type) {
            logs = logs.filter(log => log.target_type === target_type);
        }

        if (user_id) {
            logs = logs.filter(log => log.user_id === user_id);
        }

        // 新しい順にソート
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // 件数制限
        logs = logs.slice(0, parseInt(limit));

        // レスポンス整形
        const response = logs.map(log => ({
            id: log.id,
            timestamp: log.timestamp,
            user_id: log.user_id,
            action: log.action,
            target_type: log.target_type,
            target_id: log.target_id,
            changes: log.changes ? JSON.parse(log.changes) : null,
        }));

        res.json({ logs: response });
    } catch (error) {
        console.error('Get audit logs error:', error);
        next(error);
    }
});

module.exports = router;
