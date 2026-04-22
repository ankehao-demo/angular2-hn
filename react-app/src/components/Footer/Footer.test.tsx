import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Footer } from './Footer'

describe('Footer', () => {
  it('renders without crashing', () => {
    const { container } = render(<Footer />)
    expect(container.firstChild).not.toBeNull()
  })

  it('contains a link to the GitHub repository', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /github/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/hdjirdeh/angular2-hn',
    )
  })
})
