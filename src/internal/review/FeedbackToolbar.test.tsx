import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FeedbackToolbar } from './FeedbackToolbar'

afterEach(() => vi.unstubAllGlobals())

describe('feedback toolbar', () => {
  it('expands on mouse hover, stays open for the panel, and collapses after it closes', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    const { rerender } = render(<FeedbackToolbar><button>Design panel</button></FeedbackToolbar>)
    const toolbar = screen.getByRole('group', { name: 'Feedback tools' })
    const trigger = screen.getByRole('button', { name: 'Feedback tools' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('button', { name: 'Design panel' })).not.toBeInTheDocument()

    const enter = new MouseEvent('pointerover', { bubbles: true })
    Object.defineProperty(enter, 'pointerType', { value: 'mouse' })
    fireEvent(toolbar, enter)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Design panel' })).toBeInTheDocument()

    rerender(<FeedbackToolbar keepOpen><button>Design panel</button></FeedbackToolbar>)
    fireEvent.pointerLeave(toolbar)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    rerender(<FeedbackToolbar><button>Design panel</button></FeedbackToolbar>)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('supports tap expansion, outside dismissal, and Escape without losing toggle state', () => {
    render(<FeedbackToolbar><label><input type="checkbox" />Annotations</label></FeedbackToolbar>)
    const trigger = screen.getByRole('button', { name: 'Feedback tools' })
    fireEvent.click(trigger)
    fireEvent.click(screen.getByRole('checkbox', { name: 'Annotations' }))
    fireEvent.pointerDown(document.body)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(trigger)
    expect(screen.getByRole('checkbox', { name: 'Annotations' })).toBeChecked()
    fireEvent.keyDown(trigger, { key: 'Escape' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
  })

  it('keeps the toolbar expanded when its covered button dismisses the popover', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    const { rerender } = render(<FeedbackToolbar keepOpen><button>Design panel</button></FeedbackToolbar>)
    const toolbar = screen.getByRole('group', { name: 'Feedback tools' })
    toolbar.getBoundingClientRect = () => DOMRect.fromRect({ x: 600, y: 700, width: 320, height: 52 })

    const dismiss = new MouseEvent('pointerdown', { bubbles: true, clientX: 660, clientY: 725 })
    Object.defineProperty(dismiss, 'pointerType', { value: 'mouse' })
    fireEvent(document.body, dismiss)
    rerender(<FeedbackToolbar><button>Design panel</button></FeedbackToolbar>)
    expect(screen.getByRole('button', { name: 'Feedback tools' })).toHaveAttribute('aria-expanded', 'true')

    fireEvent.pointerLeave(toolbar)
    expect(screen.getByRole('button', { name: 'Feedback tools' })).toHaveAttribute('aria-expanded', 'false')
  })
})
