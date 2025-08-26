import { useEffect, useRef, useState } from 'react'
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)

  const [enabled, setEnabled] = useState(false)
  const mouse = useRef({ x: 0, y: 0 })
  const dot = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const state = useRef({ pressed: false, interactive: false })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mqHover = window.matchMedia('(hover: hover) and (pointer: fine)')
    const mqRmf = window.matchMedia('(prefers-reduced-motion: reduce)')
    const active = mqHover.matches && !mqRmf.matches
    setEnabled(active)

    const onChange = () => setEnabled(mqHover.matches && !mqRmf.matches)
    mqHover.addEventListener?.('change', onChange)
    mqRmf.addEventListener?.('change', onChange)
    return () => {
      mqHover.removeEventListener?.('change', onChange)
      mqRmf.removeEventListener?.('change', onChange)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    const html = document.documentElement
    html.classList.add('custom-cursor-active')
    return () => html.classList.remove('custom-cursor-active')
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    const handleMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }
    const handleDown = () => {
      state.current.pressed = true
      dotRef.current?.style.setProperty('--dot-scale', '0.7')
      ringRef.current?.style.setProperty('--ring-scale', state.current.interactive ? '1.1' : '0.95')
    }
    const handleUp = () => {
      state.current.pressed = false
      dotRef.current?.style.setProperty('--dot-scale', '1')
      ringRef.current?.style.setProperty('--ring-scale', state.current.interactive ? '1.15' : '1')
    }

    const interactiveSelector = 'a, button, [role="button"], input, textarea, select, .cursor-pointer, [data-cursor]'
    const handleOver = (e: MouseEvent) => {
      const target = e.target as Element | null
      if (!target) return
      const isInteractive = !!target.closest(interactiveSelector)
      if (isInteractive !== state.current.interactive) {
        state.current.interactive = isInteractive
        if (isInteractive) {
          ringRef.current?.style.setProperty('--ring-size', '42')
          ringRef.current?.style.setProperty('--ring-opacity', '0.2')
          ringRef.current?.style.setProperty('--ring-scale', state.current.pressed ? '1.1' : '1.15')
          dotRef.current?.style.setProperty('--dot-opacity', '0.8')
        } else {
          ringRef.current?.style.setProperty('--ring-size', '28')
          ringRef.current?.style.setProperty('--ring-opacity', '0.14')
          ringRef.current?.style.setProperty('--ring-scale', state.current.pressed ? '0.95' : '1')
          dotRef.current?.style.setProperty('--dot-opacity', '1')
        }
      }
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('mouseover', handleOver, { passive: true })

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n
    const tick = () => {
      dot.current.x = lerp(dot.current.x, mouse.current.x, 0.35)
      dot.current.y = lerp(dot.current.y, mouse.current.y, 0.35)
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.18)
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.18)

      if (dotRef.current) {
        const dx = dot.current.x
        const dy = dot.current.y
        dotRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(var(--dot-scale))`
      }
      if (ringRef.current) {
        const rx = ring.current.x
        const ry = ring.current.y
        const size = Number(getComputedStyle(ringRef.current).getPropertyValue('--ring-size')) || 28
        ringRef.current.style.transform = `translate3d(${rx - size / 2}px, ${ry - size / 2}px, 0) scale(var(--ring-scale))`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('mouseover', handleOver)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] mix-blend-normal">
      <div
        ref={ringRef}
        className="absolute will-change-transform"
        style={{
          ['--ring-size' as any]: 28,
          ['--ring-scale' as any]: 1,
          ['--ring-opacity' as any]: 0.14,
          width: 'var(--ring-size)px',
          height: 'var(--ring-size)px',
          borderRadius: 9999,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.2)',
          background: 'radial-gradient(closest-side, rgba(255,255,255,0.14), rgba(255,255,255,0.06) 60%, rgba(255,255,255,0) 70%)',
          opacity: 'var(--ring-opacity)' as unknown as number,
          transition: 'opacity 150ms ease, filter 150ms ease',
          filter: 'blur(0.2px) saturate(120%)',
        }}
      />
      <div
        ref={dotRef}
        className="absolute will-change-transform"
        style={{
          ['--dot-scale' as any]: 1,
          ['--dot-opacity' as any]: 1,
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          borderRadius: 9999,
          background: 'white',
          boxShadow: '0 0 12px rgba(255,255,255,0.35)',
          opacity: 'var(--dot-opacity)' as unknown as number,
          transition: 'opacity 150ms ease',
        }}
      />
    </div>
  )
}
