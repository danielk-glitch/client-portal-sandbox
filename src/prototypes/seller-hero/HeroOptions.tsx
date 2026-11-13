/** Live, keyboard-accessible comparison of the two seller hero directions. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { PreviewShell } from './PreviewShell'
import './hero-options.css'
import './picker.css'

const variants = ['Editorial', 'Private client']

export function HeroOptions() {
  const [variant, setVariant] = useState(() => new URLSearchParams(location.search).get('v') === '2' ? 1 : 0)
  const [replay, setReplay] = useState(0)
  const picker = useRef<HTMLElement>(null)
  const highlight = useRef<HTMLSpanElement>(null)

  function choose(index: number) {
    setVariant(index)
    const url = new URL(location.href)
    url.searchParams.set('v', String(index + 1))
    history.replaceState(null, '', url)
  }

  useLayoutEffect(() => {
    function measure() {
      const button = picker.current?.querySelector<HTMLButtonElement>('[data-active]')
      if (button && highlight.current) {
        highlight.current.style.width = `${button.offsetWidth}px`
        highlight.current.style.transform = `translateX(${button.offsetLeft}px)`
      }
    }
    measure()
    window.addEventListener('resize', measure)
    const frame = requestAnimationFrame(() => picker.current?.setAttribute('data-ready', ''))
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', measure)
    }
  }, [variant])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      if (event.metaKey || event.ctrlKey || event.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable || target.closest('[role="dialog"], [aria-modal="true"]')) return
      if (event.key === '1' || event.key === '2') choose(Number(event.key) - 1)
      else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault()
        choose(1 - variant)
      } else if (event.key.toLowerCase() === 'r') setReplay(value => value + 1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [variant])

  return <>
    <PreviewShell key={`${variant}-${replay}`} variant={variant} />
    <nav className="proto-picker" aria-label="Prototype variants" ref={picker}>
      <span className="proto-picker-highlight" aria-hidden="true" ref={highlight} />
      {variants.map((name, index) => <button key={name} className="proto-picker-item" data-active={variant === index ? '' : undefined} aria-current={variant === index ? 'true' : undefined} onClick={() => choose(index)}>{name}</button>)}
    </nav>
  </>
}
