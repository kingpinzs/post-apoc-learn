jest.mock('react-dom/client', () => ({ createRoot: jest.fn() }));
import * as ReactDOMClient from 'react-dom/client';

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
  ReactDOMClient.createRoot.mockClear();
});

test('renders App at root element', () => {
  const render = jest.fn();
  ReactDOMClient.createRoot.mockReturnValue({ render });
  jest.isolateModules(() => {
    require('../index');
  });
  expect(ReactDOMClient.createRoot).toHaveBeenCalledWith(document.getElementById('root'));
  expect(render).toHaveBeenCalled();
});
