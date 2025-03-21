import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Colors from '../../../constants/Colors';
import { useToast } from '../../../components/ToastProvider';

export default function SOSScreen() {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { showToast } = useToast();

  const scale = useSharedValue(1);
  const borderWidth = useSharedValue(2);

  const sosButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderWidth: borderWidth.value,
  }));

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    borderWidth.value = withRepeat(
      withSequence(
        withTiming(6, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(2, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    let interval;
    if (isEmergencyActive && countdown > 0) {
      interval = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0) {
      triggerEmergencyAlert();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEmergencyActive, countdown]);

  const triggerEmergencyAlert = async () => {
    try {
      // Here you would implement the actual SOS alert logic
      showToast('Emergency alert sent successfully!', 'success');
    } catch (error) {
      showToast('Failed to send emergency alert', 'error');
    } finally {
      setIsEmergencyActive(false);
      setCountdown(5);
    }
  };

  const handleSOSPress = () => {
    if (!isEmergencyActive) {
      setIsEmergencyActive(true);
      showToast(`SOS will be triggered in ${countdown} seconds. Tap again to cancel.`, 'info');
    } else {
      setIsEmergencyActive(false);
      setCountdown(5);
      showToast('Emergency alert cancelled', 'info');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emergency SOS</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.sosButtonContainer}>
          <Animated.View
            style={[
              styles.sosButtonOuter,
              sosButtonAnimatedStyle,
              isEmergencyActive && styles.sosButtonOuterActive,
            ]}
          >
            <TouchableOpacity
              style={[
                styles.sosButton,
                isEmergencyActive && styles.sosButtonActive,
              ]}
              onPress={handleSOSPress}
              activeOpacity={0.8}
            >
              {isEmergencyActive ? (
                <Text style={styles.countdownText}>{countdown}</Text>
              ) : (
                <>
                  <AlertTriangle size={40} color="#FFFFFF" />
                  <Text style={styles.sosButtonText}>SOS</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.sosInstructions}>
            {isEmergencyActive
              ? 'Tap again to cancel'
              : 'Tap and hold to trigger SOS'}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>What happens when you press SOS?</Text>
          <Text style={styles.infoText}>
            1. Your emergency contacts will be notified immediately{'\n'}
            2. Your current location will be shared{'\n'}
            3. Nearby emergency services will be alerted{'\n'}
            4. A loud alarm will sound (if enabled)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Inter-SemiBold',
  },
  scrollView: {
    flex: 1,
  },
  sosButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  sosButtonOuter: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: Colors.light.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  sosButtonOuterActive: {
    borderColor: Colors.light.error,
    borderWidth: 6,
  },
  sosButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.error,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  sosButtonActive: {
    backgroundColor: '#FF0000',
  },
  sosButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 5,
    fontFamily: 'Inter-Bold',
  },
  countdownText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  sosInstructions: {
    fontSize: 14,
    color: Colors.light.subtext,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  infoSection: {
    padding: 20,
    backgroundColor: Colors.light.card,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.subtext,
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
});