import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Loader from '../Loader';

describe('Loader', () => {
  it('renders the loading spinner', () => {
    const { container } = render(<Loader />);
    expect(container.querySelector('[class*="loader"]')).toBeTruthy();
  });
});
