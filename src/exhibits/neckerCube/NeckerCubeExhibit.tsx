import { useState } from 'react'
import { ExhibitRange } from '../interaction/ExhibitRange'
import type { ExhibitModuleProps } from '../interaction/types'

export function NeckerCubeExhibit({ revealed, onInteract }: ExhibitModuleProps) {
  const [rotation, setRotation] = useState(0)
  const [front, setFront] = useState<'near' | 'far'>('near')
  const interact = () => onInteract()
  const changeRotation = (value: number) => { setRotation(value); interact() }
  const flip = () => { setFront((value) => value === 'near' ? 'far' : 'near'); interact() }
  return (
    <div className="illusion-module">
      <svg className="illusion-svg necker-cube" viewBox="0 0 360 250" role="img" aria-label="奥行きが反転して見えるワイヤーフレームの立方体">
        <g transform={`rotate(${rotation} 180 125)`}>
          {revealed && <polygon points={front === 'near' ? '85,80 215,80 215,200 85,200' : '145,35 275,35 275,155 145,155'} className="necker-face" />}
          <rect x="85" y="80" width="130" height="120" />
          <rect x="145" y="35" width="130" height="120" />
          <line x1="85" y1="80" x2="145" y2="35" /><line x1="215" y1="80" x2="275" y2="35" />
          <line x1="85" y1="200" x2="145" y2="155" /><line x1="215" y1="200" x2="275" y2="155" />
          {revealed && <circle cx={front === 'near' ? 95 : 265} cy={front === 'near' ? 190 : 45} r="8" className="necker-depth-dot" />}
        </g>
      </svg>
      <div className="range-grid">
        <ExhibitRange label="回転" value={rotation} min={-18} max={18} unit="°" onChange={changeRotation} />
        <button className="button button--quiet" onClick={flip}>手前面を反転：{front === 'near' ? '左下' : '右上'}</button>
      </div>
      <p className="measurement">{revealed ? '色面と奥行き点は、いま選んだ解釈を強制する手がかりです' : 'どちらの面が手前か、クリックで意識的に切り替えます'}</p>
    </div>
  )
}
