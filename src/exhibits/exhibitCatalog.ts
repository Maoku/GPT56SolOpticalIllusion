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
  | 'folded-corridor'
  | 'counterparallax-window'

export type ExhibitPresentation = 'lab' | 'installation' | 'room'
export type ExhibitVenue = 'atrium' | 'signature' | 'scale-light' | 'classics'
export type ExhibitOutcomeKind = 'measurement' | 'comparison' | 'alignment' | 'sequence' | 'observation'
export type PerceptionAxis = 'perspective' | 'context' | 'light' | 'motion'

export type ViewSpot = {
  id: string
  label: string
  position: [number, number, number]
  target: [number, number, number]
  tolerance: number
}

export type InteractionAnchor = {
  id: string
  position: [number, number, number]
  radius: number
  target?: [number, number, number]
  activation: 'automatic' | 'confirm'
}

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
  presentation: ExhibitPresentation
  venue: ExhibitVenue
  outcomeKind: ExhibitOutcomeKind
  perceptionAxis: PerceptionAxis
  shareHook: string
  oneSentence: string
  viewSpots?: ViewSpot[]
  interactionAnchors?: InteractionAnchor[]
  recommendedAfter: ExhibitType[]
  legacy: boolean
  interaction: {
    mode: 'drag' | 'slider' | 'gaze' | 'viewpoint' | 'hybrid' | 'walk' | 'light'
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
    position: [-13.5, 1.55, 16.9], rotation: [0, Math.PI, 0], interactionDistance: 4.8,
    zone: 'geometry', accent: '#7ef4d2',
    presentation: 'lab', venue: 'classics', outcomeKind: 'measurement', perceptionAxis: 'context',
    shareHook: '同じ長さを、あなたの目はどれだけ変えた？', oneSentence: '同じ長さの線が、矢羽の向きだけで違って見える。',
    recommendedAfter: ['parallax-bloom'], legacy: true,
    interaction: { mode: 'drag', instructions: '下の線を動かして同じ長さに見える位置を探します。', supportsReducedMotion: true },
  },
  {
    id: 'ponzo', number: 2, title: 'ポンゾ錯視', subtitle: 'THE DISTANT LINE',
    isOriginal: false, prompt: '同じ長さの線が、なぜ遠くで大きく見える？',
    hint: { summary: '線路のような収束線を隠して想像してください。', explanation: '奥行きの手がかりが、遠くにあると解釈した物体の大きさを補正します。' },
    position: [-8.1, 1.55, 16.9], rotation: [0, Math.PI, 0], interactionDistance: 4.8,
    zone: 'geometry', accent: '#9ae98d',
    presentation: 'lab', venue: 'classics', outcomeKind: 'comparison', perceptionAxis: 'perspective',
    shareHook: '遠くにある線ほど、大きく見えた。', oneSentence: '同じ線が、奥行きの手がかりで大きく見える。',
    recommendedAfter: ['checker-shadow'], legacy: true,
    interaction: { mode: 'slider', instructions: '線を奥行き方向へ動かします。', supportsReducedMotion: true },
  },
  {
    id: 'ebbinghaus', number: 3, title: 'エビングハウス錯視', subtitle: 'SOCIAL CIRCLES',
    isOriginal: false, prompt: '中央の円は、本当に同じ大きさ？',
    hint: { summary: '中央円ではなく、その周囲を比べます。', explanation: '周囲の円との相対比較により、等しい中央円が違う大きさに見えます。' },
    position: [-2.7, 1.55, 16.9], rotation: [0, Math.PI, 0], interactionDistance: 4.8,
    zone: 'geometry', accent: '#f6c76e',
    presentation: 'lab', venue: 'classics', outcomeKind: 'measurement', perceptionAxis: 'context',
    shareHook: '周囲の大きさが、中央の円を変えた。', oneSentence: '同じ円が、周囲の円の大きさだけで違って見える。',
    recommendedAfter: ['chromatic-echo-corridor'], legacy: true,
    interaction: { mode: 'slider', instructions: '右の中央円を調整します。', supportsReducedMotion: true },
  },
  {
    id: 'cafe-wall', number: 4, title: 'カフェウォール錯視', subtitle: 'PARALLEL, APPARENTLY',
    isOriginal: false, prompt: '水平な目地が傾いて見えませんか？',
    hint: { summary: '白黒タイルの境界から少し離れて見ます。', explanation: 'ずれた明暗の境界と細い目地の組み合わせが、平行線を傾いて知覚させます。' },
    position: [2.7, 1.55, 16.9], rotation: [0, Math.PI, 0], interactionDistance: 4.8,
    zone: 'geometry', accent: '#ff9c7c',
    presentation: 'lab', venue: 'classics', outcomeKind: 'comparison', perceptionAxis: 'context',
    shareHook: '平行な線が、傾いて見える瞬間。', oneSentence: '平行な目地が、白黒タイルのずれで傾いて見える。',
    recommendedAfter: ['ames-room'], legacy: true,
    interaction: { mode: 'slider', instructions: '行のずれと目地を変えます。', supportsReducedMotion: true },
  },
  {
    id: 'checker-shadow', number: 5, title: 'チェッカーシャドウ', subtitle: 'SHADOW SWITCH ROOM',
    isOriginal: false, prompt: 'A と B は違う明るさに見えますか？',
    hint: { summary: '周囲を指で隠すとどうでしょう。', explanation: '脳が影を補正するため、同じ色のタイルを違う明るさとして知覚します。' },
    position: [18.2, 1.55, 8], rotation: [0, -Math.PI / 2, 0], interactionDistance: 4.8,
    zone: 'light', accent: '#ffe08a',
    presentation: 'room', venue: 'scale-light', outcomeKind: 'comparison', perceptionAxis: 'light',
    shareHook: '違う色に見えた二枚は、同じ色だった。', oneSentence: '違う色に見えた二枚は、照明を消すと同じ色だった。',
    viewSpots: [{ id: 'shadow-console', label: '照明卓', position: [12.8, 1.65, 8], target: [18, 1, 8], tolerance: 1.1 }],
    interactionAnchors: [{ id: 'shadow-console', position: [12.8, 1.65, 8], radius: 1.35, target: [18, 1, 8], activation: 'automatic' }],
    recommendedAfter: ['necker-cube'], legacy: true,
    interaction: { mode: 'light', instructions: '影、色文脈、白色照明の三状態を切り替えます。', supportsReducedMotion: true },
  },
  {
    id: 'necker-cube', number: 6, title: 'ネッカーキューブ', subtitle: 'FRONT / BACK',
    isOriginal: false, prompt: '手前の面を、意志で反転できますか？',
    hint: { summary: '交差する辺の前後関係を入れ替えて見ます。', explanation: '奥行き手がかりのない線画は、2通りの立体解釈を行き来します。' },
    position: [8.1, 1.55, 16.9], rotation: [0, Math.PI, 0], interactionDistance: 4.8,
    zone: 'light', accent: '#b5a6ff',
    presentation: 'lab', venue: 'classics', outcomeKind: 'observation', perceptionAxis: 'perspective',
    shareHook: '同じ立方体が、前と後ろを入れ替えた。', oneSentence: '奥行き手がかりのない立方体は、前後が反転して見える。',
    recommendedAfter: ['motion-induced-blindness'], legacy: true,
    interaction: { mode: 'drag', instructions: '回転し、面の解釈を切り替えます。', supportsReducedMotion: true },
  },
  {
    id: 'motion-induced-blindness', number: 7, title: '運動誘発盲', subtitle: 'NOW YOU SEE IT',
    isOriginal: false, prompt: '中央を見つめると、黄色い点は残りますか？',
    hint: { summary: '中央だけを見て、周辺の点を追わないでください。', explanation: '動く背景の中で周辺視野の静止刺激が意識から消えることがあります。' },
    position: [13.5, 1.55, 16.9], rotation: [0, Math.PI, 0], interactionDistance: 4.8,
    zone: 'light', accent: '#ecf26b',
    presentation: 'lab', venue: 'classics', outcomeKind: 'measurement', perceptionAxis: 'motion',
    shareHook: '見つめている間に、静止点が消えた。', oneSentence: '動く背景を見つめると、周辺の静止点が消えて見える。',
    recommendedAfter: ['folded-corridor'], legacy: true,
    interaction: { mode: 'gaze', instructions: '背景速度とターゲット数を変更します。', supportsReducedMotion: false },
  },
  {
    id: 'ames-room', number: 8, title: 'エイムズの部屋', subtitle: 'A CROOKED ROOM',
    isOriginal: false, prompt: '同じ背丈の二人に見えますか？',
    hint: { summary: '部屋が長方形だという前提を疑います。', explanation: '歪んだ床と壁を固定視点から見ることで、人物の大きさが違うように見えます。' },
    position: [18.2, 1.55, -9], rotation: [0, -Math.PI / 2, 0], interactionDistance: 5.2,
    zone: 'space', accent: '#ff8fa6',
    presentation: 'room', venue: 'scale-light', outcomeKind: 'alignment', perceptionAxis: 'perspective',
    shareHook: '同じ身長が、巨人と小人になった。', oneSentence: '同じ身長の二人が、部屋の端を替わるだけで巨人と小人になる。',
    viewSpots: [{ id: 'ames-aperture', label: '固定鑑賞点', position: [12.7, 1.65, -9], target: [18, 1.4, -9], tolerance: 0.75 }],
    interactionAnchors: [
      { id: 'ames-aperture', position: [12.7, 1.65, -9], radius: 1.2, target: [18, 1.4, -9], activation: 'automatic' },
      { id: 'ames-reveal', position: [15.1, 1.65, -5.8], radius: 1.55, target: [17, 1.4, -9], activation: 'automatic' },
    ],
    recommendedAfter: ['counterparallax-window'], legacy: true,
    interaction: { mode: 'viewpoint', instructions: '固定視点と横からの構造開示を往復します。', supportsReducedMotion: true },
  },
  {
    id: 'parallax-bloom', number: 9, title: '視差の花', subtitle: 'PARALLAX BLOOM',
    isOriginal: true, prompt: 'ばらばらの三層が、どこで一輪になる？',
    hint: { summary: 'mint色の床マーカーから花弁の中心を見ます。', explanation: '異なる奥行きに離れた花弁が、一つの投影位置だけで同じ輪郭へ重なります。' },
    position: [-6, 2.25, -17], rotation: [0, 0, 0], interactionDistance: 5.2,
    zone: 'space', accent: '#ff78c8',
    presentation: 'installation', venue: 'atrium', outcomeKind: 'alignment', perceptionAxis: 'perspective',
    shareHook: 'ばらばらの三層が、一歩だけ一輪になった。', oneSentence: 'ばらばらの三層が、一歩だけ一輪の花になる。',
    viewSpots: [{ id: 'bloom-origin', label: '花の成立点', position: [-6, 1.65, -10.8], target: [-6, 2.25, -17], tolerance: 0.85 }],
    interactionAnchors: [{ id: 'bloom-origin', position: [-6, 1.65, -10.8], radius: 1.35, target: [-6, 2.25, -17], activation: 'automatic' }],
    recommendedAfter: ['chromatic-echo-corridor'], legacy: true,
    interaction: { mode: 'walk', instructions: '床マーカーの周囲を歩き、三層が一輪になる位置を探します。', supportsReducedMotion: true },
  },
  {
    id: 'chromatic-echo-corridor', number: 10, title: '色彩残響回廊', subtitle: 'CHROMATIC ECHO',
    isOriginal: true, prompt: '色のない壁に、何色が残りますか？',
    hint: { summary: '中央を見つめたまま三つの帯を進みます。', explanation: '特定の色へ順応した視覚が、無彩色の面に補色の残像を生みます。' },
    position: [0, 1.55, -17], rotation: [0, 0, 0], interactionDistance: 4.8,
    zone: 'space', accent: '#73c9ff',
    presentation: 'room', venue: 'signature', outcomeKind: 'sequence', perceptionAxis: 'light',
    shareHook: '色のない壁に、反対色が現れた。', oneSentence: '色の部屋を出た瞬間、色のない壁に反対色が現れる。',
    viewSpots: [{ id: 'echo-entry', label: '順応室入口', position: [0, 1.65, -11.5], target: [0, 1.65, -17], tolerance: 1.2 }],
    interactionAnchors: [
      { id: 'echo-entry', position: [0, 1.65, -11.5], radius: 1.55, target: [0, 1.65, -17], activation: 'automatic' },
      { id: 'echo-adapt', position: [0, 1.65, -14.2], radius: 1.75, target: [0, 1.65, -17], activation: 'automatic' },
      { id: 'echo-result', position: [0, 1.65, -17.2], radius: 1.75, target: [0, 1.65, -19], activation: 'automatic' },
    ],
    recommendedAfter: ['ebbinghaus'], legacy: true,
    interaction: { mode: 'gaze', instructions: '色の順応室、無彩色の移行帯、結果室を歩きます。', supportsReducedMotion: true },
  },
  {
    id: 'folded-corridor', number: 11, title: '折り畳まれた回廊', subtitle: 'FOLDED CORRIDOR',
    isOriginal: true, prompt: '分断された壁が、どこで一本の回廊になる？',
    hint: { summary: '床のmint色の点から、白い出口を見ます。', explanation: '異なる距離と角度の平面が、ただ一つの投影位置で連続した回廊として整列します。' },
    position: [6, 1.55, -17], rotation: [0, 0, 0], interactionDistance: 5.2,
    zone: 'space', accent: '#72f0d0',
    presentation: 'installation', venue: 'signature', outcomeKind: 'alignment', perceptionAxis: 'perspective',
    shareHook: '壊れた壁が、一点だけ30mの回廊になった。', oneSentence: '分断された門と壁が、一つの視点だけで長い直線回廊になる。',
    viewSpots: [{ id: 'folded-origin', label: '回廊の成立点', position: [6, 1.65, -11], target: [6, 1.5, -17], tolerance: 0.7 }],
    interactionAnchors: [
      { id: 'folded-origin', position: [6, 1.65, -11], radius: 1.25, target: [6, 1.5, -17], activation: 'automatic' },
      { id: 'folded-reveal', position: [8.4, 1.65, -14.2], radius: 1.55, target: [6, 1.5, -17], activation: 'automatic' },
    ],
    recommendedAfter: ['muller-lyer'], legacy: false,
    interaction: { mode: 'walk', instructions: '床マーカーの周囲を歩き、回廊がつながる一点を探します。', supportsReducedMotion: true },
  },
  {
    id: 'counterparallax-window', number: 12, title: '逆視差の窓', subtitle: 'COUNTERPARALLAX WINDOW',
    isOriginal: true, prompt: '左へ歩くと、窓の奥はどちらへ動く？',
    hint: { summary: '窓枠と奥の部屋のずれを比べます。', explanation: '視点移動に合わせて層を制御し、通常の視差とは逆方向の像のずれを作ります。' },
    position: [12, 1.55, -17], rotation: [0, 0, 0], interactionDistance: 5.2,
    zone: 'space', accent: '#68c9ff',
    presentation: 'installation', venue: 'signature', outcomeKind: 'sequence', perceptionAxis: 'motion',
    shareHook: '左へ歩いたら、窓の奥も左へ逃げた。', oneSentence: '左へ歩くと、窓の奥の部屋が通常と逆方向へずれて見える。',
    viewSpots: [{ id: 'counter-window', label: '観察ライン', position: [12, 1.65, -11.4], target: [12, 1.5, -17], tolerance: 1.4 }],
    interactionAnchors: [
      { id: 'counter-window-left', position: [10.7, 1.65, -11.4], radius: 1.35, target: [12, 1.5, -17], activation: 'automatic' },
      { id: 'counter-window-center', position: [12, 1.65, -11.4], radius: 1.35, target: [12, 1.5, -17], activation: 'automatic' },
      { id: 'counter-window-right', position: [13.3, 1.65, -11.4], radius: 1.35, target: [12, 1.5, -17], activation: 'automatic' },
    ],
    recommendedAfter: ['checker-shadow'], legacy: false,
    interaction: { mode: 'walk', instructions: '窓の前を左右に歩き、奥の部屋の逆向きのずれを観察します。', supportsReducedMotion: true },
  },
]

