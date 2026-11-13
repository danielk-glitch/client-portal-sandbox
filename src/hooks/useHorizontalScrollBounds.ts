import { useCallback, useEffect, useRef, useState } from 'react'

/** Tracks whether a horizontal scroller can move left or right, for enabling carousel arrows. */
export function useHorizontalScrollBounds<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [bounds, setBounds] = useState({ left: false, right: false })

  const update = useCallback(() => {
    const element = ref.current
    if (!element) return
    const left = element.scrollLeft > 2
    const right = element.scrollLeft < element.scrollWidth - element.clientWidth - 2
    setBounds((current) => current.left === left && current.right === right ? current : { left, right })
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const frame = requestAnimationFrame(update)
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [update])

  const scrollByPage = useCallback((direction: -1 | 1) => {
    const element = ref.current
    if (!element) return
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    element.scrollBy({ left: direction * element.clientWidth * 0.8, behavior })
  }, [])

  return { ref, bounds, onScroll: update, scrollByPage }
}
