import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { SettingsProvider, useSettings } from '../SettingsContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SettingsProvider>{children}</SettingsProvider>
);

beforeEach(() => {
  localStorage.clear();
});

describe('SettingsContext', () => {
  it('provides default settings values', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });
    expect(result.current.settings.showSettings).toBe(false);
    expect(result.current.settings.openLinkInNewTab).toBe(false);
    expect(result.current.settings.titleFontSize).toBe('16');
    expect(result.current.settings.listSpacing).toBe('0');
  });

  it('toggleSettings flips showSettings', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });
    expect(result.current.settings.showSettings).toBe(false);
    act(() => result.current.toggleSettings());
    expect(result.current.settings.showSettings).toBe(true);
    act(() => result.current.toggleSettings());
    expect(result.current.settings.showSettings).toBe(false);
  });

  it('toggleOpenLinksInNewTab flips and persists', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });
    expect(result.current.settings.openLinkInNewTab).toBe(false);
    act(() => result.current.toggleOpenLinksInNewTab());
    expect(result.current.settings.openLinkInNewTab).toBe(true);
    expect(localStorage.getItem('openLinkInNewTab')).toBe('true');
    act(() => result.current.toggleOpenLinksInNewTab());
    expect(result.current.settings.openLinkInNewTab).toBe(false);
    expect(localStorage.getItem('openLinkInNewTab')).toBe('false');
  });

  it('setTheme updates theme and persists', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });
    act(() => result.current.setTheme('night'));
    expect(result.current.settings.theme).toBe('night');
    expect(localStorage.getItem('theme')).toBe('night');
    act(() => result.current.setTheme('amoledblack'));
    expect(result.current.settings.theme).toBe('amoledblack');
    expect(localStorage.getItem('theme')).toBe('amoledblack');
  });

  it('setFont updates titleFontSize and persists', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });
    act(() => result.current.setFont('20'));
    expect(result.current.settings.titleFontSize).toBe('20');
    expect(localStorage.getItem('titleFontSize')).toBe('20');
  });

  it('setSpacing updates listSpacing and persists', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });
    act(() => result.current.setSpacing('10'));
    expect(result.current.settings.listSpacing).toBe('10');
    expect(localStorage.getItem('listSpacing')).toBe('10');
  });

  it('restores settings from localStorage on init', () => {
    localStorage.setItem('openLinkInNewTab', 'true');
    localStorage.setItem('titleFontSize', '20');
    localStorage.setItem('listSpacing', '5');
    localStorage.setItem('theme', 'night');
    const { result } = renderHook(() => useSettings(), { wrapper });
    expect(result.current.settings.theme).toBe('night');
  });

  it('responds to dark mode media query', () => {
    const listeners: ((e: MediaQueryListEvent) => void)[] = [];
    const mockMatchMedia = jest.fn().mockReturnValue({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      addEventListener: (_: string, handler: (e: MediaQueryListEvent) => void) => {
        listeners.push(handler);
      },
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });
    Object.defineProperty(window, 'matchMedia', { value: mockMatchMedia, writable: true });

    const { result } = renderHook(() => useSettings(), { wrapper });
    expect(result.current.settings.theme).toBe('night');
  });

  it('throws when useSettings is used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useSettings());
    }).toThrow('useSettings must be used within a SettingsProvider');
    consoleSpy.mockRestore();
  });
});
