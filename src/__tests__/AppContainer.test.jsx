import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

/**
 * Game should load immediately without the phone frame.
 */
test('game renders directly without phone frame', () => {
  const { queryByTestId, getByText } = render(<App />);
  expect(queryByTestId('phone-frame')).toBeNull();
  expect(getByText(/INITIATING NEURAL INTERFACE/i)).toBeInTheDocument();
});
