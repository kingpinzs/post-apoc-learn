import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PacketFlow from '../components/PacketFlow';
import { allocateResources, resetResources } from '../lib/resourceSystem';

beforeEach(() => {
  resetResources();
});

test('renders correct number of packets and color', () => {
  const { getAllByTestId } = render(
    <PacketFlow
      source={{ x: 0, y: 0 }}
      destination={{ x: 50, y: 0 }}
      packetType="malware"
      count={3}
    />,
  );
  const dots = getAllByTestId('packet-dot');
  expect(dots).toHaveLength(3);
  expect(dots[0]).toHaveClass('bg-red-500');
});

test('speed decreases with higher bandwidth', () => {
  allocateResources('net', { bandwidth: 80 });
  const { getByTestId, rerender } = render(
    <PacketFlow
      source={{ x: 0, y: 0 }}
      destination={{ x: 100, y: 0 }}
      packetType="http"
      count={1}
    />,
  );
  const fast = getByTestId('packet-dot').style.transitionDuration;
  resetResources();
  rerender(
    <PacketFlow
      source={{ x: 0, y: 0 }}
      destination={{ x: 100, y: 0 }}
      packetType="http"
      count={1}
    />,
  );
  const slow = getByTestId('packet-dot').style.transitionDuration;
  expect(parseFloat(fast)).toBeLessThan(parseFloat(slow));
});

test('animates to destination', () => {
  jest.useFakeTimers();
  const { getByTestId } = render(
    <PacketFlow
      source={{ x: 0, y: 0 }}
      destination={{ x: 20, y: 10 }}
      packetType="ftp"
      count={1}
    />,
  );
  const dot = getByTestId('packet-dot');
  act(() => {
    jest.advanceTimersByTime(50);
  });
  expect(dot.style.transform).toMatch('translate(20px, 10px)');
  jest.useRealTimers();
});

