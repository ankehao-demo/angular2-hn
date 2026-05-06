import { render, screen } from '@testing-library/react';
import ErrorMessage from '../ErrorMessage';

describe('ErrorMessage', () => {
  it('renders error message text passed as prop', () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders skull icon and offline instructions', () => {
    const { container } = render(<ErrorMessage message="Error" />);
    expect(container.querySelector('.skull')).toBeInTheDocument();
    expect(screen.getByText(/offline viewing/i)).toBeInTheDocument();
  });

  it('renders error section container', () => {
    const { container } = render(<ErrorMessage message="Test" />);
    expect(container.querySelector('.error-section')).toBeInTheDocument();
  });
});
