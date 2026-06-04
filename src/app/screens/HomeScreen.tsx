import React from 'react';
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

    await syncEmployees();

  }}
>
  <Text>
    Sync Employees
  </Text>
</TouchableOpacity>
    </View>
  );
}