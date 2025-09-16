import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function RouteProgress() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const t1 = useRef<number | null>(null)
  const t2 = useRef<number | null>(null)

  useEffect(() => {
    // Start progress on path change
    setVisible(true)
    setProgress(8)
    if (t1.current) window.clearTimeout(t1.current)
    if (t2.current) window.clearTimeout(t2.current)

    t1.current = window.setTimeout(() => setProgress(90), 120)
    t2.current = window.setTimeout(() => {
      setProgress(100)
      // small delay before hide to allow full sweep
      window.setTimeout(() => setVisible(false), 220)
      // reset for next time
      window.setTimeout(() => setProgress(0), 450)
    }, 650)

    return () => {
      if (t1.current) window.clearTimeout(t1.current)
      if (t2.current) window.clearTimeout(t2.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <div className={`pointer-events-none fixed inset-x-0 top-0 z-[9998] h-0.5 transition-opacity ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div
        className="h-full origin-left rounded-r-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-rose-400 shadow-[0_0_16px_2px_rgba(168,85,247,0.5)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

