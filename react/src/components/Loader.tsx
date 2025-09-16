import { useEffect, useRef, useState } from 'react'

const messages = [
  'Chargement…',
  'Préparation des animations…',
  'Initialisation…',
]

export default function Loader() {
  const [visible, setVisible] = useState(true)
  const [index, setIndex] = useState(0)
  const intervalRef = useRef<number | null>(null)
  const mountedAt = useRef<number>(performance.now())

  useEffect(() => {
    // Rotate helper text
    intervalRef.current = window.setInterval(() => setIndex((i: number) => (i + 1) % messages.length), 900)

    const MIN_VISIBLE = 500
    const MAX_VISIBLE = 3000

    const hide = () => {
      const elapsed = performance.now() - mountedAt.current
      const wait = Math.max(0, MIN_VISIBLE - elapsed)
      const t = window.setTimeout(() => setVisible(false), wait)
      return () => window.clearTimeout(t)
    }

    if (document.readyState === 'complete') {
      const cleanup = hide()
      return () => cleanup()
    }

    const onLoad = () => hide()
    const maxTimer = window.setTimeout(() => setVisible(false), MAX_VISIBLE)
    window.addEventListener('load', onLoad, { once: true })
    return () => {
      window.removeEventListener('load', onLoad)
      window.clearTimeout(maxTimer)
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [])

  if (!visible) return null
  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-neutral-950/80 backdrop-blur-sm">
      <div className="relative text-center">
        <div className="mx-auto mb-4 grid place-items-center">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.12),transparent_60%)]" />
          </div>
        </div>
        <div className="mb-2 text-lg font-semibold tracking-tight">RedFly</div>
        <div className="text-sm text-white/80">{messages[index]}</div>
      </div>
    </div>
  )
}
