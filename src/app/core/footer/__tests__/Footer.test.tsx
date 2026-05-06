import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders footer content', () => {
    render(<Footer />);
    expect(screen.getByText(/GitHub/)).toBeInTheDocument();
  });

  it('renders GitHub link', () => {
    render(<Footer />);
    const link = screen.getByText('GitHub');
    expect(link).toHaveAttribute('href', 'https://github.com/hdjirdeh/angular2-hn');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders footer element with correct id', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('#footer')).toBeInTheDocument();
  });
});
