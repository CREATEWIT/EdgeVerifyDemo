import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,} from 'react-native';
import AsyncStorage from
'@react-native-async-storage/async-storage';
export default function RegisterScreen({
  navigation,
}: any) {
  console.log('REGISTER_SCREEN_RENDERED');
  const [employeeId, setEmployeeId] =
    useState('');

  const [employeeName, setEmployeeName] =
    useState('');
  const [loadedEmployee, setLoadedEmployee] =
  useState('');

 const onCaptureFace = () => {
  navigation.navigate('Verify', {
  mode: 'register',
  employeeId,
  employeeName,
});
};

  const onSave = async () => {

  try {

    const employee = {
      employeeId,
      employeeName,
    };

    await AsyncStorage.setItem(
      'employee',
      JSON.stringify(employee)
    );

    console.log(
      'EMPLOYEE_SAVED'
    );

  } catch (error) {

    console.log(error);

  }

};

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Register Employee
      </Text>

      <TextInput
        placeholder="Employee ID"
        value={employeeId}
        onChangeText={setEmployeeId}
        style={styles.input}
      />

      <TextInput
        placeholder="Employee Name"
        value={employeeName}
        onChangeText={setEmployeeName}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={onCaptureFace}
      >
        <Text style={styles.buttonText}>
          Capture Face
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={onSave}
      >
        <Text style={styles.buttonText}>
          Save Employee
        </Text>
      </TouchableOpacity>
  <TouchableOpacity
  style={styles.button}
  onPress={async () => {

    try {

      const data =
        await AsyncStorage.getItem(
          'employee'
        );

      setLoadedEmployee(
        data ?? 'No employee found'
      );

    } catch{

      setLoadedEmployee(
        'Load failed'
      );

    }

  }}
>
  <Text style={styles.buttonText}>
    Load Employee
  </Text>
</TouchableOpacity>
<Text>
  {loadedEmployee}
</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
  },

  button: {
    backgroundColor: 'green',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },

  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});