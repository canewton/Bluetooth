import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BleManager, Characteristic} from 'react-native-ble-plx';
import base64 from 'react-native-base64';

const serviceUUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
const notifyUUID = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';
const writeUUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';

function scanAndConnect(manager) {
  manager.startDeviceScan(null, null, (error, device) => {
    console.info('Scanning...');
    if (device.name === 'PaceTrackerTester') {
      console.log('Scanned');
      manager.stopDeviceScan();

      device
        .connect()
        .then((device) => {
          console.log('Discovering services and characteristics');
          return device.discoverAllServicesAndCharacteristics();
        })
        .then((device) => {
          console.log(device.services());
          console.log('Setting notifications');
          return setupNotifications(device);
        })
        .catch((error) => {
          // Handle errors
          console.error(error.message);
        });
    }

    if (error) {
      console.error(error.message);
      return;
    }
  });
}

async function setupNotifications(device) {
  console.log('start monitoring');

  device.monitorCharacteristicForService(
    serviceUUID,
    notifyUUID,
    (error, characteristic) => {
      if (error) {
        console.error(error.message);
        return;
      }
      console.log(base64.decode(characteristic.value));
      //var obj = JSON.parse(base64.decode(characteristic.value));
    },
  );

  try {
    await device.writeCharacteristicWithResponseForService(
      serviceUUID,
      writeUUID,
      base64.encode('Connect'),
    );
  } catch (error) {
    console.error(error);
  }
  try {
    var objSend = {
      'Requested Runs': [new String('/Run1.txt'), new String('/Run2.txt')],
    };
    await device.writeCharacteristicWithResponseForService(
      serviceUUID,
      writeUUID,
      base64.encode(JSON.stringify(objSend)),
      //'eyJSZXF1ZXN0ZWQgUnVucyI6WyIvUnVuMS50eHQiXX0=',
    );
  } catch (error) {
    console.error(error);
  }
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
