import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommandBlock from '../components/scriptbuilder/CommandBlock';

const params = [
  { type: 'text', name: 'value' },
  { type: 'select', options: ['a', 'b'] },
];

test('renders block with parameters and connections', () => {
  const { getByTestId, getAllByTestId } = render(
    <CommandBlock blockType="ACTION" parameters={params} />
  );
  expect(getByTestId('command-block')).toBeInTheDocument();
  expect(getByTestId('conn-top')).toBeInTheDocument();
  expect(getByTestId('conn-bottom')).toBeInTheDocument();
  expect(getAllByTestId('param-input')).toHaveLength(1);
  expect(getAllByTestId('param-select')).toHaveLength(1);
});

test('is draggable', () => {
  const { getByTestId } = render(
    <CommandBlock blockType="START" parameters={[]} />
  );
  const block = getByTestId('command-block');
  const dt = { setData: jest.fn() };
  fireEvent.dragStart(block, { dataTransfer: dt });
  expect(dt.setData).toHaveBeenCalled();
});
