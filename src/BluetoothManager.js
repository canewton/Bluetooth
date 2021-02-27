import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BleManager} from 'react-native-ble-plx';

function scanAndConnect(manager) {
  manager.startDeviceScan(null, null, (error, device) => {
    console.info('Scanning...');
    if (device.name === 'PaceTrackerTester') {
      console.log('yay');
    }

    if (error) {
      console.error(error.message);
      return;
    }
  });
}
const BluetoothManager = () => {
  const manager = new BleManager();
  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        scanAndConnect(manager);
        subscription.remove();
      }
    }, true);
  });
  return (
    <View>
      <Text>List Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default BluetoothManager;
