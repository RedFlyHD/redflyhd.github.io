import { motion } from 'framer-motion'

export default function Renew() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">
      <h1 className="text-3xl font-bold">ReNew</h1>
      <p className="text-white/70 max-w-2xl">
        Cette page est en cours de construction dans la version React. Le contenu sera porté et animé de façon moderne sans copier d'autres sites.
      </p>
    </motion.div>
  )
}
