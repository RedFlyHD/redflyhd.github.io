let lockCount = 0
let prevOverflow: string | null = null
let prevTouchAction: string | null = null

export function lockBodyScroll() {
  if (typeof document === 'undefined') return
  const body = document.body
  if (lockCount === 0) {
    prevOverflow = body.style.overflow || ''
    prevTouchAction = body.style.touchAction || ''
    body.style.overflow = 'hidden'
    body.style.touchAction = 'none'
  }
  lockCount++
}

export function unlockBodyScroll() {
  if (typeof document === 'undefined') return
  const body = document.body
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) {
    if (prevOverflow !== null) body.style.overflow = prevOverflow
    if (prevTouchAction !== null) body.style.touchAction = prevTouchAction
    prevOverflow = null
    prevTouchAction = null
  }
}
