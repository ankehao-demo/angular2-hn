import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { SettingsProvider, useSettings } from '../context/SettingsContext';

function TestConsumer() {
  const { theme, showSettings, toggleSettings, setTheme } = useSettings();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="showSettings">{String(showSettings)}</span>
      <button onClick={toggleSettings}>Toggle Settings</button>
      <button onClick={() => setTheme('night')}>Set Night</button>
    </div>
  );
}

describe('SettingsContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides default settings', () => {
    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );
    expect(screen.getByTestId('theme').textContent).toBe('default');
    expect(screen.getByTestId('showSettings').textContent).toBe('false');
  });

  it('toggles settings visibility', () => {
    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );
    fireEvent.click(screen.getByText('Toggle Settings'));
    expect(screen.getByTestId('showSettings').textContent).toBe('true');
  });

  it('changes theme', () => {
    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );
    fireEvent.click(screen.getByText('Set Night'));
    expect(screen.getByTestId('theme').textContent).toBe('night');
    expect(localStorage.getItem('theme')).toBe('night');
  });
});
