# PARALLAX — Optical Illusion Museum

GPT-5.6 Sol xhigh　製のブラウザで歩き回れる 3D 錯視ミュージアム。

## Ver.2

仮想の競合美術館 : Fable Optical Illusion Museum 
    体験ページ：https://maoku.github.io/FableOpticalIllusion/ 
    リポジトリ：https://github.com/Maoku/FableOpticalIllusion
を歩き回って行なった調査(Computer Useで実際に展示を撮影、評価)を基にリニューアル

その後、いくつかの展示のわかりにくさを指摘
実在の美術館の展示意図などを調査させて改善を行なったもの

※いくつかの表示不具合や、意図がわからない展示も残っている状態

## Ver.1

Docs/PLAN.md に基づいて作成したいわゆるポン出し状態


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
npm run test:e2e:ui
npm run test:e2e:spatial
```

各展示には `/?exhibit=muller-lyer` のような直接リンクでも入れます。展示IDは `src/exhibits/exhibitCatalog.ts` を参照してください。
`test:e2e:ui` は `?scene=off` で HTML インターフェースを高速検証し、`test:e2e:spatial` は WebGL を有効にして鑑賞点、歩行、シーン状態、代表描画を検証します。片方の成功をもう片方の代替にはしません。

## 配信

`npm run build` が生成する `dist/` を静的ホスティングへ配置します。`public/_redirects` と `public/_headers` は SPA フォールバック、セキュリティヘッダー、ハッシュ付きアセットの長期キャッシュを設定します。

# ライセンス

MIT