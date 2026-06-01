import React, {
  useState,
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import {
  getEmployees,
} from '../../storage/employeeStorage';

export default function
HomeScreen({
  navigation,
}: any) {

  const [employeesText,
  setEmployeesText] =
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
        onPress={async () => {

          const employees =
            await getEmployees();

          setEmployeesText(
            JSON.stringify(
              employees,
              null,
              2
            )
          );

        }}
      >

        <Text>
          Show Employees
        </Text>

      </TouchableOpacity>

      <Text>
        {employeesText}
      </Text>

    </View>
  );
}