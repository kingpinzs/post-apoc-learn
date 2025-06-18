import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TemplateSelector from '../components/scriptbuilder/TemplateSelector';
import { scriptTemplates } from '../lib/scriptTemplates';

test('calls onSelect with selected template', () => {
  const handle = jest.fn();
  const { getByTestId } = render(<TemplateSelector onSelect={handle} />);
  fireEvent.change(getByTestId('template-selector'), { target: { value: 'basicScan' } });
  expect(handle).toHaveBeenCalledWith(scriptTemplates.basicScan);
});

test('does not call onSelect when placeholder option chosen', () => {
  const handle = jest.fn();
  const { getByTestId } = render(<TemplateSelector onSelect={handle} />);
  fireEvent.change(getByTestId('template-selector'), { target: { value: '' } });
  expect(handle).not.toHaveBeenCalled();
});
