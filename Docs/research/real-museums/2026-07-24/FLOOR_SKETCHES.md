# 館内の視線と順路 — 平面スケッチ

調査日: 2026-07-24  
注意: すべて概念図であり縮尺図ではない。実在館の図は公式フロアマップ／公式案内から、設計判断に必要な関係だけを抽出した。teamLab Borderless は公式方針として地図を提供しないため、実在の部屋配置を推測していない。

## 1. National Gallery

```text
Trafalgar Square
       │
       ▼
┌─────────────────────────────┐
│ Sainsbury Wing 主入口       │
│ 明るい二層吹き抜け          │
│ 絵画の細部を見せる大型画面  │
└──────────────┬──────────────┘
               │ 大階段
               ▼
        [ Mud Sun / 最初の実作品 ]
               │
               ▼
┌─────────────────────────────┐
│ Level 2: 番号付き作品室群   │
│  room ↔ room ↔ room         │
│  座席 / ラベル / 任意ガイド │
└─────────────────────────────┘
```

視線の要点:

- 入口の情報はコレクションの代わりではなく、階段上の実作品へ視線を送る。
- 作品室は番号と地図で選べるが、室内では作品が視界の主役になる。
- 座席と大判ラベルガイドは作品室内にあるが、作品面へ重ならない別要素である。

PARALLAX への対応:

- 入口大型画面の役割を、分解状態の `PARALLAX BLOOM` 自体に担わせる。
- ゾーンポータルは文字だけでなく、その先の作品へ視線を通す。

## 2. Exploratorium

```text
Embarcadero / Entrance
       │
       ▼
┌──────────┬───────────┬──────────────┬──────────────┬─────────┐
│ Human    │ Tinkering │ Seeing &     │ Living       │ Bay     │
│ Phenomena│ / Cross   │ Listening    │ Systems      │ Observe │
└──────────┴───────────┴──────────────┴──────────────┴─────────┘
         ↕ 複数の短い展示を自由に選ぶ ↕           → Terrace
```

視線と滞留の要点:

- 長い建物をギャラリー単位で分節しながら、館内では多数の短い操作を自由に選べる。
- 大空間では複数の操作が同時進行する。囲われた Tinkering Studio とベンチは、長く試す活動の小さな退避領域になる。
- `Seeing & Listening` は光・視覚・音・聴覚という予告をゾーン名自体が持つ。

PARALLAX への対応:

- CLASSICS LAB は6点を一度に比較できる一列ギャラリーを維持する。
- 注視／動きなど時間のかかる展示だけ、通過レーンから一歩引いた凹みへ置く。

## 3. teamLab Borderless

```text
            [作品が別空間へ移動]
                  ↗
[入口] → [連続する暗い空間] ↔ [作品同士が混ざる]
                  ↘
         [休憩場所 / 任意のアプリ解説]

※実際の部屋接続を表す図ではない。
  「地図なし・固定キャプションなし」という情報設計の概念図。
```

視線と情報の要点:

- 道順ではなく、作品の移動と光が次の発見を作る。
- 固定キャプションを視界へ置かず、詳細は近傍作品を認識するアプリへ分ける。
- 完全な無案内ではなく、休憩場所、スタッフ、安全注意、アプリが補助する。

PARALLAX への対応:

- 詳細 HUD を減らすが、任意マップとアクセシビリティ支援は削らない。
- 近傍作品判定を interaction anchor と視線へ結びつける。

## 4. Camera Obscura & World of Illusions

```text
Floor 6  [Camera Obscura Show] [Rooftop / 退出前の眺望]
   ▲
Floor 5  [Magic Gallery / Shadow Wall / Light Dancer]
   ▲
Floor 4  [Light Fantastic / Ames Room] [Quiet Space] [別出口]
   ▲
Floor 3  [Eye Spy / mirrors / cameras / Infinity Corridor]
   ▲
Floor 2  [Bewilderworld / Mirror Maze / Vortex] --迂回可-->
   ▲
Ground   [Entrance / Shop / AutoWed / Giant Kaleidosphere]
```

視線と順路の要点:

- 入館階ですぐに展示の性格を見せ、各階では体験形式を変える。
- 上階の Camera Obscura show は時刻を割り当て、到着までの時間を調整できる。
- Vortex は迂回でき、Floor 4 には静かな部屋と別出口がある。
- 明瞭な垂直順路の代償として、エレベーターがなく車椅子で展示階を回れない。

