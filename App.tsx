import React from 'react';
import { Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/reduxState/store';

export default function App() {
  return (
    <Provider store={store}>
      <View>
        <Text>app 文本</Text>
      </View>
    </Provider>
  );
}
