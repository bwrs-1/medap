const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const sheetsClient = require('../lib/sheetsClient');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Google IDトークンを検証してJWTを発行
 * @param {string} idToken - Google OAuth IDトークン
 * @returns {Object} - { token, user }
 */
async function verifyGoogleToken(idToken) {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
    };
}

/**
 * ユーザーをDBから取得または作成
 * @param {Object} googleUser - Google認証情報
 * @returns {Object} - ユーザー情報
 */
async function findOrCreateUser(googleUser) {
    const headers = await sheetsClient.getHeaders('users');
    const rows = await sheetsClient.getRows('users');

    // ヘッダー行を除外
    const dataRows = rows.slice(1);

    // 既存ユーザーを検索
    for (let i = 0; i < dataRows.length; i++) {
        const user = sheetsClient.rowToObject(headers, dataRows[i]);
        if (user.email === googleUser.email) {
            // 最終ログイン日時を更新
            user.last_login = new Date().toISOString();
            const rowIndex = i + 2; // ヘッダー行 + 0始まり調整
            const rowData = sheetsClient.objectToRow(headers, user);
            await sheetsClient.updateRow('users', `A${rowIndex}:Z${rowIndex}`, rowData);
            return user;
        }
    }

    // 新規ユーザー作成（デフォルトはViewer）
    const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: googleUser.email,
        name: googleUser.name,
        role: 'viewer',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
    };

    const rowData = sheetsClient.objectToRow(headers, newUser);
    await sheetsClient.appendRow('users', rowData);

    return newUser;
}

/**
 * JWTを生成
 * @param {Object} user - ユーザー情報
 * @returns {string} - JWT
 */
function generateJWT(user) {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
}

/**
 * JWT認証ミドルウェア
 */
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'unauthorized',
                message: '認証トークンが提供されていません',
            });
        }

        const token = authHeader.substring(7);

        // JWTを検証
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ユーザー情報をリクエストに追加
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'unauthorized',
                message: 'トークンの有効期限が切れています',
            });
        }

        return res.status(401).json({
            error: 'unauthorized',
            message: '無効な認証トークンです',
        });
    }
}

/**
 * 権限チェックミドルウェア
 * @param {Array} allowedRoles - 許可されるロール
 */
function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'unauthorized',
                message: '認証が必要です',
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'forbidden',
                message: 'この操作を実行する権限がありません',
            });
        }

        next();
    };
}

module.exports = {
    verifyGoogleToken,
    findOrCreateUser,
    generateJWT,
    authenticate,
    authorize,
};
