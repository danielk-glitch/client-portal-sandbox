/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft5 Variety3 SlopFree5 */
import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import RateReviewOutlined from '@mui/icons-material/RateReviewOutlined'
import './feedback-toolbar.css'

export function FeedbackToolbar({ children, keepOpen = false, inline = false }: {
  children: ReactNode
  keepOpen?: boolean
  inline?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [keyboard, setKeyboard] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const controlsId = useId()
  const expanded = hovered || focused || pinned || keepOpen

  useEffect(() => {
    if (!pinned && !keepOpen) return
    function dismiss(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setPinned(false)
      // The popover backdrop receives clicks over the toolbar, so restore its hover state before dismissal.
      if (keepOpen && event.pointerType === 'mouse' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const bounds = rootRef.current?.getBoundingClientRect()
        if (bounds) setHovered(event.clientX >= bounds.left - 12 && event.clientX <= bounds.right + 12 && event.clientY >= bounds.top - 12 && event.clientY <= bounds.bottom + 12)
      }
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [pinned, keepOpen])

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label="Feedback tools"
      className={`feedback-toolbar${inline ? ' feedback-toolbar--inline' : ''}`}
      data-expanded={expanded}
      data-keyboard={keyboard}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) setHovered(true)
      }}
      onPointerLeave={() => setHovered(false)}
      onPointerDown={() => { setKeyboard(false); setFocused(false) }}
      onFocus={(event) => {
        if (event.target.matches(':focus-visible')) { setKeyboard(true); setFocused(true) }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
      onKeyDown={(event) => {
        setKeyboard(true)
        if (event.key === 'Escape') {
          setPinned(false)
          setFocused(false)
          setHovered(false)
          rootRef.current?.querySelector<HTMLButtonElement>('.feedback-toolbar-trigger')?.focus()
          setFocused(false)
        }
      }}
    >
      <div className="feedback-toolbar-surface">
        <button
          type="button"
          className="feedback-toolbar-trigger"
          aria-label="Feedback tools"
          aria-expanded={expanded}
          aria-controls={controlsId}
          onClick={() => setPinned((value) => !value)}
        >
          <RateReviewOutlined />
        </button>
        <div id={controlsId} className="feedback-toolbar-controls" inert={!expanded} aria-hidden={!expanded}>
          {children}
        </div>
      </div>
    </div>
  )
}
