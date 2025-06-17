import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapScreen from '../components/MapScreen';

test('renders map with location markers', () => {
  const { getByTestId } = render(<MapScreen />);
  const map = getByTestId('map-screen');
  const markers = map.querySelectorAll('div.absolute');
  expect(markers.length).toBe(4);
});
