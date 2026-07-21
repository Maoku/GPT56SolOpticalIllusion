import { useMemo, useState } from 'react'
import { ExhibitRange } from '../interaction/ExhibitRange'
import type { ExhibitModuleProps } from '../interaction/types'

const layers = [
  { radius: 58, color: '#ff7bc9', opacity: 0.82 },
  { radius: 58, color: '#8c7dff', opacity: 0.7 },
  { radius: 58, color: '#72e8d0', opacity: 0.62 },
]

export function ParallaxBloomExhibit({ revealed, onInteract }: ExhibitModuleProps) {
  const [petals, setPetals] = useState(10)
  const [phase, setPhase] = useState(28)
  const [follow, setFollow] = useState(52)
  const [viewpoint, setViewpoint] = useState(0)
  const angles = useMemo(() => Array.from({ length: petals }, (_, index) => (360 / petals) * index), [petals])
  const update = (setter: (value: number) => void) => (value: number) => { setter(value); onInteract() }
  return (
    <div className="illusion-module parallax-bloom">
      <svg className="illusion-svg bloom-stage" viewBox="0 0 420 265" role="img" aria-label="視点に追従してずれる三層の花弁">
        <defs><filter id="bloom-glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        {layers.map((layer, layerIndex) => {
          const separation = revealed ? (layerIndex - 1) * 128 : 0
          const parallax = revealed ? 0 : viewpoint * (follow / 100) * (layerIndex - 1) * 0.32
          return <g key={layer.color} transform={`translate(${210 + separation + parallax} 130) rotate(${layerIndex * phase})`} style={{ opacity: layer.opacity }}>
            {angles.map((angle) => <ellipse key={angle} cx="0" cy={-layer.radius} rx="18" ry="56" transform={`rotate(${angle})`} fill={layer.color} filter="url(#bloom-glow)" />)}
            {revealed && <circle r={layer.radius} fill="none" stroke={layer.color} strokeWidth="2" strokeDasharray="4 5" />}
          </g>
        })}
        {!revealed && <circle cx="210" cy="130" r="18" className="bloom-core" />}
        {revealed && <g className="bloom-labels"><text x="82" y="250">LAYER 1</text><text x="210" y="250">LAYER 2</text><text x="338" y="250">LAYER 3</text></g>}
      </svg>
      <div className="range-grid range-grid--three">
        <ExhibitRange label="花弁数" value={petals} min={6} max={16} onChange={update(setPetals)} />
        <ExhibitRange label="層の位相" value={phase} min={0} max={60} unit="°" onChange={update(setPhase)} />
        <ExhibitRange label="視点追従量" value={follow} min={0} max={100} unit="%" onChange={update(setFollow)} />
      </div>
      <ExhibitRange label="視点を左右へ動かす" value={viewpoint} min={-100} max={100} unit="%" onChange={update(setViewpoint)} />
      <p className="measurement">{revealed ? '三層は同じ半径。位相と水平移動だけを分離表示しています' : '視点スライダーを指と1:1で動かし、輪郭の追従差を観察します'}</p>
    </div>
  )
}
