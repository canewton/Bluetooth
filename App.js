import React from 'react';
import {Text, View} from 'react-native';
import BluetoothManager from './src/BluetoothManager';

const HelloWorldApp = () => {
  const variable = 'Hello';
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>{variable}</Text>
      <BluetoothManager />
    </View>
  );
};
export default HelloWorldApp;
