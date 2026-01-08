# リリース手順 v0.1 - AltStore配布

## 前提条件
- Flutter iOSアプリがビルド可能な環境（macOS + Xcode）
- Apple ID（無料アカウントでOK）
- AltStore/SideStoreがインストール済みのiOS端末

---

## 1. 署名証明書の準備

### 1.1 Xcodeで署名設定
1. macOSで `frontend/ios/Runner.xcworkspace` をXcodeで開く
2. **Signing & Capabilities**タブを選択
3. **Automatically manage signing**にチェック
4. **Team**で個人のApple IDを選択
5. **Bundle Identifier**を一意の値に設定（例: `com.yourname.medaka`）

### 1.2 確認事項
- [ ] 署名エラーが出ていない
- [ ] Provisioning Profileが自動生成されている

---

## 2. IPAファイルの作成

### 2.1 アーカイブ作成
1. Xcodeメニュー: **Product > Archive**
2. ビルド完了まで待機
3. Organizerウィンドウが開く

### 2.2 IPAエクスポート
1. アーカイブを選択し **Distribute App** をクリック
2. **Development** を選択
3. **Export** を選択
4. 保存先を指定（例: `~/Desktop/medaka.ipa`）

### 2.3 確認事項
- [ ] IPAファイルが生成されている
- [ ] ファイルサイズが極端に小さくない（目安: 10MB以上）

---

## 3. AltStoreでインストール

### 3.1 AltStoreの場合
1. PCとiOS端末を同じWi-Fiに接続
2. PC側でAltServerを起動
3. iOS端末でAltStoreを開く
4. **My Apps**タブで「＋」をタップ
5. 作成したIPAファイルを選択
6. インストール完了を待つ

### 3.2 SideStoreの場合
1. iOS端末でSideStoreを開く
2. **Apps**タブで「＋」をタップ
3. IPAファイルを選択（AirDrop/Files経由）
4. インストール完了を待つ

### 3.3 確認事項
- [ ] ホーム画面にアプリアイコンが表示される
- [ ] 起動・ログイン・CRUDが動作する
- [ ] 「信頼されていない開発者」エラー時は設定で信頼を付与

---

## 4. 動作確認チェックリスト

### 4.1 基本動作
- [ ] アプリ起動
- [ ] ログイン画面表示
- [ ] Google OAuthでログイン可能

### 4.2 品種機能
- [ ] 品種一覧表示
- [ ] 検索が動作
- [ ] 品種詳細表示
- [ ] 品種追加（Editor以上）

### 4.3 容器機能
- [ ] 容器一覧表示
- [ ] 容器作成
- [ ] 品種紐付け
- [ ] 個体数更新

### 4.4 権限
- [ ] Viewerは編集ボタンが表示されない
- [ ] Editorは品種・容器を編集できる
- [ ] Adminは監査ログを閲覧できる

### 4.5 オフライン
- [ ] オフライン時に前回取得データが表示される

---

## 5. トラブルシューティング

### 5.1 「信頼されていない開発者」エラー
1. 設定 > 一般 > VPNとデバイス管理
2. 自分のApple IDを選択
3. 「信頼」をタップ

### 5.2 「アプリが開けません」エラー
1. AltStore/SideStoreでアプリを削除
2. 再度IPAをインストール
3. 署名証明書の有効期限を確認（無料Apple IDは7日）

### 5.3 ビルドエラー
1. Xcodeで **Clean Build Folder**（Cmd+Shift+K）
2. Derived Dataを削除
3. 再度Archive

---

**作成日**: 2026-01-08
**バージョン**: 0.1
**次回更新**: 初回リリース後
