import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

export default function VerifyScreen({
  navigation,
}: any) {

  return (

    <View>

      <Text>
        Verification Screen
      </Text>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            'Result'
          )
        }
      >

        <Text>
          Mock Verify
        </Text>

      </TouchableOpacity>

    </View>

  );
}