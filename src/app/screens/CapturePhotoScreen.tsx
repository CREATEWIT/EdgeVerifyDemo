
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import NetInfo from
'@react-native-community/netinfo';
import {
  generateEmbedding,
} from '../../sdk/matching/generateEmbedding';
import {
  getEmployeeById,
} from '../../storage/employeeStorage';

import {
  compareEmbeddings,
} from '../../sdk/matching/compareEmbeddings';

import {
  saveEmployee,
} from '../../storage/employeeStorage';
import React, {
  useState,
} from 'react';
import {
  Camera,
  useCameraDevice,
  usePhotoOutput,
} from 'react-native-vision-camera';

import {
  TouchableOpacity,
} from 'react-native';

export default function CapturePhotoScreen({
  route,
}: any) {
  const employeeId =
    route?.params?.employeeId;
  const mode =
  route?.params?.mode;

console.log(
  'MODE',
  mode
);

  const employeeName =
    route?.params?.employeeName;
  const faceBounds =
  route?.params?.faceBounds;
console.log(
  'CAPTURE_FACE_BOUNDS',
  faceBounds
);

  const device =
    useCameraDevice('front');
 const photoOutput =
  usePhotoOutput();
  const [message, setMessage] =
  useState('READY');

  if (!device) {
    return (
      <View style={styles.center}>
        <Text>
          Loading Camera...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
<Camera
  style={StyleSheet.absoluteFill}
  device={device}
  isActive={true}
  outputs={[photoOutput]}
/>

<View
  style={styles.faceGuide}
/>

      <View style={styles.overlay}
       pointerEvents="box-none"
      >
         <TouchableOpacity
  style={styles.button}
 onPress={async () => {

  console.log(
    'CAPTURE_BUTTON_PRESSED'
  );

  setMessage(
    'CAPTURING...'
  );

try {
if (!faceBounds) {
  setMessage(
    'FACE_NOT_DETECTED'
  );
  return;
}
const startTime = Date.now();

const photo =
  await photoOutput.capturePhoto(
    {},
    {}
  );
  console.log(
  'PHOTO_CAPTURED'
);
console.log(
  'PHOTO_TIME',
  Date.now() - startTime
);

console.log(
  'HAS_PIXEL_BUFFER',
  photo.hasPixelBuffer
);

const pixelBuffer =
  photo.getPixelBuffer();
console.log(
  'PIXEL_BUFFER_OBTAINED'
);

console.log(
  'PIXEL_BUFFER_BYTES',
  pixelBuffer.byteLength
);
let embedding;

try {
  const embeddingStart =
  Date.now();
  embedding =
    await generateEmbedding(
      pixelBuffer,
      faceBounds
    );

  console.log(
    'EMBEDDING_GENERATED'
  );
  console.log(
  'EMBEDDING_TIME',
  Date.now() - embeddingStart
);

} catch (e: any) {

  console.log(
    'EMBEDDING_ERROR',
    e
  );

  setMessage(
    'EMBEDDING_FAILED'
  );

  return;
}


if (
  mode === 'register'
) {

  console.log(
    'BEFORE_SAVE'
  );
try {
  const netState =
  await NetInfo.fetch();

const isOnline =
  netState.isConnected === true;

console.log(
  'NETWORK_STATUS',
  isOnline
);

await saveEmployee({
  employeeId,
  employeeName,
  registeredAt:
    new Date().toISOString(),
  photoWidth:
    photo.width,
  photoHeight:
    photo.height,
  embedding,

  networkMode:
  isOnline
    ? 'ONLINE'
    : 'OFFLINE',

syncStatus:
  isOnline
    ? 'SYNCED'
    : 'PENDING_SYNC',
});

  console.log(
    'AFTER_SAVE'
  );

} catch (e: any) {

  console.log(
    'SAVE_EMPLOYEE_ERROR',
    e
  );

  setMessage(
    e?.message ??
    'SAVE_FAILED'
  );

  return;
}

  setMessage(
    'EMPLOYEE_REGISTERED ✓'
  );

} else if (
  mode === 'verify'
) {

  console.log(
    'VERIFY_MODE'
  );

  const employee =
    await getEmployeeById(
      employeeId
    );

  if (!employee) {

    setMessage(
      'EMPLOYEE_NOT_FOUND'
    );

    return;
  }

  const score =
    compareEmbeddings(
      employee.embedding,
      embedding
    );
  console.log(
  'FINAL_SCORE',
  score
);
setMessage(
  score > 0.80
    ? `VERIFIED ✓ Score: ${score.toFixed(4)}`
    : `VERIFICATION FAILED ✗ Score: ${score.toFixed(4)}`
);

}} catch (error: any) {

  console.log(
    'FULL_ERROR',
    error
  );

  console.log(
    'ERROR_MESSAGE',
    error?.message
  );

  console.log(
    'ERROR_STACK',
    error?.stack
  );

  setMessage(
    error?.message ??
    'CAPTURE_FAILED'
  );
}

}

}
>
  <Text style={styles.buttonText}>
  CAPTURE FACE
</Text>
</TouchableOpacity>
        <Text style={styles.title}>
          Capture Photo
        </Text>
          <Text
  style={{color: 'yellow',fontSize: 20, }}
>
  {message}
</Text>
        <Text style={styles.text}>
          Employee: {employeeId}
        </Text>

        <Text style={styles.text}>
          Name: {employeeName}
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

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },

  text: {
    color: 'white',
    fontSize: 18,
    marginBottom: 8,
  },
  button: {
  backgroundColor: 'green',
  padding: 15,
  borderRadius: 10,
  marginTop: 20,
},

buttonText: {
  color: 'white',
  fontWeight: 'bold',
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