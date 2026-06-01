import React, { useState } from 'react';
import {
  loadFaceModel,
} from '../../sdk/matching/loadModel';
import {
  generateEmbedding,
} from '../../sdk/matching/generateEmbedding';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

export default function
HomeScreen({
  navigation,
}: any) {
  const [modelStatus,
setModelStatus] =
  useState('');

  return (

    <View>

      <Text>
        EdgeVerify SDK Demo
      </Text>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            'Verify',
            {
              mode: 'verify',
            }
          )
        }
      >
        <Text>
          Start Verification
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            'Register'
          )
        }
      >
        <Text>
          Register Employee
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            'Employees'
          )
        }
      >
        <Text>
          View Employees
        </Text>
      </TouchableOpacity>
   <TouchableOpacity
  onPress={async () => {

    try {

      setModelStatus(
        'LOADING MODEL...'
      );

  const model =
  await loadFaceModel();

setModelStatus(
  JSON.stringify(
    {
      inputs: model.inputs,
      outputs: model.outputs,
    },
    null,
    2
  )
);

    } catch (error) {

      setModelStatus(
        'ERROR: ' +
        String(error)
      );

    }

  }}
>

  <Text>
    Load Model
  </Text>

</TouchableOpacity>
<TouchableOpacity
  onPress={async () => {

    try {

      const result =
  await generateEmbedding();

setModelStatus(
  JSON.stringify(
    result,
    null,
    2
  )
);

    } catch (error) {

      setModelStatus(
        'ERROR: ' +
        String(error)
      );

    }

  }}
>

  <Text>
    Run Model
  </Text>

</TouchableOpacity>
   <Text>
  {modelStatus}
</Text>

    </View>
  );
}