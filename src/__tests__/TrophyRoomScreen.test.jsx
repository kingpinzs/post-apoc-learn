import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrophyRoomScreen from '../components/TrophyRoomScreen';
import { ACHIEVEMENTS } from '../lib/achievements';

const progress = {};
progress[ACHIEVEMENTS[0].id] = 100;
progress[ACHIEVEMENTS[1].id] = 100;

jest.mock('../hooks/useAchievements', () => ({
  __esModule: true,
  default: () => ({ progress }),
}));

test('renders all achievements and overall percentage', () => {
  const { container } = render(<TrophyRoomScreen />);
  const expectedOverall = ((100 + 100) / ACHIEVEMENTS.length).toFixed(0) + '%';
  expect(screen.getByText(`Overall Completion: ${expectedOverall}`)).toBeInTheDocument();
  // one element with border per achievement
  expect(container.querySelectorAll('div.border').length).toBe(ACHIEVEMENTS.length);
  // completed achievements show 100%
  expect(screen.getAllByText('100%').length).toBe(2);
});
