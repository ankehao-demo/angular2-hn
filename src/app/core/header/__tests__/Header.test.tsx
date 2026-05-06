import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';
import { SettingsProvider } from '../../../shared/services/SettingsContext';

function renderHeader(initialEntries = ['/news/1']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SettingsProvider>
        <Header />
      </SettingsProvider>
    </MemoryRouter>
  );
}

describe('Header', () => {
  it('renders logo', () => {
    renderHeader();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  it('renders nav links with correct text', () => {
    renderHeader();
    expect(screen.getByText('new')).toBeInTheDocument();
    expect(screen.getByText('show')).toBeInTheDocument();
    expect(screen.getByText('ask')).toBeInTheDocument();
    expect(screen.getByText('jobs')).toBeInTheDocument();
  });

  it('renders nav links with correct hrefs', () => {
    renderHeader();
    expect(screen.getByText('new').closest('a')).toHaveAttribute('href', '/newest/1');
    expect(screen.getByText('show').closest('a')).toHaveAttribute('href', '/show/1');
    expect(screen.getByText('ask').closest('a')).toHaveAttribute('href', '/ask/1');
    expect(screen.getByText('jobs').closest('a')).toHaveAttribute('href', '/jobs/1');
  });

  it('clicking settings cog opens settings panel', () => {
    renderHeader();
    const settingsIcon = screen.getByAltText('Settings');
    expect(screen.queryByText('Select a theme')).not.toBeInTheDocument();
    fireEvent.click(settingsIcon);
    expect(screen.getByText('Select a theme')).toBeInTheDocument();
  });

  it('settings panel renders when showSettings is true', () => {
    renderHeader();
    fireEvent.click(screen.getByAltText('Settings'));
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Links')).toBeInTheDocument();
  });

  it('nav links have active class when route matches', () => {
    renderHeader(['/newest/1']);
    const newLink = screen.getByText('new').closest('a');
    expect(newLink).toHaveClass('active');
  });

  it('settings cog opens settings via keyboard Enter', () => {
    renderHeader();
    const settingsIcon = screen.getByAltText('Settings');
    expect(screen.queryByText('Select a theme')).not.toBeInTheDocument();
    fireEvent.keyDown(settingsIcon, { key: 'Enter' });
    expect(screen.getByText('Select a theme')).toBeInTheDocument();
  });

  it('settings cog opens settings via keyboard Space', () => {
    renderHeader();
    const settingsIcon = screen.getByAltText('Settings');
    fireEvent.keyDown(settingsIcon, { key: ' ' });
    expect(screen.getByText('Select a theme')).toBeInTheDocument();
  });

  it('settings cog ignores other keys', () => {
    renderHeader();
    const settingsIcon = screen.getByAltText('Settings');
    fireEvent.keyDown(settingsIcon, { key: 'Tab' });
    expect(screen.queryByText('Select a theme')).not.toBeInTheDocument();
  });
});
