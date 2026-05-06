import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Settings from '../Settings';
import { SettingsProvider } from '../../../shared/services/SettingsContext';

function renderSettings() {
  return render(
    <MemoryRouter>
      <SettingsProvider>
        <Settings />
      </SettingsProvider>
    </MemoryRouter>
  );
}

describe('Settings', () => {
  it('renders theme selector', () => {
    renderSettings();
    expect(screen.getByText('Select a theme')).toBeInTheDocument();
    expect(screen.getByLabelText(/Default/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Night/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Black \(AMOLED\)/)).toBeInTheDocument();
  });

  it('renders font size input', () => {
    renderSettings();
    expect(screen.getByText('Change Font')).toBeInTheDocument();
    expect(screen.getByText(/Font size:/)).toBeInTheDocument();
  });

  it('renders spacing input', () => {
    renderSettings();
    expect(screen.getByText(/List spacing:/)).toBeInTheDocument();
  });

  it('renders open-in-new-tab toggle', () => {
    renderSettings();
    expect(screen.getByText(/Open links in a new tab/)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('checkbox interaction toggles open-in-new-tab', () => {
    renderSettings();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('theme radio buttons can be selected', () => {
    renderSettings();
    const nightRadio = screen.getByLabelText(/Night/) as HTMLInputElement;
    fireEvent.click(nightRadio);
    expect(nightRadio.checked).toBe(true);
  });

  it('close button renders', () => {
    renderSettings();
    expect(screen.getByText('×')).toBeInTheDocument();
  });

  it('font size input changes value', () => {
    renderSettings();
    const inputs = screen.getAllByRole('spinbutton');
    const fontInput = inputs[0];
    fireEvent.change(fontInput, { target: { value: '20' } });
    expect(fontInput).toHaveValue(20);
  });

  it('spacing input changes value', () => {
    renderSettings();
    const inputs = screen.getAllByRole('spinbutton');
    const spacingInput = inputs[1];
    fireEvent.change(spacingInput, { target: { value: '10' } });
    expect(spacingInput).toHaveValue(10);
  });
});
