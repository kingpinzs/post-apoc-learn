import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScriptBuilder from '../components/scriptbuilder/ScriptBuilder';
import * as validator from '../lib/scriptValidator';

function createDataTransfer(cmd) {
  return {
    data: { 'text/plain': cmd },
    setData(type, val) { this.data[type] = val; },
    getData(type) { return this.data[type]; },
  };
}

test('adds command via drop', () => {
  render(<ScriptBuilder />);
  const zone = screen.getByTestId('script-dropzone');
  fireEvent.drop(zone, { dataTransfer: createDataTransfer('START') });
  expect(zone.textContent).toMatch('1. START');
});

test('shows error when validation fails', () => {
  jest.spyOn(validator, 'validateScript').mockReturnValue({ isValid: false, errors: ['bad'] });
  render(<ScriptBuilder />);
  const zone = screen.getByTestId('script-dropzone');
  fireEvent.drop(zone, { dataTransfer: createDataTransfer('START') });
  fireEvent.click(screen.getByText('Run Script'));
  expect(screen.getByText('bad')).toBeInTheDocument();
});

test('shows visualizer on valid script', () => {
  jest.spyOn(validator, 'validateScript').mockReturnValue({ isValid: true, errors: [] });
  render(<ScriptBuilder />);
  const zone = screen.getByTestId('script-dropzone');
  fireEvent.drop(zone, { dataTransfer: createDataTransfer('START') });
  fireEvent.click(screen.getByText('Run Script'));
  expect(screen.getByTestId('execution-visualizer')).toBeInTheDocument();
});

test('clears visualizer on validation failure after a success', () => {
  jest
    .spyOn(validator, 'validateScript')
    .mockReturnValueOnce({ isValid: true, errors: [] })
    .mockReturnValueOnce({ isValid: false, errors: ['bad'] });
  render(<ScriptBuilder />);
  const zone = screen.getByTestId('script-dropzone');
  fireEvent.drop(zone, { dataTransfer: createDataTransfer('START') });
  fireEvent.drop(zone, { dataTransfer: createDataTransfer('END') });
  fireEvent.click(screen.getByText('Run Script'));
  expect(screen.getByTestId('execution-visualizer')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Run Script'));
  expect(screen.queryByTestId('execution-visualizer')).not.toBeInTheDocument();
});
