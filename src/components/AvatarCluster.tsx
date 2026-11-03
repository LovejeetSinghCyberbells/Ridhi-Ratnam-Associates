import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Text } from 'react-native';
import { colors, borderRadius } from '../theme';

export const AvatarCluster: React.FC = () => {
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(floatAnim1, {
            toValue: -5,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim2, {
            toValue: 5,
            duration: 2200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(floatAnim1, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim2, {
            toValue: 0,
            duration: 2200,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [floatAnim1, floatAnim2]);

  return (
    <View style={styles.container}>
      {/* Surrounding Floating Avatar Circles (Matching shapes.inc Screen 2) */}
      <Animated.View
        style={[
          styles.orbitCircle,
          styles.circleTopLeft,
          { transform: [{ translateY: floatAnim1 }] },
        ]}
      >
        <Text style={styles.orbitEmoji}>👤</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.orbitCircle,
          styles.circleTopRight,
          { transform: [{ translateY: floatAnim2 }] },
        ]}
      >
        <Text style={styles.orbitEmoji}>💼</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.orbitCircle,
          styles.circleBottomLeft,
          { transform: [{ translateY: floatAnim2 }] },
        ]}
      >
        <Text style={styles.orbitEmoji}>📈</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.orbitCircle,
          styles.circleBottomRight,
          { transform: [{ translateY: floatAnim1 }] },
        ]}
      >
        <Text style={styles.orbitEmoji}>🛡️</Text>
      </Animated.View>

      {/* Central Brand Logo Card (shapes.inc central icon) */}
      <View style={styles.centralLogoCard}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 220,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  centralLogoCard: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#F1F3F6',
    zIndex: 10,
  },
  logoImage: {
    width: 75,
    height: 48,
  },
  orbitCircle: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
  },
  orbitEmoji: {
    fontSize: 18,
  },
  circleTopLeft: {
    top: 6,
    left: 20,
    backgroundColor: '#F3F6FD',
  },
  circleTopRight: {
    top: 10,
    right: 20,
    backgroundColor: '#FEF9EE',
  },
  circleBottomLeft: {
    bottom: 8,
    left: 24,
    backgroundColor: '#ECFDF5',
  },
  circleBottomRight: {
    bottom: 6,
    right: 22,
    backgroundColor: '#FDF2F8',
  },
});

