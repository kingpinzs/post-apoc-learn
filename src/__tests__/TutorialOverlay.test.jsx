import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TutorialOverlay from '../components/TutorialOverlay';

test('advances through steps and calls onComplete', () => {
  const handleComplete = jest.fn();
  const { getByText, queryByText } = render(
    <div>
      <button id="step1">One</button>
      <button id="step2">Two</button>
      <TutorialOverlay
        steps={[
          { targetId: 'step1', message: 'Click first', action: 'click' },
          { targetId: 'step2', message: 'Click second', action: 'click' },
        ]}
        onComplete={handleComplete}
      />
    </div>
  );

  expect(getByText('Click first')).toBeInTheDocument();
  fireEvent.click(document.getElementById('step1'));
  expect(queryByText('Click first')).not.toBeInTheDocument();
  expect(getByText('Click second')).toBeInTheDocument();
  fireEvent.click(document.getElementById('step2'));
  expect(handleComplete).toHaveBeenCalled();
  expect(queryByText('Click second')).not.toBeInTheDocument();
});
