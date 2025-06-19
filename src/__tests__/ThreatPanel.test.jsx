import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThreatPanel from '../components/ThreatPanel';

describe('ThreatPanel', () => {
  test('shows threat details and countdown', () => {
    const threat = {
      id: 'ddos',
      message: 'Incoming!',
      tool: 'firewall',
      target: 'network',
      pattern: ['A', 'B'],
    };
    const { getByTestId, getByText } = render(
      <ThreatPanel threat={threat} timeLeft={5} combo={2} />
    );
    expect(getByTestId('threat-panel')).toBeInTheDocument();
    expect(getByText(/Incoming!/)).toBeInTheDocument();
    expect(getByText(/5s/)).toBeInTheDocument();
    expect(getByText(/Target: network/)).toBeInTheDocument();
    expect(getByText(/Combo x2/)).toBeInTheDocument();
  });
});
