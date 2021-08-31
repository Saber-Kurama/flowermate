import React from 'react';
import { Text, View } from 'react-native';
import { Provider } from 'react-redux';

export default function App() {
  return (
    <Provider store={}>
      <View>
        <Text>app 文本</Text>
      </View>
    </Provider>
  );
}
