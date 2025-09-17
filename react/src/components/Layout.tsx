import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Loader from './Loader'
import { AnimatePresence, motion } from 'framer-motion'
import { Suspense, useEffect, useRef, useState } from 'react'
import { FaDiscord, FaInstagram, FaTwitter, FaYoutube, FaGithub, FaSpotify, FaTiktok, FaTwitch, FaXTwitter } from 'react-icons/fa6'
import { HiOutlineEnvelope } from 'react-icons/hi2'
import { lockBodyScroll, unlockBodyScroll } from '../utils/bodyScrollLock'
import PageTransition from './PageTransition'
import CustomCursor from './CustomCursor'
import MobileNotice from './MobileNotice'
import RouteProgress from './RouteProgress'
import RouteSkeleton from './RouteSkeleton'
const DISCORD_USERNAME = 'redflyhd' as const

export default function Layout() {
  const location = useLocation()
  const [aboutOpen, setAboutOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [copiedDiscord, setCopiedDiscord] = useState(false)
  const [confettiKey, setConfettiKey] = useState(0)
  const contactCloseRef = useRef<HTMLButtonElement>(null)

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
    <div className="min-h-dvh bg-[#0a0a0a]">
  <CustomCursor />
      <RouteProgress />
      <Loader />
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-transparent [background:radial-gradient(#ffffff0f_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_60%,transparent_100%)]" />
      </div>

      <Navbar onOpenAbout={() => setAboutOpen(true)} onOpenContact={() => setContactOpen(true)} />

  <MobileNotice />

      <AnimatePresence mode="wait">
        <PageTransition>
          <main className="mx-auto max-w-7xl px-4 py-8">
            <Suspense fallback={<RouteSkeleton />}>
              <Outlet />
            </Suspense>
          </main>
        </PageTransition>
      </AnimatePresence>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6 grid grid-cols-1 items-center gap-6 md:grid-cols-2">
            <div>
              <a href="/" aria-label="logo" className="inline-flex items-center gap-2 text-xl font-bold text-white md:text-2xl">
                RedFly
              </a>
            </div>
            <div className="flex justify-start gap-4 md:justify-end">
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
            <div className="mt-1 text-xs text-white/40">V4.2.3</div>
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
                  <div className="relative z-0 h-48 w-full overflow-hidden rounded-xl border border-white/10 sm:h-[200px]">
                    <img src="/rss/IRL.jpg" alt="Portrait" className="h-full w-full object-cover" />
                  </div>
                  <div className="relative z-10 min-w-0 space-y-3">
                    <div>
                      <h3 className="text-2xl font-bold">Maxence</h3>
                      <p className="text-sm text-white/60">France • Créateur Numérique</p>
                    </div>
                    <div className="space-y-3 text-sm leading-relaxed text-white/80">
                      <p>✨ Salut, moi c'est Maxence. Passionné par la création numérique, je touche à tout : motion design, 2D/3D, dev web, montage vidéo… J'adore imaginer des identités visuelles marquantes et des concepts interactifs qui sortent un peu de l'ordinaire.</p>
                      
                      <p>🎨 Je bosse en autodidacte depuis plusieurs années, en testant, en apprenant, et en partageant mes idées sur YouTube, TikTok et Insta (même si YouTube reste ma plateforme de cœur). J'aime aussi expérimenter sur After Effects, que ce soit pour des animations originales, ou pour donner vie à des univers plus créatifs.</p>
                      
                      <p>🚀 En 2025, mon objectif est de sortir des vidéos plus travaillées sur YouTube, pousser mes projets 2D/3D encore plus loin.</p>
                    </div>
                  </div>
                </div>

                {/* Section RedFly avec bannière */}
                <div className="relative m-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] sm:m-6">
                  <div className="pointer-events-none absolute -inset-16 blur-2xl opacity-40">
                    <div className="absolute left-10 top-0 h-40 w-40 rounded-full bg-violet-500/30" />
                    <div className="absolute right-10 top-10 h-40 w-40 rounded-full bg-indigo-500/30" />
                  </div>

                  <div className="relative">
                    <div className="aspect-[16/9] w-full overflow-hidden border-b border-white/10">
                      <img
                        src="/rss/RedFly Logo 20232025.png"
                        alt="Bannière RedFly — Logos 2023-2025"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="grid gap-3 p-4 sm:p-5">
                      <a
                        href="https://www.youtube.com/@RedFlyHD/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block"
                      >
                        <h3 className="text-2xl font-bold tracking-tight sm:text-3xl hover:underline">RedFly</h3>
                      </a>
                      <p className="text-sm leading-relaxed text-white/80">
                        Je suis apparu pour la première fois sur Internet sous le pseudo RedStone64. En 2019, j'ai changé pour
                        RedFly32. En 2022, j'ai créé mon premier vrai logo et j'ai lancé ReNew pour l'annoncer. Nouveaux logos en 2024
                        (janvier puis 4 juin), et le dernier le 28 février 2025. Je possède 4 logos (R, V, B + violet). En 2025, je fais
                        un reset: le gaming part sur RedFly+, et je vise des vidéos 2D/3D plus travaillées sur RedFly. Première vidéo visée:
                        4 juin 2025.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section liens sociaux intégrée dans le style */}
                <div className="relative m-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] sm:m-6">
                  <div className="relative p-4 sm:p-5">
                    <h3 className="mb-4 text-lg font-bold tracking-tight">Mes liens</h3>
                    
                    {/* YouTube */}
                    <div className="mb-4 space-y-2">
                      <h4 className="text-sm font-medium text-white/60">YouTube</h4>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <a href="https://www.youtube.com/@RedFlyHD" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm transition hover:bg-white/10">
                          <FaYoutube className="h-4 w-4 text-red-500" />
                          <span>RedFlyHD</span>
                        </a>
                        <a href="https://www.youtube.com/@redflyplus" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm transition hover:bg-white/10">
                          <FaYoutube className="h-4 w-4 text-red-500" />
                          <span>RedFly+</span>
                        </a>
                        <a href="https://www.youtube.com/@ReTechHD" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm transition hover:bg-white/10">
                          <FaYoutube className="h-4 w-4 text-red-500" />
                          <span>ReTechHD</span>
                        </a>
                        <a href="https://www.youtube.com/@RedFlyVOD" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm transition hover:bg-white/10">
                          <FaYoutube className="h-4 w-4 text-red-500" />
                          <span>RedFlyVOD</span>
                        </a>
                      </div>
                    </div>

                    {/* Autres réseaux */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white/60">Réseaux sociaux</h4>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <a href="https://x.com/RedFlyHD" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm transition hover:bg-white/10">
                          <FaXTwitter className="h-4 w-4 text-white" />
                          <span>X (Twitter)</span>
                        </a>
                        <a href="https://discord.gg/tF57H253vP" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm transition hover:bg-white/10">
                          <FaDiscord className="h-4 w-4 text-indigo-400" />
                          <span>Discord</span>
                        </a>
                        <a href="https://www.tiktok.com/@redflyhd" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm transition hover:bg-white/10">
                          <FaTiktok className="h-4 w-4 text-pink-400" />
                          <span>TikTok</span>
                        </a>
                        <a href="https://www.twitch.tv/redflyhd" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm transition hover:bg-white/10">
                          <FaTwitch className="h-4 w-4 text-purple-400" />
                          <span>Twitch</span>
                        </a>
                        <a href="https://github.com/RedFlyHD" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm transition hover:bg-white/10">
                          <FaGithub className="h-4 w-4 text-gray-300" />
                          <span>GitHub</span>
                        </a>
                        <a href="https://open.spotify.com/user/cnt8f9pv1lzjrhcrj4v3rcpin" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm transition hover:bg-white/10">
                          <FaSpotify className="h-4 w-4 text-green-400" />
                          <span>Spotify</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center p-4">
                <button
                  onClick={() => setAboutOpen(false)}
                  className="rounded-full bg-white/10 px-5 py-2 text-sm text-white transition hover:bg-white/20"
                >
                  Fermer
                </button>
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
              initial={{ y: 24, scale: 1, opacity: 0.98 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 24, scale: 1, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="relative z-10 w-full max-h-[90dvh] sm:w-[92vw] sm:max-w-3xl overflow-hidden sm:rounded-2xl border border-white/10 bg-neutral-900/90 text-white backdrop-blur-xl sm:shadow-2xl sm:max-h-[85dvh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative animated glow */}
              <div className="pointer-events-none absolute -inset-24 -z-10 opacity-40">
                <motion.div
                  className="absolute left-10 top-10 h-56 w-56 rounded-full bg-violet-500/30 blur-3xl"
                  animate={{ y: [0, -10, 0], x: [0, 6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute right-10 bottom-10 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl"
                  animate={{ y: [0, 12, 0], x: [0, -8, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

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
