import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameMenu from '../components/GameMenu';

test('toggle button shows menu', () => {
  render(<GameMenu />);
  const toggle = screen.getByTestId('menu-toggle');
  fireEvent.click(toggle);
  expect(screen.getByTestId('game-menu')).toBeInTheDocument();
});

test('keyboard shortcut opens terminal', () => {
  localStorage.setItem(
    'survivos-save',
    JSON.stringify({ version: 1, unlockedApps: ['terminal'], completedMissions: [] })
  );
  render(<GameMenu />);
  fireEvent.keyDown(window, { key: 't' });
  expect(screen.getByTestId('terminal-screen')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('minimize-button'));
  expect(screen.queryByTestId('terminal-screen')).not.toBeInTheDocument();
});

test('escape key toggles menu', () => {
  render(<GameMenu />);
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.getByTestId('game-menu')).toBeInTheDocument();
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.queryByTestId('game-menu')).not.toBeInTheDocument();
});

test('breadcrumb shows active tool name', () => {
  localStorage.setItem(
    'survivos-save',
    JSON.stringify({ version: 1, unlockedApps: ['terminal'], completedMissions: [] })
  );
  render(<GameMenu />);
  fireEvent.keyDown(window, { key: 't' });
  expect(screen.getByText('Game')).toBeInTheDocument();
  expect(screen.getByText(/Terminal/i)).toBeInTheDocument();
});

test('swipe gesture opens menu', () => {
  render(<GameMenu />);
  fireEvent.touchStart(window, { touches: [{ clientX: 0, clientY: 0 }] });
  fireEvent.touchEnd(window, { changedTouches: [{ clientX: 100, clientY: 0 }] });
  expect(screen.getByTestId('game-menu')).toBeInTheDocument();
});
