import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ErrorMessage } from './ErrorMessage'

describe('ErrorMessage', () => {
  it('renders the passed message prop', () => {
    render(<ErrorMessage message="Something went wrong" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('shows the offline notice text', () => {
    render(<ErrorMessage message="Oops" />)
    expect(
      screen.getByText(/If you are offline viewing/i),
    ).toBeInTheDocument()
  })
})
