import React from 'react';
import { Provider } from 'react-redux';

import store from './reducers/store';
import './App.css';

import Home from './components/Home/home';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Home />
      </div>
    </Provider>
  );
}

export default App;
