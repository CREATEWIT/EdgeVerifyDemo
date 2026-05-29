import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import {
  Camera,
  useCameraDevice,
} from 'react-native-vision-camera';

export default function VerifyScreen() {

  const device = useCameraDevice('front');

  if (device == null) {
    return (
      <View style={styles.center}>
        <Text>Loading Camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});