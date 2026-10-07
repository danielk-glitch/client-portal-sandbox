import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@mui/material'
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined'
import CommentOutlined from '@mui/icons-material/CommentOutlined'
import './annotation-layer.css'

export type AnnotationAudience = 'design' | 'engineering' | 'product' | 'business'
export type AnnotationTone = 'blue' | 'neutral' | 'violet' | 'green'

export type Annotation = {
  id: string
  target: string
  audience: AnnotationAudience
  title: string
  note: ReactNode
  icon?: ReactNode
  tone?: AnnotationTone
}

type AnnotationMarkerProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  audience: AnnotationAudience
  title: string
  note: ReactNode
  icon?: ReactNode
  tone?: AnnotationTone
  open?: boolean
  onOpenChange?: (open: boolean) => void
  popoverSide?: 'left' | 'right'
  popoverVertical?: 'above' | 'below'
}

const audienceLabels: Record<AnnotationAudience, string> = {
  design: 'Design',
  engineering: 'Engineering',
  product: 'Product',
  business: 'Business',
}

export const AnnotationMarker = forwardRef<HTMLButtonElement, AnnotationMarkerProps>(function AnnotationMarker({
  audience,
  title,
  note,
  icon = <AutoAwesomeOutlined fontSize="inherit" />,
  tone = 'blue',
  open: controlledOpen,
  onOpenChange,
  popoverSide = 'right',
  popoverVertical = 'below',
  className = '',
  onClick,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  ...buttonProps
}, ref) {
  const [internalOpen, setInternalOpen] = useState(false)
  const groupRef = useRef<HTMLSpanElement>(null)
  const open = controlledOpen ?? internalOpen

  const setOpen = useCallback((value: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(value)
    onOpenChange?.(value)
  }, [controlledOpen, onOpenChange])

  useEffect(() => {
    if (!open) return
    function closeOnOutsidePointer(event: PointerEvent) {
      if (!groupRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsidePointer)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer)
  }, [open, setOpen])

  return (
    <span
      ref={groupRef}
      className={`annotation-marker-group annotation-marker-group--${popoverSide} annotation-marker-group--${popoverVertical} ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setOpen(false)
          event.stopPropagation()
        }
      }}
    >
      <button
        {...buttonProps}
        ref={ref}
        type="button"
        className="annotation-marker"
        data-tone={tone}
        aria-label={`${audienceLabels[audience]} note: ${title}`}
        aria-expanded={open}
        onClick={(event) => { setOpen(true); onClick?.(event) }}
        onFocus={(event) => { setOpen(true); onFocus?.(event) }}
        onBlur={(event) => { if (!event.currentTarget.parentElement?.contains(event.relatedTarget)) setOpen(false); onBlur?.(event) }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {icon}
      </button>
      {open && (
        <span className="annotation-popover" role="tooltip">
          <span className="annotation-popover-audience" data-audience={audience}>{audienceLabels[audience]}</span>
          <span className="annotation-popover-title">{title}</span>
          <span className="annotation-popover-note">{note}</span>
        </span>
      )}
    </span>
  )
})

type PositionedAnnotation = Annotation & { x: number; y: number }

export function AnnotationLayer({ annotations, className = '' }: { annotations: Annotation[]; className?: string }) {
  const [enabled, setEnabled] = useState(false)
  const [positions, setPositions] = useState<PositionedAnnotation[]>([])

  useEffect(() => {
    if (!enabled) return

    let frame = 0
    let resizeObserver: ResizeObserver | undefined

    function updatePositions() {
      frame = 0
      resizeObserver?.disconnect()
      const next: PositionedAnnotation[] = []
      for (const annotation of annotations) {
        const target = document.querySelector<HTMLElement>(annotation.target)
        if (!target) continue
        resizeObserver?.observe(target)
        const rect = target.getBoundingClientRect()
        if (!rect.width || !rect.height || rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) continue
        next.push({ ...annotation, x: Math.max(16, Math.min(rect.right - 12, document.documentElement.clientWidth - 48)), y: Math.max(16, Math.min(rect.top + 16, window.innerHeight - 56)) })
      }
      setPositions(next)
    }

    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(updatePositions)
    }

    if (typeof ResizeObserver !== 'undefined') resizeObserver = new ResizeObserver(scheduleUpdate)
    const mutationObserver = new MutationObserver(scheduleUpdate)
    mutationObserver.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('scroll', scheduleUpdate, true)
    window.addEventListener('resize', scheduleUpdate)
    scheduleUpdate()
    return () => {
      cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener('scroll', scheduleUpdate, true)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [enabled, annotations])

  return (
    <>
      <Button
        variant={enabled ? 'contained' : 'outlined'}
        startIcon={<CommentOutlined />}
        className={`annotation-layer-trigger ${className}`}
        onClick={() => setEnabled((value) => !value)}
        aria-label={enabled ? 'Hide annotations' : 'Show annotations'}
        aria-pressed={enabled}
      >
        <span className="annotation-layer-trigger-label">Annotations</span>
      </Button>
      {enabled && createPortal(
        <div className="annotation-layer" aria-label="Designer annotations">
          {positions.map((annotation) => (
            <div key={annotation.id} className="annotation-layer-position" style={{ left: annotation.x, top: annotation.y }}>
              <AnnotationMarker
                audience={annotation.audience}
                title={annotation.title}
                note={annotation.note}
                icon={annotation.icon}
                tone={annotation.tone}
                popoverSide={annotation.x > window.innerWidth - 340 ? 'left' : 'right'}
                popoverVertical={annotation.y > window.innerHeight - 260 ? 'above' : 'below'}
              />
            </div>
          ))}
        </div>,
        document.body,
      )}
    </>
  )
}
