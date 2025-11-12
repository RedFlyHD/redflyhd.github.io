import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Loader from './Loader'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Suspense, useEffect, useRef, useState } from 'react'
import { FaDiscord, FaInstagram, FaTwitter, FaYoutube, FaGithub, FaSpotify, FaTiktok, FaTwitch, FaXTwitter, FaFilePdf } from 'react-icons/fa6'
import { HiOutlineEnvelope, HiOutlineExclamationTriangle, HiOutlineArrowDownTray, HiOutlineXMark } from 'react-icons/hi2'
import { lockBodyScroll, unlockBodyScroll } from '../utils/bodyScrollLock'
import PageTransition from './PageTransition'
import CustomCursor from './CustomCursor'
import MobileNotice from './MobileNotice'
import RouteProgress from './RouteProgress'
import RouteSkeleton from './RouteSkeleton'
import { ToolsOverlayProvider } from '../contexts/ToolsOverlayContext'
const DISCORD_USERNAME = 'redflyhd' as const
const LEGACY_VERSIONS = [{ label: 'Portfolio V3', href: '/V3' }] as const

// Types pour les countdowns
interface CountdownItem {
  emoji: string
  title: string
  deadline: number // Unix timestamp
  color: string
  gradient: string
}

// Composant pour un item de countdown individuel
function CountdownCard({ item }: { item: CountdownItem }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const rafId = useRef<number | null>(null)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000)
      const difference = item.deadline - now

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true })
        return
      }

      const days = Math.floor(difference / 86400)
      const hours = Math.floor((difference % 86400) / 3600)
      const minutes = Math.floor((difference % 3600) / 60)
      const seconds = difference % 60

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false })
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [item.deadline])

  // Effet de souris optimisé avec RAF
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (rafId.current) return
    rafId.current = requestAnimationFrame(() => {
      const card = cardRef.current
      if (!card) {
        rafId.current = null
        return
      }
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      card.style.setProperty('--mouse-x', `${x}px`)
      card.style.setProperty('--mouse-y', `${y}px`)
      rafId.current = null
    })
  }

  const date = new Date(item.deadline * 1000)
  const formattedDate = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: 'spring',
        stiffness: 300,
        damping: 25,
        mass: 0.8,
      }}
      whileHover={{
        y: -6,
        scale: 1.01,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 20,
        }
      }}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-white/25 hover:shadow-[0_12px_40px_-12px_rgba(255,255,255,0.15)]"
      style={{ willChange: 'transform' }}
    >
      {/* Texture de grain subtile */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.015] mix-blend-overlay">
        <div className="h-full w-full" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }} />
      </div>

      {/* Gradient animé au hover - optimisé */}
      <div className="pointer-events-none absolute -inset-10 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-40" style={{ willChange: 'opacity' }}>
        <div className={`absolute inset-0 ${item.gradient} blur-3xl`} />
      </div>

      {/* Effet de brillance interactive */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.08), transparent 40%)',
          willChange: 'opacity',
        }}
      />

      <div className="relative p-5 sm:p-6">
        {/* Header avec emoji et titre */}
        <div className="mb-5 flex items-start gap-3">
          <motion.div
            className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-br from-white/10 to-white/5 text-2xl shadow-inner ring-1 ring-white/10 backdrop-blur-sm"
            whileHover={{ 
              scale: 1.2,
              rotate: [0, -10, 10, -10, 0],
              transition: { 
                type: 'spring',
                stiffness: 500,
                damping: 10,
                rotate: {
                  repeat: Infinity,
                  duration: 0.5,
                }
              }
            }}
            whileTap={{ 
              scale: 0.85,
              rotate: 0,
              transition: { 
                type: 'spring',
                stiffness: 600,
                damping: 15 
              }
            }}
            animate={{
              y: [0, -2, 0],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            }}
          >
            {item.emoji}
          </motion.div>
          <div className="min-w-0 flex-1">
            <h4 className="text-base font-bold leading-tight tracking-tight text-white transition-colors group-hover:text-white/95 sm:text-lg">{item.title}</h4>
            <p className="mt-1.5 text-xs text-white/60 transition-colors group-hover:text-white/70 sm:text-sm">{formattedDate}</p>
          </div>
        </div>

        {/* Countdown timer */}
        {!timeLeft.isExpired ? (
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { value: timeLeft.days, label: 'Jours' },
              { value: timeLeft.hours, label: 'Heures' },
              { value: timeLeft.minutes, label: 'Min' },
              { value: timeLeft.seconds, label: 'Sec' },
            ].map((unit, idx) => (
              <motion.div 
                key={idx} 
                className="group/unit flex flex-col items-center rounded-lg bg-gradient-to-br from-white/[0.12] to-white/[0.04] p-2.5 shadow-inner ring-1 ring-white/10 backdrop-blur-sm transition-all duration-300"
                whileHover={{ 
                  scale: 1.08,
                  y: -4,
                  transition: { 
                    type: 'spring', 
                    stiffness: 400, 
                    damping: 15 
                  }
                }}
                whileTap={{ 
                  scale: 0.95,
                  transition: { 
                    type: 'spring', 
                    stiffness: 600, 
                    damping: 20 
                  }
                }}
              >
                <div className="relative h-9 sm:h-11 w-full flex items-center justify-center overflow-hidden px-1" style={{ perspective: '1000px' }}>
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={unit.value}
                      initial={{ 
                        y: 30,
                        opacity: 0,
                        scale: 0.7,
                        rotateX: 60,
                        filter: 'blur(8px)',
                      }}
                      animate={{ 
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        rotateX: 0,
                        filter: 'blur(0px)',
                      }}
                      exit={{ 
                        y: -30,
                        opacity: 0,
                        scale: 0.7,
                        rotateX: -60,
                        filter: 'blur(8px)',
                      }}
                      transition={{ 
                        type: 'spring',
                        stiffness: 400,
                        damping: 25,
                        mass: 0.7,
                        filter: {
                          duration: 0.2,
                        }
                      }}
                      className={`text-xl font-black tabular-nums ${item.color} transition-all duration-300 group-hover/unit:scale-110 sm:text-2xl drop-shadow-lg`}
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transformStyle: 'preserve-3d',
                        willChange: 'transform, filter, opacity',
                      }}
                    >
                      {String(unit.value).padStart(2, '0')}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/50 transition-colors group-hover/unit:text-white/70 sm:text-xs">
                  {unit.label}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/5 p-5 ring-1 ring-green-400/20"
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              rotate: 0,
              transition: {
                type: 'spring',
                stiffness: 300,
                damping: 15,
                mass: 0.8,
              }
            }}
            whileHover={{ 
              scale: 1.05,
              rotate: [0, -5, 5, -5, 0],
              transition: { 
                type: 'spring',
                stiffness: 400,
                damping: 10,
                rotate: {
                  duration: 0.5,
                }
              }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: {
                type: 'spring',
                stiffness: 600,
                damping: 15,
              }
            }}
          >
            <motion.span 
              className="text-xl"
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              ✅
            </motion.span>
            <span className="text-sm font-semibold text-green-400">Terminé</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// Section principale Countdown
