import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import usePhoneState, { initialPhoneState } from '../hooks/usePhoneState';

function TestComponent() {
  const [state] = usePhoneState();
  return <div data-testid="screen">{state.currentScreen}</div>;
}

test('usePhoneState falls back to defaults with invalid save data', () => {
  localStorage.setItem('survivos-save', '{bad json');
  const { getByTestId } = render(<TestComponent />);
  expect(getByTestId('screen').textContent).toBe(initialPhoneState.currentScreen);
});
