# 次に投げる差分プロンプト（3本）

## プロンプト1: Backend実装開始

```
QUESTIONS.mdの確認事項のうち、以下を決定しました：
- Cloud Runを使用（Node.js + Express）
- JWT秘密鍵はCloud Secret Managerで管理
- 初回ログインユーザーはViewer、最初のAdminは手動でSheets追加
- 系統は固定リスト（ヒカリ体型/普通体型/ダルマ体型/半ダルマ）
- 品種削除時、容器に紐付いていたら409エラーを返す

IMPLEMENTATION_PLAN.mdのP0-4〜P0-11を実装してください。
- プロジェクト構成（ディレクトリ・package.json）
- Google Sheets APIクライアント
- 品種・容器のCRUD API
- JWT認証・権限チェックミドルウェア

完了後、Postmanでテストできる状態にしてください。
```

---

## プロンプト2: iOS実装開始

```
Backend APIが完成しました（エンドポイント: https://medaka-api-xxxxx.run.app/v1）。

IMPLEMENTATION_PLAN.mdのP0-12〜P0-23を実装してください。
- Xcodeプロジェクト作成（Bundle ID: com.yourname.medaka）
- API通信基盤（URLSession + JWT保存）
- 品種・容器の全画面（一覧・詳細・編集）
- Google OAuth連携

SCREEN_DESIGN.mdに従い、以下を重視してください：
- 文字サイズ最小16pt
- タップ領域最小44x44pt
- VoiceOverラベル設定

完了後、シミュレータで動作確認できる状態にしてください。
```

---

## プロンプト3: テスト＆リリース準備

```
iOS実装が完了しました。

以下を実施してください：
1. IMPLEMENTATION_PLAN.mdのP0-24〜P0-27（テスト＋リリース）
2. PRD_v0.1.mdの受入基準を全てチェック
3. RELEASE_GUIDE.mdに従ってIPAを作成
4. 実機でインストール・動作確認

問題があれば報告し、なければREADME.mdを作成して完了としてください。
README.mdには以下を含めてください：
- プロジェクト概要
- インストール手順（AltStore）
- 使い方（スクリーンショット付き）
- 開発者向け情報（Backend/iOS環境構築）
```

---

**使い方**:
1. プロンプト1を投げてBackend完成を待つ
2. プロンプト2を投げてiOS完成を待つ
3. プロンプト3を投げてリリース準備完了

各プロンプトの前に、QUESTIONS.mdの該当項目を確認・決定してください。

---

**作成日**: 2026-01-08  
**バージョン**: 0.1