export const exhibitById = new Map(exhibitCatalog.map((exhibit) => [exhibit.id, exhibit]))
const legacyTransforms: Partial<Record<ExhibitType, Pick<ExhibitDefinition, 'position' | 'rotation'>>> = {
  'muller-lyer': { position: [-12, 1.55, 16.9], rotation: [0, Math.PI, 0] },
  ponzo: { position: [-6, 1.55, 16.9], rotation: [0, Math.PI, 0] },
  ebbinghaus: { position: [6, 1.55, 16.9], rotation: [0, Math.PI, 0] },
  'cafe-wall': { position: [12, 1.55, 16.9], rotation: [0, Math.PI, 0] },
  'checker-shadow': { position: [18.2, 1.55, 8], rotation: [0, -Math.PI / 2, 0] },
  'necker-cube': { position: [18.2, 1.55, 1], rotation: [0, -Math.PI / 2, 0] },
  'motion-induced-blindness': { position: [18.2, 1.55, -7], rotation: [0, -Math.PI / 2, 0] },
  'ames-room': { position: [9, 1.55, -17], rotation: [0, 0, 0] },
  'parallax-bloom': { position: [-1, 1.55, -17], rotation: [0, 0, 0] },
  'chromatic-echo-corridor': { position: [-18.2, 1.55, -8], rotation: [0, Math.PI / 2, 0] },
}

export const legacyExhibitCatalog = exhibitCatalog
  .filter((exhibit) => exhibit.legacy)
  .map((exhibit) => ({ ...exhibit, ...legacyTransforms[exhibit.id] }))

export function getExhibitCatalog(mode: 'v1' | 'v2') {
  return mode === 'v2' ? exhibitCatalog : legacyExhibitCatalog
}
