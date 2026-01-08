const express = require('express');
const router = express.Router();
const { verifyGoogleToken, findOrCreateUser, generateJWT } = require('../middleware/auth');

/**
 * POST /v1/auth/login
 * Google OAuthでログイン
 */
router.post('/login', async (req, res, next) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(422).json({
                error: 'validation_error',
                message: 'idTokenが必要です',
            });
        }

        // Google IDトークンを検証
        const googleUser = await verifyGoogleToken(idToken);

        // ユーザーを取得または作成
        const user = await findOrCreateUser(googleUser);

        // JWTを生成
        const token = generateJWT(user);

        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        next({
            status: 401,
            code: 'unauthorized',
            message: 'Google認証に失敗しました',
        });
    }
});

module.exports = router;
