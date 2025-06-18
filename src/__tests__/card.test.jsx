import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { Card } from '../components/ui/card';

test('merges custom class names and forwards ref', () => {
  const ref = React.createRef();
  const { container } = render(<Card ref={ref} className="p-2">Hi</Card>);
  const div = container.firstChild;
  expect(div).toHaveClass('rounded-lg');
  expect(div).toHaveClass('p-2');
  expect(ref.current).toBe(div);
});
