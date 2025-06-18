import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommandLibrary from '../components/scriptbuilder/CommandLibrary';

test('renders available command blocks', () => {
  render(<CommandLibrary />);
  const library = screen.getByTestId('command-library');
  expect(library.children).toHaveLength(4);
  expect(screen.getByText('init')).toBeInTheDocument();
  expect(screen.getByText('step')).toBeInTheDocument();
  expect(screen.getByText('wait')).toBeInTheDocument();
  expect(screen.getByText('end')).toBeInTheDocument();
});
