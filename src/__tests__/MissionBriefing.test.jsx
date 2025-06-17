import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MissionBriefing from '../components/MissionBriefing';

const sampleMission = {
  title: 'Hack the Mainframe',
  description: 'Infiltrate the central server.',
  objectives: ['Find credentials', 'Bypass firewall'],
  recommendedTools: ['nmap', 'metasploit'],
  difficulty: 'Hard',
  timeLimit: '30m',
};

test('renders mission details', () => {
  const { getByTestId, getByText } = render(<MissionBriefing mission={sampleMission} />);
  expect(getByTestId('mission-title')).toHaveTextContent(sampleMission.title);
  expect(getByTestId('mission-description')).toHaveTextContent(sampleMission.description);
  expect(getByTestId('objective-list').children.length).toBe(sampleMission.objectives.length);
  expect(getByTestId('tool-list').children.length).toBe(sampleMission.recommendedTools.length);
  getByText(/difficulty:/i);
  getByText(/time limit:/i);
});

test('calls onStart when start button clicked', () => {
  const handleStart = jest.fn();
  const { getByTestId } = render(
    <MissionBriefing mission={sampleMission} onStart={handleStart} />
  );
  fireEvent.click(getByTestId('start-mission'));
  expect(handleStart).toHaveBeenCalled();
});
