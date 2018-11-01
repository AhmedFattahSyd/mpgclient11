import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MpgApp from './mpgapp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MpgApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
