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

  const [status, setStatus] =
    useState('No Face');

  const [debugInfo, setDebugInfo] =
    useState('');
    const [leftVerified, setLeftVerified] =
  useState(false);

const [rightVerified, setRightVerified] =
  useState(false);

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

          if (faces.length === 0) {

            setStatus('No Face');
            setDebugInfo('');

          } else if (faces.length > 1) {

            setStatus('Multiple Faces');

          }else {

  const face = faces[0];

  const yaw = face.yawAngle;

  const {
    width,
    x,
  } = face.bounds;

  setDebugInfo(
    JSON.stringify(
      {
        yaw: face.yawAngle,
        pitch: face.pitchAngle,
        roll: face.rollAngle,
        width,
        x,
        leftVerified,
        rightVerified,
      },
      null,
      2
    )
  );

  if (width < 300) {

    setStatus('Move Closer');

  } else if (x < 150) {

    setStatus('Move Right');

  } else if (x > 450) {

    setStatus('Move Left');

  } else {

    if (!leftVerified) {

      if (yaw > 40) {

        setLeftVerified(true);

      }

      setStatus('Turn Head Left');

    } else if (!rightVerified) {

      if (yaw < -40) {

        setRightVerified(true);

      }

      setStatus('Turn Head Right');

    } else {

      setStatus('Liveness Passed ✓');

    }

  }

}
        }}
        onError={(error) => {
          console.log(error);
        }}
      />

      <View style={styles.overlay}>

        <Text style={styles.text}>
          {status}
        </Text>

        <Text style={styles.text}>
          Faces Detected: {faceCount}
        </Text>

        <Text style={styles.debugText}>
          {debugInfo}
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
    left: 10,
    right: 10,
    alignItems: 'center',
  },

  text: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  debugText: {
    color: 'yellow',
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    maxHeight: 300,
  },

});