function CountdownSection() {
  const countdowns: CountdownItem[] = [
    {
      emoji: '🔥',
      title: 'Reveal Divizion Launcher',
      deadline: 1764954000,
      color: 'text-red-400',
      gradient: 'bg-gradient-to-br from-red-500/20 to-orange-500/20',
    },
    {
      emoji: '🎨',
      title: '3D — 1 mois pour devenir le king',
      deadline: 1765407540,
      color: 'text-purple-400',
      gradient: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
    },
    {
      emoji: '🎥',
      title: 'Finir la vidéo de reveal du nouveau portfolio',
      deadline: 1766617140,
      color: 'text-blue-400',
      gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
    },
    {
      emoji: '🎭',
      title: 'DA + reveal de VHR (mi-janvier)',
      deadline: 1768517940,
      color: 'text-emerald-400',
      gradient: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20',
    },
    {
      emoji: '🎬',
      title: 'VHR — première courte vidéo (5–10 min) en mars 2026',
      deadline: 1773594000,
      color: 'text-amber-400',
      gradient: 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20',
    },
    {
      emoji: '🚀',
      title: 'VHR — grosse vidéo en juin 2026',
      deadline: 1781539200,
      color: 'text-indigo-400',
      gradient: 'bg-gradient-to-br from-indigo-500/20 to-violet-500/20',
    },
    {
      emoji: '🎯',
      title: 'Objectif : 100k vues YouTube avant mes 18 ans (pas une vidéo shitpost easy)',
      deadline: 1796511540,
      color: 'text-rose-400',
      gradient: 'bg-gradient-to-br from-rose-500/20 to-pink-500/20',
    },
  ]

  return (
    <div className="relative m-4 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] shadow-xl shadow-black/20 backdrop-blur-sm sm:m-6">
      {/* Texture de grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-overlay">
        <div className="h-full w-full" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }} />
      </div>
      
      {/* Effets de fond animés optimisés */}
      <div className="pointer-events-none absolute -inset-20 blur-3xl opacity-40">
        <motion.div
          className="absolute left-10 top-0 h-56 w-56 rounded-full bg-violet-500/40"
          animate={{
            x: [0, 25, 0],
            y: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ willChange: 'transform' }}
        />
        <motion.div
          className="absolute right-10 top-10 h-56 w-56 rounded-full bg-blue-500/40"
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ willChange: 'transform' }}
        />
        <motion.div
          className="absolute left-1/2 bottom-0 h-56 w-56 -translate-x-1/2 rounded-full bg-pink-500/30"
          animate={{
            x: [-50, 50, -50],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ willChange: 'transform' }}
        />
      </div>

      <div className="relative p-5 sm:p-7">
        {/* Header avec animation améliorée */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 sm:mb-7"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              animate={{
                rotate: [0, 8, -8, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              whileHover={{ scale: 1.15, rotate: 15 }}
              className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 text-3xl shadow-lg ring-1 ring-white/10 backdrop-blur-sm transition-all hover:ring-white/20 sm:h-16 sm:w-16 sm:text-4xl"
            >
              ⏰
            </motion.div>
            <div>
              <h3 className="text-2xl font-black tracking-tight sm:text-3xl">Mes Objectifs</h3>
              <p className="mt-1 text-sm text-white/60">Deadlines et projets en cours</p>
            </div>
          </div>
          <motion.p 
            className="mt-4 rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4 text-sm leading-relaxed text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:from-white/[0.07]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Voici mes deadlines et objectifs pour les prochains mois. Je travaille dur pour transformer mes idées en réalité et créer du contenu de qualité.
          </motion.p>
        </motion.div>

        {/* Grille de countdowns */}
        <div className="grid gap-4 sm:gap-5">
          {countdowns.map((countdown, index) => (
            <CountdownCard key={index} item={countdown} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Layout() {
  const location = useLocation()
  const [aboutOpen, setAboutOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [confirmBrochureOpen, setConfirmBrochureOpen] = useState(false)
  const [shouldReopenAbout, setShouldReopenAbout] = useState(false)
  const [versionMenuOpen, setVersionMenuOpen] = useState(false)
  const [copiedDiscord, setCopiedDiscord] = useState(false)
  const [confettiKey, setConfettiKey] = useState(0)
  const contactCloseRef = useRef<HTMLButtonElement>(null)
  const versionMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [location.pathname])

  // Accessibilité contact modal: Échap pour fermer + focus management
  useEffect(() => {
    if (!contactOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setContactOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const t = setTimeout(() => contactCloseRef.current?.focus(), 0)
    lockBodyScroll()
    return () => {
      document.removeEventListener('keydown', onKey)
      clearTimeout(t)
      unlockBodyScroll()
    }
  }, [contactOpen])

  useEffect(() => {
    if (!versionMenuOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!versionMenuRef.current?.contains(event.target as Node)) {
        setVersionMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setVersionMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [versionMenuOpen])


  const handleCopyDiscord = async () => {
    const text = DISCORD_USERNAME
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        throw new Error('Clipboard API non dispo')
      }
      setCopiedDiscord(true)
      setTimeout(() => setCopiedDiscord(false), 2000)
    } catch (_) {
      try {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.focus()
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        setCopiedDiscord(true)
        setTimeout(() => setCopiedDiscord(false), 2000)
  } catch {}
    }
  }
  return (
    <div className="min-h-dvh bg-[#0a0a0a] flex flex-col">
  <CustomCursor />
      <RouteProgress />
      <Loader />
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-transparent [background:radial-gradient(#ffffff0f_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_60%,transparent_100%)]" />
      </div>

      <Navbar
        onOpenAbout={() => setAboutOpen(true)}
        onOpenContact={() => setContactOpen(true)}
        onAnyNavClick={() => {
          // Close any open modal when navigating via navbar
          setAboutOpen(false)
          setContactOpen(false)
          setConfirmBrochureOpen(false)
        }}
      />

  <MobileNotice />

      <div className="flex-1 flex flex-col">
        <ToolsOverlayProvider>
          <AnimatePresence mode="wait">
            <PageTransition>
              <main className="mx-auto max-w-7xl px-4 py-8 flex-1">
                <Suspense fallback={<RouteSkeleton />}>
                  <Outlet />
                </Suspense>
              </main>
            </PageTransition>
          </AnimatePresence>
        </ToolsOverlayProvider>
      </div>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
            <div className="flex w-full justify-center md:w-auto md:flex-1 md:justify-start">
              <a href="/" aria-label="logo" className="inline-flex items-center gap-2 text-xl font-bold text-white md:text-2xl">
                RedFly
              </a>
            </div>
            <div className="flex w-full justify-center md:w-auto">
              <div className="relative" ref={versionMenuRef}>
                <button
                  type="button"
                  onClick={() => setVersionMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/30 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  aria-haspopup="listbox"
                  aria-expanded={versionMenuOpen}
                  aria-controls="legacy-versions-menu"
                >
                  Anciennes versions
                  <motion.span
                    animate={{ rotate: versionMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="inline-flex"
                  >
                    <svg aria-hidden className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none">
                      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence>
                  {versionMenuOpen && (
                    <motion.div
                      key="legacy-menu"
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="absolute bottom-full left-1/2 z-20 mb-3 w-64 -translate-x-1/2 transform space-y-2 overflow-hidden rounded-xl border border-white/10 bg-neutral-900/95 p-3 shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur"
                    >
                      <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 p-3 text-xs text-amber-100">
                        <p>Ces versions archivees ne sont plus maintenues.</p>
                        <p className="mt-1">La page actuelle (V4) contient mes projets les plus recents, reste la plus elegante et fonctionne sur la plupart des appareils.</p>
                      </div>
                      <ul id="legacy-versions-menu" role="listbox" className="space-y-1">
                        {LEGACY_VERSIONS.map((version) => (
                          <li key={version.href}>
                            <a
                              href={version.href}
                              className="flex flex-col rounded-lg px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                              onClick={() => setVersionMenuOpen(false)}
                            >
                              <span className="font-medium">{version.label}</span>
                              <span className="text-xs text-white/60">Ouvrir la version precedente</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex w-full flex-wrap justify-center gap-4 md:flex-1 md:justify-end">
              <a
                href="https://www.instagram.com/redflyhd/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram RedFlyHD"
                className="text-white/60 transition hover:text-white"
                title="Instagram"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://x.com/RedFlyHD"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter/X RedFlyHD"
                className="text-white/60 transition hover:text-white"
                title="Twitter/X"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="https://github.com/RedFlyHD"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub RedFlyHD"
                className="text-white/60 transition hover:text-white"
                title="GitHub"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@RedFlyHD"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube RedFlyHD"
                className="text-white/60 transition hover:text-white"
                title="YouTube"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                  <path d="M23.498 6.186a2.988 2.988 0 0 0-2.104-2.113C19.693 3.5 12 3.5 12 3.5s-7.693 0-9.394.573A2.988 2.988 0 0 0 .502 6.186C0 7.887 0 12 0 12s0 4.113.502 5.814a2.988 2.988 0 0 0 2.104 2.113C4.307 20.5 12 20.5 12 20.5s7.693 0 9.394-.573a2.988 2.988 0 0 0 2.104-2.113C24 16.113 24 12 24 12s0-4.113-.502-5.814zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="border-t border-dotted border-white/10 py-6 text-center text-sm text-white/60">
            <a href="https://www.youtube.com/@RedFlyHD" target="_blank" rel="noreferrer" className="hover:underline">
              @RedFlyHD
            </a>
            <div className="mt-1 text-xs text-white/40">V4.3.0</div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {aboutOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex max-h-[90dvh] w-[92vw] max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 p-0 text-white sm:max-h-[85vh]"
            >
              <div className="flex-1 overflow-y-auto">
                <div className="relative grid grid-cols-1 gap-4 p-4 sm:grid-cols-[200px_1fr] sm:gap-6 sm:p-6">
                  <div className="relative z-0">
                    <div className="h-48 w-full overflow-hidden rounded-xl border border-white/10 sm:h-[200px]">
                      <img src="/rss/IRL.jpg" alt="Portrait" className="h-full w-full object-cover" />
                    </div>
                    <motion.div 
                      className="mt-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.4 }}
                    >
                      <motion.button
                        onClick={() => {
                          // Flow: close About, open confirmation
                          setAboutOpen(false)
                          // mark to reopen after confirm closes
                          setShouldReopenAbout(true)
                          setConfirmBrochureOpen(true)
                        }}
                        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-white to-white/95 px-5 py-3 text-sm font-bold text-black shadow-lg shadow-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-white/30"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaFilePdf className="relative z-10 h-4 w-4 transition-all duration-300 group-hover:scale-125 group-hover:-rotate-12" aria-hidden />
                        <span className="relative z-10">Télécharger la brochure</span>
                        <svg className="relative z-10 ml-1 h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <div className="absolute inset-0 -z-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </motion.button>
                    </motion.div>
                  </div>
                  <div className="relative z-10 min-w-0 space-y-3">
                    <div>
                      <h3 className="text-2xl font-bold">Maxence</h3>
                      <p className="text-sm text-white/60">France • Créateur Numérique</p>
                    </div>
                    <div className="space-y-3 text-sm leading-relaxed text-white/80">
                    <p>✨ Salut, moi c’est Maxence. Je suis passionné par la création numérique sous toutes ses formes : motion design, 2D/3D, web, montage vidéo… J’aime imaginer des univers visuels uniques, des identités marquantes et des concepts interactifs qui sortent un peu des sentiers battus.</p>

                    <p>🎨 Je me forme en autodidacte depuis plusieurs années, en testant, en apprenant et en partageant mes projets sur YouTube, TikTok et Instagram — même si YouTube reste clairement ma plateforme préférée. J’adore passer des heures sur After Effects à donner vie à mes idées ou à créer des animations qui sortent de l’ordinaire.</p>

                    <p>🚀 En 2026, je veux aller encore plus loin : sortir des vidéos plus abouties, expérimenter davantage en 3D et continuer à faire évoluer mes projets.</p>
                    </div>
                  </div>
                </div>

                {/* Section RedFly avec bannière */}
                <motion.div 
                  className="group/redfly relative m-4 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] shadow-xl shadow-black/20 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:shadow-2xl sm:m-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {/* Texture */}
                  <div className="pointer-events-none absolute inset-0 opacity-[0.015] mix-blend-overlay">
                    <div className="h-full w-full" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }} />
                  </div>

                  <div className="pointer-events-none absolute -inset-20 blur-3xl opacity-0 transition-opacity duration-700 group-hover/redfly:opacity-40">
                    <motion.div 
                      className="absolute left-10 top-0 h-48 w-48 rounded-full bg-violet-500/40"
                      animate={{
                        x: [0, 20, 0],
                        y: [0, -15, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      style={{ willChange: 'transform' }}
                    />
                    <motion.div 
                      className="absolute right-10 top-10 h-48 w-48 rounded-full bg-indigo-500/40"
                      animate={{
                        x: [0, -15, 0],
                        y: [0, 20, 0],
                        scale: [1, 1.15, 1],
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      style={{ willChange: 'transform' }}
                    />
                  </div>

                  <div className="relative">
                    <div className="aspect-[16/9] w-full overflow-hidden border-b border-white/10">
                      <motion.img
                        src="/rss/RedFly Logo 20232025.png"
                        alt="Bannière RedFly — Logos 2023-2025"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover/redfly:scale-105"
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <div className="grid gap-4 p-5 sm:p-6">
                      <a
                        href="https://www.youtube.com/@RedFlyHD/"
                        target="_blank"
                        rel="noreferrer"
                        className="group/link inline-block transition-transform duration-300 hover:translate-x-1"
                      >
                        <h3 className="text-2xl font-black tracking-tight transition-colors sm:text-3xl group-hover/link:text-white/90">RedFly</h3>
                        <div className="mt-0.5 h-0.5 w-0 bg-gradient-to-r from-white to-transparent transition-all duration-300 group-hover/link:w-full" />
                      </a>
                      <p className="rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4 text-sm leading-relaxed text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:from-white/[0.07]">
                        Je suis apparu pour la première fois sur Internet sous le pseudo RedStone64. En 2019, j'ai changé pour RedFly32.
                        En 2022, j'ai créé mon premier vrai logo et j'ai lancé ReNew pour l'annoncer. Nouveaux logos en 2024 (janvier puis
                        juin), et le dernier en février 2025. Je possède 4 logos (R, V, B + violet). En 2025, je fais un reset : le gaming
                        part sur RedFly+, et je vise des vidéos 2D/3D plus travaillées sur RedFly. Première vidéo visée : 2026.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Section Countdown */}
                <CountdownSection />

                {/* Section liens sociaux intégrée dans le style */}
                <motion.div 
                  className="relative m-4 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] shadow-xl shadow-black/20 backdrop-blur-sm sm:m-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                >
                  {/* Texture */}
                  <div className="pointer-events-none absolute inset-0 opacity-[0.015] mix-blend-overlay">
                    <div className="h-full w-full" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }} />
                  </div>

                  {/* Gradient animé de fond */}
                  <div className="pointer-events-none absolute -inset-20 blur-3xl opacity-30">
                    <motion.div 
                      className="absolute left-1/4 top-0 h-48 w-48 rounded-full bg-blue-500/30"
                      animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      style={{ willChange: 'transform' }}
                    />
                    <motion.div 
                      className="absolute right-1/4 bottom-0 h-48 w-48 rounded-full bg-purple-500/30"
                      animate={{
                        x: [0, -30, 0],
                        scale: [1, 1.15, 1],
                      }}
                      transition={{
                        duration: 16,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      style={{ willChange: 'transform' }}
                    />
                  </div>

                  <div className="relative p-5 sm:p-6">
                    <div className="mb-5 flex items-center gap-3">
                      <motion.div 
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-white/10 to-white/5 text-xl ring-1 ring-white/10 transition-all hover:scale-110 hover:ring-white/20"
                        whileHover={{ rotate: 15 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        🔗
                      </motion.div>
                      <h3 className="text-xl font-black tracking-tight sm:text-2xl">Mes liens</h3>
                    </div>
                    
                    {/* YouTube */}
                    <div className="mb-5 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">YouTube</h4>
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {[
                          { href: 'https://www.youtube.com/@RedFlyHD', label: 'RedFlyHD' },
                          { href: 'https://www.youtube.com/@redflyplus', label: 'RedFly+' },
                          { href: 'https://www.youtube.com/@ReTechHD', label: 'ReTechHD' },
                          { href: 'https://www.youtube.com/@RedFlyVOD', label: 'RedFlyVOD' },
                        ].map((link, i) => (
                          <motion.a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="group relative flex items-center gap-3 overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-3.5 text-sm font-medium shadow-sm transition-all duration-300 hover:border-red-500/30 hover:from-red-500/10 hover:to-white/[0.05] hover:shadow-lg hover:shadow-red-500/20 hover:-translate-y-0.5"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.05 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <FaYoutube className="h-5 w-5 text-red-500 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                            <span className="relative z-10 transition-colors group-hover:text-white">{link.label}</span>
                            <svg className="ml-auto h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          </motion.a>
                        ))}
                      </div>
                    </div>

                    {/* Autres réseaux */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">Réseaux sociaux</h4>
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {[
                          { href: 'https://x.com/RedFlyHD', label: 'X (Twitter)', icon: FaXTwitter, color: 'text-white', hoverColor: 'hover:from-white/10' },
                          { href: 'https://discord.gg/tF57H253vP', label: 'Discord', icon: FaDiscord, color: 'text-indigo-400', hoverColor: 'hover:from-indigo-500/10 hover:border-indigo-500/30 hover:shadow-indigo-500/10' },
                          { href: 'https://www.tiktok.com/@redflyhd', label: 'TikTok', icon: FaTiktok, color: 'text-pink-400', hoverColor: 'hover:from-pink-500/10 hover:border-pink-500/30 hover:shadow-pink-500/10' },
                          { href: 'https://www.twitch.tv/redflyhd', label: 'Twitch', icon: FaTwitch, color: 'text-purple-400', hoverColor: 'hover:from-purple-500/10 hover:border-purple-500/30 hover:shadow-purple-500/10' },
                          { href: 'https://github.com/RedFlyHD', label: 'GitHub', icon: FaGithub, color: 'text-gray-300', hoverColor: 'hover:from-white/10 hover:border-white/20' },
                          { href: 'https://open.spotify.com/user/cnt8f9pv1lzjrhcrj4v3rcpin', label: 'Spotify', icon: FaSpotify, color: 'text-green-400', hoverColor: 'hover:from-green-500/10 hover:border-green-500/30 hover:shadow-green-500/10' },
                        ].map((link, i) => (
                          <motion.a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className={`group relative flex items-center gap-3 overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-3.5 text-sm font-medium shadow-sm transition-all duration-300 ${link.hoverColor} hover:shadow-lg hover:-translate-y-0.5`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.05 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <link.icon className={`h-5 w-5 ${link.color} transition-all duration-300 group-hover:scale-125 group-hover:rotate-12`} />
                            <span className="relative z-10 transition-colors group-hover:text-white">{link.label}</span>
                            <svg className="ml-auto h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              <div className="flex justify-center border-t border-white/10 bg-gradient-to-t from-zinc-900/95 to-zinc-900/90 p-5 backdrop-blur-xl">
                <motion.button
                  onClick={() => setAboutOpen(false)}
                  className="group relative overflow-hidden rounded-full bg-gradient-to-r from-white/10 to-white/5 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/10 shadow-lg transition-all duration-300 hover:from-white/15 hover:to-white/10 hover:ring-white/20 hover:shadow-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 transition-colors group-hover:text-white">Fermer</span>
                  <div className="absolute inset-0 -z-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation modal: Télécharger la brochure */}
      <AnimatePresence>
        {confirmBrochureOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setConfirmBrochureOpen(false)
              if (shouldReopenAbout) {
                setAboutOpen(true)
                setShouldReopenAbout(false)
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex w-[92vw] max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative glow */}
              <div className="pointer-events-none absolute -inset-24 opacity-40">
                <div className="absolute left-10 top-8 h-40 w-40 rounded-full bg-violet-500/20 blur-2xl" />
                <div className="absolute right-10 bottom-8 h-40 w-40 rounded-full bg-indigo-500/20 blur-2xl" />
              </div>

              <div className="relative p-6 sm:p-8">
                <div className="mx-auto flex max-w-xl flex-col items-center text-center">
                  <motion.div
                    initial={{ y: 6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-300 ring-1 ring-amber-400/30 shadow-lg shadow-amber-500/10"
                    aria-hidden
                  >
                    <HiOutlineExclamationTriangle className="h-7 w-7" />
                  </motion.div>
                  <motion.h3 
                    className="text-2xl font-black tracking-tight"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    Télécharger ma brochure
                  </motion.h3>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-white/80">
                    <p>
                      Le PDF est relativement lourd. Selon la puissance de votre appareil et votre connexion, l’ouverture ou le téléchargement peut
                      prendre du temps et peut faire ralentir votre appareil.
                    </p>
                    <p>
                      Une version allégée, ainsi qu’une version encore plus haute qualité arrivent bientôt.
                    </p>
                  </div>
                  <div className="mt-6 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
                    <motion.button
                      onClick={() => {
                        setConfirmBrochureOpen(false)
                        if (shouldReopenAbout) {
                          setAboutOpen(true)
                          setShouldReopenAbout(false)
                        }
                      }}
                      className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-white/10 to-white/5 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/10 shadow-lg transition-all duration-300 hover:from-white/15 hover:to-white/10 hover:ring-white/20 hover:shadow-xl"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <HiOutlineXMark className="h-4 w-4 transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" aria-hidden />
                      <span>Annuler</span>
                    </motion.button>
                    <motion.a
                      href="/RedFlyHD%20BOOK.pdf"
                      download
                      onClick={() => {
                        setConfirmBrochureOpen(false)
                        if (shouldReopenAbout) {
                          setAboutOpen(true)
                          setShouldReopenAbout(false)
                        }
                      }}
                      className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-white to-white/95 px-5 py-3 text-sm font-bold text-black shadow-lg shadow-white/25 transition-all duration-300 hover:shadow-xl hover:shadow-white/30"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <HiOutlineArrowDownTray className="h-4 w-4 transition-all duration-300 group-hover:translate-y-1 group-hover:scale-110" aria-hidden />
                      <span>Télécharger (PDF)</span>
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {contactOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay clickable to close */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setContactOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sheet on mobile, card on desktop */}
            <motion.div
              initial={{ y: 24, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 24, scale: 0.96, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative z-10 w-full max-h-[90dvh] sm:w-[92vw] sm:max-w-3xl overflow-hidden rounded-t-3xl sm:rounded-xl border border-white/10 bg-gradient-to-br from-neutral-900/95 via-neutral-900/90 to-neutral-900/95 text-white backdrop-blur-xl shadow-2xl shadow-black/50 sm:max-h-[85dvh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Texture de grain subtile */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.015] mix-blend-overlay">
                <div className="h-full w-full" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }} />
              </div>

              {/* Decorative animated glow */}
              <div className="pointer-events-none absolute -inset-24 opacity-30">
                <motion.div
                  className="absolute left-10 top-10 h-56 w-56 rounded-full bg-violet-500/40 blur-3xl"
                  animate={{ 
                    y: [0, -12, 0], 
                    x: [0, 8, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ willChange: 'transform' }}
                />
                <motion.div
                  className="absolute right-10 bottom-10 h-56 w-56 rounded-full bg-indigo-500/40 blur-3xl"
                  animate={{ 
                    y: [0, 15, 0], 
                    x: [0, -10, 0],
                    scale: [1, 1.15, 1]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ willChange: 'transform' }}
                />
              </div>

              {/* Gradient accents */}
              <div className="pointer-events-none absolute inset-0 rounded-xl [background:radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.08),transparent_50%)]" />
              <div className="pointer-events-none absolute inset-0 rounded-xl [background:radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.05),transparent_50%)]" />

              {/* Header */}
              <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-neutral-900/80 px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-xl">
                <div className="min-w-0">
                  <h3 id="contact-title" className="text-lg font-bold sm:text-xl">Me contacter</h3>
                  <p className="mt-0.5 hidden text-sm text-white/70 sm:block">Envie de me contacter ? Vous pouvez utiliser l’un de ces moyens de communication ci-dessous.</p>
                </div>
                <button
                  ref={contactCloseRef}
                  onClick={() => setContactOpen(false)}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/90 ring-1 ring-white/10 transition hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  aria-label="Fermer le contact"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M6.225 4.811 4.811 6.225 10.586 12l-5.775 5.775 1.414 1.414L12 13.414l5.775 5.775 1.414-1.414L13.414 12l5.775-5.775-1.414-1.414L12 10.586 6.225 4.811z" />
                  </svg>
                </button>
              </div>

              {/* Content (scrollable) */}
              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="grid gap-4 p-4 sm:gap-6 sm:p-6">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
                >
                  <div className="pointer-events-none absolute -inset-10 opacity-50">
                    <div className="absolute inset-0 [background:radial-gradient(240px_160px_at_20%_20%,rgba(139,92,246,0.12),transparent_60%),radial-gradient(260px_180px_at_80%_60%,rgba(79,70,229,0.12),transparent_60%)]" />
                  </div>
                    <div className="relative grid items-center gap-4 p-4 sm:grid-cols-[140px_1fr_220px] sm:p-5">
                    <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-lg ring-1 ring-white/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2] via-[#4E5BE6] to-[#3C45C6]" />
                        <FaDiscord aria-hidden className="relative h-10 w-10" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h4 className="text-lg font-semibold">Discord</h4>
                      <p className="text-sm text-white/70">Discord est mon moyen de communication préféré : je pourrai vous répondre rapidement. Vous pouvez aussi rejoindre mon serveur communautaire.</p>
                    </div>
                    <div className="col-span-full mt-2 grid grid-cols-1 gap-2 sm:col-auto sm:mt-0 sm:justify-self-end">
                      {/* Rejoindre (haut) */}
                      <a
                        href="https://discord.gg/tF57H253vP"
                        target="_blank"
                        rel="noreferrer"
                        className="group relative inline-flex min-w-[140px] items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(79,70,229,0.35)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 hover:brightness-110"
                      >
                        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-white/20" />
                        <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition duration-700 group-hover:translate-x-[220%] group-hover:opacity-100" style={{ transform: 'translateX(-120%)' }} />
                        <span className="relative z-10">Rejoindre</span>
                      </a>

                      {/* M'ajouter (bas) */}
                      <button
                        onClick={() => { setConfettiKey(Date.now()); handleCopyDiscord(); }}
                        className="relative group inline-flex min-w-[140px] items-center justify-center gap-2 overflow-hidden rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                        aria-label={`Copier mon utilisateur Discord pour m'ajouter: ${DISCORD_USERNAME}`}
                        aria-live="polite"
                      >
                        {/* Glow & shine */}
                        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(180px_120px_at_var(--x,50%)_var(--y,50%),rgba(255,255,255,0.18),transparent_60%)' }} />
                        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-white/15" />
                        <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition duration-700 group-hover:translate-x-[220%] group-hover:opacity-100" style={{ transform: 'translateX(-120%)' }} />

                        {/* Confetti burst */}
                        <span aria-hidden className="pointer-events-none absolute inset-0" style={{ perspective: 600 }}>
                          <AnimatePresence mode="popLayout">
                            {copiedDiscord && (
                              <motion.span key={confettiKey} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: [1, 1, 0] }}
                                transition={{ duration: 0.9 }}
                              >
                                {Array.from({ length: 18 }).map((_, i) => {
                                  const angle = (i / 18) * Math.PI * 2
                                  const distance = 40 + Math.random() * 50
                                  const x = Math.cos(angle) * distance
                                  const y = Math.sin(angle) * distance
                                  const size = 4 + Math.round(Math.random() * 3)
                                  const colors = ['#22d3ee', '#60a5fa', '#a78bfa', '#34d399', '#f472b6', '#f59e0b']
                                  const color = colors[i % colors.length]
                                  return (
                                    <motion.span
                                      key={i}
                                      className="absolute block rounded-full"
                                      style={{ width: size, height: size, background: color }}
                                      initial={{ x: 0, y: 0, scale: 0.6, rotate: 0 }}
                                      animate={{ x, y, scale: 1, rotate: 180 + Math.random() * 180 }}
                                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                  )
                                })}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>

                        {!copiedDiscord ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 opacity-80 group-hover:opacity-100" aria-hidden="true">
                              <path d="M15 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm-2 2h-2c-3.866 0-7 3.134-7 7v1h12v-1c0-1.657-.672-3.157-1.758-4.242A5.98 5.98 0 0013 14z" />
                              <path d="M19 14v-2h-2v2h-2v2h2v2h2v-2h2v-2h-2z" />
                            </svg>
                            <span>M'ajouter</span>
                          </>
                        ) : (
                          <motion.span initial={{ opacity: 0, y: 2 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-emerald-400" aria-hidden="true">
                              <path d="M9 16.2l-3.5-3.5L4 14.2 9 19l12-12-1.5-1.5z" />
                            </svg>
                            <span className="text-emerald-300">Copié !</span>
                          </motion.span>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
                >
                  <div className="pointer-events-none absolute -inset-10 opacity-40">
                    <div className="absolute inset-0 [background:radial-gradient(220px_140px_at_20%_20%,rgba(255,255,255,0.06),transparent_60%)]" />
                  </div>
                  <div className="relative grid items-center gap-4 p-4 sm:grid-cols-[140px_1fr_220px] sm:p-5">
                    <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-lg ring-1 ring-white/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-300/40 via-zinc-200/30 to-white/20" />
                      <HiOutlineEnvelope aria-hidden className="relative h-10 w-10" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h4 className="text-lg font-semibold">Email</h4>
                      <p className="text-sm text-white/70">Arrive bientôt.</p>
                    </div>
                    <div className="col-span-full mt-2 grid grid-cols-1 gap-2 sm:col-auto sm:mt-0 sm:justify-self-end">
                      <span className="inline-flex min-w-[140px] items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">Bientôt</span>
                    </div>
                  </div>
                </motion.div>

                {/* Instagram */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 }}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
                >
                  <div className="pointer-events-none absolute -inset-10 opacity-40">
                    <div className="absolute inset-0 [background:radial-gradient(220px_140px_at_15%_80%,rgba(244,114,182,0.12),transparent_60%),radial-gradient(220px_140px_at_85%_20%,rgba(250,204,21,0.12),transparent_60%)]" />
                  </div>
                  <div className="relative grid items-center gap-4 p-4 sm:grid-cols-[140px_1fr_220px] sm:p-5">
                    <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-lg ring-1 ring-white/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-300 via-pink-300 to-purple-400" />
                      <FaInstagram aria-hidden className="relative h-10 w-10" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h4 className="text-lg font-semibold">Instagram</h4>
                      <p className="text-sm text-white/70">J’ouvre rarement ce compte Instagram. Vous pouvez m’y contacter, mais je vous recommande vivement d’utiliser Discord.</p>
                    </div>
                    <div className="col-span-full mt-2 grid grid-cols-1 gap-2 sm:col-auto sm:mt-0 sm:justify-self-end">
                      <a
                        href="https://www.instagram.com/redflyhd/"
                        target="_blank"
                        rel="noreferrer"
                        className="group relative inline-flex min-w-[140px] items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-pink-500 via-rose-500 to-amber-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(244,114,182,0.35)] transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                      >
                        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-white/20" />
                        <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition duration-700 group-hover:translate-x-[220%] group-hover:opacity-100" style={{ transform: 'translateX(-120%)' }} />
                        <span className="relative z-10">Ouvrir</span>
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* Twitter */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26 }}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
                >
                  <div className="pointer-events-none absolute -inset-10 opacity-40">
                    <div className="absolute inset-0 [background:radial-gradient(220px_140px_at_20%_20%,rgba(29,161,242,0.18),transparent_60%)]" />
                  </div>
                  <div className="relative grid items-center gap-4 p-4 sm:grid-cols-[140px_1fr_220px] sm:p-5">
                    <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-lg ring-1 ring-white/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600" />
                      <FaTwitter aria-hidden className="relative h-10 w-10" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h4 className="text-lg font-semibold">Twitter</h4>
                      <p className="text-sm text-white/70">J’ouvre parfois Twitter pour poster quelques petites blagues (pas toujours drôles avec le recul ). Comme pour Instagram, je vous recommande plutôt de passer par Discord, mais si c’est vraiment nécessaire, vous pouvez toujours me contacter sur Twitter.</p>
                    </div>
                    <div className="col-span-full mt-2 grid grid-cols-1 gap-2 sm:col-auto sm:mt-0 sm:justify-self-end">
                      <a
                        href="https://x.com/RedFlyHD"
                        target="_blank"
                        rel="noreferrer"
                        className="group relative inline-flex min-w-[140px] items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#1DA1F2] via-[#1A8CD8] to-[#1778BF] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(29,161,242,0.35)] transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                      >
                        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-white/20" />
                        <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition duration-700 group-hover:translate-x-[220%] group-hover:opacity-100" style={{ transform: 'translateX(-120%)' }} />
                        <span className="relative z-10">Ouvrir</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
                </div>
              </div>

              {/* Footer (sticky on mobile) */}
              <div className="sticky bottom-0 z-20 flex items-center justify-center gap-3 border-t border-white/10 bg-neutral-900/80 px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-xl">
                <button
                  onClick={() => setContactOpen(false)}
                  className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2 text-sm text-white transition hover:bg-white/20"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
