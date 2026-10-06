import '@testing-library/jest-dom/vitest'

globalThis.ResizeObserver ??= class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
} as typeof ResizeObserver
