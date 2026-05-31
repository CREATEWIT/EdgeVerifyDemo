
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
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

const p: any = photo;

setMessage(
  JSON.stringify(
    {
      width: p.width,
      height: p.height,
      type: p.__type,
    },
    null,
    2
  )
);

console.log(
  'PHOTO_OBJECT',
  p
);

} catch (error) {

  setMessage(
    'ERROR: ' +
    String(error)
  );

}

}}
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