import { useEffect, useRef, useState } from 'react'

const messages = [
  'Chargement en cours…',
  'Prépare les animations…',
  'Initialise les composants…',
]

export default function Loader() {
  const [visible, setVisible] = useState(true)
  const [index, setIndex] = useState(0)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    timer.current = window.setInterval(() => setIndex((i: number) => (i + 1) % messages.length), 1000)
    const done = window.setTimeout(() => setVisible(false), 1200)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
      window.clearTimeout(done)
    }
  }, [])

  if (!visible) return null
  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-neutral-950/80 backdrop-blur">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        <div className="text-sm text-white/80">{messages[index]}</div>
      </div>
    </div>
  )
}
