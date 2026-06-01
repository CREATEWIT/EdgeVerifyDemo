import React from 'react';
import EmployeeListScreen
from '../screens/EmployeeListScreen';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import VerifyScreen from '../screens/VerifyScreen';
import CapturePhotoScreen from '../screens/CapturePhotoScreen';
import ResultScreen from '../screens/ResultScreen';

const Stack =
  createNativeStackNavigator();

export default function AppNavigator() {

  return (
    <NavigationContainer>

      <Stack.Navigator
        initialRouteName="Home"
      >

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'EdgeVerify',
          }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            title: 'Register Employee',
          }}
        />

        <Stack.Screen
          name="Verify"
          component={VerifyScreen}
          options={{
            title: 'Verify Employee',
          }}
        />

        <Stack.Screen
          name="CapturePhoto"
          component={CapturePhotoScreen}
          options={{
            title: 'Capture Face',
          }}
        />

        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{
            title: 'Verification Result',
          }}
        />
        <Stack.Screen
  name="Employees"
  component={EmployeeListScreen}
/>
      </Stack.Navigator>

    </NavigationContainer>
  );
}