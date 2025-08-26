import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'rf_mobile_notice_ack'

export default function MobileNotice() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const alreadyAck = localStorage.getItem(STORAGE_KEY) === '1'
    if (alreadyAck) return

    const mq = window.matchMedia('(max-width: 768px)')
    const decide = () => setShow(mq.matches)
    decide()
    mq.addEventListener?.('change', decide)
    return () => mq.removeEventListener?.('change', decide)
  }, [])

  const acknowledge = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {}
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="m-6 w-[min(560px,92vw)] text-white text-center"
            role="dialog"
            aria-labelledby="mobile-notice-title"
            aria-modal="true"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/85">
                <rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="12" cy="18.5" r="0.9" fill="currentColor" />
              </svg>
            </div>
            <h2 id="mobile-notice-title" className="text-base font-semibold">Attention</h2>
            <p className="mt-2 text-sm text-white/85">
               Mon portfolio est optimisé pour les mobiles, mais l’expérience est plus agréable sur ordinateur, avec un grand écran.
            </p>
            <br></br>
            <p className="mt-1 text-xs text-white/70">Je vous recommande donc de visionner mon portfolio ainsi que mes créations sur votre ordinateur. Ce message ne réapparaîtra plus une fois fermé.</p>
            <div className="mt-4">
              <button
                onClick={acknowledge}
                className="rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
              >
                J’ai compris
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
