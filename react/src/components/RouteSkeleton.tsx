import React from 'react'
import Skeleton from './Skeleton'

export default function RouteSkeleton() {
  return (
    <div className="py-4">
      <Skeleton className="h-7 w-44 mb-4" />

      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
            <Skeleton className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  )
}

