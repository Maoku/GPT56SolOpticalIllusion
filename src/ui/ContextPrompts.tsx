import { useMuseumStore } from '../state/useMuseumStore'

const prompts = [
  {
    eyebrow: '01 · BODY INPUT',
    title: '歩くと、像が変わる。',
    body: 'WASD・矢印・左スティックで進みます。画面中央を向けた展示が反応します。',
    action: '歩いてみる',
  },
  {
    eyebrow: '02 · VIEW SPOT',
    title: 'mintの輪が、成立点。',
    body: '空間展示では床の輪を探してください。「鑑賞点へ移動」でキーボードやタッチからも同じ原理を比較できます。',
    action: '輪を探す',
  },
  {
    eyebrow: '03 · KEEP THE RESULT',
    title: '見え方を、持ち帰る。',
    body: '展示の結果は4軸の知覚パスポートへ。順位や診断ではなく、今回の観察記録として保存できます。',
    action: '自由に見る',
  },
]

export function ContextPrompts() {
  const step = useMuseumStore((state) => state.contextPromptStep)
  const advance = useMuseumStore((state) => state.advanceContextPrompt)
  const dismiss = useMuseumStore((state) => state.dismissContextPrompts)
  if (step === null) return null
  const prompt = prompts[step]
  if (!prompt) return null

  return (
    <aside className="context-prompt" aria-live="polite">
      <div className="context-prompt__progress" aria-label={`導入 ${step + 1} / ${prompts.length}`}>
        {prompts.map((_, index) => <i key={index} className={index <= step ? 'is-active' : ''} />)}
      </div>
      <p className="eyebrow">{prompt.eyebrow}</p>
      <h2>{prompt.title}</h2>
      <p>{prompt.body}</p>
      <div>
        <button className="button button--quiet" onClick={dismiss}>閉じる</button>
        <button className="button button--primary" onClick={advance}>{prompt.action}</button>
      </div>
    </aside>
  )
}
