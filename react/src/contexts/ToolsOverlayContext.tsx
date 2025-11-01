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
                  className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/90 p-0 text-left text-white shadow-2xl backdrop-blur flex max-h-[86dvh] flex-col"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                >
                  <button
                    onClick={close}
                    className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/90 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
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

                  <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] [background:radial-gradient(60%_60%_at_30%_10%,#ffffff12,transparent_60%)]" />
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
    <div>
      <div className="flex items-start gap-4 pr-10">
        <div className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          <div className="absolute inset-0 [background:radial-gradient(60%_60%_at_30%_20%,#ffffff12,transparent_60%)]" />
          {tool.icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tool.icon} alt="icon" className="z-10 h-9 w-9 object-contain" />
          ) : (
            <div className="z-10 text-xl">🧰</div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold leading-tight">{tool.name}</h3>
          <p className="text-sm text-white/60">{tool.category}</p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <p className="text-sm text-white/80">{tool.description}</p>
        {tool.tags && (
          <div className="flex flex-wrap gap-1.5">
            {tool.tags.map(tag => (
              <span key={tag} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/70">{tag}</span>
            ))}
          </div>
        )}
        {tool.href && (
          <a href={tool.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow transition hover:shadow-md">
            Ouvrir
            <HiMiniArrowTopRightOnSquare className="h-4 w-4" />
          </a>
        )}
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
      <div className="sticky top-0 z-10 border-b border-white/10 bg-neutral-900/90 p-4 sm:p-6 backdrop-blur">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              <div className="absolute inset-0 [background:radial-gradient(60%_60%_at_30%_20%,#ffffff12,transparent_60%)]" />
              {tool.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tool.icon} alt="icon" className="z-10 h-10 w-10 object-contain" />
              ) : (
                <div className="z-10 text-xl">🧰</div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold leading-tight">{tool.name}</h2>
              {tool.subtitle && <p className="text-sm text-white/60">{tool.subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {tool.href && (
              <a
                href={tool.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-black shadow transition hover:shadow-md"
              >
                Ouvrir
              </a>
            )}
            <button
              onClick={() => { (document.activeElement as HTMLElement | null)?.blur?.(); overlay?.close?.() }}
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Fermer
            </button>
          </div>
        </div>
        {tool.shortDescription && (
          <p className="mt-3 text-[15px] text-white/80">{tool.shortDescription}</p>
        )}
      </div>

      <div className="space-y-8 p-4 sm:p-6">
        <div ref={scrollRef} className="-mx-2 overflow-x-auto px-2 pb-2 no-scrollbar">
          <div className="flex snap-x snap-mandatory gap-4">
            {list.map((src, i) => (
              <div data-item key={src + i} className="snap-start shrink-0 w-[90vw] sm:w-[80vw] md:w-[68vw] lg:w-[980px]">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-inner">
                  <img src={src} loading="lazy" className="h-[56vw] max-h-[520px] w-full object-cover sm:h-[48vw] md:h-[40vw] lg:h-[520px]" alt="Capture d’écran" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="font-semibold">Interface intuitive</h3>
            <ul className="ml-5 mt-2 list-disc space-y-1 text-sm text-white/80">
              <li>Swipe gauche/droite ou clavier</li>
              <li>Design moderne, mode sombre</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="font-semibold">Apprentissage intelligent</h3>
            <ul className="ml-5 mt-2 list-disc space-y-1 text-sm text-white/80">
              <li>SRS adaptatif</li>
              <li>Progression personnalisée</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="font-semibold">Mode Examen</h3>
            <ul className="ml-5 mt-2 list-disc space-y-1 text-sm text-white/80">
              <li>40 questions, chronomètre</li>
              <li>Correction détaillée</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="font-semibold">Statistiques</h3>
            <ul className="ml-5 mt-2 list-disc space-y-1 text-sm text-white/80">
              <li>Maîtrise globale et par thème</li>
              <li>Niveaux, XP, badges, streak 🔥</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <h3 className="font-semibold">Avantages</h3>
            <ul className="ml-5 mt-2 list-disc space-y-1">
              <li>100% gratuit, sans publicité</li>
              <li>Hors‑ligne (PWA), respect de la vie privée</li>
              <li>Accessibilité soignée</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <h3 className="font-semibold">Technique</h3>
            <ul className="ml-5 mt-2 list-disc space-y-1">
              <li>React 18 + TS, Vite, Tailwind, Router v6</li>
              <li>LocalStorage versionné, SRS custom</li>
              <li>PWA (manifest, SW, cache)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
