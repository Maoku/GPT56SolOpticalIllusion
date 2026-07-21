import { useState } from 'react'
import { ExhibitRange } from '../interaction/ExhibitRange'
import type { ExhibitModuleProps } from '../interaction/types'

const actualLength = 160

function ArrowLine({ y, length, outward, answer }: { y: number; length: number; outward: boolean; answer?: boolean }) {
  const start = 160 - length / 2
  const end = 160 + length / 2
  const direction = outward ? 1 : -1
  return (
    <g className={answer ? 'illusion-answer' : undefined}>
      <line x1={start} y1={y} x2={end} y2={y} />
      {!answer && <>
        <path d={`M ${start} ${y} l ${22 * direction} -18 M ${start} ${y} l ${22 * direction} 18`} />
        <path d={`M ${end} ${y} l ${-22 * direction} -18 M ${end} ${y} l ${-22 * direction} 18`} />
      </>}
    </g>
  )
}

export function MullerLyerExhibit({ revealed, onInteract }: ExhibitModuleProps) {
  const [length, setLength] = useState(138)
  const update = (value: number) => { setLength(value); onInteract() }
  return (
    <div className="illusion-module">
      <svg className="illusion-svg illusion-svg--ink" viewBox="0 0 320 210" role="img" aria-label="矢羽の向きが異なる2本の線">
        <ArrowLine y={68} length={actualLength} outward />
        <ArrowLine y={145} length={length} outward={false} />
        {revealed && <ArrowLine y={145} length={actualLength} outward={false} answer />}
      </svg>
      <ExhibitRange label="下の線の実長" value={length} min={110} max={210} unit=" px" onChange={update} />
      <p className="measurement">
        {revealed ? `上 160 px / 下 ${length} px — 誤差 ${Math.abs(length - actualLength)} px` : '同じ長さに見えた位置で止めてください'}
      </p>
    </div>
  )
}
