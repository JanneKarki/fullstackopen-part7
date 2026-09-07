import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import ErrorBoundary from './ErrorBoundary'

const BrokenComponent = () => {
  throw new Error('simulated error')
}

describe('ErrorBoundary', () => {
  test('shows a fallback message when a child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong :(')).toBeInTheDocument()
    expect(screen.getByText(/Please make a bug report/)).toBeInTheDocument()

    console.error.mockRestore()
  })
})
