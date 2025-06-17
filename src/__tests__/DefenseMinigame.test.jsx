import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DefenseMinigame from '../components/defense/DefenseMinigame';

function createDataTransfer(data) {
  return {
    data: {},
    setData(type, val) { this.data[type] = val; },
    getData(type) { return this.data[type]; },
    dropEffect: '',
    effectAllowed: 'all',
  };
}

describe('DefenseMinigame', () => {
  const pattern = ['A', 'B', 'C', 'D'];

  test('calls onSuccess when pattern matched', () => {
    jest.useFakeTimers();
    const handleSuccess = jest.fn();
    const { getByTestId } = render(
      <DefenseMinigame threatPattern={pattern} timeLimit={5} onSuccess={handleSuccess} />
    );
    pattern.forEach((sym, i) => {
      const dt = createDataTransfer();
      fireEvent.dragStart(getByTestId(`symbol-${i}`), { dataTransfer: dt });
      fireEvent.dragOver(getByTestId(`slot-${i}`), { dataTransfer: dt });
      fireEvent.drop(getByTestId(`slot-${i}`), { dataTransfer: dt });
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(handleSuccess).toHaveBeenCalled();
    jest.useRealTimers();
  });

  test('calls onFailure when time expires', () => {
    jest.useFakeTimers();
    const handleFailure = jest.fn();
    render(
      <DefenseMinigame threatPattern={pattern} timeLimit={1} onFailure={handleFailure} />
    );
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(handleFailure).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
