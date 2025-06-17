import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FirewallApp from '../components/FirewallApp';

function createDataTransfer() {
  return {
    data: {},
    setData(type, val) {
      this.data[type] = val;
    },
    getData(type) {
      return this.data[type];
    },
    dropEffect: '',
    effectAllowed: 'all',
  };
}

function addRule(port) {
  fireEvent.change(screen.getByLabelText('Port'), { target: { value: port } });
  fireEvent.click(screen.getByTestId('add-rule'));
}

test('adds rule to list', () => {
  render(<FirewallApp />);
  addRule('80');
  const list = screen.getByTestId('rule-list');
  expect(list.children.length).toBe(1);
});

test('dragging rule reorders list', () => {
  render(<FirewallApp />);
  addRule('80');
  addRule('22');
  const items = screen.getAllByTestId(/rule-/);
  const dt = createDataTransfer();
  fireEvent.dragStart(items[0], { dataTransfer: dt });
  fireEvent.dragOver(items[1], { dataTransfer: dt });
  fireEvent.drop(items[1], { dataTransfer: dt });
  const after = screen.getAllByTestId(/rule-/);
  expect(after[0].textContent).toMatch('22');
  expect(after[1].textContent).toMatch('80');
});
