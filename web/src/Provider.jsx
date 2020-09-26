import React from 'react';
import { Provider } from 'react-redux';

import store from './reducers/store';

import App from './App';

function StoreProvider() {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
};

export default StoreProvider;