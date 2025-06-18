import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DDoSSimulator from '../components/DDoSSimulator';
import { getUsage, resetResources } from '../lib/resourceSystem';

beforeEach(() => {
  jest.useFakeTimers();
  resetResources();
});

afterEach(() => {
  jest.useRealTimers();
});

test('launching attack allocates resources and spawns packets', () => {
  const { getByText, queryAllByTestId } = render(<DDoSSimulator />);
  fireEvent.click(getByText('Launch'));
  act(() => {
    jest.advanceTimersByTime(250);
  });
  expect(getUsage().bandwidth).toBeGreaterThan(0);
  expect(queryAllByTestId('packet-flow').length).toBeGreaterThan(0);
});

test('stopping attack clears packets and frees resources', () => {
  const { getByText, queryAllByTestId } = render(<DDoSSimulator />);
  fireEvent.click(getByText('Launch'));
  act(() => {
    jest.advanceTimersByTime(250);
  });
  fireEvent.click(getByText('Stop'));
  expect(getUsage().bandwidth).toBe(0);
  expect(queryAllByTestId('packet-flow').length).toBe(0);
});
