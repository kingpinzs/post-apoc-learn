import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StorylineManager from '../components/StorylineManager';
import { storyChapters } from '../data/story';

describe('StorylineManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('displays chapter and advances progress', () => {
    const { rerender } = render(<StorylineManager currentLevel={0} />);
    expect(screen.getByTestId('story-overlay')).toBeInTheDocument();
    expect(screen.getByText(storyChapters[0].title)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('story-continue'));
    expect(screen.queryByTestId('story-overlay')).not.toBeInTheDocument();
    expect(localStorage.getItem('survivos-story-progress')).toBe('1');

    rerender(<StorylineManager currentLevel={1} />);
    expect(screen.getByTestId('story-overlay')).toBeInTheDocument();
    expect(screen.getByText(storyChapters[1].title)).toBeInTheDocument();
  });
});
