import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsProvider, useSettings } from '../context/SettingsContext';

function TestConsumer() {
    const { settings, toggleSettings, setTheme, setFont, setSpacing, toggleOpenLinksInNewTab } = useSettings();
    return (
        <div>
            <span data-testid="theme">{settings.theme}</span>
            <span data-testid="showSettings">{settings.showSettings.toString()}</span>
            <span data-testid="openLinkInNewTab">{settings.openLinkInNewTab.toString()}</span>
            <span data-testid="titleFontSize">{settings.titleFontSize}</span>
            <span data-testid="listSpacing">{settings.listSpacing}</span>
            <button data-testid="toggleSettings" onClick={toggleSettings}>Toggle Settings</button>
            <button data-testid="setNight" onClick={() => setTheme('night')}>Night</button>
            <button data-testid="setFont" onClick={() => setFont('20')}>Font 20</button>
            <button data-testid="setSpacing" onClick={() => setSpacing('10')}>Spacing 10</button>
            <button data-testid="toggleLinks" onClick={toggleOpenLinksInNewTab}>Toggle Links</button>
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

        expect(screen.getByTestId('theme').textContent).toBe('default');
        expect(screen.getByTestId('showSettings').textContent).toBe('false');
        expect(screen.getByTestId('openLinkInNewTab').textContent).toBe('false');
    });

    it('toggles settings visibility', () => {
        render(
            <SettingsProvider>
                <TestConsumer />
            </SettingsProvider>
        );

        fireEvent.click(screen.getByTestId('toggleSettings'));
        expect(screen.getByTestId('showSettings').textContent).toBe('true');

        fireEvent.click(screen.getByTestId('toggleSettings'));
        expect(screen.getByTestId('showSettings').textContent).toBe('false');
    });

    it('changes theme and persists to localStorage', () => {
        render(
            <SettingsProvider>
                <TestConsumer />
            </SettingsProvider>
        );

        fireEvent.click(screen.getByTestId('setNight'));
        expect(screen.getByTestId('theme').textContent).toBe('night');
        expect(localStorage.getItem('theme')).toBe('night');
    });

    it('changes font size and persists to localStorage', () => {
        render(
            <SettingsProvider>
                <TestConsumer />
            </SettingsProvider>
        );

        fireEvent.click(screen.getByTestId('setFont'));
        expect(screen.getByTestId('titleFontSize').textContent).toBe('20');
        expect(localStorage.getItem('titleFontSize')).toBe('20');
    });

    it('changes list spacing and persists to localStorage', () => {
        render(
            <SettingsProvider>
                <TestConsumer />
            </SettingsProvider>
        );

        fireEvent.click(screen.getByTestId('setSpacing'));
        expect(screen.getByTestId('listSpacing').textContent).toBe('10');
        expect(localStorage.getItem('listSpacing')).toBe('10');
    });

    it('toggles open links in new tab and persists to localStorage', () => {
        render(
            <SettingsProvider>
                <TestConsumer />
            </SettingsProvider>
        );

        fireEvent.click(screen.getByTestId('toggleLinks'));
        expect(screen.getByTestId('openLinkInNewTab').textContent).toBe('true');
        expect(localStorage.getItem('openLinkInNewTab')).toBe('true');
    });

    it('reads initial values from localStorage', () => {
        localStorage.setItem('theme', 'amoledblack');
        localStorage.setItem('titleFontSize', '18');
        localStorage.setItem('listSpacing', '5');
        localStorage.setItem('openLinkInNewTab', 'true');

        render(
            <SettingsProvider>
                <TestConsumer />
            </SettingsProvider>
        );

        expect(screen.getByTestId('theme').textContent).toBe('amoledblack');
        expect(screen.getByTestId('titleFontSize').textContent).toBe('18');
        expect(screen.getByTestId('listSpacing').textContent).toBe('5');
        expect(screen.getByTestId('openLinkInNewTab').textContent).toBe('true');
    });
});
