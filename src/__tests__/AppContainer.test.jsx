import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

/**
 * Ensure the game is shown inside the phone frame on load.
 */
test('game renders within phone frame', () => {
  const { getByTestId } = render(<App />);
  const frame = getByTestId('phone-frame');
  expect(frame).toBeInTheDocument();
  expect(frame).toHaveTextContent(/INITIATING NEURAL INTERFACE/i);
});
