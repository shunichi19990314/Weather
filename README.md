# 天気予報アプリ

気象庁の天気データを取得して表示するWebアプリケーションです。位置情報を自動取得し、現在地の天気をリアルタイムで表示します。

## 機能

- 📍 **位置情報自動取得**: ブラウザの位置情報を使用して、現在地の天気を自動表示
- 🌤️ **天気予報表示**: 今日・明日・明後日の天気予報をカード形式で表示
- 🗺️ **地域選択**: 全国47都道府県から手動で地域を選択可能
- 📋 **週間予報解説**: 気象庁の週間予報解説情報を表示
- 📱 **レスポンシブデザイン**: モバイル・タブレット・デスクトップに対応
- 🚀 **Web Service対応**: RenderのWeb Serviceとしてデプロイ可能

## 技術スタック

- **フロントエンド**: React 18 + TypeScript + Vite
- **スタイリング**: Tailwind CSS
- **バックエンド**: Express.js
- **API**: 気象庁API（オープンデータ）
- **位置情報**: OpenStreetMap Nominatim API（逆ジオコーディング）
- **デプロイ**: Render Web Service

## デプロイ

### Render Web Service（推奨）

`render.yaml`ファイルが設定されているため、Renderで簡単にデプロイできます。

詳細な手順は [DEPLOY.md](./DEPLOY.md) を参照してください。

#### クイックデプロイ

1. このリポジトリをGitHubにプッシュ
2. [Render Dashboard](https://dashboard.render.com/)にアクセス
3. 「New +」→「Web Service」を選択
4. GitHubリポジトリを接続
5. 以下の設定を確認：
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
6. 「Create Web Service」をクリック

### ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動（Vite）
npm run dev

# プロダクションビルド
npm run build

# Web Serviceとして起動（本番環境）
node server.js
```

## プロジェクト構成

```
.
├── src/
│   ├── App.tsx                 # メインアプリケーション
│   ├── main.tsx                # エントリーポイント
│   ├── index.css               # グローバルスタイル
│   ├── components/
│   │   ├── WeatherCard.tsx     # 天気予報カード
│   │   ├── WeeklyOverview.tsx  # 週間予報解説
│   │   └── RegionSelector.tsx  # 地域選択コンポーネント
│   ├── data/
│   │   └── prefectures.ts      # 都道府県データ
│   ├── hooks/
│   │   ├── useWeather.ts       # 天気データ取得フック
│   │   └── useGeolocation.ts   # 位置情報取得フック
│   ├── types/
│   │   └── weather.ts          # 型定義
│   └── utils/
│       └── weather.ts          # 天気ユーティリティ
├── public/
│   ├── _headers                # セキュリティヘッダー
│   └── _redirects              # リダイレクト設定
├── server.js                   # Express サーバー
├── render.yaml                 # Render Blueprint設定
├── DEPLOY.md                   # デプロイ手順
└── README.md                   # このファイル
```

## データソース

- **天気予報**: [気象庁](https://www.jma.go.jp/)
- **位置情報**: OpenStreetMap Nominatim

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 貢献

プルリクエストやイシューを歓迎します。

## 注意事項

- 位置情報の利用には、ブラウザでの許可が必要です
- 気象庁APIはCORSを許可していますが、ネットワーク環境によってはアクセスできない場合があります
- 無料のRenderプランでは、15分間のアイドル時間でスリープします
