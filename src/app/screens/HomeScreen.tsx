import React, { useState } from 'react';
import {syncEmployees,} from '../../sync/syncEmployees';
import {View,Text,TouchableOpacity,} from 'react-native';
export default function
HomeScreen({
  navigation,
  
}: any) {
  const [syncStatus, setSyncStatus] =
  useState('');

  return (

    <View>

     <Text>
  EdgeVerify
</Text>

<Text>
  Offline Personnel Authentication
</Text>

      <TouchableOpacity
        onPress={() =>
         navigation.navigate(
  'VerifyEmployee'
)
        }
      >
        <Text>
          Verify Personnel
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
          Register Personnel
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
 Local Records Queue
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
    Sync & Purge
  </Text>
  <Text>
  {syncStatus}
</Text>
</TouchableOpacity>
    </View>
  );
}