import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommunicatorScreen from '../components/CommunicatorScreen';

test('sends message and decrypts intercepted text', () => {
  const { getByText, getByRole, getByTestId } = render(<CommunicatorScreen />);
  const input = getByRole('textbox');
  fireEvent.change(input, { target: { value: 'TEST' } });
  fireEvent.click(getByText('Send'));
  expect(getByTestId('message-log')).toHaveTextContent('TEST');

  fireEvent.click(getByText('Decrypt'));
  expect(getByText('This is a secret message')).toBeInTheDocument();
});
