import { motion, Variants } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const lastPathRef = useRef<string | null>(null)
  const directionRef = useRef<1 | -1>(1)
  const modeRef = useRef<'h' | 'v'>('v')

  useEffect(() => {
    const order = ['/', '/work', '/tools', '/renew']
    const current = location.pathname
    const last = lastPathRef.current
  if (last === null) {
      modeRef.current = 'v'
    } else {
      const ci = order.indexOf(current)
      const li = order.indexOf(last)
      if (ci !== -1 && li !== -1 && ci !== li) {
        directionRef.current = ci > li ? 1 : -1
        modeRef.current = 'h'
      } else {
        modeRef.current = 'v'
      }
    }
    lastPathRef.current = current
  }, [location.pathname])

  const dir = directionRef.current

  const easeSoft = [0.16, 1, 0.3, 1] as const
  const variants: Variants = {
    initial: (c: { dir: number; mode: 'h' | 'v' } = { dir: 1, mode: 'h' }) =>
      c.mode === 'h'
        ? { opacity: 0, x: -160 * c.dir, y: 0, scale: 0.99, filter: 'blur(2px)' }
        : { opacity: 0, x: 0, y: 60, scale: 0.985, filter: 'blur(2px)' },
    animate: { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' },
    exit: (c: { dir: number; mode: 'h' | 'v' } = { dir: 1, mode: 'h' }) =>
      c.mode === 'h'
        ? { opacity: 0, x: 160 * c.dir, y: 0, scale: 0.99, filter: 'blur(2px)' }
        : { opacity: 0, x: 0, y: -60, scale: 0.985, filter: 'blur(2px)' },
  }

  return (
    <motion.div
      key={location.pathname}
      custom={{ dir, mode: modeRef.current }}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        x: { duration: 0.6, ease: easeSoft },
        y: { duration: 0.6, ease: easeSoft },
        scale: { duration: 0.6, ease: easeSoft },
        opacity: { duration: 0.35, ease: 'easeOut' },
        filter: { duration: 0.45, ease: 'easeOut' },
      }}
    >
      {children}
    </motion.div>
  )
}
