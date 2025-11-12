import { useEffect, type ReactNode } from 'react'
import { lockBodyScroll, unlockBodyScroll } from '../utils/bodyScrollLock'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

type ModalProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export default function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    lockBodyScroll()
    return () => {
      document.removeEventListener('keydown', onKey)
      unlockBodyScroll()
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/20 bg-neutral-900/95 text-white shadow-2xl shadow-black/50 backdrop-blur-xl flex max-h-[85dvh] flex-col"
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            >
              {/* Gradient accents */}
              <div className="pointer-events-none absolute inset-0 rounded-[1rem] [background:radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.15),transparent_50%)]" />
              <div className="pointer-events-none absolute inset-0 rounded-[1rem] [background:radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.08),transparent_50%)]" />
              
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-white/90 backdrop-blur-md transition-all hover:scale-105 hover:border-white/20 hover:bg-black/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-95"
                aria-label="Fermer le modal"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M6.225 4.811 4.811 6.225 10.586 12l-5.775 5.775 1.414 1.414L12 13.414l5.775 5.775 1.414-1.414L13.414 12l5.775-5.775-1.414-1.414L12 10.586 6.225 4.811z" />
                </svg>
              </button>
              <div className="relative overflow-y-auto pt-16 pb-4">
                {children}
              </div>
              <div className="relative flex items-center justify-center border-t border-white/10 bg-gradient-to-t from-neutral-900/95 to-neutral-900/90 p-4 backdrop-blur-xl sm:hidden">
                <button
                  onClick={onClose}
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-white to-white/95 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-white/25 transition-all active:scale-95"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
