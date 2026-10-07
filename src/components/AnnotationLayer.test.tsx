import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AnnotationLayer, AnnotationMarker } from './AnnotationLayer'

describe('annotations', () => {
  it('reveals a note by keyboard and closes it with Escape', () => {
    render(<AnnotationMarker audience="engineering" title="People tabs" note="Switching tabs updates the people shown." />)

    const marker = screen.getByRole('button', { name: 'Engineering note: People tabs' })
    fireEvent.focus(marker)
    expect(screen.getByRole('tooltip')).toHaveTextContent('Switching tabs updates the people shown.')
    expect(marker).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(marker, { key: 'Escape' })
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('toggles markers for targets present on the page', async () => {
    const target = document.createElement('div')
    target.className = 'annotation-test-target'
    target.getBoundingClientRect = () => DOMRect.fromRect({ x: 40, y: 40, width: 200, height: 100 })
    document.body.append(target)

    render(<AnnotationLayer annotations={[
      { id: 'visible', target: '.annotation-test-target', audience: 'product', title: 'Visible note', note: 'A note.' },
      { id: 'missing', target: '.absent-target', audience: 'business', title: 'Missing note', note: 'Hidden.' },
    ]} />)

    const toggle = screen.getByRole('button', { name: 'Show annotations' })
    fireEvent.click(toggle)
    await waitFor(() => expect(screen.getByRole('button', { name: 'Product note: Visible note' })).toBeInTheDocument())
    expect(screen.queryByRole('button', { name: 'Business note: Missing note' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Hide annotations' }))
    expect(screen.queryByRole('button', { name: 'Product note: Visible note' })).not.toBeInTheDocument()
    target.remove()
  })
})
