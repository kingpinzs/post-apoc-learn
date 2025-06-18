import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MissionManager from '../components/MissionManager';

let mockState;
let mockSetState;

jest.mock('../hooks/usePhoneState', () => ({
  __esModule: true,
  default: () => [mockState, mockSetState],
}));

describe('MissionManager', () => {
  beforeEach(() => {
    mockState = { unlockedApps: [], notifications: [] };
    mockSetState = jest.fn((update) => {
      mockState = typeof update === 'function' ? update(mockState) : update;
    });
    localStorage.clear();
  });

  test('starts next mission and saves progress', () => {
    render(<MissionManager />);
    fireEvent.click(screen.getByTestId('start-next'));
    // should show first mission objectives
    expect(screen.getByTestId('objective-0')).toBeInTheDocument();
    const saved = JSON.parse(localStorage.getItem('survivos-mission-progress'));
    expect(saved.active).toBe('tutorial-scanner');
  });

  test('completing objectives unlocks reward', () => {
    render(<MissionManager />);
    fireEvent.click(screen.getByTestId('start-next'));
    // complete both objectives
    fireEvent.click(screen.getByTestId('objective-0'));
    fireEvent.click(screen.getByTestId('objective-1'));
    // start button should reappear
    expect(screen.getByTestId('start-next')).toBeInTheDocument();
    expect(mockState.unlockedApps).toContain('map');
    expect(mockState.notifications.length).toBeGreaterThan(0);
  });
});
