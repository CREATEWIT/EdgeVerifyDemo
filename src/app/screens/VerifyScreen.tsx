import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Camera } from 'react-native-vision-camera-face-detector';
import { useCameraDevice} from 'react-native-vision-camera';
import { saveVerification } from '../../storage/verificationStorage';

type LivenessStep = 'BLINK' | 'SMILE' | 'LEFT' | 'CENTER' | 'RIGHT' | 'VERIFIED';

// How long (ms) the user must hold CENTER gaze before moving to RIGHT
const CENTER_HOLD_MS = 900;

export default function VerifyScreen({ route, navigation }: any) {
  const mode = route?.params?.mode;
  const employeeId = route?.params?.employeeId;
  const employeeName = route?.params?.employeeName;

  const [faceCount, setFaceCount] = useState(0);
  const [status, setStatus] = useState('No Face');
  const [stepUi, setStepUi] = useState<LivenessStep>('BLINK');


  const stepRef = useRef<LivenessStep>('BLINK');
  const photoCapturedRef = useRef(false);
  const finalFaceBoundsRef =
  useRef<any>(null);
  const verificationSavedRef = useRef(false);
  const rightStartRef =
  useRef<number | null>(null);

  // Tracks when user first hit CENTER so we can enforce hold time
  const centerStartRef = useRef<number | null>(null);
  const device = useCameraDevice('front');

 const updateStep = (s: LivenessStep) => {

  console.log(
    'STEP_CHANGE',
    s
  );

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
console.log(
  'BLINK_VALUES',
  Number(
    face.leftEyeOpenProbability
  ).toFixed(3),
  Number(
    face.rightEyeOpenProbability
  ).toFixed(3)
);

  setStatus('Blink Both Eyes');
if (
  (face.leftEyeOpenProbability ?? 1) < 0.5 &&
  (face.rightEyeOpenProbability ?? 1) < 0.5
) {
  console.log('BLINK_DETECTED');
  updateStep('SMILE');
}

  break;

      // ── SMILE ──────────────────────────────────────────────────────────────
      case 'SMILE':
        setStatus('Smile 😊');
        if ((face.smilingProbability ?? 0) > .3) {
          updateStep('LEFT');
        }
        break;

      // ── LEFT ───────────────────────────────────────────────────────────────
      // Front camera: user turns LEFT  → yaw becomes POSITIVE (mirrored)
     case 'LEFT':

  setStatus(
    'Turn Head Left ←'
  );

  if (yaw > 25) {
    updateStep('CENTER');
    centerStartRef.current = null;
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

  rightStartRef.current =
    null;

  updateStep('RIGHT');

  centerStartRef.current =
    null;
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
 case 'RIGHT': {

  setStatus(
    'Turn Head Right →'
  );

  if (yaw < -35) {

    if (
      rightStartRef.current === null
    ) {
      rightStartRef.current =
        Date.now();
    }

    const held =
      Date.now() -
      rightStartRef.current;

    if (held > 700) {
      updateStep('VERIFIED');
    }

  } else {

    rightStartRef.current =
      null;
  }

  break;
}

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

navigation.replace(
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

navigation.replace(
  'CapturePhoto',
  {
    mode: 'verify',
    employeeId,
    employeeName,
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

  setFaceCount(0);

  setStatus('No Face');

  if (stepRef.current !== 'BLINK') {
  updateStep('BLINK');
}

  centerStartRef.current =
    null;

  rightStartRef.current =
    null;

  photoCapturedRef.current =
    false;

  verificationSavedRef.current =
    false;

  return;
}


   if (faces.length > 1) {
  setStatus(
    'Multiple Faces Detected - Only One Person Allowed'
  );
  return;
}

 const face = faces[0];

finalFaceBoundsRef.current =
  face.bounds;

/* FIRST CHECK DISTANCE */

const faceWidth: number =
  face.bounds?.width ??
  face.width ??
  face.frameWidth ??
  0;

if (faceWidth > 0 && faceWidth < 250) {

  setStatus(
    'Move Closer 🔍'
  );

  return;
}

/* THEN CHECK POSITION */

/*const faceCenterX =
  face.bounds.x +
  face.bounds.width / 2;

const faceCenterY =
  face.bounds.y +
  face.bounds.height / 2;

const insideGuide =
  faceCenterX > 120 &&
  faceCenterX < 420 &&
  faceCenterY > 250 &&
  faceCenterY < 700;

if (!insideGuide) {

  setStatus(
    `${stepRef.current}: Keep Face Inside Green Oval`
  );

  return;
}
 */


    handleLivenessStep(face).catch(err => {
      console.log('LIVENESS_ERROR', err);
    });

 /*setDebugInfo(
  JSON.stringify({
    step: stepRef.current,
    leftEye: face.leftEyeOpenProbability,
    rightEye: face.rightEyeOpenProbability,
    smile: face.smilingProbability,
    yaw: face.yawAngle,
    pitch: face.pitchAngle,
    roll: face.rollAngle,
    faceWidth: faceWidth,
  }, null, 2)
);*/
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

<View style={styles.faceGuide} />

<View style={styles.overlay}>
        <Text style={styles.text}>{status}</Text>
        <Text style={styles.text}>Faces: {faceCount}</Text>
        <Text style={styles.text}>Step: {stepUi}</Text>
        <Text style={styles.text}>Mode: {mode}</Text>
        <Text style={styles.text}>Employee: {employeeId}</Text>
        <Text style={styles.text}>Name: {employeeName}</Text>
        {/* <Text style={styles.debugText}>{debugInfo}</Text> */}
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
  faceGuide: {
  position: 'absolute',
  width: 260,
  height: 340,
  borderWidth: 4,
  borderColor: 'lime',
  borderRadius: 170,
  alignSelf: 'center',
  top: '22%',
},
});