import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PracticeMode from '../components/PracticeMode';

test('PracticeMode renders ApocalypseGame', () => {
  const { getByText } = render(<PracticeMode />);
  expect(getByText(/INITIATING NEURAL INTERFACE/i)).toBeInTheDocument();
});

test('PracticeMode uses practiceState storage key', () => {
  const spy = jest.spyOn(Storage.prototype, 'setItem');
  render(<PracticeMode />);
  expect(spy).toHaveBeenCalledWith('practiceState', expect.any(String));
  spy.mockRestore();
});
