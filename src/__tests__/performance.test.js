import { render } from '@testing-library/react';
import App from '../App';

describe('render performance', () => {
  test('App renders quickly', () => {
    const start = performance.now();
    render(<App />);
    const duration = performance.now() - start;
    // Allow a little variance in CI environments
    expect(duration).toBeLessThan(250);
  });
});
