import type { ComponentType } from 'react'

export type ExhibitType =
  | 'muller-lyer'
  | 'ponzo'
  | 'ebbinghaus'
  | 'cafe-wall'
  | 'checker-shadow'
  | 'necker-cube'
  | 'motion-induced-blindness'
  | 'ames-room'
  | 'parallax-bloom'
  | 'chromatic-echo-corridor'

export type ExhibitDefinition = {
  id: ExhibitType
  number: number
  title: string
  subtitle: string
  isOriginal: boolean
  prompt: string
  hint: { summary: string; explanation: string }
  position: [number, number, number]
  rotation: [number, number, number]
  interactionDistance: number
  zone: 'geometry' | 'light' | 'space'
  accent: string
  interaction: {
    mode: 'drag' | 'slider' | 'gaze' | 'viewpoint' | 'hybrid'
    instructions: string
    supportsReducedMotion: boolean
  }
  component?: ComponentType
}

export const exhibitCatalog: ExhibitDefinition[] = [
  {
    id: 'muller-lyer', number: 1, title: 'ミュラー・リヤー錯視', subtitle: 'MEASURE TWICE',
    isOriginal: false, prompt: '上と下、どちらの線が長く見えますか？',
    hint: { summary: '矢羽の向きだけに注目してください。', explanation: '外向きと内向きの矢羽が、同じ長さの線を異なる長さとして知覚させます。' },
    position: [-12, 1.55, 16.9], rotation: [0, Math.PI, 0], interactionDistance: 4.8,
    zone: 'geometry', accent: '#7ef4d2', interaction: { mode: 'drag', instructions: '下の線を動かして同じ長さに見える位置を探します。', supportsReducedMotion: true },
  },
  {
    id: 'ponzo', number: 2, title: 'ポンゾ錯視', subtitle: 'THE DISTANT LINE',
    isOriginal: false, prompt: '同じ長さの線が、なぜ遠くで大きく見える？',
    hint: { summary: '線路のような収束線を隠して想像してください。', explanation: '奥行きの手がかりが、遠くにあると解釈した物体の大きさを補正します。' },
    position: [-6, 1.55, 16.9], rotation: [0, Math.PI, 0], interactionDistance: 4.8,
    zone: 'geometry', accent: '#9ae98d', interaction: { mode: 'slider', instructions: '線を奥行き方向へ動かします。', supportsReducedMotion: true },
  },
  {
    id: 'ebbinghaus', number: 3, title: 'エビングハウス錯視', subtitle: 'SOCIAL CIRCLES',
    isOriginal: false, prompt: '中央の円は、本当に同じ大きさ？',
    hint: { summary: '中央円ではなく、その周囲を比べます。', explanation: '周囲の円との相対比較により、等しい中央円が違う大きさに見えます。' },
    position: [6, 1.55, 16.9], rotation: [0, Math.PI, 0], interactionDistance: 4.8,
    zone: 'geometry', accent: '#f6c76e', interaction: { mode: 'slider', instructions: '右の中央円を調整します。', supportsReducedMotion: true },
  },
  {
    id: 'cafe-wall', number: 4, title: 'カフェウォール錯視', subtitle: 'PARALLEL, APPARENTLY',
    isOriginal: false, prompt: '水平な目地が傾いて見えませんか？',
    hint: { summary: '白黒タイルの境界から少し離れて見ます。', explanation: 'ずれた明暗の境界と細い目地の組み合わせが、平行線を傾いて知覚させます。' },
    position: [12, 1.55, 16.9], rotation: [0, Math.PI, 0], interactionDistance: 4.8,
    zone: 'geometry', accent: '#ff9c7c', interaction: { mode: 'slider', instructions: '行のずれと目地を変えます。', supportsReducedMotion: true },
  },
  {
    id: 'checker-shadow', number: 5, title: 'チェッカーシャドウ', subtitle: 'SAME SHADE',
    isOriginal: false, prompt: 'A と B は違う明るさに見えますか？',
    hint: { summary: '周囲を指で隠すとどうでしょう。', explanation: '脳が影を補正するため、同じ色のタイルを違う明るさとして知覚します。' },
    position: [18.2, 1.55, 8], rotation: [0, -Math.PI / 2, 0], interactionDistance: 4.8,
    zone: 'light', accent: '#ffe08a', interaction: { mode: 'drag', instructions: '影の位置を動かします。', supportsReducedMotion: true },
  },
  {
    id: 'necker-cube', number: 6, title: 'ネッカーキューブ', subtitle: 'FRONT / BACK',
    isOriginal: false, prompt: '手前の面を、意志で反転できますか？',
    hint: { summary: '交差する辺の前後関係を入れ替えて見ます。', explanation: '奥行き手がかりのない線画は、2通りの立体解釈を行き来します。' },
    position: [18.2, 1.55, 1], rotation: [0, -Math.PI / 2, 0], interactionDistance: 4.8,
    zone: 'light', accent: '#b5a6ff', interaction: { mode: 'drag', instructions: '回転し、面の解釈を切り替えます。', supportsReducedMotion: true },
  },
  {
    id: 'motion-induced-blindness', number: 7, title: '運動誘発盲', subtitle: 'NOW YOU SEE IT',
    isOriginal: false, prompt: '中央を見つめると、黄色い点は残りますか？',
    hint: { summary: '中央だけを見て、周辺の点を追わないでください。', explanation: '動く背景の中で周辺視野の静止刺激が意識から消えることがあります。' },
    position: [18.2, 1.55, -7], rotation: [0, -Math.PI / 2, 0], interactionDistance: 4.8,
    zone: 'light', accent: '#ecf26b', interaction: { mode: 'gaze', instructions: '背景速度とターゲット数を変更します。', supportsReducedMotion: false },
  },
  {
    id: 'ames-room', number: 8, title: 'エイムズの部屋', subtitle: 'A CROOKED ROOM',
    isOriginal: false, prompt: '同じ背丈の二人に見えますか？',
    hint: { summary: '部屋が長方形だという前提を疑います。', explanation: '歪んだ床と壁を固定視点から見ることで、人物の大きさが違うように見えます。' },
    position: [9, 1.55, -17], rotation: [0, 0, 0], interactionDistance: 5.2,
    zone: 'space', accent: '#ff8fa6', interaction: { mode: 'viewpoint', instructions: '人物と鑑賞点を切り替えます。', supportsReducedMotion: true },
  },
  {
    id: 'parallax-bloom', number: 9, title: '視差の花', subtitle: 'PARALLAX BLOOM',
    isOriginal: true, prompt: '動いているのは、花？ それともあなた？',
    hint: { summary: '花弁の輪郭を一層ずつ追います。', explanation: '同じ半径の層が異なる位相と追従量で動き、花が呼吸するような奥行きを作ります。' },
    position: [-1, 1.55, -17], rotation: [0, 0, 0], interactionDistance: 5.2,
    zone: 'space', accent: '#ff78c8', interaction: { mode: 'hybrid', instructions: '視点、位相、追従量を調整します。', supportsReducedMotion: true },
  },
  {
    id: 'chromatic-echo-corridor', number: 10, title: '色彩残響回廊', subtitle: 'CHROMATIC ECHO',
    isOriginal: true, prompt: '色のない壁に、何色が残りますか？',
    hint: { summary: '中央を見つめたまま色が消えるのを待ちます。', explanation: '特定の色へ順応した視覚が、無彩色の面に補色の残像を生みます。' },
    position: [-18.2, 1.55, -8], rotation: [0, Math.PI / 2, 0], interactionDistance: 4.8,
    zone: 'space', accent: '#73c9ff', interaction: { mode: 'gaze', instructions: '色を選び、短い注視シーケンスを体験します。', supportsReducedMotion: false },
  },
]

export const exhibitById = new Map(exhibitCatalog.map((exhibit) => [exhibit.id, exhibit]))
