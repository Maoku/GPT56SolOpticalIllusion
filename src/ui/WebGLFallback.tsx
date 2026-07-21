export function WebGLFallback() {
  return (
    <main className="fallback-screen" role="alert">
      <p className="eyebrow">WEBGL 2 REQUIRED</p>
      <h1>3D 展示を表示できません</h1>
      <p>
        WebGL 2 が無効か、この端末では利用できません。最新の Chrome、Safari、Edge、Firefox
        でハードウェアアクセラレーションを有効にしてお試しください。
      </p>
    </main>
  )
}
