import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsProvider, useSettings } from '../contexts/SettingsContext';

function TestConsumer() {
  const { settings, toggleSettings, toggleOpenLinksInNewTab, setTheme, setFont, setSpacing } =
    useSettings();
  return (
    <div>
      <span data-testid="theme">{settings.theme}</span>
      <span data-testid="showSettings">{String(settings.showSettings)}</span>
      <span data-testid="openLinkInNewTab">{String(settings.openLinkInNewTab)}</span>
      <span data-testid="titleFontSize">{settings.titleFontSize}</span>
      <span data-testid="listSpacing">{settings.listSpacing}</span>
      <button onClick={toggleSettings}>toggleSettings</button>
      <button onClick={toggleOpenLinksInNewTab}>toggleLinks</button>
      <button onClick={() => setTheme('night')}>setNight</button>
      <button onClick={() => setFont('20')}>setFont20</button>
      <button onClick={() => setSpacing('10')}>setSpacing10</button>
    </div>
  );
}

describe('SettingsContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  it('provides default settings', () => {
    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('default');
    expect(screen.getByTestId('showSettings').textContent).toBe('false');
    expect(screen.getByTestId('openLinkInNewTab').textContent).toBe('false');
    expect(screen.getByTestId('titleFontSize').textContent).toBe('16');
    expect(screen.getByTestId('listSpacing').textContent).toBe('0');
  });

  it('toggles showSettings', async () => {
    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    expect(screen.getByTestId('showSettings').textContent).toBe('false');
    await userEvent.click(screen.getByText('toggleSettings'));
    expect(screen.getByTestId('showSettings').textContent).toBe('true');
  });

  it('toggles openLinkInNewTab and persists to localStorage', async () => {
    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    await userEvent.click(screen.getByText('toggleLinks'));
    expect(screen.getByTestId('openLinkInNewTab').textContent).toBe('true');
    expect(localStorage.getItem('openLinkInNewTab')).toBe('true');
  });

  it('sets theme and persists to localStorage', async () => {
    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    await userEvent.click(screen.getByText('setNight'));
    expect(screen.getByTestId('theme').textContent).toBe('night');
    expect(localStorage.getItem('theme')).toBe('night');
  });

  it('sets font size and persists to localStorage', async () => {
    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    await userEvent.click(screen.getByText('setFont20'));
    expect(screen.getByTestId('titleFontSize').textContent).toBe('20');
    expect(localStorage.getItem('titleFontSize')).toBe('20');
  });

  it('sets list spacing and persists to localStorage', async () => {
    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    await userEvent.click(screen.getByText('setSpacing10'));
    expect(screen.getByTestId('listSpacing').textContent).toBe('10');
    expect(localStorage.getItem('listSpacing')).toBe('10');
  });

  it('reads saved settings from localStorage', () => {
    localStorage.setItem('openLinkInNewTab', 'true');
    localStorage.setItem('theme', 'amoledblack');
    localStorage.setItem('titleFontSize', '22');
    localStorage.setItem('listSpacing', '5');

    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    expect(screen.getByTestId('openLinkInNewTab').textContent).toBe('true');
    expect(screen.getByTestId('theme').textContent).toBe('amoledblack');
    expect(screen.getByTestId('titleFontSize').textContent).toBe('22');
    expect(screen.getByTestId('listSpacing').textContent).toBe('5');
  });

  it('detects system dark mode when no theme is saved', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('night');
  });
});
