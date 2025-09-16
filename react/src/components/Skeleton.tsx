import React from 'react'

type SkeletonProps = {
  className?: string
  rounded?: boolean
}

export default function Skeleton({ className = '', rounded = true }: SkeletonProps) {
  return (
    <div
      className={
        `relative overflow-hidden bg-white/[0.06] ${rounded ? 'rounded-md' : ''} ${className}`
      }
      aria-hidden
    >
      <div className="absolute inset-0 -translate-x-full animate-skeleton-shimmer bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)]" />
    </div>
  )
}

