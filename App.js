/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {store,} from './app/store';
import {Provider} from 'react-redux';
 import Navigator from './app/navigation';
import {View} from 'react-native'

const App: () => React$Node = () => {
  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  );
};

export default App;
