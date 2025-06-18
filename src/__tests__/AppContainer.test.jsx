import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

/**
 * Ensure the active app container is visible and has height
 * when an app is launched from the home screen.
 */

test('active app container fills available height', () => {
  const { container, getByTestId } = render(<App />);
  const slot0 = container.querySelector('[data-testid="grid-slot-0"]');
  const icon = slot0.querySelector('[draggable="true"]');
  fireEvent.click(icon);
  const active = getByTestId('active-app');
  expect(active).toBeInTheDocument();
  // the active container should occupy the full height of the phone frame
  const frame = getByTestId('phone-frame');
  expect(frame.className).toMatch(/h-screen/);
  expect(active.parentElement.className).toMatch(/h-full/);
});
