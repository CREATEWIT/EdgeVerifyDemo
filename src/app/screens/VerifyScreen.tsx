import React, { useState } from 'react';

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

  const [faceCount] = useState(0);


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

      <View style={styles.overlay}>

        <Text style={styles.text}>
          Faces Detected: {faceCount}
        </Text>

      </View>

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

  overlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    alignItems: 'center',
  },

  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },

});