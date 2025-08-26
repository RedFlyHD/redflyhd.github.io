import ProjectCard from '../components/ProjectCard'
import { motion, useAnimation, Variants } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  const recentControls = useAnimation()
  const contactControls = useAnimation()
  const listVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  }
  return (
  <div className="space-y-10 sm:space-y-12">
  <Hero />

      <motion.section
        initial="hidden"
        animate={recentControls}
        variants={{ hidden: { opacity: 1 }, show: { opacity: 1 } }}
  viewport={{ amount: 0.15, once: true }}
        onViewportEnter={() => recentControls.start('show')}
      >
        <motion.h2
          variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.35 }}
          className="mb-4 text-xl font-semibold sm:mb-6 sm:text-2xl"
        >
          Quelques-uns de mes projets
        </motion.h2>
        <motion.div
          variants={listVariants}
          className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2"
        >
          <motion.div variants={itemVariants}>
          <ProjectCard title="Une nouvelle ère commence !" image="/minia/unenvler.png" href="https://youtu.be/N5fSRFc3-RA?si=0388-VmST7JDUpic" />
          </motion.div>
          <motion.div variants={itemVariants}>
          <ProjectCard title="RedFly × Garfield" image="/minia/2024RedFly x Garfield.jpg" href="https://youtu.be/Mz2yruk83rE" />
          </motion.div>
          <motion.div variants={itemVariants}>
          <ProjectCard title="Reveal ReNew - June 4" image="/minia/2024RevealJune4.jpg" href="https://youtu.be/-dp9QM9ZIdU" />
          </motion.div>
          <motion.div variants={itemVariants}>
             <Link
              to="/work"
              className="group relative block w-full overflow-hidden rounded-2xl bg-white/[0.05] shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.28)] aspect-[16/9] min-h-[200px] sm:min-h-[240px] transform-gpu will-change-transform motion-reduce:transition-none motion-reduce:hover:transform-none"
              aria-label="Voir tous mes projets"
              title="Voir tous mes projets"
            >
              <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />
              <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-black/10 to-black/50 transition-[background] duration-300 group-hover:from-black/15 group-hover:to-black/60" />
              <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-20 transition-opacity duration-300 group-hover:opacity-30 [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(120%_160%_at_50%_-10%,black_0%,rgba(0,0,0,0.9)_35%,transparent_80%)] [mask-repeat:no-repeat] [mask-size:100%_100%]" />
              <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(139,92,246,0.12),transparent)]" />

              <div className="absolute inset-0 z-10 grid place-items-center p-5 sm:p-6 text-center">
                <div className="max-w-sm">
                  <h3 className="text-lg sm:text-xl font-semibold tracking-[-0.01em]">Voir tous mes projets</h3>
                  <p className="mt-2 text-[13px] sm:text-sm text-white/70">Parcourez l’ensemble de mes réalisations et projets</p>
                  <div className="mt-4 sm:mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
                    Découvrir
                    <svg className="h-4 w-4 -translate-x-0.5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M13.172 12 8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

  <motion.section
    initial="hidden"
    animate={contactControls}
    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
  viewport={{ amount: 0.15, once: true }}
    onViewportEnter={() => contactControls.start('show')}
  >
    <div className="w-full overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur border border-white/10">
          <div className="grid sm:grid-cols-2">
            <div className="h-24 bg-gradient-to-tl from-slate-800 via-violet-500 to-white sm:h-auto sm:block" />
            <div className="p-5 sm:p-10">
              <h3 className="text-lg font-bold mb-1 sm:text-2xl">Me contacter</h3>
              <p className="text-white/70 mb-4 sm:mb-6 text-sm sm:text-base">Pour une commande, un achat de droits, ou toute autre demande.</p>
              <a href="#" onClick={(e)=>{e.preventDefault(); const btn = document.querySelector('#openContactBtn, #openContactBtnMobile') as HTMLButtonElement|null; btn?.click();}} className="inline-flex items-center justify-center h-10 sm:h-11 rounded-lg bg-gradient-to-b from-purple-400 via-violet-500 to-indigo-600 px-5 sm:px-6 text-sm font-medium text-white transition hover:scale-95">Commencer</a>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

