import { useState } from 'react'
import { ExhibitRange } from '../interaction/ExhibitRange'
import type { ExhibitModuleProps } from '../interaction/types'

export function PonzoExhibit({ revealed, onInteract }: ExhibitModuleProps) {
  const [depth, setDepth] = useState(62)
  const update = (value: number) => { setDepth(value); onInteract() }
  const upperY = 38 + depth * 0.72
  return (
    <div className="illusion-module">
      <svg className="illusion-svg illusion-svg--ponzo" viewBox="0 0 320 230" role="img" aria-label="収束線上に置かれた同じ長さの2本の線">
        {!revealed && <g className="ponzo-rails"><line x1="35" y1="220" x2="145" y2="5" /><line x1="285" y1="220" x2="175" y2="5" />
          {[45, 78, 116, 158, 202].map((y) => <line key={y} x1={48 + y * .23} y1={y} x2={272 - y * .23} y2={y} />)}
        </g>}
        <g className="ponzo-bars">
          <line x1={revealed ? 55 : 120} y1={revealed ? 80 : upperY} x2={revealed ? 155 : 200} y2={revealed ? 80 : upperY} />
          <line x1={revealed ? 175 : 120} y1={revealed ? 150 : 185} x2={revealed ? 275 : 200} y2={revealed ? 150 : 185} />
        </g>
      </svg>
      <ExhibitRange label="上の線の奥行き" value={depth} min={10} max={100} unit="%" onChange={update} />
      <p className="measurement">{revealed ? '遠近線を外すと、2本はどちらも 80 px です' : '上の線を奥へ動かし、見え方の変化を観察します'}</p>
    </div>
  )
}
