import { useMuseumStore } from '../state/useMuseumStore'

export function StartScreen() {
  const enterMuseum = useMuseumStore((state) => state.enterMuseum)
  const openSettings = useMuseumStore((state) => state.openOverlay)

  return (
    <section className="start-screen" aria-labelledby="museum-title">
      <div className="start-screen__copy">
        <p className="eyebrow">A MUSEUM FOR DOUBTFUL EYES</p>
        <h1 id="museum-title">PARALLAX</h1>
        <p className="start-screen__lead">
          見えているものは、本当にそこにある？ 10 の錯視を歩いて、動かして、確かめる。
        </p>
        <div className="start-screen__actions">
          <button className="button button--primary" onClick={enterMuseum}>
            入館する <span aria-hidden="true">→</span>
          </button>
          <button className="button button--quiet" onClick={() => openSettings('settings')}>
            設定
          </button>
        </div>
      </div>
      <dl className="controls-card" aria-label="操作方法">
        <div><dt>MOVE</dt><dd>WASD / 矢印 / 左スティック</dd></div>
        <div><dt>LOOK</dt><dd>マウス / 右側をドラッグ</dd></div>
        <div><dt>VIEW</dt><dd>E / タップ</dd></div>
        <div><dt>HINT</dt><dd>自分で開くまで秘密です</dd></div>
      </dl>
    </section>
  )
}
