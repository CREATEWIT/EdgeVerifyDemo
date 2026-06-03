import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera } from 'react-native-vision-camera-face-detector';
import { useCameraDevice} from 'react-native-vision-camera';
import { saveVerification } from '../../storage/verificationStorage';

type LivenessStep = 'BLINK' | 'SMILE' | 'LEFT' | 'CENTER' | 'RIGHT' | 'VERIFIED';

// How long (ms) the user must hold CENTER gaze before moving to RIGHT
const CENTER_HOLD_MS = 1000;

export default function VerifyScreen({ route, navigation }: any) {
  const mode = route?.params?.mode;
  const employeeId = route?.params?.employeeId;
  const employeeName = route?.params?.employeeName;

  const [faceCount, setFaceCount] = useState(0);
  const [status, setStatus] = useState('No Face');
  const [debugInfo, setDebugInfo] = useState('');
  const [stepUi, setStepUi] = useState<LivenessStep>('BLINK');


  const stepRef = useRef<LivenessStep>('BLINK');
  const photoCapturedRef = useRef(false);
  const finalFaceBoundsRef =
  useRef<any>(null);
  const verificationSavedRef = useRef(false);

  // Tracks when user first hit CENTER so we can enforce hold time
  const centerStartRef = useRef<number | null>(null);
  const device = useCameraDevice('front');

  const updateStep = (s: LivenessStep) => {
    stepRef.current = s;
    setStepUi(s);
  };

  // ─── Liveness State Machine ───────────────────────────────────────────────────
  const handleLivenessStep = useCallback(async (face: any) => {

    // ── yawAngle on front camera is mirrored ──────────────────────────────────
    // Physical LEFT turn  → positive yaw  (mirrored)
    // Physical RIGHT turn → negative yaw  (mirrored)
    const yaw: number = face.yawAngle ?? 0;

    switch (stepRef.current) {

      // ── BLINK ──────────────────────────────────────────────────────────────
      case 'BLINK':
        setStatus('Blink Both Eyes');
        if (
          (face.leftEyeOpenProbability ?? 1) < 0.2 &&
          (face.rightEyeOpenProbability ?? 1) < 0.2
        ) {
          updateStep('SMILE');
        }
        break;

      // ── SMILE ──────────────────────────────────────────────────────────────
      case 'SMILE':
        setStatus('Smile 😊');
        if ((face.smilingProbability ?? 0) > .7) {
          updateStep('LEFT');
        }
        break;

      // ── LEFT ───────────────────────────────────────────────────────────────
      // Front camera: user turns LEFT  → yaw becomes POSITIVE (mirrored)
      case 'LEFT':
        setStatus('Turn Head Left ←');
        if (yaw > 40) {           // mirrored: positive = physical left
          updateStep('CENTER');
          centerStartRef.current = null; // reset hold timer
        }
        break;

      // ── CENTER ─────────────────────────────────────────────────────────────
      // Must stay centered for CENTER_HOLD_MS before advancing
      case 'CENTER': {
        const isCentered = yaw > -15 && yaw < 15;

        if (isCentered) {
          setStatus('Look Straight ⏳');
          if (centerStartRef.current === null) {
            centerStartRef.current = Date.now();
          }
          const held = Date.now() - centerStartRef.current;
          if (held >= CENTER_HOLD_MS) {
            updateStep('RIGHT');
            centerStartRef.current = null;
          }
        } else {
          // Drifted away — reset the hold timer
          centerStartRef.current = null;
          setStatus('Look Straight →');
        }
        break;
      }

      // ── RIGHT ──────────────────────────────────────────────────────────────
      // Front camera: user turns RIGHT → yaw becomes NEGATIVE (mirrored)
      case 'RIGHT':
        setStatus('Turn Head Right →');
        if (yaw < -40) {          // mirrored: negative = physical right
          updateStep('VERIFIED');
        }
        break;

      // ── VERIFIED ───────────────────────────────────────────────────────────
      case 'VERIFIED':
        if (!verificationSavedRef.current) {
          verificationSavedRef.current = true;
          await saveVerification({
            employeeId,
            employeeName,
            verifiedAt: new Date().toISOString(),
            livenessPassed: true,
          });
        }

        setStatus('Liveness Passed ✓');
if (
  mode === 'register' &&
  !photoCapturedRef.current
) {

  photoCapturedRef.current =
    true;

navigation.navigate(
  'CapturePhoto',
  {
    mode: 'register',
    employeeId,
    employeeName,
    faceBounds:
      finalFaceBoundsRef.current,
  }
);
}
      if (
  mode === 'verify' &&
  !photoCapturedRef.current
) {

  photoCapturedRef.current =
    true;

navigation.navigate(
  'CapturePhoto',
  {
    mode: 'verify',
    employeeId,
    faceBounds:
      finalFaceBoundsRef.current,
  }
);

}
        break;
    }
  }, [mode, employeeId, employeeName, navigation,]);

  // ─── Face Detection ────────────────────────────────────────────────────────────
  const handleFacesDetected = useCallback((faces: any[]) => {
    setFaceCount(faces.length);

    if (faces.length === 0) {
      setStatus('No Face');
      setDebugInfo('');
      updateStep('BLINK');
      photoCapturedRef.current = false;
      verificationSavedRef.current = false;
      centerStartRef.current = null;
      return;
    }

    if (faces.length > 1) {
      setStatus('Multiple Faces Detected');
      return;
    }

    const face = faces[0];
    
   finalFaceBoundsRef.current =
  face.bounds;
    // ── FIX: bounds comes as { x, y, width, height } or as a flat object ──────
    // Try both shapes defensively
    const faceWidth: number =
      face.bounds?.width ??   // react-native-vision-camera-face-detector v3
      face.width ??            // some older versions
      face.frameWidth ??       // fallback
      0;

    if (faceWidth > 0 && faceWidth < 320) {
      setStatus('Move Closer 🔍');
      setDebugInfo(JSON.stringify({ faceWidth }, null, 2));
      return;
    }

    handleLivenessStep(face).catch(err => {
      console.log('LIVENESS_ERROR', err);
    });

    setDebugInfo(
      JSON.stringify({
        step: stepRef.current,
        leftEye: face.leftEyeOpenProbability?.toFixed(2),
        rightEye: face.rightEyeOpenProbability?.toFixed(2),
        smile: face.smilingProbability?.toFixed(2),
        yaw: Math.round(face.yawAngle ?? 0),
        pitch: Math.round(face.pitchAngle ?? 0),
        roll: Math.round(face.rollAngle ?? 0),
        faceWidth: Math.round(faceWidth),
      }, null, 2)
    );
  }, [handleLivenessStep]);

  // ─── Render ────────────────────────────────────────────────────────────────────
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

// ─── Styles ────────────────────────────────────────────────────────────────────
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