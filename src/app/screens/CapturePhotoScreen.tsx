
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
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
    console.log(
  'CAPTURE_SCREEN_RENDERED'
);
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

      <View style={styles.overlay}
       pointerEvents="box-none"
      >
         <TouchableOpacity
  style={styles.button}
  onPress={async () => {

  setMessage(
    'CAPTURING...'
  );

 try {
const photo =
  await photoOutput.capturePhoto(
    {},
    {}
  );

console.log(
  'HAS_PIXEL_BUFFER',
  photo.hasPixelBuffer
);

const pixelBuffer =
  photo.getPixelBuffer();

console.log(
  'PIXEL_BUFFER_BYTES',
  pixelBuffer.byteLength
);

const bytes =
  new Uint8Array(
    pixelBuffer
  );

console.log(
  'FIRST_20_BYTES',
  Array.from(
    bytes.slice(0, 20)
  )
);

console.log(
  'PIXEL_BUFFER_TYPE',
  typeof pixelBuffer
);

console.log(
  'PIXEL_BUFFER_CONSTRUCTOR',
  pixelBuffer?.constructor?.name
);

console.log(
  'PIXEL_BUFFER_KEYS',
  Object.keys(pixelBuffer || {})
);
const embedding =
  await generateEmbedding(
    pixelBuffer
  );

console.log(
  'EMBEDDING_GENERATED'
);

if (
  mode === 'register'
) {

  console.log(
    'BEFORE_SAVE'
  );
console.log(
  'PIXEL_BUFFER',
  pixelBuffer
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
  });

  console.log(
    'AFTER_SAVE'
  );

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
    'SIMILARITY',
    score
  );

  setMessage(
    score > 0.95
      ? `VERIFIED ✓ ${score.toFixed(4)}`
      : `FAILED ✗ ${score.toFixed(4)}`
  );

}

/*
await saveEmployee({
  employeeId,
  employeeName,
  registeredAt:
    new Date().toISOString(),
  photoWidth:
    photo.width,
  photoHeight:
    photo.height,
});

setMessage(
  'EMPLOYEE_REGISTERED ✓'
);
*/} catch (error) {

  console.log(
    'SAVE_ERROR',
    error
  );

  setMessage(
    String(error)
  );

}

}

}
>
  <Text style={styles.buttonText}>
    PRESS ME
  </Text>
</TouchableOpacity>
        <Text style={styles.title}>
          Capture Photo
        </Text>
        <Text
  style={{
    color: 'yellow',
    fontSize: 16,
    marginBottom: 20,
  }}
>
  {message}
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

});