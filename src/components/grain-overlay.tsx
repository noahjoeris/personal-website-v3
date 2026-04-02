export function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-9999 bg-repeat opacity-10"
      style={{ backgroundImage: 'url(/grain.gif)' }}
      aria-hidden
    />
  )
}
