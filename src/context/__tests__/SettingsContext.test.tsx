import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsProvider, useSettings } from '../SettingsContext';

function TestConsumer() {
  const { settings, toggleSettings, toggleOpenLinksInNewTab, setTheme, setFont, setSpacing } = useSettings();
  return (
    <div>
      <span data-testid="theme">{settings.theme}</span>
      <span data-testid="showSettings">{String(settings.showSettings)}</span>
      <span data-testid="openLinkInNewTab">{String(settings.openLinkInNewTab)}</span>
      <span data-testid="titleFontSize">{settings.titleFontSize}</span>
      <span data-testid="listSpacing">{settings.listSpacing}</span>
      <button onClick={toggleSettings}>Toggle Settings</button>
      <button onClick={toggleOpenLinksInNewTab}>Toggle Links</button>
      <button onClick={() => setTheme('night')}>Night Theme</button>
      <button onClick={() => setFont('18')}>Set Font</button>
      <button onClick={() => setSpacing('10')}>Set Spacing</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('SettingsContext', () => {
  it('provides default settings', () => {
    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('default');
    expect(screen.getByTestId('showSettings')).toHaveTextContent('false');
    expect(screen.getByTestId('openLinkInNewTab')).toHaveTextContent('false');
  });

  it('toggles settings visibility', async () => {
    const user = userEvent.setup();
    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    expect(screen.getByTestId('showSettings')).toHaveTextContent('false');
    await user.click(screen.getByText('Toggle Settings'));
    expect(screen.getByTestId('showSettings')).toHaveTextContent('true');
  });

  it('changes theme', async () => {
    const user = userEvent.setup();
    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    await user.click(screen.getByText('Night Theme'));
    expect(screen.getByTestId('theme')).toHaveTextContent('night');
    expect(localStorage.getItem('theme')).toBe('night');
  });

  it('changes font size', async () => {
    const user = userEvent.setup();
    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    await user.click(screen.getByText('Set Font'));
    expect(screen.getByTestId('titleFontSize')).toHaveTextContent('18');
    expect(localStorage.getItem('titleFontSize')).toBe('18');
  });

  it('changes list spacing', async () => {
    const user = userEvent.setup();
    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    await user.click(screen.getByText('Set Spacing'));
    expect(screen.getByTestId('listSpacing')).toHaveTextContent('10');
    expect(localStorage.getItem('listSpacing')).toBe('10');
  });

  it('reads initial settings from localStorage', () => {
    localStorage.setItem('theme', 'amoledblack');
    localStorage.setItem('openLinkInNewTab', 'true');
    localStorage.setItem('titleFontSize', '20');
    localStorage.setItem('listSpacing', '15');

    render(
      <SettingsProvider>
        <TestConsumer />
      </SettingsProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('amoledblack');
    expect(screen.getByTestId('openLinkInNewTab')).toHaveTextContent('true');
    expect(screen.getByTestId('titleFontSize')).toHaveTextContent('20');
    expect(screen.getByTestId('listSpacing')).toHaveTextContent('15');
  });
});
