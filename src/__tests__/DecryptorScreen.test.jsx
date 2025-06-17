import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DecryptorScreen from '../components/DecryptorScreen';

test('decrypts caesar and base64', () => {
  const { getByText, getByRole } = render(<DecryptorScreen />);
  const textarea = getByRole('textbox');
  fireEvent.change(textarea, { target: { value: 'KHOOR' } });
  fireEvent.click(getByText('Decrypt'));
  expect(getByText('HELLO')).toBeInTheDocument();

  fireEvent.change(textarea, { target: { value: 'U1VSVklWRQ==' } });
  fireEvent.change(getByRole('combobox'), { target: { value: 'base64' } });
  fireEvent.click(getByText('Decrypt'));
  expect(getByText('SURVIVE')).toBeInTheDocument();
});