PARALLAX への対応:

- ゾーンごとの主行為を変える。
- 明瞭な順路だけを借り、アクセス不能という欠点は再現しない。

## 5. 現行 PARALLAX 2.0 の座標スケッチ

開始カメラ: `[0, 1.7, 8]`、初期視線: `-Z` 方向。  
展示座標は `src/exhibits/exhibitCatalog.ts`、建築は `src/scene/museum/*` に基づく。

```text
                         -Z / 奥
┌──────────────────────────────────────────────────────────┐
│                 PARALLAX SIGNATURE HALL                  │
│ x=-6 Bloom | x=0 Echo | x=6 Folded | x=12 Counter       │ z=-17
│                    [portal / z=-11.1]                    │
│                                              Ames        │ (18,-9)
│                                                          │
│     ARRIVAL ATRIUM / suspended bloom                     │
│     center landmark (0, 1.5)              SCALE + LIGHT │
│                                              Shadow      │ (18,8)
│     Start / Entry camera (0,8), looking toward -Z        │
│                    [portal / z=11.2]                     │
│                 CLASSICS LAB 6 panels                    │ z=16.9
└──────────────────────────────────────────────────────────┘
                         +Z / 入口側
```

現状の問題:

- SIGNATURE、SCALE + LIGHT、CLASSICS は同一の大空間を座標と床色で区切るため、遠景で「次室」が読み取りにくい。
- SIGNATURE と CLASSICS は壁面側で終わり、入口へ戻る以外の回遊意図が弱い。
- view spot は展示中心から離れるが、フォーカス判定は展示中心距離を使う。
- CLASSICS は6枚の壁面として一覧できる一方、実際の主効果ではなく簡略図である。

## 6. 推奨する PARALLAX 2.0 平面

現行座標を大きく破壊せず、右回りの主ループと中央短絡を建築・床・光で明示する。

```text
                         -Z / 奥
┌──────────────────────────────────────────────────────────┐
│  [Bloom] [Echo] [Folded] [Counter] ───────┐             │
│       SIGNATURE: 作品間に観察・追越し帯    │             │
│        ▲                         側路 ─────┼→ [Ames]     │
│        │                                  │      │      │
│        │          中央バイパス             │      ▼      │
│        │     ┌─────────────────────┐       │  [Shadow]   │
│        └─────┤ ARRIVAL / LANDMARK  ├───────┘      │      │
│              │ 入口・帰還・支援    │              ▼      │
│              └─────────┬───────────┘      CLASSICS 6点   │
│                        │                         │        │
│                     ENTRY ◄──── RETURN / EXIT ◄─┘        │
└──────────────────────────────────────────────────────────┘
                         +Z / 入口側
```

### 主経路

1. ENTRY から作品を見たまま ARRIVAL へ入る。
2. LANDMARK に引かれて SIGNATURE へ進む。
3. SIGNATURE 東側の側路から SCALE + LIGHT へ移る。
4. Shadow から CLASSICS へ抜ける。
5. CLASSICS の端から ENTRY／ARRIVAL へ戻り、結果を見るか終了する。

### 自由探索と迂回

- ARRIVAL から SIGNATURE、SCALE + LIGHT、CLASSICS へ直接行ける。
- SIGNATURE の動き展示を避けても SCALE + LIGHT と CLASSICS に到達できる。
- 色順応や運動誘発盲をスキップしても、退出とパスポート生成を妨げない。
- すべての展示で、参加領域の背後または横に観察位置を置き、主通路を鑑賞点にしない。

### 各ゾーンの見通し契約

| 視点 | 必ず見えるもの | 見せないもの |
| --- | --- | --- |
| ENTRY | 分解花、SIGNATURE の色／輪郭 | モーダル、パスポート、全展示一覧 |
| ARRIVAL 中央 | SIGNATURE 1点、SCALE + LIGHT の暖色、CLASSICS の複数枠 | 長文解説 |
| SIGNATURE 閾 | 4点のうち最低1点の成立前状態、東側路 | 作品を覆う HUD |
| SCALE + LIGHT 閾 | 円柱＋影または Ames 開口、CLASSICS 方向の予告 | 物理値カード |
| CLASSICS 閾 | 6点の異なる主効果、帰還方向 | 全画面遷移の必須ボタン |
| RETURN | 今回の代表結果1枚、終了、再訪候補 | 未完了を責める進捗演出 |

