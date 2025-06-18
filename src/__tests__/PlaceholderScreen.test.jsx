import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlaceholderScreen from '../components/PlaceholderScreen';

test('renders placeholder text', () => {
  render(<PlaceholderScreen name="Testing" />);
  expect(screen.getByTestId('placeholder-screen')).toHaveTextContent('Testing coming soon...');
});
