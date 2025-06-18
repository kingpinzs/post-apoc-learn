import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApocalypseGame from '../components/Game';

describe('ApocalypseGame cleanup', () => {
  test('removes keydown listener on unmount', () => {
    const addSpy = jest.spyOn(window, 'addEventListener');
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<ApocalypseGame practice />);
    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});
