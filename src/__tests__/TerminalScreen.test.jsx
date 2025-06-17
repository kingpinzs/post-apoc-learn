import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TerminalScreen from '../components/TerminalScreen';

test('runs basic file commands', () => {
  const { getByRole, getByText } = render(<TerminalScreen />);
  const input = getByRole('textbox');
  fireEvent.change(input, { target: { value: 'ls' } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  expect(getByText('home var')).toBeInTheDocument();

  fireEvent.change(input, { target: { value: 'cd home' } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  fireEvent.change(input, { target: { value: 'ls' } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  expect(getByText('survivor.txt')).toBeInTheDocument();

  fireEvent.change(input, { target: { value: 'cat survivor.txt' } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  expect(getByText(/Stay hidden/)).toBeInTheDocument();
});
