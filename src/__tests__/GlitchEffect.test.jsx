import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import GlitchEffect from '../components/GlitchEffect';

test('applies css variables and active class', () => {
  const { getByTestId } = render(
    <GlitchEffect intensity={7} duration={1000} active>
      <span>Damage</span>
    </GlitchEffect>
  );
  const el = getByTestId('glitch-effect');
  expect(el).toHaveClass('glitch-active');
  expect(el.style.getPropertyValue('--glitch-intensity')).toBe('7');
  expect(el.style.getPropertyValue('--glitch-duration')).toBe('1000ms');
  expect(el.querySelector('.glitch-noise')).toBeInTheDocument();
});
