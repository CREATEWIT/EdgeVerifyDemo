import React from 'react';

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

    </View>
  );
}