import React, { useState } from 'react';
import {
  syncEmployees,
} from '../../sync/syncEmployees';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';


export default function
HomeScreen({
  navigation,
  
}: any) {
  const [syncStatus, setSyncStatus] =
  useState('');

  return (

    <View>

      <Text>
        EdgeVerify SDK Demo
      </Text>

      <TouchableOpacity
        onPress={() =>
         navigation.navigate(
  'VerifyEmployee'
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
  Offline Sync Queue
</Text>
      </TouchableOpacity>
<TouchableOpacity
  onPress={async () => {

  const result =
    await syncEmployees();

  if (result?.success) {

    setSyncStatus(
      `Uploaded ${result.uploaded} employees`
    );

  } else {

    setSyncStatus(
      'SYNC FAILED'
    );

  }

}}
>
  <Text>
    Sync Employees
  </Text>
  <Text>
  {syncStatus}
</Text>
</TouchableOpacity>
    </View>
  );
}