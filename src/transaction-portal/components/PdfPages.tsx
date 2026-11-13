/**
 * PDF pages for the document viewer, rendered with react-pdf (Mozilla's pdf.js).
 * Loaded lazily, so pdf.js only downloads the first time someone opens a document.
 * Every page renders at the viewer's width times the zoom, with a selectable text layer.
 * Reports the page count and file size once loaded, and which page is most in view while scrolling.
 */
import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

/** US Letter proportions, used to hold space for pages before they draw. */
const PAGE_RATIO = 11 / 8.5

export type PdfInfo = { pages: number; bytes?: number }

export default function PdfPages({ url, width, scrollRoot, onLoad, onError, onPageChange }: {
  url: string
  /** Rendered page width in CSS pixels (fit width times zoom). */
  width: number
  scrollRoot: HTMLElement | null
  onLoad: (info: PdfInfo) => void
  onError: () => void
  onPageChange: (page: number) => void
}) {
  const [pages, setPages] = useState(0)
  const pageRefs = useRef<Array<HTMLDivElement | null>>([])

  async function handleLoad(pdf: PDFDocumentProxy) {
    setPages(pdf.numPages)
    let bytes: number | undefined
    try {
      bytes = (await pdf.getDownloadInfo()).length
    } catch {
      bytes = undefined
    }
    onLoad({ pages: pdf.numPages, bytes })
  }

  // The page with the most area in view is the current page.
  useEffect(() => {
    if (!pages || !scrollRoot || !('IntersectionObserver' in window)) return
    const ratios = new Map<number, number>()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => ratios.set(Number((entry.target as HTMLElement).dataset.page), entry.intersectionRatio))
      let best = 1
      let bestRatio = -1
      ratios.forEach((ratio, page) => {
        if (ratio > bestRatio) {
          best = page
          bestRatio = ratio
        }
      })
      onPageChange(best)
    }, { root: scrollRoot, threshold: [0, 0.25, 0.5, 0.75, 1] })
    pageRefs.current.slice(0, pages).forEach((node) => node && observer.observe(node))
    return () => observer.disconnect()
  }, [pages, scrollRoot, onPageChange])

  const placeholder = <div className="doc-viewer-page doc-viewer-page--loading" style={{ width, height: width * PAGE_RATIO }} aria-hidden="true" />

  return (
    <Document
      file={url}
      onLoadSuccess={handleLoad}
      onLoadError={onError}
      onSourceError={onError}
      loading={placeholder}
      error={null}
      className="doc-viewer-document"
    >
      {Array.from({ length: pages }, (_, index) => (
        <div
          key={index}
          ref={(node) => { pageRefs.current[index] = node }}
          data-page={index + 1}
          className="doc-viewer-page"
          style={{ width, minHeight: width * PAGE_RATIO }}
        >
          <Page pageNumber={index + 1} width={width} loading={null} renderAnnotationLayer renderTextLayer />
        </div>
      ))}
    </Document>
  )
}
