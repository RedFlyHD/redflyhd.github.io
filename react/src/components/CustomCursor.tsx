import { useEffect, useLayoutEffect, useRef, useState } from 'react'

type CursorState = 'default' | 'link' | 'external-link' | 'button' | 'input' | 'drag' | 'pointer'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const dotRef = useRef<HTMLDivElement | null>(null)
  const outerRingRef = useRef<HTMLDivElement | null>(null)
  const iconRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)

  const [enabled, setEnabled] = useState(false)
  const [cursorState, setCursorState] = useState<CursorState>('default')
  
  const mouse = useRef({ x: 0, y: 0 })
  const dot = useRef({ x: 0, y: 0 })
  const outerRing = useRef({ x: 0, y: 0 })
  const state = useRef({ 
    pressed: false, 
    currentState: 'default' as CursorState,
    velocity: { x: 0, y: 0 },
    lastMouse: { x: 0, y: 0 }
  })

  // Détection du support hover et des préférences de mouvement réduit
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const checkEnabled = () => {
      // Vérifier si c'est un appareil mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent)
      
      // Vérifier les media queries
      const hasHover = window.matchMedia('(hover: hover)').matches
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      
      // Activer seulement sur desktop avec souris
      const shouldEnable = !isMobile && !isTablet && hasHover && hasFinePointer && !prefersReducedMotion
      
      console.log('Custom cursor check:', { isMobile, isTablet, hasHover, hasFinePointer, prefersReducedMotion, shouldEnable })
      setEnabled(shouldEnable)
    }
    
    checkEnabled()

    // Écouter les changements de media queries
    const mqHover = window.matchMedia('(hover: hover)')
    const mqPointer = window.matchMedia('(pointer: fine)')
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    mqHover.addEventListener?.('change', checkEnabled)
    mqPointer.addEventListener?.('change', checkEnabled)
    mqMotion.addEventListener?.('change', checkEnabled)
    
    return () => {
      mqHover.removeEventListener?.('change', checkEnabled)
      mqPointer.removeEventListener?.('change', checkEnabled)
      mqMotion.removeEventListener?.('change', checkEnabled)
    }
  }, [])

  // Ajouter la classe pour masquer le curseur système
  useEffect(() => {
    if (!enabled) {
      console.log('Custom cursor not enabled')
      return
    }
    
    console.log('Custom cursor enabled - hiding system cursor')
    const html = document.documentElement
    const body = document.body
    
    html.classList.add('custom-cursor-active')
    
    // Sauvegarder les styles originaux
    const originalBodyCursor = body.style.cursor
    const originalHtmlCursor = html.style.cursor
    
    // Appliquer cursor: none de manière ultra-agressive
    html.style.setProperty('cursor', 'none', 'important')
    body.style.setProperty('cursor', 'none', 'important')
    
    // Créer un style qui force cursor: none partout
    const styleElement = document.createElement('style')
    styleElement.id = 'custom-cursor-force-hide'
    styleElement.textContent = `
      @media (hover: hover) and (pointer: fine) {
        * {
          cursor: none !important;
          -webkit-cursor: none !important;
        }
        *::before,
        *::after {
          cursor: none !important;
          -webkit-cursor: none !important;
        }
      }
    `
    document.head.insertBefore(styleElement, document.head.firstChild)
    
    // Fonction ultra-agressive pour forcer cursor: none
    const forceNoCursor = () => {
      html.style.setProperty('cursor', 'none', 'important')
      body.style.setProperty('cursor', 'none', 'important')
      
      // Forcer sur TOUS les éléments
      const allElements = document.querySelectorAll('*')
      allElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          const computedStyle = window.getComputedStyle(el)
          if (computedStyle.cursor !== 'none') {
            el.style.setProperty('cursor', 'none', 'important')
          }
        }
      })
    }
    
    // Forcer immédiatement et en boucle
    forceNoCursor()
    const interval = setInterval(forceNoCursor, 16) // Environ 60fps
    
    // Observer TOUS les changements
    const observer = new MutationObserver((mutations) => {
      forceNoCursor()
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      childList: true,
      subtree: true,
    })
    
    // Event listeners en mode capture pour intercepter avant tout le monde
    const forceCursorOnEvent = (e: Event) => {
      const target = e.target as HTMLElement
      if (target instanceof HTMLElement) {
        target.style.setProperty('cursor', 'none', 'important')
      }
    }
    
    document.addEventListener('mousemove', forceCursorOnEvent, { capture: true, passive: true })
    document.addEventListener('mouseover', forceCursorOnEvent, { capture: true, passive: true })
    document.addEventListener('mouseenter', forceCursorOnEvent, { capture: true, passive: true })
    document.addEventListener('focus', forceCursorOnEvent, { capture: true, passive: true })
    
    return () => {
      html.classList.remove('custom-cursor-active')
      body.style.cursor = originalBodyCursor
      html.style.cursor = originalHtmlCursor
      const styleEl = document.getElementById('custom-cursor-force-hide')
      if (styleEl) styleEl.remove()
      clearInterval(interval)
      observer.disconnect()
      document.removeEventListener('mousemove', forceCursorOnEvent, { capture: true })
      document.removeEventListener('mouseover', forceCursorOnEvent, { capture: true })
      document.removeEventListener('mouseenter', forceCursorOnEvent, { capture: true })
      document.removeEventListener('focus', forceCursorOnEvent, { capture: true })
    }
  }, [enabled])

  // Gestion des événements et animations
  useEffect(() => {
    if (!enabled) return

    const handleMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      
      // Calculer la vélocité pour les effets de traînée
      state.current.velocity.x = e.clientX - state.current.lastMouse.x
      state.current.velocity.y = e.clientY - state.current.lastMouse.y
      state.current.lastMouse.x = e.clientX
      state.current.lastMouse.y = e.clientY
    }

    const handleDown = () => {
      state.current.pressed = true
      updateCursorAppearance()
    }

    const handleUp = () => {
      state.current.pressed = false
      updateCursorAppearance()
    }

    const detectCursorType = (element: Element | null): CursorState => {
      if (!element) return 'default'

      // Vérifier les éléments parents jusqu'à trouver un élément interactif
      const interactive = element.closest('a, button, [role="button"], input, textarea, select, [data-cursor], .cursor-pointer')
      
      if (!interactive) return 'default'

      // Liens externes (avec target="_blank" ou href commençant par http)
      if (interactive.tagName === 'A') {
        const anchor = interactive as HTMLAnchorElement
        const isExternal = anchor.target === '_blank' || 
                          anchor.rel?.includes('external') ||
                          (anchor.href && (anchor.href.startsWith('http://') || anchor.href.startsWith('https://')) && !anchor.href.includes(window.location.hostname))
        
        if (isExternal) return 'external-link'
        return 'link'
      }

      // Champs de saisie
      if (interactive.tagName === 'INPUT' || interactive.tagName === 'TEXTAREA' || interactive.tagName === 'SELECT') {
        return 'input'
      }

      // Attribut data-cursor personnalisé
      const dataCursor = interactive.getAttribute('data-cursor')
      if (dataCursor === 'drag') return 'drag'
      if (dataCursor === 'pointer') return 'pointer'

      // Boutons et éléments cliquables
      return 'button'
    }

    const updateCursorAppearance = () => {
      const currentState = state.current.currentState
      const isPressed = state.current.pressed

      if (!dotRef.current || !outerRingRef.current || !iconRef.current) return

      // Échelles et opacités selon l'état
      let dotScale = 1
      let ringScale = 1
      let ringSize = 32
      let dotOpacity = 1
      let ringOpacity = 0.15
      let iconOpacity = 0
      let iconContent = ''

      switch (currentState) {
        case 'link':
          ringSize = 48
          ringScale = isPressed ? 0.9 : 1
          dotScale = isPressed ? 0.7 : 0.9
          ringOpacity = 0.25
          dotOpacity = 0.9
          break

        case 'external-link':
          ringSize = 64
          ringScale = isPressed ? 0.85 : 1.05
          dotScale = 0
          ringOpacity = 0.35
          iconOpacity = 1
          iconContent = '↗'
          break

        case 'button':
          ringSize = 44
          ringScale = isPressed ? 0.85 : 1
          dotScale = isPressed ? 0.6 : 0.8
          ringOpacity = 0.22
          dotOpacity = 0.95
          break

        case 'input':
          ringSize = 4
          ringScale = 1
          dotScale = isPressed ? 0.8 : 1.2
          ringOpacity = 0.4
          dotOpacity = 1
          break

        case 'drag':
          ringSize = 52
          ringScale = isPressed ? 1.1 : 1
          dotScale = isPressed ? 1.2 : 1
          ringOpacity = 0.28
          dotOpacity = 1
          break

        case 'pointer':
          ringSize = 40
          ringScale = isPressed ? 0.88 : 1
          dotScale = isPressed ? 0.65 : 0.85
          ringOpacity = 0.2
          dotOpacity = 0.92
          break

        default: // 'default'
          ringSize = 32
          ringScale = isPressed ? 0.92 : 1
          dotScale = isPressed ? 0.75 : 1
          ringOpacity = 0.15
          dotOpacity = 1
      }

      // Appliquer les transformations avec des transitions smooth
      dotRef.current.style.setProperty('--dot-scale', dotScale.toString())
      dotRef.current.style.setProperty('--dot-opacity', dotOpacity.toString())
      
      outerRingRef.current.style.setProperty('--ring-size', ringSize.toString())
      outerRingRef.current.style.setProperty('--ring-scale', ringScale.toString())
      outerRingRef.current.style.setProperty('--ring-opacity', ringOpacity.toString())
      
      iconRef.current.style.setProperty('--icon-opacity', iconOpacity.toString())
      iconRef.current.style.setProperty('--icon-scale', iconOpacity > 0 ? '1' : '0')
      iconRef.current.textContent = iconContent
    }

    const handleOver = (e: MouseEvent) => {
      const target = e.target as Element | null
      const newState = detectCursorType(target)
      
      if (newState !== state.current.currentState) {
        state.current.currentState = newState
        setCursorState(newState)
        updateCursorAppearance()
      }
    }

    // Écouter les événements
    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('mouseover', handleOver, { passive: true })
    
    // Écouter aussi les changements de focus pour les inputs
    window.addEventListener('focusin', (e) => {
      const newState = detectCursorType(e.target as Element)
      if (newState !== state.current.currentState) {
        state.current.currentState = newState
        setCursorState(newState)
        updateCursorAppearance()
      }
    }, { passive: true })

    // Animation loop avec interpolation smooth
    const lerp = (a: number, b: number, n: number) => {
      const diff = b - a
      return Math.abs(diff) < 0.001 ? b : a + diff * n
    }

    const tick = () => {
      // Dot suit rapidement la souris
      dot.current.x = lerp(dot.current.x, mouse.current.x, 0.45)
      dot.current.y = lerp(dot.current.y, mouse.current.y, 0.45)
      
      // Outer ring suit plus lentement pour un effet de traînée
      outerRing.current.x = lerp(outerRing.current.x, mouse.current.x, 0.15)
      outerRing.current.y = lerp(outerRing.current.y, mouse.current.y, 0.15)

      // Mise à jour de la position du dot
      if (dotRef.current) {
        const dx = dot.current.x
        const dy = dot.current.y
        dotRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(var(--dot-scale))`
      }

      // Mise à jour de la position du ring extérieur
      if (outerRingRef.current) {
        const rx = outerRing.current.x
        const ry = outerRing.current.y
        const size = parseFloat(outerRingRef.current.style.getPropertyValue('--ring-size')) || 32
        
        // Légère rotation basée sur la vélocité pour un effet plus vivant
        const velocityRotation = Math.atan2(state.current.velocity.y, state.current.velocity.x) * (180 / Math.PI)
        const rotation = state.current.currentState === 'external-link' ? velocityRotation * 0.1 : 0
        
        outerRingRef.current.style.transform = `translate3d(${rx - size / 2}px, ${ry - size / 2}px, 0) scale(var(--ring-scale)) rotate(${rotation}deg)`
      }

      // Mise à jour de la position de l'icône
      if (iconRef.current) {
        const ix = outerRing.current.x
        const iy = outerRing.current.y
        const iconScale = parseFloat(iconRef.current.style.getPropertyValue('--icon-scale') || '0')
        iconRef.current.style.transform = `translate3d(${ix}px, ${iy}px, 0) scale(${iconScale})`
      }

      rafRef.current = requestAnimationFrame(tick)
    }
    
    rafRef.current = requestAnimationFrame(tick)
    updateCursorAppearance()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('mouseover', handleOver)
    }
  }, [enabled, cursorState])

  if (!enabled) return null

  return (
    <div 
      ref={cursorRef}
      className="pointer-events-none fixed inset-0 z-[99999] mix-blend-normal"
      style={{ contain: 'layout style paint' }}
    >
      {/* Ring extérieur - suit lentement */}
      <div
        ref={outerRingRef}
        className="absolute will-change-transform transition-[width,height,opacity] duration-300 ease-out"
        style={{
          ['--ring-size' as string]: '32',
          ['--ring-scale' as string]: '1',
          ['--ring-opacity' as string]: '0.15',
          width: 'calc(var(--ring-size) * 1px)',
          height: 'calc(var(--ring-size) * 1px)',
          borderRadius: '50%',
          border: '1.5px solid rgba(255, 255, 255, 0.35)',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 60%, transparent 100%)',
          opacity: 'var(--ring-opacity)',
          backdropFilter: 'blur(0.5px)',
          transition: 'width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
        }}
      />

      {/* Dot central - suit rapidement */}
      <div
        ref={dotRef}
        className="absolute will-change-transform"
        style={{
          ['--dot-scale' as string]: '1',
          ['--dot-opacity' as string]: '1',
          width: '6px',
          height: '6px',
          marginLeft: '-3px',
          marginTop: '-3px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
          boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 12px rgba(255, 255, 255, 0.4), 0 0 24px rgba(255, 255, 255, 0.15)',
          opacity: 'var(--dot-opacity)',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Icône pour les liens externes */}
      <div
        ref={iconRef}
        className="absolute will-change-transform pointer-events-none"
        style={{
          ['--icon-opacity' as string]: '0',
          ['--icon-scale' as string]: '0',
          marginLeft: '-16px',
          marginTop: '-16px',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: '800',
          color: '#000000',
          backgroundColor: '#FFFFFF',
          borderRadius: '50%',
          opacity: 'var(--icon-opacity)',
          boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 255, 255, 0.4)',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      />
    </div>
  )
}
