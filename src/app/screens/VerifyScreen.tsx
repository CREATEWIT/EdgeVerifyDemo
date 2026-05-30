import React, { useState } from 'react';
import {
  Camera,
} from 'react-native-vision-camera-face-detector';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import {
  useCameraDevice,
} from 'react-native-vision-camera';


export default function VerifyScreen() {
  
  const [faceCount, setFaceCount] =
    useState(0);
    

  const [status, setStatus] =
    useState('No Face');

  const [debugInfo, setDebugInfo] =
    useState('');
  const [step, setStep] =
  useState('BLINK');
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
  runClassifications={true}
  onFacesDetected={(faces) => {

          setFaceCount(faces.length);

          if (faces.length === 0) {

            setStatus('No Face');
            setDebugInfo('');
             setStep('BLINK');
          } else if (faces.length > 1) {

            setStatus('Multiple Faces');

          }else {

  const face = faces[0];
if (step === 'BLINK') {

  setStatus('Blink Both Eyes');

  if (
  (face.leftEyeOpenProbability ?? 1) < 0.2 &&
  (face.rightEyeOpenProbability ?? 1) < 0.2
) {
    setStep('SMILE');
  }

} else if (step === 'SMILE') {

  setStatus('Smile');

  if (
  (face.smilingProbability ?? 0) > 0.8
) {
    setStep('LEFT');
  }

} else if (step === 'LEFT') {

  setStatus('Turn Head Left');

  if (
  face.yawAngle < -40
) {
    setStep('RIGHT');
  }

} else if (step === 'LEFT') {

  setStatus('Turn Head Left');

  if (
    face.yawAngle < -40
  ) {
    setStep('CENTER');
  }

} else if (step === 'CENTER') {

  setStatus('Look Straight');

  if (
    face.yawAngle > -10 &&
    face.yawAngle < 10
  ) {
    setStep('RIGHT');
  }

} else if (step === 'RIGHT') {

  setStatus('Turn Head Right');

  if (
    face.yawAngle > 40
  ) {
    setStep('VERIFIED');
  }

} else {

  setStatus('Liveness Passed ✓');

}
  const { width, x } = face.bounds;

if (width < 300) {
  setStatus('Move Closer');
  return;
}

 setDebugInfo( JSON.stringify({
  step,

  leftEye:
    face.leftEyeOpenProbability,

  rightEye:
    face.rightEyeOpenProbability,

  smile:
    face.smilingProbability,

  yaw:
    face.yawAngle,

  pitch:
    face.pitchAngle,

  roll:
    face.rollAngle,

  width,
  x,
},
    null,
    2
  )
);

  

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

<Text style={styles.text}>
  Step: {step}
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