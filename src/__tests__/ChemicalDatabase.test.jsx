import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChemicalDatabase from '../components/ChemicalDatabase';

// Helper to get rows of results table
function getRows() {
  return screen.getByTestId('query-results').querySelectorAll('tbody tr');
}

describe('ChemicalDatabase', () => {
  test('runs default query and shows results', () => {
    render(<ChemicalDatabase />);
    fireEvent.click(screen.getByText('Run'));
    const rows = getRows();
    // default query selects organic compounds -> Water and Ethanol
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toMatch(/Water/);
    expect(rows[1].textContent).toMatch(/Ethanol/);
  });

  test('build query updates textarea', () => {
    render(<ChemicalDatabase />);
    fireEvent.change(screen.getByDisplayValue(/SELECT/i), {
      target: { value: "SELECT * FROM compounds WHERE type='inorganic'" },
    });
    // change builder to locations table
    fireEvent.change(screen.getByDisplayValue('compounds'), {
      target: { value: 'locations' },
    });
    fireEvent.change(screen.getByPlaceholderText('column'), {
      target: { value: 'id' },
    });
    fireEvent.change(screen.getByPlaceholderText('value'), {
      target: { value: '1' },
    });
    fireEvent.click(screen.getByText('Build'));
    expect(screen.getByDisplayValue(/SELECT/).value).toBe(
      "SELECT * FROM locations WHERE id='1'",
    );
  });
});
