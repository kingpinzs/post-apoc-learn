import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HandbookScreen from '../components/HandbookScreen';

test('renders handbook sections', () => {
  render(<HandbookScreen />);
  expect(screen.getByText('Security Basics')).toBeInTheDocument();
  expect(screen.getByText('Survival Tips')).toBeInTheDocument();
});
