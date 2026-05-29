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
            'Verify'
          )
        }>

        <Text>
          Start Verification
        </Text>

      </TouchableOpacity>

    </View>
  );
}