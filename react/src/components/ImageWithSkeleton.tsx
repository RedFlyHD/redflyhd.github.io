import React, { ImgHTMLAttributes, useEffect, useRef, useState } from 'react'
import Skeleton from './Skeleton'

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  containerClassName?: string
}

export default function ImageWithSkeleton({ containerClassName = '', className = '', onLoad, ...imgProps }: Props) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth > 0) {
      // Already loaded from cache
      setLoaded(true)
    }
  }, [imgProps.src])

  return (
    <div className={`${containerClassName || 'relative'}`}>
      {!loaded && (
        <Skeleton className="absolute inset-0 pointer-events-none z-10" rounded />
      )}
      <img
        ref={imgRef}
        {...imgProps}
        onLoad={(e) => {
          setLoaded(true)
          onLoad?.(e)
        }}
        className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
    </div>
  )
}
