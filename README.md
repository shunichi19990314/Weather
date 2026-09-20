# 天気予報アプリ

気象庁の天気データを取得して表示するWebアプリケーションです。

## 機能

- 📍 **位置情報自動取得**: ブラウザの位置情報を使用して、現在地の天気を自動表示
- 🌤️ **天気予報表示**: 今日・明日・明後日の天気予報をカード形式で表示
- 🗺️ **地域選択**: 全国47都道府県から手動で地域を選択可能
- 📋 **週間予報解説**: 気象庁の週間予報解説情報を表示
- 📱 **レスポンシブデザイン**: モバイル・タブレット・デスクトップに対応

## デプロイ

### Renderでのデプロイ手順

#### 方法1: GitHub連携（推奨）

1. このリポジトリをGitHubにプッシュ
2. [Render Dashboard](https://dashboard.render.com/)にアクセス
3. 「New Static Site」をクリック
4. GitHubリポジトリを選択
5. 以下の設定を確認:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
6. 「Create Static Site」をクリック

#### 方法2: Blueprint使用

`render.yaml`ファイルが既に設定されているため、Render Dashboardで「New Blueprint Instance」を選択するだけでデプロイできます。

### ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build

# ビルドファイルのプレビュー
npm run preview
```

## 技術スタック

- React 18
- TypeScript
- Vite
- Tailwind CSS
- 気象庁API（オープンデータ）
- OpenStreetMap Nominatim API（逆ジオコーディング）

## データソース

- **天気予報**: [気象庁](https://www.jma.go.jp/)
- **位置情報**: OpenStreetMap Nominatim

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
