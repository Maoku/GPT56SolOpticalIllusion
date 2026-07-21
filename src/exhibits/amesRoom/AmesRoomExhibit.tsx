import { useState } from 'react'
import { ExhibitRange } from '../interaction/ExhibitRange'
import type { ExhibitModuleProps } from '../interaction/types'

function Person({ x, scale, label }: { x: number; scale: number; label: string }) {
  return <g transform={`translate(${x} 0) scale(${scale})`} className="ames-person"><circle cx="0" cy="118" r="12" /><path d="M -14 134 L 14 134 L 20 190 L 7 190 L 5 230 L -6 230 L -8 190 L -20 190 Z" /><text x="0" y="160">{label}</text></g>
}

export function AmesRoomExhibit({ revealed, onInteract }: ExhibitModuleProps) {
  const [rail, setRail] = useState(65)
  const [freeView, setFreeView] = useState(false)
  const update = (value: number) => { setRail(value); onInteract() }
  const leftScale = revealed ? 0.78 : 0.72 + rail / 330
  const rightScale = revealed ? 0.78 : 1.18 - rail / 420
  return (
    <div className="illusion-module ames-module">
      <svg className="illusion-svg ames-room" viewBox="0 0 420 260" role="img" aria-label="歪んだ部屋に立つ同じ大きさの二人">
        <polygon points={revealed || freeView ? '45,55 365,25 400,230 20,230' : '45,55 365,55 400,230 20,230'} className="ames-back" />
        <line x1="45" y1="55" x2="20" y2="230" /><line x1="365" y1={revealed || freeView ? 25 : 55} x2="400" y2="230" />
        <line x1="45" y1="55" x2="365" y2={revealed || freeView ? 25 : 55} />
        <Person x={90 + rail * .45} scale={leftScale} label="A" /><Person x={325 - rail * .25} scale={rightScale} label="B" />
        {revealed && <g className="ames-measure"><line x1="75" y1="238" x2="345" y2="238" /><text x="210" y="252">実寸は同じ 170 cm</text></g>}
      </svg>
      <div className="range-grid">
        <ExhibitRange label="人物のレール位置" value={rail} min={0} max={100} unit="%" onChange={update} />
        <button className="button button--quiet" onClick={() => { setFreeView((value) => !value); onInteract() }}>{freeView ? '鑑賞点へ戻る' : '自由視点で歪みを見る'}</button>
      </div>
      <p className="measurement">{revealed ? '俯瞰すると、台形の部屋と同じ実寸の二人が見えます' : freeView ? '壁と床の歪みが見える視点です' : '小さな鑑賞穴から長方形の部屋だと思って観察します'}</p>
    </div>
  )
}
