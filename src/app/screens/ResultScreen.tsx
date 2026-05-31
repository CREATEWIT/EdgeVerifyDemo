import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera } from 'react-native-vision-camera-face-detector';
import { useCameraDevice, usePhotoOutput } from 'react-native-vision-camera';

type LivenessStep = 'BLINK' | 'SMILE' | 'LEFT' | 'CENTER' | 'RIGHT' | 'VERIFIED';

export default function VerifyScreen({ route }: any) {
  const mode = route?.params?.mode;
  const employeeId = route?.params?.employeeId;
  const employeeName = route?.params?.employeeName;

  const [faceCount, setFaceCount] = useState(0);
  const [status, setStatus] = useState('No Face');
  const [debugInfo, setDebugInfo] = useState('');
  const [stepUi, setStepUi] = useState<LivenessStep>('BLINK');
  const [captureError, setCaptureError] = useState(''); // added

  const stepRef = useRef<LivenessStep>('BLINK');
  const photoCapturedRef = useRef(false);

  const photoOutput = usePhotoOutput();
  const device = useCameraDevice('front');

  const updateStep = (s: LivenessStep) => {
    stepRef.current = s;
    setStepUi(s);
  };

  // ─── Capture ─────────────────────────────────────────────────────────────────

  const captureFace = useCallback(async () => {
    setStatus('CAPTURE_STARTED');
    console.log('PHOTO_OUTPUT', photoOutput);
    console.log('CAPTURE_FUNCTION_STARTED');
    try {
      const photo = await photoOutput.capturePhotoToFile({}, {});
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
      setStatus('PHOTO_CAPTURED ✓');
    } catch (error) {
      console.log('CAPTURE_ERROR', error);
    setCaptureError(
  error instanceof Error
    ? error.message
    : String(error)
); // added
      setStatus('CAPTURE_ERROR');
    }
  }, [photoOutput]);

  // ─── Liveness State Machine ──────────────────────────────────────────────────

  const handleLivenessStep = useCallback((face: any) => {
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
        setStatus('Turn Head Right');
        if (face.yawAngle > 40) {
          updateStep('VERIFIED');
        }
        break;

      case 'VERIFIED':
        console.log('VERIFIED_REACHED');
      if (!photoCapturedRef.current) {
  setStatus('Liveness Passed ✓');
}
        if (mode === 'enroll' && !photoCapturedRef.current) {
          photoCapturedRef.current = true;
          captureFace();
        }
        break;
    }
  }, [mode, captureFace]);

  // ─── Face Detection ───────────────────────────────────────────────────────────

  const handleFacesDetected = useCallback((faces: any[]) => {
    setFaceCount(faces.length);

    if (faces.length === 0) {
      setStatus('No Face');
      setDebugInfo('');
      setCaptureError('');
      updateStep('BLINK');
      photoCapturedRef.current = false;
      return;
    }

    if (faces.length > 1) {
      setStatus('Multiple Faces');
      return;
    }

    const face = faces[0];
    const { width } = face.bounds;

    if (width < 260) {
      setStatus('Move Closer');
      return;
    }

    handleLivenessStep(face);

    setDebugInfo(
      JSON.stringify({
        step: stepRef.current,
        photoCaptured: photoCapturedRef.current,
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
        {captureError !== '' && (
          <Text style={styles.debugText}>{captureError}</Text>
        )}
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