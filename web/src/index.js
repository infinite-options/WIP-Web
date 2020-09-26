import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import StoreProvider from './Provider';

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider />
  </React.StrictMode>,
  document.getElementById('root')
);
