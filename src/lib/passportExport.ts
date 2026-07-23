import { exhibitById, type ExhibitType, type PerceptionAxis } from '../exhibits/exhibitCatalog'
import type { ExhibitOutcome } from '../state/outcomes'

const axisLabels: Record<PerceptionAxis, string> = {
  perspective: 'PERSPECTIVE',
  context: 'CONTEXT',
  light: 'LIGHT',
  motion: 'MOTION',
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function outcomeText(outcome: ExhibitOutcome | undefined) {
  if (!outcome) return '次の実験で記録が追加されます'
  if (outcome.metric) {
    return `${outcome.metric.label}: ${outcome.metric.value}${outcome.metric.unit ?? ''}`
  }
  return outcome.headline
}

export function buildPassportSvg(
  outcomes: Partial<Record<ExhibitType, ExhibitOutcome>>,
) {
  const latestByAxis = Object.values(outcomes).reduce<Partial<Record<PerceptionAxis, ExhibitOutcome>>>(
    (latest, outcome) => {
      if (!outcome) return latest
      const current = latest[outcome.axis]
      if (!current || outcome.recordedAt > current.recordedAt) latest[outcome.axis] = outcome
      return latest
    },
    {},
  )
  const axes = Object.keys(axisLabels) as PerceptionAxis[]
  const modules = axes.map((axis, index) => {
    const x = 70 + index * 270
    const outcome = latestByAxis[axis]
    const accent = ['#7ef4d2', '#ff68bd', '#ffe08a', '#69cfff'][index]
    return `
      <g transform="translate(${x} 205)">
        <rect width="242" height="255" rx="18" fill="#0f1827" stroke="${accent}" stroke-opacity=".5"/>
        <text x="20" y="42" fill="${accent}" font-size="16" letter-spacing="2">${axisLabels[axis]}</text>
        <circle cx="121" cy="112" r="48" fill="none" stroke="#283447" stroke-width="8"/>
        <circle cx="121" cy="112" r="48" fill="none" stroke="${accent}" stroke-width="8" stroke-dasharray="${outcome ? '245 302' : '35 302'}" transform="rotate(-90 121 112)"/>
        <text x="121" y="120" text-anchor="middle" fill="#f3f7f5" font-size="24">${outcome ? 'REC' : '—'}</text>
        <foreignObject x="18" y="177" width="206" height="62">
          <div xmlns="http://www.w3.org/1999/xhtml" style="color:#aebbb8;font:15px system-ui;line-height:1.45;text-align:center">
            ${escapeXml(outcomeText(outcome))}
          </div>
        </foreignObject>
      </g>`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#070c15"/>
    <circle cx="1080" cy="40" r="260" fill="#ff68bd" opacity=".07"/>
    <circle cx="80" cy="620" r="300" fill="#7ef4d2" opacity=".06"/>
    <text x="70" y="82" fill="#7ef4d2" font-family="system-ui" font-size="15" letter-spacing="5">PARALLAX 2.0</text>
    <text x="70" y="140" fill="#f3f7f5" font-family="system-ui" font-size="44" font-weight="700" letter-spacing="7">PERCEPTION PASSPORT</text>
    <text x="70" y="174" fill="#9eadaa" font-family="system-ui" font-size="16">この来館セッションで、どの手がかりに影響されたかの観察記録</text>
    ${modules}
    <text x="70" y="535" fill="#7ef4d2" font-family="system-ui" font-size="15">${Object.keys(outcomes).length} / 12 EXHIBITS RECORDED</text>
    <text x="70" y="573" fill="#778581" font-family="system-ui" font-size="13">娯楽・学習用の記録です。視力検査や診断ではありません。</text>
  </svg>`
}

export function buildOutcomeCardSvg(outcome: ExhibitOutcome) {
  const exhibit = exhibitById.get(outcome.exhibitId)
  const accent = exhibit?.accent ?? '#7ef4d2'
  const metric = outcome.metric
    ? `<text x="72" y="450" fill="${accent}" font-family="system-ui" font-size="70" font-weight="750">${outcome.metric.value}${escapeXml(outcome.metric.unit ?? '')}</text>
       <text x="72" y="485" fill="#9eadaa" font-family="system-ui" font-size="17">${escapeXml(outcome.metric.label)}</text>`
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#070c15"/>
    <path d="M850 0H1200V630H720Z" fill="${accent}" opacity=".12"/>
    <circle cx="1020" cy="170" r="230" fill="none" stroke="${accent}" stroke-width="3" opacity=".45"/>
    <circle cx="1020" cy="170" r="150" fill="none" stroke="${accent}" stroke-width="18" stroke-dasharray="490 940" transform="rotate(-90 1020 170)"/>
    <text x="72" y="82" fill="${accent}" font-family="system-ui" font-size="15" letter-spacing="5">PARALLAX 2.0 · ${String(exhibit?.number ?? 0).padStart(2, '0')}</text>
    <text x="72" y="155" fill="#f3f7f5" font-family="system-ui" font-size="50" font-weight="750">${escapeXml(exhibit?.title ?? outcome.exhibitId)}</text>
    <foreignObject x="72" y="205" width="650" height="155">
      <div xmlns="http://www.w3.org/1999/xhtml" style="color:#f3f7f5;font:30px system-ui;line-height:1.5">${escapeXml(outcome.headline)}</div>
    </foreignObject>
    ${metric}
    <text x="72" y="570" fill="#778581" font-family="system-ui" font-size="14">SESSION OBSERVATION · NOT A DIAGNOSIS</text>
  </svg>`
}

export function downloadSvg(svg: string, filename: string) {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
