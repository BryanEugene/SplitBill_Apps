import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';

const Loading = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        {/* <LottieView
          source={require('../assets/animations/loading.json')}
          autoPlay
          loop
          style={styles.animation}
        /> */}
        <Text style={styles.loadingText}>Just a moment...</Text>
        <Text style={styles.subText}>We're setting things up for you</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5B37B7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
  loadingText: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default Loading;
