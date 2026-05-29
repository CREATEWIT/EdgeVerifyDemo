import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function ResultScreen({
  navigation,
}: any) {

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Verification Result
      </Text>

      <Text style={styles.result}>
        Verified ✓
      </Text>

      <Text style={styles.info}>
        Confidence: 95%
      </Text>

      <Text style={styles.info}>
        Mode: Offline
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate(
            'Home'
          )
        }
      >

        <Text style={styles.buttonText}>
          Back To Home
        </Text>

      </TouchableOpacity>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },

  result: {
    fontSize: 22,
    fontWeight: '600',
    color: 'green',
    marginBottom: 16,
  },

  info: {
    fontSize: 18,
    marginBottom: 8,
  },

  button: {
    marginTop: 30,
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },

  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },

});