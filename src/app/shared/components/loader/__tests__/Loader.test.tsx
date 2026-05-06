import { render, screen } from '@testing-library/react';
import Loader from '../Loader';

describe('Loader', () => {
  it('renders loading indicator element', () => {
    render(<Loader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with correct CSS classes', () => {
    const { container } = render(<Loader />);
    expect(container.querySelector('.loading-section')).toBeInTheDocument();
    expect(container.querySelector('.loader')).toBeInTheDocument();
  });
});
