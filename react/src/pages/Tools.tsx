import { useMemo, useRef, useState, MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'
import type { Tool, ToolCategory } from '../data/tools'
import { categories, tools as toolsData } from '../data/tools'
import { useToolsOverlay } from '../contexts/ToolsOverlayContext'

export default function Tools() {
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState<ToolCategory | 'Tous'>('Tous')
  const { open: openTool } = useToolsOverlay()

  const tools = toolsData // future: fetch or extend here

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tools.filter(t => {
      const matchQuery = !q || [t.name, t.description, ...(t.tags ?? [])].some(s => s.toLowerCase().includes(q))
      const matchCat = activeCat === 'Tous' || t.category === activeCat
      return matchQuery && matchCat
    })
  }, [tools, query, activeCat])

  return (
    <div className="relative">
      <div>
        <div className="relative mb-6 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold sm:text-3xl">Mes outils</h1>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center">
          <SearchBar value={query} onChange={setQuery} />
          <CategoryTabs
            active={activeCat}
            onChange={setActiveCat}
            items={["Tous" as const, ...categories]}
          />
        </div>

        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {filtered.map((t) => (
            <ToolCard key={t.id} tool={t} onOpen={() => openTool(t)} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
              Aucun outil trouvé.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const shellRef = useRef<HTMLDivElement>(null)
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = shellRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--x', `${e.clientX - r.left}px`)
    el.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return (
    <div
      ref={shellRef}
      onMouseMove={onMove}
      className="group relative flex-1 overflow-hidden rounded-full border border-white/10 bg-black/40 px-3 py-2 backdrop-blur sm:max-w-md"
    >
      <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 [background:radial-gradient(140px_140px_at_var(--x,_50%)_var(--y,_50%),rgba(255,255,255,0.08),transparent_60%)]" />
      <div className="relative z-10 flex items-center gap-2 text-white/70">
        <HiOutlineMagnifyingGlass className="h-5 w-5" />
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Rechercher un outil…"
          className="w-full appearance-none border-0 bg-transparent text-sm outline-none placeholder:text-white/40 focus:border-0 focus:outline-none focus:ring-0 focus:ring-transparent"
        />
      </div>
    </div>
  )
}

function CategoryTabs({ items, active, onChange }: { items: (ToolCategory | 'Tous')[]; active: ToolCategory | 'Tous'; onChange: (v: ToolCategory | 'Tous') => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {items.map((it) => (
        <button
          key={it}
          onClick={() => onChange(it)}
          className={`rounded-full px-3 py-1 text-xs transition ${active === it ? 'bg-white text-black shadow' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
        >
          {it}
        </button>
      ))}
    </div>
  )
}

function ToolCard({ tool, onOpen }: { tool: Tool; onOpen: () => void }) {
  const shellRef = useRef<HTMLButtonElement>(null)
  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = shellRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--x', `${e.clientX - r.left}px`)
    el.style.setProperty('--y', `${e.clientY - r.top}px`)
  }

  return (
    <motion.button
      ref={shellRef}
      onMouseMove={onMove}
      onClick={onOpen}
      layoutId={`card-${tool.id}`}
      className="group relative flex w-full flex-col items-start overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-shadow hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.25)]"
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <span className="pointer-events-none absolute inset-0 -z-10 rounded-[1.25rem] [background:radial-gradient(220px_220px_at_var(--x)_var(--y),rgba(255,255,255,0.10),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-center gap-3">
        <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-xl border border-white/10 bg-black/30 shadow-inner">
          <div className="absolute inset-0 [background:radial-gradient(60%_60%_at_30%_20%,#ffffff12,transparent_60%)]" />
          {tool.icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tool.icon} alt="icon" className="z-10 h-8 w-8 object-contain" />
          ) : (
            <div className="z-10 text-lg">🧰</div>
          )}
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">{tool.name}</div>
          <div className="text-xs text-white/60">{tool.category}</div>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-white/70">{tool.description}</p>
      {tool.tags && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tool.tags.map(tag => (
            <span key={tag} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/70">{tag}</span>
          ))}
        </div>
      )}
    </motion.button>
  )
}

// Overlay géré globalement par le provider pour conserver le morphing
