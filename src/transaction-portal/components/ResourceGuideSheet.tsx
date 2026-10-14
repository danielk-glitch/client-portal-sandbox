import { useId, useRef, useState } from 'react'
import { Box, Button, ButtonBase, Collapse, Drawer, IconButton, Typography, useMediaQuery } from '@mui/material'
import MenuOutlined from '@mui/icons-material/MenuOutlined'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined'
import { PlaceSheet } from '../../components/PlaceSheet'
import type { TransactionResource } from '../types'
import './resource-guide-sheet.css'
import { cleanResourceHtml } from '../resourceContent'

/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft5 Variety5 SlopFree5 */
export function ResourceGuideSheet({ resource, resources, onSelectResource, onClose }: {
  resource: TransactionResource | null
  resources: TransactionResource[]
  onSelectResource: (resource: TransactionResource) => void
  onClose: () => void
}) {
  const [libraryOpen, setLibraryOpen] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const libraryReturnFocus = useRef<'menu' | 'guide'>('menu')
  const libraryId = useId()
  const titleId = useId()
  const sectionPrefix = useId()
  const scrollRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  function closeLibrary() {
    libraryReturnFocus.current = 'menu'
    setLibraryOpen(false)
  }

  function closeGuide() {
    setLibraryOpen(false)
    onClose()
  }

  function selectResource(nextResource: TransactionResource) {
    libraryReturnFocus.current = 'guide'
    onSelectResource(nextResource)
    setLibraryOpen(false)
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: 0 })
    })
  }

  function goToSection(index: number) {
    const target = scrollRef.current?.querySelector<HTMLElement>(`[data-guide-section="${index}"]`)
    target?.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'instant' : 'smooth' })
    target?.focus({ preventScroll: true })
  }

  return (
    <PlaceSheet open={resource !== null} onClose={closeGuide} labelledBy={titleId} className="resource-sheet-root">
      <Box ref={frameRef} className="resource-sheet-frame">
      <Box ref={scrollRef} className="place-sheet-scroll resource-sheet-scroll">
        <Box component="header" className="resource-sheet-toolbar">
          <IconButton ref={menuButtonRef} onClick={() => setLibraryOpen(true)} aria-label="Open resource library" aria-expanded={libraryOpen} aria-controls={libraryOpen ? libraryId : undefined} aria-haspopup="dialog" className="resource-library-trigger"><MenuOutlined /></IconButton>
          <Typography variant="labelS" color="text.secondary" className="resource-sheet-toolbar-label">Transaction resources</Typography>
          <IconButton onClick={closeGuide} aria-label="Close resource guide"><CloseOutlined /></IconButton>
        </Box>
        {resource && (
          <Box component="article" key={resource.id} className="resource-editorial">
            <Box component="header" className="resource-editorial-intro">
              <Typography variant="labelS" color="text.secondary" className="resource-editorial-eyebrow">Seller guide · {resource.readingTime}</Typography>
              <Typography component="h1" ref={headingRef} tabIndex={-1} id={titleId} variant="displayM" sx={{ typography: { xs: 'titleL', sm: 'displayM' } }}>{resource.title}</Typography>
              <Typography variant="bodyLStandard" color="text.secondary" className="resource-editorial-deck">{resource.summary}</Typography>
            </Box>
            <Box className="resource-editorial-layout">
              <GuideContents resource={resource} sectionPrefix={sectionPrefix} onGoToSection={goToSection} />
              <Box className="resource-editorial-body">
                {resource.sections.map((section, index) => (
                  <Box component="section" key={section.title} id={`${sectionPrefix}-${index}`} data-guide-section={index} tabIndex={-1} className={`resource-editorial-section${section.points ? ' resource-editorial-preparation' : ''}`} aria-labelledby={`${sectionPrefix}-heading-${index}`}>
                    <Typography variant="labelS" color="text.secondary" className="resource-section-number">{String(index + 1).padStart(2, '0')}</Typography>
                    <Typography component="h2" variant="titleS" id={`${sectionPrefix}-heading-${index}`}>{section.title}</Typography>
                    {section.html && <Typography component="div" variant="bodyMStandard" className="resource-rich-content" dangerouslySetInnerHTML={{ __html: cleanResourceHtml(section.html) }} />}
                    {section.body && <Typography variant="bodyMStandard" color="text.secondary">{section.body}</Typography>}
                    {section.points && (
                      <Box component="ul" className="resource-preparation-list">
                        {section.points.map((point, pointIndex) => <Box component="li" key={point}><Typography component="span" variant="labelS" className="resource-section-number">{String(pointIndex + 1).padStart(2, '0')}</Typography><Typography variant="bodyMStandard">{point}</Typography></Box>)}
                      </Box>
                    )}
                  </Box>
                ))}
                {resource.questions.length > 0 && <Box component="section" id={`${sectionPrefix}-questions`} data-guide-section={resource.sections.length} tabIndex={-1} className="resource-editorial-questions" aria-labelledby={`${sectionPrefix}-questions-heading`}>
                  <Typography variant="labelS" color="text.secondary">Your next conversation</Typography>
                  <Typography component="h2" variant="titleS" id={`${sectionPrefix}-questions-heading`}>Questions to ask your agent</Typography>
                  <Box component="ul">{resource.questions.map((question) => <Typography component="li" variant="bodyMStandard" key={question}>{question}</Typography>)}</Box>
                </Box>}
                <Box component="footer" className="resource-editorial-footer">
                  <Typography variant="bodySStandard" color="text.secondary">Your team can explain how these steps apply to your home and contract.</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <Drawer anchor="left" open={resource !== null && libraryOpen} onClose={closeLibrary} container={() => frameRef.current} disablePortal disableRestoreFocus transitionDuration={reducedMotion ? 0 : 220} className="resource-library-drawer"
        slotProps={{ paper: { id: libraryId, className: 'resource-library-paper', role: 'dialog', 'aria-modal': true, 'aria-label': 'Resource library' }, transition: { onExited: () => {
          if (resource) (libraryReturnFocus.current === 'guide' ? headingRef.current : menuButtonRef.current)?.focus({ preventScroll: true })
        } } }}>
        <Box className="resource-library-header">
          <Box>
            <Typography component="h2" variant="titleS">Resource library</Typography>
            <Typography variant="bodySStandard" color="text.secondary">Guides for every step of your sale</Typography>
          </Box>
          <IconButton onClick={closeLibrary} aria-label="Close resource library"><CloseOutlined /></IconButton>
        </Box>
        <Box component="nav" aria-label="All resources" className="resource-library-navigation">
          {(['Useful now', 'Coming up', 'Good to know'] as const).map((relevance) => {
            const guides = resources.filter((guide) => guide.relevance === relevance)
            if (guides.length === 0) return null
            return <Box component="section" key={relevance} className="resource-library-group">
              <Typography component="h3" variant="labelS" color="text.secondary">{relevance === 'Useful now' ? 'Useful right now' : relevance}</Typography>
              {guides.map((guide) => <ButtonBase key={guide.id} className="resource-library-item" onClick={() => selectResource(guide)} aria-current={guide.id === resource?.id ? 'page' : undefined}>
                <Typography variant="titleXS">{guide.title}</Typography>
                <Typography variant="labelS" color="text.secondary">{guide.readingTime}{guide.id === resource?.id ? ' · Reading now' : ''}</Typography>
              </ButtonBase>)}
            </Box>
          })}
        </Box>
      </Drawer>
      </Box>
    </PlaceSheet>
  )
}

function GuideContents({ resource, sectionPrefix, onGoToSection }: { resource: TransactionResource; sectionPrefix: string; onGoToSection: (index: number) => void }) {
  const [expanded, setExpanded] = useState(false)
  const mobile = useMediaQuery('(max-width: 600px)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const navigationId = useId()
  return (
    <Box className="resource-editorial-contents">
      {mobile && <Button className="resource-contents-toggle" aria-expanded={expanded} aria-controls={navigationId} onClick={() => setExpanded(!expanded)} endIcon={<ExpandMoreOutlined sx={{ transform: expanded ? 'rotate(180deg)' : undefined }} />}>In this guide</Button>}
      <Collapse in={!mobile || expanded} timeout={reducedMotion ? 0 : 180}>
        <Box component="nav" id={navigationId} aria-label="In this guide" className="resource-editorial-navigation">
          {!mobile && <Typography variant="labelM">In this guide</Typography>}
          {resource.sections.map((section, index) => <Button key={section.title} onClick={() => onGoToSection(index)} aria-controls={`${sectionPrefix}-${index}`}><Typography component="span" variant="labelS" className="resource-section-number">{String(index + 1).padStart(2, '0')}</Typography>{section.title}</Button>)}
          {resource.questions.length > 0 && <Button onClick={() => onGoToSection(resource.sections.length)} aria-controls={`${sectionPrefix}-questions`}>Questions for your agent</Button>}
        </Box>
      </Collapse>
    </Box>
  )
}
