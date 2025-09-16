import { useRef } from 'react'
import ImageWithSkeleton from './ImageWithSkeleton'

type Props = {
  title: string
  image: string
  href?: string
  date?: string
  onClick?: () => void
  actionLabel?: string
}

export default function ProjectCard({ title, image, href, date, onClick, actionLabel }: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const rafId = useRef<number | null>(null)
  const lastXY = useRef<{ x: number; y: number } | null>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = cardRef.current
    if (!el) return
    // Disable transform transition while moving for immediate response
    el.style.transition = 'transform 0s'
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    lastXY.current = { x, y }
    if (rafId.current) return
    rafId.current = requestAnimationFrame(() => {
      const xy = lastXY.current
      if (xy) {
        const rotX = (-xy.y) * 4
        const rotY = xy.x * 6
        el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`
        // Update CSS vars for metallic highlight position
        const px = (xy.x + 0.5) * 100
        const py = (xy.y + 0.5) * 100
        el.style.setProperty('--px', `${px}%`)
        el.style.setProperty('--py', `${py}%`)
      }
      rafId.current = null
    })
  }

  const onLeave = () => {
    const el = cardRef.current
    if (!el) return
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
      rafId.current = null
    }
    // Re-enable a smooth transition only for the return to neutral
    el.style.transition = 'transform 380ms cubic-bezier(0.16,1,0.3,1)'
    el.style.transform = ''
  }

  const content = (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
  className="group relative aspect-[16/9] min-h-[180px] sm:min-h-[220px] overflow-hidden rounded-xl shadow-lg will-change-transform transform-gpu motion-reduce:transform-none"
    >
      <div className="absolute inset-0 overflow-hidden">
        <ImageWithSkeleton
          src={image}
          alt={title}
          loading="lazy"
          containerClassName="absolute inset-0"
          className="absolute inset-0 block h-full w-full object-cover object-center scale-[1.04] transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.07]"
        />
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-90" />
        <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M-10 10 L 110 10" stroke="url(#g)" strokeWidth="0.4">
            <animate attributeName="stroke-opacity" values="0.1;0.6;0.1" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M-10 30 L 110 30" stroke="url(#g)" strokeWidth="0.4">
            <animate attributeName="stroke-opacity" values="0.1;0.5;0.1" dur="2.6s" repeatCount="indefinite" />
          </path>
          <path d="M-10 50 L 110 50" stroke="url(#g)" strokeWidth="0.4">
            <animate attributeName="stroke-opacity" values="0.1;0.7;0.1" dur="3.4s" repeatCount="indefinite" />
          </path>
        </svg>
      </div>
      {/* Metallic reflective highlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          // Radial specular highlight following cursor + subtle brushed texture
          background:
            `radial-gradient( circle at var(--px, 50%) var(--py, 50%), rgba(255,255,255,0.45), rgba(255,255,255,0.18) 20%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0) 60%),` +
            `repeating-linear-gradient( 115deg, rgba(255,255,255,0.06) 0 2px, rgba(0,0,0,0.06) 2px 4px )`,
          mixBlendMode: 'soft-light',
        }}
      />
      <div className="absolute inset-0 flex items-end opacity-100 sm:opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="w-full translate-y-0 bg-black/50 p-3 sm:p-4 backdrop-blur transition duration-300 sm:translate-y-full sm:group-hover:translate-y-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{title}</h3>
              {date && <p className="text-xs text-white/70">{date}</p>}
            </div>
            {(href || onClick) && (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black">{actionLabel ?? 'Voir'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {content}
      </a>
    )
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-xl">
        {content}
      </button>
    )
  }
  return content
}
