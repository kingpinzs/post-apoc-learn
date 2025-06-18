import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PacketAnalyzer from '../components/PacketAnalyzer';
import { getUsage, resetResources } from '../lib/resourceSystem';

function mockRandom(value) {
  jest.spyOn(Math, 'random').mockReturnValue(value);
}

describe('PacketAnalyzer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetResources();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('capture allocates and frees resources', () => {
    mockRandom(0); // deterministic packet
    render(<PacketAnalyzer />);
    fireEvent.click(screen.getByText('Start Capture'));
    act(() => {
      jest.advanceTimersByTime(800);
    });
    expect(getUsage().cpu).toBeGreaterThan(0);
    const rows = screen.getByTestId('packet-table').querySelectorAll('tbody tr');
    expect(rows.length).toBeGreaterThan(0);
    fireEvent.click(screen.getByText('Stop Capture'));
    expect(getUsage().cpu).toBe(0);
  });

  test('protocol filter hides unmatched packets', () => {
    mockRandom(0);
    render(<PacketAnalyzer />);
    fireEvent.click(screen.getByText('Start Capture'));
    act(() => {
      jest.advanceTimersByTime(800);
    });
    const select = screen.getByLabelText('Protocol');
    fireEvent.change(select, { target: { value: 'HTTP' } });
    let rows = screen.getByTestId('packet-table').querySelectorAll('tbody tr');
    expect(rows.length).toBeGreaterThan(0);
    fireEvent.change(select, { target: { value: 'FTP' } });
    rows = screen.getByTestId('packet-table').querySelectorAll('tbody tr');
    expect(rows.length).toBe(0);
  });
});
