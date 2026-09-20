# Render デプロイ手順

このドキュメントでは、天気予報アプリをRenderにデプロイする手順を説明します。

## 前提条件

- GitHubアカウント
- Renderアカウント（[こちら](https://dashboard.render.com/)から登録）
- このリポジトリがGitHubにプッシュされていること

## デプロイ方法

### 方法1: GitHub連携（推奨）

1. **GitHubリポジトリを準備**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Render Dashboardにアクセス**
   - https://dashboard.render.com/ にアクセス
   - GitHubアカウントでログイン

3. **新しい静的サイトを作成**
   - 「New +」ボタンをクリック
   - 「Static Site」を選択

4. **リポジトリを接続**
   - 「Connect GitHub」をクリック（初回のみ）
   - デプロイしたいリポジトリを選択
   - 「Connect」をクリック

5. **設定を確認**
   - **Name**: 任意のサイト名（例: `weather-forecast-app`）
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Auto-Deploy**: `Yes`（推奨）

6. **デプロイ実行**
   - 「Create Static Site」ボタンをクリック
   - デプロイが完了するまで待機（通常2-5分）

7. **デプロイ完了**
   - デプロイが完了すると、サイトURLが発行されます
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

## 環境変数の設定

このアプリは環境変数を必要としませんが、必要に応じてRender Dashboardの「Environment」セクションで設定できます。

## カスタムドメインの設定

Renderでカスタムドメインを使用する場合：

1. Render Dashboardでサイトを選択
2. 「Settings」→「Custom Domains」に移動
3. 「Add Custom Domain」をクリック
4. ドメイン名を入力
5. DNS設定の指示に従って、ドメインレジストラでDNSレコードを設定

## 自動デプロイ

GitHubの`main`ブランチにプッシュすると、自動的にデプロイが実行されます。

## トラブルシューティング

### ビルドが失敗する場合

1. **ログを確認**
   - Render Dashboardでサイトの「Logs」セクションを確認
   - エラーメッセージを確認

2. **ローカルでビルドをテスト**
   ```bash
   npm install
   npm run build
   ```
   ローカルでビルドが成功することを確認

3. **Node.jsバージョン**
   - Renderは最新のLTSバージョンのNode.jsを使用
   - 特定のバージョンが必要な場合は、`.nvmrc`ファイルを追加

### サイトが表示されない場合

1. **デプロイステータスを確認**
   - Render Dashboardでデプロイが完了しているか確認

2. **キャッシュをクリア**
   - ブラウザのキャッシュをクリア
   - シークレットウィンドウでアクセス

3. **CORSエラー**
   - 気象庁APIはCORSを許可しているため、通常は問題ありません
   - 問題がある場合は、ブラウザのコンソールでエラーを確認

## 料金

RenderのStatic Siteは無料プランで利用可能です。

- **無料プラン**: 月100GBの帯域幅
- **詳細**: https://render.com/pricing

## サポート

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
