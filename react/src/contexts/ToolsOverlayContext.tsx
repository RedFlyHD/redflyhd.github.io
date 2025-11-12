import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import type { Tool } from '../data/tools'
import { HiMiniArrowTopRightOnSquare } from 'react-icons/hi2'
import { lockBodyScroll, unlockBodyScroll } from '../utils/bodyScrollLock'

type Ctx = {
  open: (tool: Tool) => void
  close: () => void
  selected: Tool | null
}

const ToolsOverlayContext = createContext<Ctx | undefined>(undefined)

export function useToolsOverlay() {
  const ctx = useContext(ToolsOverlayContext)
  if (!ctx) throw new Error('useToolsOverlay must be used within ToolsOverlayProvider')
  return ctx
}

export function ToolsOverlayProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<Tool | null>(null)
  const open = useCallback((tool: Tool) => setSelected(tool), [])
  const close = useCallback(() => setSelected(null), [])

  useEffect(() => {
    if (selected) lockBodyScroll()
    else unlockBodyScroll()
    return () => unlockBodyScroll()
  }, [selected])

  // Close on Escape
  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [selected, close])

  const value = useMemo<Ctx>(() => ({ open, close, selected }), [open, close, selected])

  return (
    <ToolsOverlayContext.Provider value={value}>
      {/* Keep cards and overlay in same LayoutGroup for shared layoutId morph */}
      <LayoutGroup>
        {children}
        <AnimatePresence>
          {selected && (
            <motion.div
              key="tools-overlay"
              className="fixed inset-0 z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close}
              />
              <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
                <motion.div
                  layoutId={`card-${selected.id}`}
                  className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/20 bg-neutral-900/95 p-0 text-left text-white shadow-2xl shadow-black/50 backdrop-blur-xl flex max-h-[86dvh] flex-col"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                >
                  {/* Gradient accent */}
                  <div className="pointer-events-none absolute inset-0 rounded-[1rem] [background:radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.15),transparent_50%)]" />
                  <div className="pointer-events-none absolute inset-0 rounded-[1rem] [background:radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.08),transparent_50%)]" />
                  
                  <button
                    onClick={close}
                    className="absolute left-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-white/90 backdrop-blur-md transition-all hover:scale-105 hover:border-white/20 hover:bg-black/60 hover:text-white active:scale-95"
                    aria-label="Fermer"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M6.225 4.811 4.811 6.225 10.586 12l-5.775 5.775 1.414 1.414L12 13.414l5.775 5.775 1.414-1.414L13.414 12l5.775-5.775-1.414-1.414L12 10.586 6.225 4.811z" />
                    </svg>
                  </button>
                  {selected.id === 'revisit' ? (
                    <AppStoreLayout tool={selected} />
                  ) : (
                    <DefaultLayout tool={selected} />
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </ToolsOverlayContext.Provider>
  )
}

function DefaultLayout({ tool }: { tool: Tool }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="relative p-6 sm:p-8">
        {/* Gradient background decoration */}
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_50%)]" />
        
        <div className="relative flex items-start gap-5 pb-6">
          <motion.div 
            className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="absolute inset-0 [background:radial-gradient(60%_60%_at_30%_20%,#ffffff22,transparent_70%)]" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
            {tool.icon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={tool.icon} alt="icon" className="z-10 h-12 w-12 object-contain drop-shadow-lg" />
            ) : (
              <div className="z-10 text-3xl">🧰</div>
            )}
          </motion.div>
          <div className="flex-1 pt-1">
            <motion.h3 
              className="text-2xl font-bold leading-tight tracking-tight"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {tool.name}
            </motion.h3>
            <motion.p 
              className="mt-1 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              {tool.category}
            </motion.p>
          </div>
        </div>

        <motion.div 
          className="relative space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-5 backdrop-blur-sm">
            <p className="text-base leading-relaxed text-white/90">{tool.description}</p>
          </div>
          
          {tool.tags && tool.tags.length > 0 && (
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {tool.tags.map((tag, i) => (
                  <motion.span 
                    key={tag}
                    className="group relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-white/10 to-white/5 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition-all hover:border-white/20 hover:from-white/15 hover:to-white/10"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <span className="relative z-10">{tag}</span>
                    <div className="absolute inset-0 -z-0 translate-y-full bg-gradient-to-t from-white/10 to-transparent transition-transform group-hover:translate-y-0" />
                  </motion.span>
                ))}
              </div>
            </div>
          )}
          
          {tool.href && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 300, damping: 20 }}
            >
              <a 
                href={tool.href} 
                target="_blank" 
                rel="noreferrer" 
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-white to-white/95 px-6 py-3 text-sm font-bold text-black shadow-lg shadow-white/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-white/30"
              >
                <span className="relative z-10">Ouvrir l'outil</span>
                <HiMiniArrowTopRightOnSquare className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <div className="absolute inset-0 -z-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function AppStoreLayout({ tool }: { tool: Tool }) {
  const overlay = useContext(ToolsOverlayContext)
  const [gallery, setGallery] = useState<string[]>([
    '/dev-img/ReVisit/HomePage.png',
    '/dev-img/ReVisit/Questions%20View.png',
    '/dev-img/ReVisit/ProgressView.png',
    '/dev-img/ReVisit/ProfilView.png',
  ])
  useEffect(() => {
    fetch('/dev-img/ReVisit/manifest.json', { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((data: { images?: string[] }) => {
        if (Array.isArray(data.images) && data.images.length) setGallery(data.images)
      })
      .catch(() => {})
  }, [])
  // Auto-scroll + infinite loop
  const baseLen = gallery.length || 1
  const list = useMemo(() => [...gallery, ...gallery, ...gallery], [gallery])
  const [idx, setIdx] = useState(baseLen)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = window.setInterval(() => setIdx((i) => i + 1), 3500)
    return () => clearInterval(id)
  }, [list.length])

  useEffect(() => {
    setIdx(gallery.length || 1)
  }, [gallery.length])

  useEffect(() => {
    const sc = scrollRef.current
    if (!sc) return
    const items = Array.from(sc.querySelectorAll('[data-item]')) as HTMLElement[]
    const current = items[idx]
    if (current) sc.scrollTo({ left: current.offsetLeft - 8, behavior: 'smooth' })
    if (idx >= baseLen * 2 - 1) {
      const reset = idx - baseLen
      const t = window.setTimeout(() => {
        const el = items[reset]
        if (el) sc.scrollTo({ left: el.offsetLeft - 8, behavior: 'auto' })
        setIdx(reset + 1)
      }, 520)
      return () => clearTimeout(t)
    }
  }, [idx, baseLen])

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="sticky top-0 z-10 border-b border-white/10 bg-gradient-to-b from-neutral-900/95 to-neutral-900/90 p-5 sm:p-7 backdrop-blur-xl">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 shadow-lg"
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 [background:radial-gradient(60%_60%_at_30%_20%,#ffffff25,transparent_70%)]" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
              {tool.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tool.icon} alt="icon" className="z-10 h-12 w-12 object-contain drop-shadow-lg" />
              ) : (
                <div className="z-10 text-2xl">🧰</div>
              )}
            </motion.div>
            <div>
              <motion.h2 
                className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {tool.name}
              </motion.h2>
              {tool.subtitle && (
                <motion.p 
                  className="mt-1 text-sm text-white/70"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  {tool.subtitle}
                </motion.p>
              )}
            </div>
          </div>
          {tool.href && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <a
                href={tool.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-white to-white/95 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-white/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-white/30 active:scale-95"
              >
                Ouvrir
                <HiMiniArrowTopRightOnSquare className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </motion.div>
          )}
        </div>
        {tool.shortDescription && (
          <motion.p 
            className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3 text-[15px] leading-relaxed text-white/90 backdrop-blur-sm"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            {tool.shortDescription}
          </motion.p>
        )}
      </div>

            <div className="space-y-8 p-5 sm:p-7">
        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/60">Aperçu</h3>
          <div ref={scrollRef} className="-mx-2 overflow-x-auto px-2 pb-3 no-scrollbar">
            <div className="flex snap-x snap-mandatory gap-4">
              {list.map((src, i) => (
                <motion.div 
                  data-item 
                  key={src + i} 
                  className="snap-start shrink-0 w-[90vw] sm:w-[80vw] md:w-[68vw] lg:w-[980px]"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 shadow-xl shadow-black/20 transition-all hover:border-white/30 hover:shadow-2xl hover:shadow-black/30">
                    <div className="absolute inset-0 -z-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <img src={src} loading="lazy" className="h-[56vw] max-h-[520px] w-full object-cover sm:h-[48vw] md:h-[40vw] lg:h-[520px]" alt="Capture d'écran" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/60">Fonctionnalités</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <motion.div 
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-5 backdrop-blur-sm transition-all hover:border-white/20 hover:from-white/[0.12] hover:to-white/[0.05]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="absolute inset-0 -z-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <span className="text-lg">✨</span>
              </div>
              <h4 className="mb-2 font-bold">Interface intuitive</h4>
              <ul className="space-y-1.5 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/60" />
                  <span>Swipe gauche/droite ou clavier</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/60" />
                  <span>Design moderne, mode sombre</span>
                </li>
              </ul>
            </motion.div>
            <motion.div 
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-5 backdrop-blur-sm transition-all hover:border-white/20 hover:from-white/[0.12] hover:to-white/[0.05]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="absolute inset-0 -z-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <span className="text-lg">🧠</span>
              </div>
              <h4 className="mb-2 font-bold">Apprentissage intelligent</h4>
              <ul className="space-y-1.5 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/60" />
                  <span>SRS adaptatif</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/60" />
                  <span>Progression personnalisée</span>
                </li>
              </ul>
            </motion.div>
            <motion.div 
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-5 backdrop-blur-sm transition-all hover:border-white/20 hover:from-white/[0.12] hover:to-white/[0.05]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="absolute inset-0 -z-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <span className="text-lg">📝</span>
              </div>
              <h4 className="mb-2 font-bold">Mode Examen</h4>
              <ul className="space-y-1.5 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/60" />
                  <span>40 questions, chronomètre</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/60" />
                  <span>Correction détaillée</span>
                </li>
              </ul>
            </motion.div>
            <motion.div 
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-5 backdrop-blur-sm transition-all hover:border-white/20 hover:from-white/[0.12] hover:to-white/[0.05]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <div className="absolute inset-0 -z-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <span className="text-lg">📊</span>
              </div>
              <h4 className="mb-2 font-bold">Statistiques</h4>
              <ul className="space-y-1.5 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/60" />
                  <span>Maîtrise globale et par thème</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/60" />
                  <span>Niveaux, XP, badges, streak 🔥</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <motion.div 
            className="relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-green-500/10 via-white/5 to-transparent p-5 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="absolute inset-0 -z-0 [background:radial-gradient(ellipse_at_top_left,rgba(34,197,94,0.1),transparent_60%)]" />
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
              <span className="text-lg">💎</span>
            </div>
            <h4 className="mb-3 text-lg font-bold">Avantages</h4>
            <ul className="space-y-2 text-sm text-white/90">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                <span>100% gratuit, sans publicité</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                <span>Hors‑ligne (PWA), respect de la vie privée</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                <span>Accessibilité soignée</span>
              </li>
            </ul>
          </motion.div>
          <motion.div 
            className="relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-blue-500/10 via-white/5 to-transparent p-5 backdrop-blur-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
          >
            <div className="absolute inset-0 -z-0 [background:radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.1),transparent_60%)]" />
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
              <span className="text-lg">⚙️</span>
            </div>
            <h4 className="mb-3 text-lg font-bold">Technique</h4>
            <ul className="space-y-2 text-sm text-white/90">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span>React 18 + TS, Vite, Tailwind, Router v6</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span>LocalStorage versionné, SRS custom</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span>PWA (manifest, SW, cache)</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
