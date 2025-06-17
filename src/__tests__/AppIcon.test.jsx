import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppIcon from '../components/AppIcon';
import { Cpu } from 'lucide-react';

test('shows lock overlay when locked', () => {
  const { getByTestId } = render(
    <AppIcon appId="test" name="Terminal" icon={<Cpu />} isLocked={true} isDraggable={false} />
  );
  expect(getByTestId('lock-overlay')).toBeInTheDocument();
});
