import { useEffect, useRef } from 'react'

/** Adds 'animate-in' class to the returned ref element once it enters the viewport */
export function useScrollAnimation<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('animate-in'); observer.disconnect() }
    }, { threshold: 0.12 })
    observer.observe(el); return () => observer.disconnect()
  }, [])
  return ref
}
