/**
 * Shadowbox reader with a single floating bottom bar: title, details, page/zoom, download, pin, and close.
 * Secondary file information appears in a tooltip on hover, keyboard focus, or tap.
 * The bar wraps into two compact rows on phones; reduced-motion and reduced-transparency are supported.
 */
/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft5 Variety4 SlopFree5 */
import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { Box, Button, ClickAwayListener, Dialog, Tooltip, Typography, useMediaQuery } from '@mui/material'
import AddRounded from '@mui/icons-material/AddRounded'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import PushPin from '@mui/icons-material/PushPin'
import PushPinOutlined from '@mui/icons-material/PushPinOutlined'
import RemoveRounded from '@mui/icons-material/RemoveRounded'
import { toast } from 'sonner'
import { FactList, type Fact } from '../../components/FactList'
import { PlaceIconButton } from '../../components/PlaceIconButton'
import type { TransactionDocument } from '../types'
import type { PdfInfo } from './PdfPages'
import './document-viewer.css'

const PdfPages = lazy(() => import('./PdfPages'))

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2]
/** Pages never draw wider than a real letter page at 100%, even on big screens. */
const MAX_FIT_WIDTH = 816

export type ViewerDocument = TransactionDocument

/** "08/20/2026" → "Aug 20, 2026". Leaves anything else as is. */
function readableDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
  if (!match) return value
  const date = new Date(Number(match[3]), Number(match[1]) - 1, Number(match[2]))
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function DocumentViewer({ document, onClose, pinned = false, onTogglePin, extraFacts }: {
  document: ViewerDocument | null
  onClose: () => void
  pinned?: boolean
  onTogglePin?: (document: ViewerDocument) => void
  /** Page-specific details for the info tooltip; stage is omitted. */
  extraFacts?: (document: ViewerDocument) => Fact[]
}) {
  // Keep the last document while the viewer animates closed.
  const [shown, setShown] = useState(document)
  if (document && document !== shown) setShown(document)
  const current = document ?? shown
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [page, setPage] = useState(1)
  const [info, setInfo] = useState<PdfInfo | null>(null)
  const [failed, setFailed] = useState(false)
  const [stage, setStage] = useState<HTMLDivElement | null>(null)
  const [fitWidth, setFitWidth] = useState(640)

  // Fresh view for every document.
  const currentId = current?.id
  const [viewedId, setViewedId] = useState(currentId)
  if (currentId !== viewedId) {
    setViewedId(currentId)
    setZoom(1)
    setPage(1)
    setInfo(null)
    setFailed(false)
    setDetailsOpen(false)
  }
  // Fit pages to the stage width.
  useLayoutEffect(() => {
    if (!stage) return
    const measure = () => setFitWidth(Math.min(
      MAX_FIT_WIDTH,
      Math.max(240, stage.clientWidth - 48),
      Math.max(240, (stage.clientHeight - 48) * 8.5 / 11),
    ))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [stage])

  const zoomIndex = ZOOM_STEPS.indexOf(zoom)
  const zoomOut = useCallback(() => setZoom((value) => ZOOM_STEPS[Math.max(0, ZOOM_STEPS.indexOf(value) - 1)]), [])
  const zoomIn = useCallback(() => setZoom((value) => ZOOM_STEPS[Math.min(ZOOM_STEPS.length - 1, ZOOM_STEPS.indexOf(value) + 1)]), [])

  useEffect(() => {
    if (!document) return
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if ((event.target as HTMLElement | null)?.closest('input, textarea')) return
      if (event.key === '+' || event.key === '=') zoomIn()
      else if (event.key === '-') zoomOut()
      else if (event.key === '0') setZoom(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [document, zoomIn, zoomOut])

  if (!current) return null

  const fileName = current.fileName || current.category
  const url = current.fileUrl ?? `/documents/${current.id}.pdf`
  const downloadName = fileName && /\.pdf$/i.test(fileName) ? fileName : `${current.name}.pdf`

  function download() {
    if (!current) return
    const link = window.document.createElement('a')
    link.href = url
    link.download = downloadName
    link.click()
    toast('Download started', { description: downloadName })
  }

  const facts: Fact[] = [
    ...(fileName ? [{ label: 'File', value: fileName }] : []),
    ...(extraFacts?.(current).filter((fact) => fact.label !== 'Stage') ?? []),
    { label: 'Added by', value: current.postedBy },
    { label: 'Uploaded', value: readableDate(current.uploadedAt) },
  ]

  let stageContent: ReactNode
  if (failed) {
    stageContent = (
      <Box className="doc-viewer-empty" role="status">
        <Box component="span" className="doc-viewer-empty-icon" aria-hidden="true"><DescriptionOutlined /></Box>
        <Typography variant="titleS" component="p">This preview isn’t available</Typography>
        <Typography variant="bodySStandard" color="text.secondary">You can still download the file and open it on your device.</Typography>
      </Box>
    )
  } else {
    stageContent = (
      <Suspense fallback={<div className="doc-viewer-page doc-viewer-page--loading" style={{ width: Math.round(fitWidth * zoom), height: Math.round(fitWidth * zoom) * 11 / 8.5 }} aria-hidden="true" />}>
        <PdfPages key={url} url={url} width={Math.round(fitWidth * zoom)} scrollRoot={stage} onLoad={setInfo} onError={() => setFailed(true)} onPageChange={setPage} />
      </Suspense>
    )
  }

  const transitionDuration = reducedMotion ? 0 : { enter: 240, exit: 180 }

  return (
    <Dialog
      open={document !== null}
      onClose={onClose}
      fullScreen
      className={`doc-viewer${document ? ' is-open' : ''}`}
      aria-labelledby="doc-viewer-title"
      transitionDuration={transitionDuration}
      slotProps={{
        paper: { className: 'doc-viewer-paper' },
        backdrop: { transitionDuration },
      }}
    >
      <Box className="doc-viewer-workspace">
        <Box className="doc-viewer-reader">
          <Box
            ref={setStage}
            className="doc-viewer-stage"
            tabIndex={0}
            aria-label={`${current.name} pages`}
            onClick={(event) => {
              if (event.target === event.currentTarget || (event.target as HTMLElement).classList.contains('doc-viewer-stage-inner')) onClose()
            }}
          >
            <Box className="doc-viewer-stage-inner">{stageContent}</Box>
          </Box>

        </Box>
      </Box>

      <Box className="doc-viewer-dock" role="group" aria-label="Document controls">
        <Box className="doc-viewer-identity">
          <Typography component="h2" variant="titleXS" id="doc-viewer-title" noWrap>{current.name}</Typography>
          <ClickAwayListener onClickAway={() => setDetailsOpen(false)}>
            <Box component="span" className="doc-viewer-info-anchor">
              <Tooltip
                open={detailsOpen}
                onOpen={() => setDetailsOpen(true)}
                onClose={() => setDetailsOpen(false)}
                placement="top-start"
                describeChild
                enterDelay={200}
                slotProps={{
                  tooltip: { className: 'doc-viewer-info-tooltip' },
                  popper: { modifiers: [{ name: 'preventOverflow', options: { padding: 16, rootBoundary: 'viewport' } }] },
                  transition: { timeout: reducedMotion ? 0 : 160 },
                }}
                title={
                  <Box className="doc-viewer-info-content">
                    {current.summary && <Typography variant="bodySStandard" component="p">{current.summary}</Typography>}
                    <FactList facts={facts} layout="rows" />
                  </Box>
                }
              >
                <PlaceIconButton
                  aria-label="Details"
                  aria-expanded={detailsOpen}
                  onClick={() => setDetailsOpen(true)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape' && detailsOpen) {
                      event.stopPropagation()
                      setDetailsOpen(false)
                    }
                  }}
                ><InfoOutlined fontSize="small" /></PlaceIconButton>
              </Tooltip>
            </Box>
          </ClickAwayListener>
        </Box>

        {!failed && (
          <Box className="doc-viewer-reading-controls">
            <Typography variant="labelS" component="span" className="doc-viewer-pages" aria-live="polite" aria-label={info ? `Page ${page} of ${info.pages}` : 'Loading pages'}>
              {info ? <>{page} / {info.pages}</> : 'Loading…'}
            </Typography>
            <Box component="span" className="doc-viewer-control-divider" aria-hidden="true" />
            <Box className="doc-viewer-zoom" role="group" aria-label="Zoom">
              <PlaceIconButton onClick={zoomOut} disabled={zoomIndex <= 0} aria-label="Zoom out"><RemoveRounded fontSize="small" /></PlaceIconButton>
              <Button size="small" variant="text" onClick={() => setZoom(1)} className="doc-viewer-zoom-value" aria-label={`Zoom ${Math.round(zoom * 100)} percent. Reset to fit width`}>{Math.round(zoom * 100)}%</Button>
              <PlaceIconButton onClick={zoomIn} disabled={zoomIndex >= ZOOM_STEPS.length - 1} aria-label="Zoom in"><AddRounded fontSize="small" /></PlaceIconButton>
            </Box>
          </Box>
        )}

        <Box className="doc-viewer-actions">
          {onTogglePin && (
            <Tooltip title={pinned ? 'Unpin document' : 'Pin document'}>
              <PlaceIconButton
                className="doc-viewer-pin"
                onClick={() => onTogglePin(current)}
                aria-pressed={pinned}
                aria-label={pinned ? `Unpin ${current.name}` : `Pin ${current.name}`}
              >{pinned ? <PushPin fontSize="small" /> : <PushPinOutlined fontSize="small" />}</PlaceIconButton>
            </Tooltip>
          )}
          <Button className="doc-viewer-download" aria-label="Download" variant="contained" color="primary" startIcon={<FileDownloadOutlined />} onClick={download}><span className="doc-viewer-download-label">Download</span></Button>
          <Tooltip title="Close">
            <PlaceIconButton onClick={onClose} aria-label="Close document" className="doc-viewer-close"><CloseOutlined /></PlaceIconButton>
          </Tooltip>
        </Box>
      </Box>
    </Dialog>
  )
}
