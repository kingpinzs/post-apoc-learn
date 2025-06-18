import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsScreen from '../components/SettingsScreen';

test('renders settings sections', () => {
  render(<SettingsScreen />);
  expect(screen.getByText('Audio')).toBeInTheDocument();
  expect(screen.getByText('Display')).toBeInTheDocument();
  expect(screen.getByText('Gameplay')).toBeInTheDocument();
  expect(screen.getByText('Data Management')).toBeInTheDocument();
});

