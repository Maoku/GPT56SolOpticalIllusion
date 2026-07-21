import { useState } from 'react'
import { ExhibitRange } from '../interaction/ExhibitRange'
import type { ExhibitModuleProps } from '../interaction/types'

const cells = Array.from({ length: 48 }, (_, index) => ({ row: Math.floor(index / 8), column: index % 8 }))

export function CheckerShadowExhibit({ revealed, onInteract }: ExhibitModuleProps) {
  const [shadowX, setShadowX] = useState(195)
  const update = (value: number) => { setShadowX(value); onInteract() }
  return (
    <div className="illusion-module">
      <svg className="illusion-svg checker-shadow" viewBox="0 0 400 245" role="img" aria-label="円柱の影が落ちたチェッカーボード">
        <g transform="translate(40 25) skewX(-10)">
          {cells.map(({ row, column }) => <rect key={`${row}-${column}`} x={column * 40} y={row * 32} width="40" height="32" className={(row + column) % 2 ? 'checker-dark' : 'checker-light'} />)}
          {!revealed && <ellipse cx={shadowX} cy="96" rx="112" ry="70" className="checker-cast-shadow" />}
          <rect x="80" y="32" width="40" height="32" className="checker-target" />
          <rect x="200" y="128" width="40" height="32" className="checker-target" />
          {revealed && <path d="M 100 48 C 145 85, 180 125, 220 144" className="checker-bridge" />}
          <text x="95" y="55">A</text><text x="215" y="151">B</text>
        </g>
        <g className="checker-cylinder" transform={`translate(${shadowX - 5} 7)`}><ellipse cx="0" cy="20" rx="20" ry="8" /><rect x="-20" y="20" width="40" height="100" /><ellipse cx="0" cy="120" rx="20" ry="8" /></g>
      </svg>
      <ExhibitRange label="影の位置" value={shadowX} min={115} max={285} unit=" px" onChange={update} />
      <p className="measurement">{revealed ? 'A と B は同じ #747985 — 色帯が途切れずにつながります' : '影を動かしても A と B の見え方は同じでしょうか'}</p>
    </div>
  )
}
