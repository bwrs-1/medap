const { google } = require('googleapis');

/**
 * Google Sheets APIクライアント
 * サービスアカウント認証を使用してSheetsにアクセス
 */
class SheetsClient {
    constructor() {
        this.spreadsheetId = process.env.SPREADSHEET_ID;
        this.auth = null;
        this.sheets = null;
    }

    /**
     * 認証を初期化
     */
    async initialize() {
        if (this.sheets) return; // 既に初期化済み

        // サービスアカウント認証
        // 本番環境ではCloud Secret Managerから取得
        // 開発環境では環境変数またはJSONファイルから取得
        this.auth = new google.auth.GoogleAuth({
            keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS, // サービスアカウントJSONファイルのパス
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    }

    /**
     * シートからデータを取得
     * @param {string} sheetName - シート名
     * @param {string} range - 範囲（例: 'A1:Z1000'）
     * @returns {Array} - 行データの配列
     */
    async getRows(sheetName, range = 'A:Z') {
        await this.initialize();

        const response = await this.sheets.spreadsheets.values.get({
            spreadsheetId: this.spreadsheetId,
            range: `${sheetName}!${range}`,
        });

        return response.data.values || [];
    }

    /**
     * シートにデータを追加
     * @param {string} sheetName - シート名
     * @param {Array} values - 追加する行データ
     * @returns {Object} - 追加結果
     */
    async appendRow(sheetName, values) {
        await this.initialize();

        const response = await this.sheets.spreadsheets.values.append({
            spreadsheetId: this.spreadsheetId,
            range: `${sheetName}!A:Z`,
            valueInputOption: 'RAW',
            resource: { values: [values] },
        });

        return response.data;
    }

    /**
     * シートのデータを更新
     * @param {string} sheetName - シート名
     * @param {string} range - 更新範囲（例: 'A2:Z2'）
     * @param {Array} values - 更新する行データ
     * @returns {Object} - 更新結果
     */
    async updateRow(sheetName, range, values) {
        await this.initialize();

        const response = await this.sheets.spreadsheets.values.update({
            spreadsheetId: this.spreadsheetId,
            range: `${sheetName}!${range}`,
            valueInputOption: 'RAW',
            resource: { values: [values] },
        });

        return response.data;
    }

    /**
     * 行を削除（実際には空白で上書き）
     * @param {string} sheetName - シート名
     * @param {number} rowIndex - 行番号（1始まり）
     */
    async deleteRow(sheetName, rowIndex) {
        await this.initialize();

        // Sheets APIでは行削除が複雑なため、空白で上書きする方法を採用
        const range = `${sheetName}!A${rowIndex}:Z${rowIndex}`;
        await this.updateRow(sheetName, `A${rowIndex}:Z${rowIndex}`, []);
    }

    /**
     * ヘッダー行を取得
     * @param {string} sheetName - シート名
     * @returns {Array} - ヘッダー配列
     */
    async getHeaders(sheetName) {
        const rows = await this.getRows(sheetName, 'A1:Z1');
        return rows[0] || [];
    }

    /**
     * 行データをオブジェクトに変換
     * @param {Array} headers - ヘッダー配列
     * @param {Array} row - 行データ
     * @returns {Object} - キーバリューオブジェクト
     */
    rowToObject(headers, row) {
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = row[index] || '';
        });
        return obj;
    }

    /**
     * オブジェクトを行データに変換
     * @param {Array} headers - ヘッダー配列
     * @param {Object} obj - データオブジェクト
     * @returns {Array} - 行データ
     */
    objectToRow(headers, obj) {
        return headers.map(header => obj[header] || '');
    }
}

// シングルトンインスタンス
const sheetsClient = new SheetsClient();

module.exports = sheetsClient;
