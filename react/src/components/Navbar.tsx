import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import FancyContactButton from './FancyContactButton'
import { MouseEvent, useRef, useState } from 'react'

function LinkNav({ to, children, end = false }: { to: string; children: React.ReactNode; end?: boolean }) {
  const shellRef = useRef<HTMLDivElement>(null)
  const [dir, setDir] = useState<'l' | 'r'>('r')
  const location = useLocation()
  const isActive = end ? location.pathname === to : (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to))
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = shellRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.setProperty('--x', `${x}px`)
    el.style.setProperty('--y', `${y}px`)
  }
  const onEnter = (e: MouseEvent<HTMLDivElement>) => {
    const el = shellRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setDir(e.clientX < r.left + r.width / 2 ? 'l' : 'r')
  }
  return (
    <div
      ref={shellRef}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      className="group relative h-8 overflow-hidden rounded-full"
    >
      <span
        className={`pointer-events-none absolute inset-0 -z-10 rounded-full bg-white/10 transition-transform duration-300 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100`}
        style={{ transformOrigin: dir === 'l' ? 'left center' : 'right center' }}
      />
      <span className="pointer-events-none absolute inset-0 -z-10 rounded-full [background:radial-gradient(120px_120px_at_var(--x)_var(--y),rgba(255,255,255,0.10),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
  <NavLink to={to} end={end} className={`relative z-10 flex h-full items-center rounded-full px-3 text-xs leading-none transition`}>
        {children}
      </NavLink>
    </div>
  )
}

function ButtonNav({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  const shellRef = useRef<HTMLButtonElement>(null)
  const [dir, setDir] = useState<'l' | 'r'>('r')
  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = shellRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.setProperty('--x', `${x}px`)
    el.style.setProperty('--y', `${y}px`)
  }
  const onEnter = (e: MouseEvent<HTMLButtonElement>) => {
    const el = shellRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setDir(e.clientX < r.left + r.width / 2 ? 'l' : 'r')
  }
  return (
    <button
      ref={shellRef}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      className="group relative inline-flex h-8 items-center overflow-hidden rounded-full px-3 text-xs leading-none"
    >
      <span
        className="pointer-events-none absolute inset-0 -z-10 scale-x-0 rounded-full bg-white/10 transition-transform duration-300 ease-out group-hover:scale-x-100"
        style={{ transformOrigin: dir === 'l' ? 'left center' : 'right center' }}
      />
      <span className="pointer-events-none absolute inset-0 -z-10 rounded-full [background:radial-gradient(120px_120px_at_var(--x)_var(--y),rgba(255,255,255,0.10),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="relative z-10">Infos</span>
    </button>
  )
}

export default function Navbar({ onOpenAbout, onOpenContact }: { onOpenAbout?: () => void; onOpenContact?: () => void }) {
  return (
  <div className="sticky top-0 z-50 flex justify-center px-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
    <motion.nav
      initial={{ y: -12, opacity: 0, filter: 'blur(2px)' }}
      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto flex w-full max-w-3xl items-center justify-between gap-2 rounded-full border border-white/10 bg-black/40 px-1.5 py-1 sm:px-2 sm:py-1.5 backdrop-blur"
    >
        <Link to="/" className="flex items-center gap-2 px-1 shrink-0">
          <img src="/rss/redfly.svg" alt="logo" className="h-6 w-6" />
          <span className="hidden text-sm font-semibold sm:inline">RedFly</span>
        </Link>

    <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 overflow-x-auto no-scrollbar sm:justify-end">
          <LinkNav to="/" end>
            Accueil
          </LinkNav>
          <ButtonNav onClick={onOpenAbout}>
            Infos
          </ButtonNav>
          <LinkNav to="/work">
            Projets
          </LinkNav>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onOpenContact}
            aria-label="Contact"
            id="openContactBtnMobile"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white hover:bg-white/20 sm:hidden"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
          <div className="hidden sm:block">
            <FancyContactButton onClick={onOpenContact} />
          </div>
        </div>
  </motion.nav>
    </div>
  )
}
