import { motion } from 'framer-motion'
import { MouseEvent, useRef } from 'react'

export default function FancyContactButton({ onClick }: { onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.setProperty('--x', `${x}px`)
    el.style.setProperty('--y', `${y}px`)
    const rx = (x / r.width) - 0.5
    const ry = (y / r.height) - 0.5
    el.style.setProperty('--rx', rx.toString())
    el.style.setProperty('--ry', ry.toString())
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0')
    el.style.setProperty('--ry', '0')
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      id="openContactBtn"
      aria-label="Ouvrir le contact"
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.985, y: 0 }}
      className="group relative inline-flex items-center justify-center overflow-hidden rounded-full px-5 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      style={{
        background:
          'radial-gradient(160px_160px_at_var(--x)_var(--y),rgba(255,255,255,0.25),transparent_60%), linear-gradient(135deg, #7c3aed, #2563eb)',
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-10 -z-10 opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
        style={{ background: 'radial-gradient(360px 360px at 50% 50%, rgba(255,255,255,0.6), transparent 60%)' }}
      />
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/20 transition group-hover:ring-white/30" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition duration-700 group-hover:translate-x-[220%] group-hover:opacity-100"
        style={{ transform: 'translateX(-120%)' }}
      />
      <span
        className="relative z-10 flex items-center gap-2 transition-transform"
        style={{ transform: 'translate3d(calc(var(--rx)*6px), calc(var(--ry)*6px), 0)', textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.45))' }}>
          <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
        </svg>
        <span>Contact</span>
      </span>
    </motion.button>
  )
}
