import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera } from 'react-native-vision-camera-face-detector';
import { useCameraDevice, usePhotoOutput } from 'react-native-vision-camera';
import {
  saveVerification,
} from '../../storage/verificationStorage';

type LivenessStep = 'BLINK' | 'SMILE' | 'LEFT' | 'CENTER' | 'RIGHT' | 'VERIFIED';

export default function VerifyScreen({ route,navigation, }: any) {
  const mode = route?.params?.mode;
  const employeeId = route?.params?.employeeId;
  const employeeName = route?.params?.employeeName;

  const [faceCount, setFaceCount] = useState(0);
  const [status, setStatus] = useState('No Face');
  const [debugInfo, setDebugInfo] = useState('');
  const [stepUi, setStepUi] = useState<LivenessStep>('BLINK');

  const stepRef = useRef<LivenessStep>('BLINK');
  const photoCapturedRef = useRef(false);
  const verificationSavedRef =
  useRef(false);

  const photoOutput = usePhotoOutput();
  const device = useCameraDevice('front');

  const updateStep = (s: LivenessStep) => {
    stepRef.current = s;
    setStepUi(s);
  };

  // ─── Capture ─────────────────────────────────────────────────────────────────
const captureFace = useCallback(async () => {

  setStatus('CAPTURE_STARTED');

  console.log(
    'CAPTURE_FUNCTION_STARTED'
  );

  try {

    const photo =
      await photoOutput.capturePhotoToFile(
        {},
        {}
      );

    console.log(
      'PHOTO_FILE',
      photo
    );

    setDebugInfo(
      JSON.stringify(
        photo,
        null,
        2
      )
    );

    setStatus(
      'PHOTO_CAPTURED ✓'
    );

  } catch (error) {

    console.log(
      'CAPTURE_ERROR',
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : String(error);

    setDebugInfo(
      'ERROR: ' + message
    );

    setStatus(
      'CAPTURE_ERROR'
    );

  }

}, [photoOutput]);

  // ─── Liveness State Machine ──────────────────────────────────────────────────

 const handleLivenessStep = useCallback(async (face: any) => {
    switch (stepRef.current) {
      case 'BLINK':
        setStatus('Blink Both Eyes');
        if (
          (face.leftEyeOpenProbability ?? 1) < 0.2 &&
          (face.rightEyeOpenProbability ?? 1) < 0.2
        ) {
          updateStep('SMILE');
        }
        break;

      case 'SMILE':
        setStatus('Smile');
        if ((face.smilingProbability ?? 0) > 0.8) {
          updateStep('LEFT');
        }
        break;

      case 'LEFT':
        setStatus('Turn Head Left');
        if (face.yawAngle < -40) {
          updateStep('CENTER');
        }
        break;

      case 'CENTER':
        setStatus('Look Straight');
        if (face.yawAngle > -10 && face.yawAngle < 10) {
          updateStep('RIGHT');
        }
        break;

      case 'RIGHT':

  setStatus('RIGHT_SUCCESS');

  if (face.yawAngle > 40) {

    console.log(
      'RIGHT_COMPLETED'
    );

    updateStep('VERIFIED');
  }

  break;

  case 'VERIFIED':

  if (
    !verificationSavedRef.current
  ) {

    verificationSavedRef.current =
      true;

    await saveVerification({
      employeeId,
      employeeName,
      verifiedAt:
        new Date().toISOString(),
      livenessPassed: true,
    });

  }

  setStatus(
    'Liveness Passed ✓'
  );

  if (
    mode === 'enroll' &&
    !photoCapturedRef.current
  ) {

    photoCapturedRef.current = true;

    navigation.navigate(
      'CapturePhoto',
      {
        employeeId,
        employeeName,
      }
    );
  }

  break;
    }
  }, [mode,employeeId, employeeName, navigation]);

  // ─── Face Detection ───────────────────────────────────────────────────────────

  const handleFacesDetected = useCallback((faces: any[]) => {
    setFaceCount(faces.length);

    if (faces.length === 0) {
      setStatus('No Face');
      setDebugInfo('');
      updateStep('BLINK');
      photoCapturedRef.current = false;
      verificationSavedRef.current =
  false;
      return;
    }

    if (faces.length > 1) {
      setStatus('Multiple Faces');
      return;
    }

    const face = faces[0];
    const { width } = face.bounds;

    if (width < 220) {
      setStatus('Move Closer');
      return;
    }

    handleLivenessStep(face)
  .catch(error => {

    console.log(
      'LIVENESS_ERROR',
      error
    );

  });

    setDebugInfo(
      JSON.stringify({
        step: stepRef.current,
        leftEye: face.leftEyeOpenProbability?.toFixed(2),
        rightEye: face.rightEyeOpenProbability?.toFixed(2),
        smile: face.smilingProbability?.toFixed(2),
        yaw: Math.round(face.yawAngle),
        pitch: Math.round(face.pitchAngle),
        roll: Math.round(face.rollAngle),
        width: Math.round(width),
      }, null, 2)
    );
  }, [handleLivenessStep]);

  // ─── Render ───────────────────────────────────────────────────────────────────

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
        outputs={[photoOutput]}
        isActive={true}
        runClassifications={true}
        onFacesDetected={handleFacesDetected}
        onError={(error) => console.log('Camera Error:', error)}
      />

      <View style={styles.overlay}>
        <Text style={styles.text}>{status}</Text>
        <Text style={styles.text}>Faces: {faceCount}</Text>
        <Text style={styles.text}>Step: {stepUi}</Text>
        <Text style={styles.text}>Mode: {mode}</Text>
        <Text style={styles.text}>Employee: {employeeId}</Text>
        <Text style={styles.text}>Name: {employeeName}</Text>
        <Text style={styles.debugText}>{debugInfo}</Text>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'black',
    textShadowRadius: 2,
  },
  debugText: {
    color: 'yellow',
    fontSize: 11,
    fontFamily: 'monospace',
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 8,
    marginTop: 10,
    borderRadius: 5,
    width: '90%',
  },
});