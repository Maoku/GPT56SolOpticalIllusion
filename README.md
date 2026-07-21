# PARALLAX — Optical Illusion Museum

ブラウザで歩き回り、10種類の錯視を操作して確かめる一人称視点の3Dミュージアムです。展示のヒントは来場者が明示的に開くまで表示されません。

## 開発

Node.js 22 以上を使用します。

```bash
npm install
npm run dev
```

品質確認は次のコマンドで実行できます。

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run verify:size
npm run test:e2e
```

各展示には `/?exhibit=muller-lyer` のような直接リンクでも入れます。展示IDは `src/exhibits/exhibitCatalog.ts` を参照してください。
WebGL を使えない自動テスト環境では `?scene=off` を指定すると HTML インターフェースだけを検証できます。

## 配信

`npm run build` が生成する `dist/` を静的ホスティングへ配置します。`public/_redirects` と `public/_headers` は SPA フォールバック、セキュリティヘッダー、ハッシュ付きアセットの長期キャッシュを設定します。
