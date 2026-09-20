# 🚀 Render デプロイ手順（超簡単ガイド）

このガイドでは、天気予報アプリをRenderにデプロイする手順を、初心者にも分かりやすく解説します。

## 📋 必要なもの

- ✅ GitHubアカウント（持っていない場合は[こちら](https://github.com/signup)から作成）
- ✅ Renderアカウント（持っていない場合は[こちら](https://dashboard.render.com/register)から作成）
- ✅ このプロジェクトのコードがGitHubにアップロードされていること

---

## 🎯 ステップ1: GitHubにコードをアップロード

### 1-1. GitHubで新しいリポジトリを作成

1. [GitHub](https://github.com)にログイン
2. 右上の「+」ボタン → 「New repository」をクリック
3. 以下のように入力：
   - **Repository name**: `weather-app`（または好きな名前）
   - **Description**: 「天気予報アプリ」
   - **Public** を選択
   - 「Create repository」をクリック

### 1-2. ローカルのコードをGitHubにプッシュ

ターミナル（コマンドプロンプト）を開いて、以下のコマンドを順番に実行：

```bash
# Gitの初期化（まだの場合）
git init

# ファイルをステージング
git add .

# 最初のコミット
git commit -m "Initial commit"

# メインブランチをmainに設定
git branch -M main

# GitHubのリポジトリをリモートとして追加（YOUR_USERNAMEをあなたのGitHubユーザー名に置き換え）
git remote add origin https://github.com/YOUR_USERNAME/weather-app.git

# GitHubにプッシュ
git push -u origin main
```

💡 **ヒント**: `YOUR_USERNAME` はあなたのGitHubユーザー名に置き換えてください。

---

## 🎯 ステップ2: Renderでデプロイ

### 2-1. Render Dashboardにアクセス

1. [Render Dashboard](https://dashboard.render.com/)にアクセス
2. GitHubアカウントでログイン（まだの場合は「Sign up」からアカウント作成）

### 2-2. 新しいWeb Serviceを作成

1. Dashboard画面の右上「**New +**」ボタンをクリック
2. 「**Web Service**」を選択

### 2-3. GitHubリポジトリを接続

1. 「**Connect GitHub**」ボタンをクリック（初回のみ）
2. GitHubの認証画面が表示されるので「**Authorize Render**」をクリック
3. デプロイしたいリポジトリ（`weather-app`）の「**Connect**」ボタンをクリック

### 2-4. サービス設定

以下のように入力してください：

#### 基本設定
- **Name**: `weather-forecast-app`（または好きな名前）
- **Region**: `Singapore`（日本から近い）
- **Branch**: `main`
- **Root Directory**: 空欄（変更しない）
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `node server.js`

#### インスタンスタイプ
- **Instance Type**: `Free`（無料プラン）を選択

### 2-5. 環境変数の設定

1. 「**Advanced**」セクションをクリックして展開
2. 「**Add Environment Variable**」をクリック
3. 以下の2つを追加：

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

### 2-6. デプロイ実行

1. 画面下部の「**Create Web Service**」ボタンをクリック
2. デプロイが開始されます（3〜7分程度かかります）
3. ログ画面でビルドの進行状況を確認できます

### 2-7. デプロイ完了！

- ビルドが成功すると「**Live**」と表示されます
- 画面上部にURLが表示されます（例: `https://weather-forecast-app.onrender.com`）
- このURLをクリックして、アプリが正常に動作するか確認してください！

---

## ✅ 動作確認

デプロイが完了したら、以下の手順で動作確認を行います：

1. 発行されたURLにアクセス
2. ブラウザが位置情報の許可を求めてくるので「許可」をクリック
3. 現在地の天気予報が表示されることを確認
4. 地域を選択して、他の地域の天気も確認できることを確認

---

## 🔄 自動デプロイについて

一度デプロイすると、GitHubの`main`ブランチにコードをプッシュするたびに、**自動的に再デプロイ**されます。

```bash
# コードを変更した後
git add .
git commit -m "変更内容の説明"
git push origin main
```

これだけで、Renderが自動的に新しいバージョンをデプロイしてくれます！

---

## 🐛 トラブルシューティング

### ❌ 問題: ビルドが失敗する

**確認事項:**
1. Render Dashboardの「Logs」セクションでエラーメッセージを確認
2. ローカルでビルドが成功するか確認：
   ```bash
   npm install
   npm run build
   ```

**よくある原因:**
- `package.json`のスクリプトが正しくない
- 依存関係がインストールされていない

### ❌ 問題: サーバーが起動しない

**確認事項:**
1. Render Dashboardの「Settings」→「Build & Deploy」で以下を確認：
   - Build Command: `npm install && npm run build`
   - Start Command: `node server.js`

2. 「Logs」でエラーメッセージを確認

### ❌ 問題: サイトが表示されない

**確認事項:**
1. デプロイが完了しているか確認（「Live」ステータス）
2. ブラウザのキャッシュをクリア（Ctrl+Shift+R または Cmd+Shift+R）
3. シークレットウィンドウでアクセスしてみる

### ❌ 問題: 位置情報が取得できない

**原因:**
- ブラウザが位置情報をブロックしている
- HTTPSではない環境（Renderは自動的にHTTPSを提供）

**解決方法:**
- ブラウザの設定で位置情報を許可
- 「手動で地域を選択」ボタンを使用

### ❌ 問題: 無料プランでスリープする

**症状:**
- 15分間アクセスがないとスリープする
- 初回アクセスに30秒程度かかる

**解決方法:**
- 有料プラン（$7/月）にアップグレード
- または、[UptimeRobot](https://uptimerobot.com/)などの無料サービスで定期的にアクセスする

---

## 💰 料金について

### 無料プラン
- ✅ 月額無料
- ✅ 月750時間の実行時間
- ⚠️ 15分間のアイドル時間でスリープ
- ⚠️ 初回アクセスに30秒程度かかる

### 有料プラン（$7/月〜）
- ✅ スリープなし
- ✅ 高速なレスポンス
- ✅ より多くのリソース
- ✅ 本番環境に適している

---

## 🌐 カスタムドメインの設定（オプション）

独自ドメインを使用したい場合：

1. Render Dashboardでサービスを選択
2. 「Settings」→「Custom Domains」
3. 「Add Custom Domain」をクリック
4. ドメイン名を入力（例: `weather.example.com`）
5. DNS設定の指示に従って、ドメインレジストラで設定

---

## 📞 サポート

問題が解決しない場合：

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [Render Status](https://status.render.com/)

---

## 🎉 お疲れ様でした！

これであなたの天気予報アプリが世界中からアクセスできるようになりました！

次のステップ：
- [ ] 友達にURLを共有
- [ ] SNSで紹介
- [ ] さらに機能を追加して改善

Happy coding! 🚀
