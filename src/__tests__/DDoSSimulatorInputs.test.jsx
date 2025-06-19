import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DDoSSimulator from '../components/DDoSSimulator';

describe('DDoSSimulator inputs', () => {
  test('changing target updates select value', () => {
    const { getByLabelText } = render(<DDoSSimulator />);
    const select = getByLabelText('Target');
    fireEvent.change(select, { target: { value: 'bravo' } });
    expect(select.value).toBe('bravo');
  });

  test('changing packet size updates input value', () => {
    const { getByLabelText } = render(<DDoSSimulator />);
    const input = getByLabelText(/packet size/i);
    fireEvent.change(input, { target: { value: '1024' } });
    expect(input.value).toBe('1024');
  });

  test('changing frequency updates input value', () => {
    const { getByLabelText } = render(<DDoSSimulator />);
    const input = getByLabelText(/frequency/i);
    fireEvent.change(input, { target: { value: '10' } });
    expect(input.value).toBe('10');
  });
});
