import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mx-auto max-w-3xl py-16 text-white">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-10">
        <div className="pointer-events-none absolute -inset-24 opacity-40 blur-2xl">
          <div className="absolute left-10 top-10 h-48 w-48 rounded-full bg-violet-500/30" />
          <div className="absolute right-10 top-28 h-48 w-48 rounded-full bg-indigo-500/30" />
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-sm text-white/50">Erreur 404</p>
          <h1 className="mt-2 text-3xl font-bold">Page introuvable</h1>
          <p className="mt-2 text-sm text-white/70">
            La page que vous cherchez n’existe pas ou a été déplacée.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:opacity-90"
            >
              Retour à l’accueil
            </Link>
            <Link
              to="/work"
              className="rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
            >
              Voir mes projets
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
