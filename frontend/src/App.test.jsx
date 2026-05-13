import React from 'react';
import {
  render, screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the form with name, message, and file dropzone', () => {
    render(<App />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByText(/drag & drop/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty fields', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(await screen.findByText('Message is required')).toBeInTheDocument();
  });

  it('does not show validation errors when both fields are filled', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => ({ name: 'Alice', message: 'Hello', filePath: null }),
    });

    render(<App />);
    await userEvent.type(screen.getByLabelText('Name'), 'Alice');
    await userEvent.type(screen.getByLabelText('Message'), 'Hello');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Message is required')).not.toBeInTheDocument();
    });
  });

  it('displays the response after successful submission', async () => {
    const mockResponse = { name: 'Alice', message: 'Hello', filePath: null };
    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => mockResponse,
    });

    render(<App />);
    await userEvent.type(screen.getByLabelText('Name'), 'Alice');
    await userEvent.type(screen.getByLabelText('Message'), 'Hello');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText('Response')).toBeInTheDocument();
    expect(screen.getByText(/"name": "Alice"/)).toBeInTheDocument();
  });

  it('displays the filePath in the response when a file is attached', async () => {
    const mockResponse = { name: 'Bob', message: 'With file', filePath: 'uploads/test.pdf' };
    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => mockResponse,
    });

    render(<App />);
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const dropzone = screen.getByText(/drag & drop/i).closest('.dropzone');

    await userEvent.type(screen.getByLabelText('Name'), 'Bob');
    await userEvent.type(screen.getByLabelText('Message'), 'With file');
    await userEvent.upload(dropzone.querySelector('input'), file);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText('Response')).toBeInTheDocument();
    expect(screen.getByText(/"filePath": "uploads\/test\.pdf"/)).toBeInTheDocument();
  });

  it('shows a network error when fetch fails', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

    render(<App />);
    await userEvent.type(screen.getByLabelText('Name'), 'Alice');
    await userEvent.type(screen.getByLabelText('Message'), 'Hello');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText('Network error')).toBeInTheDocument();
  });

  it('accepts a dropped file and shows the filename', async () => {
    render(<App />);
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const dropzone = screen.getByText(/drag & drop/i).closest('.dropzone');

    await userEvent.upload(dropzone.querySelector('input'), file);

    expect(await screen.findByText('test.pdf')).toBeInTheDocument();
  });
});
