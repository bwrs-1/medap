require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API v1 routes
app.use('/v1/varieties', require('./routes/varieties'));
app.use('/v1/containers', require('./routes/containers'));
app.use('/v1/auth', require('./routes/auth'));
app.use('/v1/audit-logs', require('./routes/auditLogs'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.code || 'internal_error',
        message: err.message || 'サーバー内部エラーが発生しました'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'not_found',
        message: 'リクエストされたリソースが見つかりません'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
