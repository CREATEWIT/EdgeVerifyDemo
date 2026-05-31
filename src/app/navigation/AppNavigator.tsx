import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator }
from '@react-navigation/native-stack';

import HomeScreen
from '../screens/HomeScreen';

import VerifyScreen
from '../screens/VerifyScreen';

import ResultScreen
from '../screens/ResultScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CapturePhotoScreen from '../screens/CapturePhotoScreen';

const Stack =
  createNativeStackNavigator();

export default function
AppNavigator() {

  return (

    <NavigationContainer>

      <Stack.Navigator>

        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        <Stack.Screen
          name="Verify"
          component={VerifyScreen}
        />

        <Stack.Screen
          name="Result"
          component={ResultScreen}
        />
         <Stack.Screen
  name="Register"
  component={RegisterScreen}
/>
<Stack.Screen
  name="CapturePhoto"
  component={CapturePhotoScreen}
/>
      </Stack.Navigator>

    </NavigationContainer>

  );
}