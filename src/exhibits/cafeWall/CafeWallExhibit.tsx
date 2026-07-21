import { useState } from 'react'
import { ExhibitRange } from '../interaction/ExhibitRange'
import type { ExhibitModuleProps } from '../interaction/types'

export function CafeWallExhibit({ revealed, onInteract }: ExhibitModuleProps) {
  const [offset, setOffset] = useState(22)
  const [mortar, setMortar] = useState(4)
  const update = (setter: (value: number) => void) => (value: number) => { setter(value); onInteract() }
  const tileWidth = 42
  return (
    <div className="illusion-module">
      <svg className="illusion-svg cafe-wall" viewBox="0 0 360 220" role="img" aria-label="ずらして並べた白黒タイルと平行な目地">
        <rect width="360" height="220" className="cafe-mortar" />
        {Array.from({ length: 6 }, (_, row) => {
          const y = row * (34 + mortar)
          const shift = row % 2 ? offset - tileWidth : 0
          return Array.from({ length: 11 }, (_, column) => (
            <rect key={`${row}-${column}`} x={column * tileWidth + shift} y={y} width={tileWidth} height="34" className={(row + column) % 2 ? 'cafe-dark' : 'cafe-light'} />
          ))
        })}
        {revealed && Array.from({ length: 5 }, (_, i) => <line key={i} x1="0" x2="360" y1={(i + 1) * (34 + mortar) - mortar / 2} y2={(i + 1) * (34 + mortar) - mortar / 2} className="cafe-guide" />)}
      </svg>
      <div className="range-grid">
        <ExhibitRange label="行のずれ" value={offset} min={0} max={42} unit=" px" onChange={update(setOffset)} />
        <ExhibitRange label="目地の太さ" value={mortar} min={1} max={10} unit=" px" onChange={update(setMortar)} />
      </div>
      <p className="measurement">{revealed ? '水平ガイドはすべて平行です' : '錯視が最も強くなる組み合わせを探します'}</p>
    </div>
  )
}
