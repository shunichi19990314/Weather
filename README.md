# 🌤️ 天気予報アプリ

気象庁の天気データを取得して表示するWebアプリケーションです。位置情報を自動取得し、現在地の天気をリアルタイムで表示します。

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ 機能

- 📍 **位置情報自動取得** - 現在地の天気を自動表示
- 🌤️ **天気予報** - 今日・明日・明後日の天気をカード形式で表示
- 🗺️ **地域選択** - 全国47都道府県から手動選択可能
- 📋 **週間予報解説** - 気象庁の解説情報を表示
- 📱 **レスポンシブ** - モバイル・タブレット・デスクトップ対応

## 🚀 クイックスタート

### ローカルで動かす

```bash
# 1. リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/weather-app.git
cd weather-app

# 2. 依存関係をインストール
npm install

# 3. 開発サーバーを起動
npm run dev

# 4. ブラウザで http://localhost:3000 を開く
```

### Renderにデプロイ（3分で完了！）

**詳細な手順は [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) を参照してください。**

#### 簡単3ステップ：

1. **GitHubにプッシュ**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Render Dashboardで「New Web Service」を作成**
   - [Render Dashboard](https://dashboard.render.com/)にアクセス
   - 「New +」→「Web Service」
   - GitHubリポジトリを接続

3. **設定を入力**
   - Build Command: `npm install && npm run build`
   - Start Command: `node server.js`
   - 「Create Web Service」をクリック

✅ 3〜7分でデプロイ完了！URLが発行されます。

## 🛠️ 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フロントエンド | React 18 + TypeScript |
| ビルドツール | Vite |
| スタイリング | Tailwind CSS |
| バックエンド | Express.js |
| API | 気象庁API |
| 位置情報 | OpenStreetMap Nominatim |
| デプロイ | Render |

## 📁 プロジェクト構成

```
.
├── src/
│   ├── App.tsx                 # メインアプリケーション
│   ├── components/
│   │   ├── WeatherCard.tsx     # 天気予報カード
│   │   ├── WeeklyOverview.tsx  # 週間予報解説
│   │   └── RegionSelector.tsx  # 地域選択
│   ├── hooks/
│   │   ├── useWeather.ts       # 天気データ取得
│   │   └── useGeolocation.ts   # 位置情報取得
│   ├── data/
│   │   └── prefectures.ts      # 都道府県データ
│   └── utils/
│       └── weather.ts          # ユーティリティ
├── server.js                   # Express サーバー
├── render.yaml                 # Render設定
└── package.json
```

## 📖 使い方

### 位置情報を許可

1. ページを開くと、ブラウザが位置情報の許可を求めます
2. 「許可」をクリック
3. 現在地の天気予報が自動表示されます

### 地域を手動で選択

1. 「🗺️ 地域を手動で選択」ボタンをクリック
2. 都道府県を選択
3. 選択した地域の天気予報が表示されます

### 現在地に戻る

1. 「📍 現在地の天気に戻る」ボタンをクリック
2. 位置情報ベースの表示に戻ります

## 🔧 利用可能なコマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# ビルドファイルをプレビュー
npm run preview

# サーバー起動（本番環境）
node server.js

# 型チェック
npm run typecheck
```

## 📡 データソース

- **天気予報**: [気象庁](https://www.jma.go.jp/)（オープンデータ）
- **位置情報**: [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/)

## ⚠️ 注意事項

- 位置情報の利用にはブラウザでの許可が必要です
- 気象庁APIはCORSを許可していますが、ネットワーク環境によってはアクセスできない場合があります
- 無料のRenderプランでは、15分間のアイドル時間でスリープします

## 🤝 貢献

プルリクエストやイシューを歓迎します！

## 📄 ライセンス

このプロジェクトは[MITライセンス](./LICENSE)の下で公開されています。

## 🔗 リンク

- [デプロイガイド](./DEPLOY_GUIDE.md) - 詳細なデプロイ手順
- [気象庁](https://www.jma.go.jp/) - データ提供元
- [Render](https://render.com/) - デプロイプラットフォーム

---

Made with ❤️ by [Your Name]
