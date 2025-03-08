import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TriangleAlert as AlertTriangle, Phone, Users, MapPin, Shield, Ambulance, Flame } from 'lucide-react-native';
import * as Location from 'expo-location';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeInDown,
} from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import { useToast } from '../../components/ToastProvider';
import AnimatedPressable from '../../components/AnimatedPressable';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://ride.big-matrix.com';

export default function SOSScreen() {
  const [location, setLocation] = useState(null);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [nearbyHelpers, setNearbyHelpers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [alertMode, setAlertMode] = useState('specific'); // 'specific', 'radius', or 'community'
  const { showToast } = useToast();

  const scale = useSharedValue(1);
  const borderWidth = useSharedValue(2);
  const rotation = useSharedValue(0);

  const emergencyContacts = [
    { id: '1', name: 'Police', number: '911', icon: <Shield size={24} color="#FFFFFF" />, backgroundColor: '#3B82F6' },
    { id: '2', name: 'Ambulance', number: '112', icon: <Ambulance size={24} color="#FFFFFF" />, backgroundColor: '#EF4444' },
    { id: '3', name: 'Fire Department', number: '101', icon: <Flame size={24} color="#FFFFFF" />, backgroundColor: '#F59E0B' },
  ];

  const familyContacts = [
    { id: '1', name: 'Mom', number: '+1234567890', image: 'https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: '2', name: 'Dad', number: '+1987654321', image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: '3', name: 'Sister', number: '+1122334455', image: 'https://images.unsplash.com/photo-1535008652995-e95986556e32?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
  ];

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          showToast('Location permission is required for SOS features', 'error');
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
    })();

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

    fetchUsers();
    fetchActiveSOSAlerts();
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

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        showToast('Please log in to fetch users', 'error');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/sos/users/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log("TEST", response);

      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        showToast('Failed to fetch users', 'error');
      }
    } catch (error) {
      showToast('Network error fetching users', 'error');
      console.error('Error:', error);
    }
  };

  const fetchActiveSOSAlerts = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch(`${BASE_URL}/api/sos/active/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log("active", response);
      const data = await response.json();
      if (response.ok) {
        const helpers = data.map(alert => ({
          id: alert.id.toString(),
          name: `${alert.user.first_name} ${alert.user.last_name}`,
          distance: 'Unknown',
          rating: 4.5,
          image: alert.user.profile_photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        }));
        setNearbyHelpers(helpers);
      }
    } catch (error) {
      console.error('Error fetching SOS alerts:', error);
    }
  };

  const triggerEmergencyAlert = async () => {
    if (!location) {
      showToast('Location unavailable. Cannot send SOS.', 'error');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        showToast('Please log in to send SOS', 'error');
        return;
      }

      const payload = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      if (alertMode === 'specific' && selectedUsers.length > 0) {
        payload.notified_users = selectedUsers;
      } else if (alertMode === 'community') {
        payload.is_community_alert = true;
      } // 'radius' mode uses default backend behavior (no extra field)

      console.log('Sending SOS payload:', JSON.stringify(payload));

      const response = await fetch(`${BASE_URL}/api/sos/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      console.log("create", response);
      const data = await response.json();
      console.log('SOS create response:', data);

      if (response.ok) {
        showToast(data.notification_status || 'Emergency alert sent successfully', 'success');
        fetchActiveSOSAlerts();
      } else {
        showToast(data.error || 'Failed to send SOS', 'error');
      }
    } catch (error) {
      showToast('Network error sending SOS', 'error');
      console.error('Error:', error);
    } finally {
      setIsEmergencyActive(false);
      setCountdown(5);
      setSelectedUsers([]);
      setAlertMode('specific'); // Reset to default
      rotation.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );
    }
  };

  const handleSOSPress = () => {
    if (!isEmergencyActive) {
      setShowUserModal(true);
    } else {
      setIsEmergencyActive(false);
      setCountdown(5);
      showToast('Emergency alert cancelled', 'info');
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const confirmSOS = () => {
    if (alertMode === 'specific' && selectedUsers.length === 0) {
      showToast('Please select at least one user', 'error');
      return;
    }
    setShowUserModal(false);
    setIsEmergencyActive(true);
    showToast(`SOS will be triggered in ${countdown} seconds. Tap again to cancel.`, 'info');
  };

  const callEmergencyNumber = (number) => {
    if (Platform.OS === 'web') {
      showToast('Calling is not available on web', 'error');
      return;
    }
    Linking.openURL(`tel:${number}`);
  };

  const sendSMS = (number) => {
    if (Platform.OS === 'web') {
      showToast('SMS is not available on web', 'error');
      return;
    }
    const message = `EMERGENCY: I need help! My location is: ${location ?
      `https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}` :
      'Location not available'}`;
    Linking.openURL(`sms:${number}?body=${encodeURIComponent(message)}`);
  };

  const sosButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderWidth: borderWidth.value,
  }));

  const alertIconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

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
              : 'Tap to select SOS options'}
          </Text>
        </View>

        {nearbyHelpers.length > 0 && (
          <Animated.View
            style={styles.nearbyHelpersSection}
            entering={FadeInDown.delay(300).duration(500)}
          >
            <View style={styles.sectionHeader}>
              <Animated.View style={alertIconAnimatedStyle}>
                <AlertTriangle size={20} color={Colors.light.error} />
              </Animated.View>
              <Text style={styles.sectionTitle}>Nearby Help</Text>
            </View>

            <Text style={styles.helperSubtitle}>
              These people have been notified of an SOS
            </Text>

            {nearbyHelpers.map((helper, index) => (
              <Animated.View
                key={helper.id}
                entering={FadeInDown.delay(400 + index * 100).duration(400)}
              >
                <AnimatedPressable style={styles.helperCard}>
                  <Image source={{ uri: helper.image }} style={styles.helperImage} />
                  <View style={styles.helperInfo}>
                    <Text style={styles.helperName}>{helper.name}</Text>
                    <View style={styles.helperDetails}>
                      <MapPin size={14} color={Colors.light.subtext} />
                      <Text style={styles.helperDistance}>{helper.distance}</Text>
                      <Text style={styles.helperRating}>★ {helper.rating}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => callEmergencyNumber('+1234567890')}
                  >
                    <Phone size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </AnimatedPressable>
              </Animated.View>
            ))}
          </Animated.View>
        )}

        <View style={styles.emergencyContactsSection}>
          <View style={styles.sectionHeader}>
            <Phone size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Emergency Services</Text>
          </View>
          <View style={styles.emergencyContactsGrid}>
            {emergencyContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={[styles.emergencyContactCard, { backgroundColor: contact.backgroundColor }]}
                onPress={() => callEmergencyNumber(contact.number)}
              >
                <View style={styles.emergencyContactIcon}>
                  {contact.icon}
                </View>
                <Text style={styles.emergencyContactName}>{contact.name}</Text>
                <Text style={styles.emergencyContactNumber}>{contact.number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.familyContactsSection}>
          <View style={styles.sectionHeader}>
            <Users size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Family Contacts</Text>
          </View>
          {familyContacts.map((contact) => (
            <AnimatedPressable key={contact.id} style={styles.familyContactCard}>
              <Image source={{ uri: contact.image }} style={styles.familyContactImage} />
              <View style={styles.familyContactInfo}>
                <Text style={styles.familyContactName}>{contact.name}</Text>
                <Text style={styles.familyContactNumber}>{contact.number}</Text>
              </View>
              <View style={styles.familyContactActions}>
                <TouchableOpacity
                  style={[styles.familyContactButton, styles.callFamilyButton]}
                  onPress={() => callEmergencyNumber(contact.number)}
                >
                  <Phone size={16} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.familyContactButton, styles.smsFamilyButton]}
                  onPress={() => sendSMS(contact.number)}
                >
                  <Text style={styles.smsButtonText}>SOS</Text>
                </TouchableOpacity>
              </View>
            </AnimatedPressable>
          ))}
          <TouchableOpacity style={styles.addContactButton}>
            <Text style={styles.addContactButtonText}>+ Add Emergency Contact</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.safetyTipsSection}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Safety Tips</Text>
          </View>
          <View style={styles.safetyTipCard}>
            <Text style={styles.safetyTipTitle}>Stay Calm</Text>
            <Text style={styles.safetyTipText}>
              Take deep breaths and try to remain calm during an emergency situation.
            </Text>
          </View>
          <View style={styles.safetyTipCard}>
            <Text style={styles.safetyTipTitle}>Share Your Location</Text>
            <Text style={styles.safetyTipText}>
              Always share your live location with trusted contacts when traveling.
            </Text>
          </View>
          <View style={styles.safetyTipCard}>
            <Text style={styles.safetyTipTitle}>Use Well-Lit Routes</Text>
            <Text style={styles.safetyTipText}>
              When walking at night, stick to well-lit and populated areas.
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showUserModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUserModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>SOS Options</Text>
            <TouchableOpacity
              style={[
                styles.optionButton,
                alertMode === 'radius' && styles.optionButtonSelected,
              ]}
              onPress={() => {
                setAlertMode('radius');
                setSelectedUsers([]);
              }}
            >
              <Text style={styles.optionText}>Notify Nearby Users (5km)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                alertMode === 'community' && styles.optionButtonSelected,
              ]}
              onPress={() => {
                setAlertMode('community');
                setSelectedUsers([]);
              }}
            >
              <Text style={styles.optionText}>Notify Community</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                alertMode === 'specific' && styles.optionButtonSelected,
              ]}
              onPress={() => setAlertMode('specific')}
            >
              <Text style={styles.optionText}>Select Specific Users</Text>
            </TouchableOpacity>

            {alertMode === 'specific' && (
              <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.userItem,
                      selectedUsers.includes(item.id) && styles.userItemSelected,
                    ]}
                    onPress={() => toggleUserSelection(item.id)}
                  >
                    <Text style={styles.userName}>
                      {item.first_name} {item.last_name}
                    </Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                  </TouchableOpacity>
                )}
                style={styles.userList}
              />
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowUserModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmSOS}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 30,
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
  nearbyHelpersSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  helperSubtitle: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 15,
    fontFamily: 'Inter-Regular',
  },
  helperCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  helperImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  helperInfo: {
    flex: 1,
  },
  helperName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
    fontFamily: 'Inter-Medium',
  },
  helperDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helperDistance: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginLeft: 4,
    marginRight: 10,
    fontFamily: 'Inter-Regular',
  },
  helperRating: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
  callButton: {
    backgroundColor: Colors.light.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyContactsSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  emergencyContactsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  emergencyContactCard: {
    width: '31%',
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  emergencyContactIcon: {
    marginBottom: 10,
  },
  emergencyContactName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: 'Inter-Medium',
  },
  emergencyContactNumber: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  familyContactsSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  familyContactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  familyContactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  familyContactInfo: {
    flex: 1,
  },
  familyContactName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
    fontFamily: 'Inter-Medium',
  },
  familyContactNumber: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
  familyContactActions: {
    flexDirection: 'row',
  },
  familyContactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  callFamilyButton: {
    backgroundColor: Colors.light.primary,
  },
  smsFamilyButton: {
    backgroundColor: Colors.light.error,
  },
  smsButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  addContactButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addContactButtonText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  safetyTipsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  safetyTipCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  safetyTipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 5,
    fontFamily: 'Inter-SemiBold',
  },
  safetyTipText: {
    fontSize: 14,
    color: Colors.light.subtext,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 15,
    fontFamily: 'Inter-SemiBold',
  },
  optionButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: Colors.light.card,
    marginBottom: 10,
  },
  optionButtonSelected: {
    backgroundColor: Colors.light.primary + '20',
  },
  optionText: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  userList: {
    maxHeight: '60%',
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  userItemSelected: {
    backgroundColor: Colors.light.primary + '20',
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  userEmail: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: Colors.light.border,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: Colors.light.text,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  confirmButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});