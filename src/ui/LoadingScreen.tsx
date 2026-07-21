export function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <span className="loading-mark" aria-hidden="true" />
      <span>展示室を整えています…</span>
    </div>
  )
}
