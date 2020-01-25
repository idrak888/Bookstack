import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Navigator from './navigation/Navigator';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import collection from './reducers/collection';

export default class App extends React.Component {

  reducer = combineReducers({
    collection
  });

  store = createStore(this.reducer);

  render () {
    return (
      <Provider store={this.store}>
        <Navigator/>
      </Provider>
    );
  }
}
