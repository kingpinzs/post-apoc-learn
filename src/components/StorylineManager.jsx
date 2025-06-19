import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { storyChapters } from '../data/story';

const STORAGE_KEY = 'survivos-story-progress';

function loadProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return 0;
  const n = parseInt(raw, 10);
  return Number.isNaN(n) ? 0 : n;
}

function saveProgress(value) {
  localStorage.setItem(STORAGE_KEY, String(value));
}

const StorylineManager = ({ currentLevel, onAdvance }) => {
  const [chapter, setChapter] = useState(() => loadProgress());
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    saveProgress(chapter);
  }, [chapter]);

  useEffect(() => {
    if (chapter < storyChapters.length && currentLevel === chapter && !visible) {
      setVisible(true);
    }
  }, [currentLevel, chapter, visible]);

  const handleContinue = () => {
    setVisible(false);
    if (chapter < storyChapters.length) {
      const next = chapter + 1;
      setChapter(next);
      onAdvance?.(next);
    }
  };

  if (!visible || chapter >= storyChapters.length) return null;

  const { title, text } = storyChapters[chapter];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      data-testid="story-overlay"
    >
      <div className="bg-gray-900 p-4 rounded space-y-4 max-w-md text-center">
        <h2 className="text-green-400 text-xl font-bold" data-testid="story-title">
          {title}
        </h2>
        <p className="text-green-200 whitespace-pre-line" data-testid="story-text">
          {text}
        </p>
        <button
          type="button"
          onClick={handleContinue}
          className="border border-green-500 text-green-400 rounded px-3 py-1"
          data-testid="story-continue"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

StorylineManager.propTypes = {
  currentLevel: PropTypes.number.isRequired,
  onAdvance: PropTypes.func,
};

export default StorylineManager;
