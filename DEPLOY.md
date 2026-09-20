# Render Web Service デプロイ手順

このドキュメントでは、天気予報アプリをRenderのWeb Serviceとしてデプロイする手順を説明します。

## 前提条件

- GitHubアカウント
- Renderアカウント（[こちら](https://dashboard.render.com/)から登録）
- このリポジトリがGitHubにプッシュされていること

## アーキテクチャ

このアプリは以下の構成でデプロイされます：

- **フロントエンド**: React + Vite（ビルド済み静的ファイル）
- **バックエンド**: Express.js サーバー
- **配信**: Render Web Service（Node.js環境）

## デプロイ方法

### 方法1: GitHub連携（推奨）

1. **GitHubリポジトリを準備**
   ```bash
   git add .
   git commit -m "Add Render Web Service deployment config"
   git push origin main
   ```

2. **Render Dashboardにアクセス**
   - https://dashboard.render.com/ にアクセス
   - GitHubアカウントでログイン

3. **新しいWeb Serviceを作成**
   - 「New +」ボタンをクリック
   - 「Web Service」を選択

4. **リポジトリを接続**
   - 「Connect GitHub」をクリック（初回のみ）
   - デプロイしたいリポジトリを選択
   - 「Connect」をクリック

5. **設定を確認**
   - **Name**: 任意のサービス名（例: `weather-forecast-app`）
   - **Region**: 希望するリージョン（例: Singapore, Oregonなど）
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`（無料プラン）

6. **環境変数の設定**
   - 「Advanced」セクションをクリック
   - 以下の環境変数を追加：
     - `NODE_ENV`: `production`
     - `PORT`: `3000`

7. **デプロイ実行**
   - 「Create Web Service」ボタンをクリック
   - デプロイが完了するまで待機（通常3-7分）

8. **デプロイ完了**
   - デプロイが完了すると、サービスURLが発行されます
   - 例: `https://weather-forecast-app.onrender.com`

### 方法2: Blueprint使用（render.yaml）

`render.yaml`ファイルが既に設定されているため、より簡単にデプロイできます。

1. **Render Dashboardにアクセス**
   - https://dashboard.render.com/ にアクセス

2. **Blueprint Instanceを作成**
   - 「New +」ボタンをクリック
   - 「Blueprint Instance」を選択

3. **GitHubリポジトリを接続**
   - リポジトリを選択して接続

4. **自動デプロイ**
   - `render.yaml`の設定が自動的に読み込まれます
   - デプロイが自動的に開始されます

## ローカルでのテスト

デプロイ前に、ローカルでWeb Serviceとして動作確認できます。

```bash
# 依存関係のインストール
npm install

# プロダクションビルド
npm run build

# サーバーを起動
node server.js

# ブラウザで http://localhost:3000 にアクセス
```

## 環境変数

### 必須環境変数

- `PORT`: サーバーがリッスンするポート番号（Renderが自動的に設定）
- `NODE_ENV`: 環境モード（`production`を推奨）

### 任意の環境変数

必要に応じて追加できますが、このアプリでは環境変数は不要です。

## カスタムドメインの設定

Renderでカスタムドメインを使用する場合：

1. Render Dashboardでサービスを選択
2. 「Settings」→「Custom Domains」に移動
3. 「Add Custom Domain」をクリック
4. ドメイン名を入力
5. DNS設定の指示に従って、ドメインレジストラでDNSレコードを設定

## 自動デプロイ

GitHubの`main`ブランチにプッシュすると、自動的にデプロイが実行されます。

## トラブルシューティング

### ビルドが失敗する場合

1. **ログを確認**
   - Render Dashboardでサービスの「Logs」セクションを確認
   - エラーメッセージを確認

2. **ローカルでビルドをテスト**
   ```bash
   npm install
   npm run build
   node server.js
   ```
   ローカルでビルドとサーバー起動が成功することを確認

3. **Node.jsバージョン**
   - Renderは最新のLTSバージョンのNode.jsを使用
   - 特定のバージョンが必要な場合は、`.nvmrc`ファイルを追加（既に追加済み）

### サーバーが起動しない場合

1. **startCommandを確認**
   - Render Dashboardの「Settings」で`node server.js`が設定されているか確認

2. **ポート設定を確認**
   - Renderが自動的に`PORT`環境変数を設定します
   - `server.js`で`process.env.PORT`を使用していることを確認

3. **ログを確認**
   - Render Dashboardで「Logs」セクションを確認
   - エラーメッセージを確認

### サイトが表示されない場合

1. **デプロイステータスを確認**
   - Render Dashboardでデプロイが完了しているか確認

2. **ヘルスチェック**
   - Renderは自動的にヘルスチェックを実行します
   - 「Health Check Path」が`/`に設定されていることを確認

3. **キャッシュをクリア**
   - ブラウザのキャッシュをクリア
   - シークレットウィンドウでアクセス

### 無料プランの制限

Renderの無料プランには以下の制限があります：

- **スリープモード**: 15分間リクエストがないとスリープする
- **初回アクセス**: スリープ後、初回アクセスに30秒程度かかる
- **月間実行時間**: 750時間/月

これらの制限を回避するには、有料プラン（$7/月〜）へのアップグレードを検討してください。

## スケーリング

### 手動スケーリング

Render Dashboardでインスタンス数を手動で変更できます。

### 自動スケーリング

有料プランでは、自動スケーリングを設定できます。

## モニタリング

Render Dashboardで以下のメトリクスを確認できます：

- CPU使用率
- メモリ使用率
- リクエスト数
- レスポンスタイム
- エラー率

## セキュリティ

### HTTPS

Renderは自動的にHTTPSを提供します。追加の設定は不要です。

### 環境変数の管理

機密情報は必ず環境変数として設定し、コードにハードコーディングしないでください。

## コスト

### 無料プラン

- 月750時間の実行時間
- 15分のアイドル時間でスリープ
- 個人プロジェクトやテスト用途に適しています

### 有料プラン

- $7/月〜
- スリープなし
- より多くのリソース
- 本番環境に適しています

## サポート

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [Render Status](https://status.render.com/)

## 追加情報

### server.jsのカスタマイズ

必要に応じて、`server.js`に以下の機能を追加できます：

- CORS設定
- レート制限
- ログ出力
- エラーハンドリング
- APIエンドポイント

### 本番環境のベストプラクティス

1. **ヘルスチェックエンドポイントの追加**
   ```javascript
   app.get('/health', (req, res) => {
     res.status(200).json({ status: 'ok' });
   });
   ```

2. **ログの構造化**
   - JSON形式でログを出力
   - ログレベルの設定

3. **エラーハンドリング**
   - グローバルエラーハンドラーの追加
   - 404ハンドラーの追加

4. **セキュリティヘッダー**
   - Helmetミドルウェアの使用

これらの機能は必要に応じて追加してください。
