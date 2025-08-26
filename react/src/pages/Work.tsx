import ProjectCard from '../components/ProjectCard'
import Modal from '../components/Modal'
import { motion, useAnimation, Variants } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function Work() {
  const years = useMemo(() => [2025, 2024, 2023, 2022, 2021, 2019], [])
  const [activeYear, setActiveYear] = useState<number>(2025)
  const refs = useRef<Record<number, HTMLElement | null>>({})
  const trackRef = useRef<HTMLDivElement | null>(null)
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const [cursorY, setCursorY] = useState(0)
  const [phase, setPhase] = useState<'stacked' | 'animating' | 'tracking'>('stacked')
  const firstScrollDone = useRef(false)
  const animTimer = useRef<number | null>(null)
  const [labelPos, setLabelPos] = useState<Record<number, number>>({})

  useEffect(() => {
    const onScroll = () => {
      const firstEl = refs.current[years[0]]
      const lastEl = refs.current[years[years.length - 1]]
      const track = trackRef.current
      const cursor = cursorRef.current
      if (!firstEl || !lastEl || !track || !cursor) return
      const viewH = window.innerHeight
      const firstRect = firstEl.getBoundingClientRect()
      const lastRect = lastEl.getBoundingClientRect()
      const rangeStart = firstRect.top + window.scrollY
      const rangeEnd = lastRect.bottom + window.scrollY
      const totalRange = Math.max(1, rangeEnd - rangeStart)
      const cursorStart = rangeStart
      const cursorEnd = rangeEnd - viewH
      const cursorDen = Math.max(1, cursorEnd - cursorStart)
      const y = (window.scrollY - cursorStart) / cursorDen
      const progress = Math.min(1, Math.max(0, y))
      const trackHeight = track.getBoundingClientRect().height
      const cursorHeight = cursor.getBoundingClientRect().height
      const maxY = Math.max(0, trackHeight - cursorHeight)
      setCursorY(progress * maxY)
      if (window.scrollY <= cursorStart + 2) setActiveYear(years[0])
      if (window.scrollY >= cursorEnd - 2) setActiveYear(years[years.length - 1])
  const trackRect = track.getBoundingClientRect()
  const pillH = 24
  const minGap = 26
      type Item = { year: number; desired: number; pos: number }
      const items: Item[] = []
      years.forEach((year) => {
        const el = refs.current[year]
        if (!el) return
        const r = el.getBoundingClientRect()
        const centerViewport = r.top + r.height / 2
        let desired = centerViewport - trackRect.top - pillH / 2
        desired = Math.max(0, Math.min(trackHeight - pillH, desired))
        items.push({ year, desired, pos: desired })
      })
      items.sort((a, b) => years.indexOf(a.year) - years.indexOf(b.year))
      
      items.forEach((it) => {
        const idx = years.indexOf(it.year)
        const step = (trackHeight - pillH) / Math.max(1, years.length - 1)
        const baseline = idx * step
        it.pos = Math.max(0, Math.min(trackHeight - pillH, (it.desired * 0.8) + (baseline * 0.2)))
      })
      
      for (let i = 1; i < items.length; i++) {
        const prev = items[i - 1]
        const curr = items[i]
        if (curr.pos < prev.pos + minGap) {
          curr.pos = prev.pos + minGap
        }
      }
      
      if (items.length) {
        const overflow = items[items.length - 1].pos - (trackHeight - pillH)
        if (overflow > 0) {
          for (const it of items) it.pos = Math.max(0, it.pos - overflow)
        }
      }
      
      for (let i = items.length - 2; i >= 0; i--) {
        const next = items[i + 1]
        const curr = items[i]
        if (curr.pos > next.pos - minGap) {
          curr.pos = Math.max(0, next.pos - minGap)
        }
      }
      const posMap: Record<number, number> = {}
      items.forEach((it) => (posMap[it.year] = it.pos))
      setLabelPos(posMap)
      if (!firstScrollDone.current) {
        firstScrollDone.current = true
        setPhase('animating')
        if (animTimer.current) cancelAnimationFrame(animTimer.current)
        animTimer.current = window.setTimeout(() => setPhase('tracking'), 420) as unknown as number
      }
      const trackCenter = trackHeight / 2
      let bestY: number = years[0]
      let bestD = Infinity
      for (const it of items) {
        const d = Math.abs((it.pos + pillH / 2) - trackCenter)
        if (d < bestD) {
          bestD = d
          bestY = it.year
        }
      }
      setActiveYear(bestY)
    }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [years])

  const scrollToYear = (y: number) => {
    const el = refs.current[y]
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const sec2024 = useAnimation()
  const sec2025 = useAnimation()
  const sec2023 = useAnimation()
  const sec2022 = useAnimation()
  const sec2021 = useAnimation()
  const sec2019 = useAnimation()
  const listVariants: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
  const itemVariants: Variants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

  const [openBloond, setOpenBloond] = useState(false)
  const [openYouTube, setOpenYouTube] = useState(false)

  return (
    <div className="relative sm:grid sm:grid-cols-[7rem,1fr] sm:gap-6">
      <aside className="sticky top-24 z-10 hidden w-32 self-start sm:flex sm:py-2">
        <div className="relative flex h-[calc(100dvh-96px)] items-start">
          <div ref={trackRef} className="relative h-full w-px overflow-visible bg-white/10">
            <div className="absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-white via-white/70 to-white/20 [mask-image:linear-gradient(180deg,transparent,black_20%,black_80%,transparent)] animate-[pulse_3s_ease-in-out_infinite]" />
            <div ref={cursorRef} style={{ top: cursorY }} className="pointer-events-none absolute left-[-1px] h-16 w-[3px] rounded bg-white/90 shadow-[0_0_12px_2px_rgba(255,255,255,0.4)]" />
          </div>
          <ul className="relative ml-3 h-full w-[6rem]">
            {years.map(y => (
        <li
                key={y}
                className="absolute"
                style={{
          top: phase === 'stacked' ? years.indexOf(y) * 28 : Math.max(0, (labelPos[y] ?? 0)),
          transition: phase === 'animating' ? 'top 380ms cubic-bezier(0.16,1,0.3,1)' : 'none',
          transitionDelay: phase === 'animating' ? `${(years.indexOf(y)) * 30}ms` : '0ms',
                }}
              >
                <button
                  onClick={() => scrollToYear(y)}
                  className={`rounded-full px-3 py-1 text-xs transition ${activeYear === y ? 'bg-white text-black shadow' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
                >
                  {y}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <div className="sm:ml-0">
        <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">Mes projets</h1>

  <motion.section
    data-year={2025}
    ref={el => (refs.current[2025] = el)}
    className="scroll-mt-24 space-y-4 pb-10"
    initial="hidden"
    animate={sec2025}
    variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
  viewport={{ amount: 0.15, once: true }}
    onViewportEnter={() => sec2025.start('show')}
  >
          <h2 className="relative ml-6 text-xl font-semibold">
            <span className="absolute left-[-24px] top-1/2 h-px w-5 -translate-y-1/2 bg-gradient-to-r from-white/60 to-transparent">
              <span className={`absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${activeYear===2025?'bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]':'bg-white/40'}`}>
                <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
              </span>
            </span>
            2025
          </h2>
          <motion.div
            className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2"
            initial="hidden"
            animate={sec2025}
            variants={listVariants}
          >
            <motion.div variants={itemVariants}>
              <ProjectCard date="2025" title="Une nouvelle ère commence !" image="/minia/unenvler.png" href="https://youtu.be/N5fSRFc3-RA?si=0388-VmST7JDUpic" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ProjectCard date="2025" title="Et maintenant ?" image="/minia/et maintenantFev1.png" href="https://www.youtube.com/watch?v=qnqZrftvB2I&list=PLmZyM6Vr837yt6o4VYKGuHN-xjYbga_sG&index=6" />
            </motion.div>
          </motion.div>
        </motion.section>

  <motion.section
    data-year={2024}
    ref={el => (refs.current[2024] = el)}
    className="scroll-mt-24 space-y-4 pb-10"
    initial="hidden"
    animate={sec2024}
    variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
  viewport={{ amount: 0.15, once: true }}
    onViewportEnter={() => sec2024.start('show')}
  >
          <h2 className="relative ml-6 text-xl font-semibold">
            <span className="absolute left-[-24px] top-1/2 h-px w-5 -translate-y-1/2 bg-gradient-to-r from-white/60 to-transparent">
              <span className={`absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${activeYear===2024?'bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]':'bg-white/40'}`}>
                <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
              </span>
            </span>
            2024
          </h2>
          <motion.div
            className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2"
            initial="hidden"
            animate={sec2024}
            variants={listVariants}
          >
            <motion.div variants={itemVariants}>
            <ProjectCard date="2024" title="RedFly × Garfield" image="/minia/2024RedFly x Garfield.jpg" href="https://youtu.be/Mz2yruk83rE" />
            </motion.div>
            <motion.div variants={itemVariants}>
            <ProjectCard date="2024-06-04" title="Reveal ReNew - June 4" image="/minia/2024RevealJune4.jpg" href="https://youtu.be/-dp9QM9ZIdU" />
            </motion.div>
            <motion.div variants={itemVariants}>
            <ProjectCard date="2024-06" title="Teaser ReNew - June 4" image="/minia/2024TeaserJune4.jpg" href="https://youtu.be/uo3t5csmEaQ" />
            </motion.div>
            <motion.div variants={itemVariants}>
            <ProjectCard date="2024" title="New Era - ReNew" image="/minia/2024NewEraReNew.jpg" href="https://youtu.be/NRHOwqc_x4A" />
            </motion.div>
          </motion.div>
        </motion.section>

  



  <motion.section
    data-year={2023}
    ref={el => (refs.current[2023] = el)}
    className="scroll-mt-24 space-y-4 pb-10"
    initial="hidden"
    animate={sec2023}
    variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
  viewport={{ amount: 0.15, once: true }}
    onViewportEnter={() => sec2023.start('show')}
  >
          <h2 className="relative ml-6 text-xl font-semibold">
            <span className="absolute left-[-24px] top-1/2 h-px w-5 -translate-y-1/2 bg-gradient-to-r from-white/60 to-transparent">
              <span className={`absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${activeYear===2023?'bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]':'bg-white/40'}`}>
                <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
              </span>
            </span>
            2023
          </h2>
          <motion.div
            className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2"
            initial="hidden"
            animate={sec2023}
            variants={listVariants}
          >
            <motion.div variants={itemVariants}>
            <ProjectCard date="2023" title="New RedFly 2023" image="/rss/New RedFly 2023.webp" href="https://www.youtube.com/watch?v=xxxx" />
            </motion.div>
          </motion.div>
        </motion.section>

  <motion.section
    data-year={2022}
    ref={el => (refs.current[2022] = el)}
    className="scroll-mt-24 space-y-4 pb-10"
    initial="hidden"
    animate={sec2022}
    variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
  viewport={{ amount: 0.15, once: true }}
    onViewportEnter={() => sec2022.start('show')}
  >
          <h2 className="relative ml-6 text-xl font-semibold">
            <span className="absolute left-[-24px] top-1/2 h-px w-5 -translate-y-1/2 bg-gradient-to-r from-white/60 to-transparent">
              <span className={`absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${activeYear===2022?'bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]':'bg-white/40'}`}>
                <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
              </span>
            </span>
            2022
          </h2>
          <motion.div
            className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2"
            initial="hidden"
            animate={sec2022}
            variants={listVariants}
          >
            <motion.div variants={itemVariants}>
            <ProjectCard
              date="2022"
              title="Build Bêta 22u03 [ Test 3 ]"
              image="/minia/2022test3.jpg"
              href="https://www.youtube.com/watch?v=7omUMMZ2lJw"
            />
            </motion.div>
            <motion.div variants={itemVariants}>
            <ProjectCard
              date="2022"
              title="Build Bêta 22u03 [ Test 2 ]"
              image="/minia/2022test2.jpg"
              href="https://www.youtube.com/watch?v=9AhS5S6GKk0"
            />
            </motion.div>
            <motion.div variants={itemVariants}>
            <ProjectCard
              date="2022"
              title="Build 22u03 Trailer Test"
              image="/minia/2022test1.jpg"
              href="https://www.youtube.com/watch?v=UqtYCgvxXiw"
            />
            </motion.div>
          </motion.div>
        </motion.section>

  <motion.section
    data-year={2021}
    ref={el => (refs.current[2021] = el)}
    className="scroll-mt-24 space-y-4 pb-10"
    initial="hidden"
    animate={sec2021}
    variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
  viewport={{ amount: 0.15, once: true }}
    onViewportEnter={() => sec2021.start('show')}
  >
          <h2 className="relative ml-6 text-xl font-semibold">
            <span className="absolute left-[-24px] top-1/2 h-px w-5 -translate-y-1/2 bg-gradient-to-r from-white/60 to-transparent">
              <span className={`absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${activeYear===2021?'bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]':'bg-white/40'}`}>
                <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
              </span>
            </span>
            2021
          </h2>
          <motion.div
            className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2"
            initial="hidden"
            animate={sec2021}
            variants={listVariants}
          >
            <motion.div variants={itemVariants}>
            <ProjectCard
              date="2021"
              title="Desastivale Prototype 1 - Trailer"
              image="/minia/2021.jpg"
              href="https://www.youtube.com/watch?v=W9MdYg3KT30"
            />
            </motion.div>
          </motion.div>
        </motion.section>

  <motion.section
    data-year={2019}
    ref={el => (refs.current[2019] = el)}
    className="scroll-mt-24 space-y-4 pb-10"
    initial="hidden"
    animate={sec2019}
    variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
  viewport={{ amount: 0.15, once: true }}
    onViewportEnter={() => sec2019.start('show')}
  >
          <h2 className="relative ml-6 text-xl font-semibold">
            <span className="absolute left-[-24px] top-1/2 h-px w-5 -translate-y-1/2 bg-gradient-to-r from-white/60 to-transparent">
              <span className={`absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${activeYear===2019?'bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]':'bg-white/40'}`}>
                <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
              </span>
            </span>
            2019
          </h2>
          <motion.div
            className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2"
            initial="hidden"
            animate={sec2019}
            variants={listVariants}
          >
            <motion.div variants={itemVariants}>
              <ProjectCard
                title="Bloond Survie"
                image="/projects/Bloond-Survie/image.webp"
                date="2019 → 2022 · Statut: Abandonné"
                onClick={() => setOpenBloond(true)}
                actionLabel="En savoir plus"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ProjectCard
                title="YouTube"
                image="/rss/YouTube Old.jpg"
                date={"2019 → aujourd'hui · Statut: Actif"}
                onClick={() => setOpenYouTube(true)}
                actionLabel="En savoir plus"
              />
            </motion.div>
          </motion.div>
        </motion.section>

      <Modal open={openBloond} onClose={() => setOpenBloond(false)}>
        <div className="relative">
          <div className="relative h-48 w-full sm:h-56">
            <img src="/projects/Bloond-Survie/image.webp" alt="Bannière Bloond Survie" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xl font-bold">Bloond Survie</h3>
              <span className="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1 text-sm font-medium text-red-300">
                <span className="h-2 w-2 rounded-full bg-red-400" /> Abandonné
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-xs uppercase tracking-wide text-white/60">Début</p>
                <p className="text-sm">2019</p>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-xs uppercase tracking-wide text-white/60">Fin</p>
                <p className="text-sm">2022</p>
              </div>
            </div>

            <div className="mt-5">
              <h4 className="mb-2 text-sm font-semibold text-white/90">Collaborateurs</h4>
              <div className="flex flex-wrap gap-2">
                <a href="https://www.youtube.com/@SynaxxXD" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                  Synaxx
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M10 17l5-5-5-5v10z" />
                  </svg>
                </a>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Amadeo</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Swixi</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Toto</span>
              </div>
            </div>

            <div className="mt-5">
              <h4 className="mb-2 text-sm font-semibold text-white/90">Description</h4>
              <p className="text-sm text-white/80">
                Bloond Survie est un serveur Minecraft initié en 2019 avec mon ami Synaxx, pensé à l’origine comme un projet de serveur mini‑jeux. Nous étions très jeunes, avec peu de budget, et nous avons dû tout faire nous‑mêmes. C’est véritablement là que j’ai fait mes débuts : développement, communication, design, montage…
              </p>
              <p className="mt-2 text-sm text-white/80">
                Avec le recul, même si j’ai peu d’archives, ce projet reste le point de départ d’un nouveau chapitre. Sans Bloond Survie, ce portfolio et son contenu n’existeraient pas – ou seraient très différents.
              </p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={openYouTube} onClose={() => setOpenYouTube(false)}>
        <div className="relative">
          <div className="relative h-48 w-full sm:h-56 overflow-hidden">
            <img src="/rss/RedFly Logo 20232025.png" alt="Bannière YouTube" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xl font-bold">YouTube</h3>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Actif
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-xs uppercase tracking-wide text-white/60">Début</p>
                <p className="text-sm">2019</p>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-xs uppercase tracking-wide text-white/60">Aujourd'hui</p>
                <p className="text-sm">Toujours en cours</p>
              </div>
            </div>

            <div className="mt-5">
              <h4 className="mb-2 text-sm font-semibold text-white/90">Description</h4>
              <div className="space-y-2 text-sm text-white/80">
                <p>
                  Depuis tout petit, YouTube me passionne. En 2019, je me lance vraiment sur la plateforme. Pendant plusieurs années, je tâtonne avec des contenus Minecraft et gaming ; ça m&apos;a formé, mais je sentais que quelque chose manquait.
                </p>
                <p>
                  En 2022, je découvre sérieusement After Effects. À partir de là, je n&apos;ai plus cessé de m&apos;entraîner. En 2024, déclic : je me rends compte que je peux produire des montages bien plus aboutis, notamment sur des formats best-of de live (à la Cacabox / Wankil). C&apos;est motivant… mais très chronophage.
                </p>
                <p>
                  Aujourd&apos;hui, je fais une courte pause publique pour revenir avec des vidéos vraiment percutantes. En coulisses, je continue de m&apos;entraîner au montage pour gagner en vitesse et en précision. Mon objectif : ne publier que des bangers, et—peut‑être un jour—vivre pleinement de ce qui me motive chaque matin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

  
      </div>
    </div>
  )
}
