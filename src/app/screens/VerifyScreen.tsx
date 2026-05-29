import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import {
  useCameraDevice,
} from 'react-native-vision-camera';

import {
  Camera,
} from 'react-native-vision-camera-face-detector';

export default function VerifyScreen() {

  const [faceCount, setFaceCount] =
    useState(0);

  const device =
    useCameraDevice('front');

  if (!device) {
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
        onFacesDetected={(faces) => {
          setFaceCount(faces.length);
        }}
        onError={(error) => {
          console.log(error);
        }}
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
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },

});