function Hero() {
  const [open, setOpen] = useState(false)
  const [mountVideo, setMountVideo] = useState(false)
  const [ambi, setAmbi] = useState(1)
  const [showHint, setShowHint] = useState(true)
  const mainVideoRef = useRef<HTMLVideoElement | null>(null)
  const ambiVideoRef = useRef<HTMLVideoElement | null>(null)
  const rVfcId = useRef<number | null>(null)
  const syncIntervalId = useRef<number | null>(null)

  useEffect(() => {
    const idle = (cb: () => void) => {
      const ric = (window as any).requestIdleCallback as ((cb: () => void, opts?: { timeout?: number }) => number) | undefined
      if (ric) ric(cb, { timeout: 2000 })
      else setTimeout(cb, 1200)
    }
    const onReady = () => idle(() => setMountVideo(true))
    if (document.readyState === 'complete') onReady()
    else {
      window.addEventListener('load', onReady, { once: true })
      return () => window.removeEventListener('load', onReady)
    }
  }, [])

  useEffect(() => {
    const m = mainVideoRef.current
    const a = ambiVideoRef.current
    if (!m || !a) return

    let running = true

    const syncNow = () => {
      if (!running) return
      try {
        const drift = Math.abs(a.currentTime - m.currentTime)
        if (drift > 0.033) a.currentTime = m.currentTime
      } catch {}
    }

    const copyState = () => {
      a.loop = m.loop
  a.muted = true
      a.playbackRate = m.playbackRate
      if (m.paused) {
        if (!a.paused) a.pause()
      } else {
        if (a.paused) a.play().catch(() => {})
      }
    }

    const onLoadedMeta = () => {
      syncNow()
      copyState()
    }
    const onPlay = () => {
      a.play().catch(() => {})
      syncNow()
    }
    const onPause = () => {
      a.pause()
    }
    const onRate = () => {
      a.playbackRate = m.playbackRate
    }
    const onSeek = () => {
      syncNow()
    }

    m.addEventListener('loadedmetadata', onLoadedMeta)
    m.addEventListener('play', onPlay)
    m.addEventListener('pause', onPause)
    m.addEventListener('ratechange', onRate)
    m.addEventListener('seeking', onSeek)
    m.addEventListener('seeked', onSeek)

    const anyM: any = m as any
    const anyA: any = a as any
    if (anyM.requestVideoFrameCallback) {
      const tick = () => {
        if (!running) return
        syncNow()
        rVfcId.current = anyM.requestVideoFrameCallback(tick)
      }
      rVfcId.current = anyM.requestVideoFrameCallback(tick)
    } else {
      syncIntervalId.current = window.setInterval(syncNow, 100)
    }

    const tryStart = () => {
      if (m.readyState >= 2) {
        m.play().catch(() => {})
        a.play().catch(() => {})
        syncNow()
      }
    }
    const startTimer = window.setTimeout(tryStart, 50)

    return () => {
      running = false
      window.clearTimeout(startTimer)
      m.removeEventListener('loadedmetadata', onLoadedMeta)
      m.removeEventListener('play', onPlay)
      m.removeEventListener('pause', onPause)
      m.removeEventListener('ratechange', onRate)
      m.removeEventListener('seeking', onSeek)
      m.removeEventListener('seeked', onSeek)
      if (rVfcId.current && anyA.cancelVideoFrameCallback && anyM.cancelVideoFrameCallback) {
        try { anyM.cancelVideoFrameCallback(rVfcId.current) } catch {}
      }
      if (syncIntervalId.current) {
        clearInterval(syncIntervalId.current)
      }
    }
  }, [mountVideo])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setOpen(prev => {
        if (y > 40) return true
        if (y <= 4) return false
        return prev
      })
  const progress = Math.max(0, Math.min(1, 1 - y / 120))
  setAmbi(progress)
  setShowHint(y <= 4)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <section className="relative">
      <div className="relative w-full isolate">
        <div className="pointer-events-none absolute -inset-6 -z-10">
          <motion.video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            poster="/videos/hero-poster.webp"
            initial={false}
            animate={{
              opacity: 0.2 + 0.3 * ambi,
              scale: 1.08 + 0.08 * ambi,
              filter: `blur(${Math.round(40 + 40 * ambi)}px) saturate(${110 + 20 * ambi}%) brightness(${40 + 6 * ambi}%)`,
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            ref={ambiVideoRef}
          >
            {mountVideo && (
              <>
                <source src="/videos/hero.webm" type="video/webm" />
                <source src="/videos/hero.mp4" type="video/mp4" />
              </>
            )}
          </motion.video>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          <div className="relative aspect-[16/9]">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="/videos/hero-poster.webp"
              preload="metadata"
              ref={mainVideoRef}
            >
              {mountVideo && (
                <>
                  <source src="/videos/hero.webm" type="video/webm" />
                  <source src="/videos/hero.mp4" type="video/mp4" />
                </>
              )}
            </video>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            <motion.div
              className="pointer-events-none absolute inset-0 z-10 bg-black/70 backdrop-blur-xl"
              initial={false}
              animate={{ opacity: open ? 1 : 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            />

            <div className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-6">
              <div className="max-w-2xl text-center">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl font-bold sm:text-4xl"
                >
                  Repoussons les limites,<br />ensemble !
                </motion.h1>
                <div className="mt-3 flex flex-col items-center">
                  <motion.p
                    initial={false}
                    animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden text-[13px] text-white/80 sm:text-sm"
                  >
                    Salut, moi c'est RedFly ! Depuis quelques années, j'aime de plus en plus travailler sur de gros projets. J'adore donner vie à mes idées, même si elles sont parfois assez abstraites. J'aime sortir des règles contemporaines et innover sur mes visuels.
                  </motion.p>
                </div>
              </div>
            </div>

            <motion.div
              className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex flex-col items-center gap-2"
              initial={false}
              animate={{ opacity: showHint ? 1 : 0, y: showHint ? 0 : 6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="flex items-center justify-center">
                <div className="h-5 w-3 rounded-full border border-white/30">
                  <motion.span
                    className="mx-auto mt-0.5 block h-1 w-1 rounded-full bg-white/90"
                    initial={{ opacity: 0.9, y: 0 }}
                    animate={{ opacity: [0.6, 1, 0.6], y: [0, 8, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </div>
              <div className="text-[11px] sm:text-sm text-white/80">
                Descendez pour continuer
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
