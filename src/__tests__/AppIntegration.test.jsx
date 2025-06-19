import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React, { useEffect } from 'react';
import AppIntegration, { useAppIntegration } from '../components/AppIntegration';

function Requester({ apps }) {
  const { requestApp } = useAppIntegration();
  useEffect(() => {
    apps.forEach((a) => requestApp(a.id, a.props, a.cbs));
  }, [apps, requestApp]);
  return null;
}

test('requestApp shows overlay with props', () => {
  render(
    <AppIntegration>
      <Requester apps={[{ id: 'portScanner', props: { initialTarget: '1.2.3.4' } }]} />
    </AppIntegration>
  );
  expect(screen.getByTestId('integration-overlay')).toBeInTheDocument();
  expect(screen.getByDisplayValue('1.2.3.4')).toBeInTheDocument();
});

test('queued requests open sequentially', () => {
  render(
    <AppIntegration>
      <Requester apps={[{ id: 'terminal' }, { id: 'portScanner', props: { initialTarget: '2.2.2.2' } }]} />
    </AppIntegration>
  );
  // first app should be terminal
  expect(screen.getByTestId('terminal-screen')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('integration-close'));
  expect(screen.getByDisplayValue('2.2.2.2')).toBeInTheDocument();
});

test('success callback fires on close', () => {
  const onSuccess = jest.fn();
  render(
    <AppIntegration>
      <Requester apps={[{ id: 'terminal', cbs: { onSuccess } }]} />
    </AppIntegration>
  );
  fireEvent.click(screen.getByTestId('integration-close'));
  expect(onSuccess).toHaveBeenCalled();
});
