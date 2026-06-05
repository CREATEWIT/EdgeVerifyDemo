import React, {useState,} from 'react';
import { View,Text,TextInput,TouchableOpacity,} from 'react-native';
export default function
VerifyEmployeeScreen({
  navigation,
}: any) {

  const [employeeId,
  setEmployeeId] =
    useState('');

  return (

    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >

      <Text>
        Enter Employee ID
      </Text>

      <TextInput
        value={employeeId}
        onChangeText={
          setEmployeeId
        }
        style={{
          borderWidth: 1,
          padding: 10,
          marginTop: 10,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={() => {

          navigation.navigate(
            'Verify',
            {
              mode: 'verify',
              employeeId,
            }
          );

        }}
      >

        <Text>
          Start Verification
        </Text>

      </TouchableOpacity>

    </View>

  );

}