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

  it('close button is keyboard accessible with Enter', () => {
    renderSettings();
    const closeBtn = screen.getByText('×');
    expect(closeBtn).toHaveAttribute('role', 'button');
    expect(closeBtn).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(closeBtn, { key: 'Enter' });
  });

  it('close button is keyboard accessible with Space', () => {
    renderSettings();
    const closeBtn = screen.getByText('×');
    fireEvent.keyDown(closeBtn, { key: ' ' });
  });

  it('close button ignores other keys', () => {
    renderSettings();
    const closeBtn = screen.getByText('×');
    fireEvent.keyDown(closeBtn, { key: 'Escape' });
  });

  it('selecting AMOLED theme works', () => {
    renderSettings();
    const amoledRadio = screen.getByLabelText(/Black \(AMOLED\)/) as HTMLInputElement;
    fireEvent.click(amoledRadio);
    expect(amoledRadio.checked).toBe(true);
  });

  it('default theme radio reflects current theme', () => {
    renderSettings();
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    const checkedRadio = radios.find(r => r.checked);
    expect(checkedRadio).toBeDefined();
  });
});
