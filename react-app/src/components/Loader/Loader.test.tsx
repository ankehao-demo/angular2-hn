import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Loader } from './Loader'

describe('Loader', () => {
  it('renders without crashing', () => {
    const { container } = render(<Loader />)
    expect(container.firstChild).not.toBeNull()
  })

  it('shows the "Loading..." text', () => {
    render(<Loader />)
    expect(screen.getByText(/Loading\.\.\./i)).toBeInTheDocument()
  })
})
