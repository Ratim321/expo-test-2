import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronDown, 
  Car as CarIcon, 
  Truck, 
  Bike,
  Bell,
  Chrome as HomeIcon,
  Car,
  TriangleAlert as AlertTriangle,
  Clock as ClockIcon,
  User
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import { useToast } from '../../components/ToastProvider';
import AnimatedPressable from '../../components/AnimatedPressable';

const { width } = Dimensions.get('window');

export default function RidesScreen() {
  const [activeTab, setActiveTab] = useState('create');
  const [startingPoint, setStartingPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicleType, setVehicleType] = useState('car');
  const [gender, setGender] = useState('any');
  const [riders, setRiders] = useState('1 Rider');
  const [notes, setNotes] = useState('');
  const { showToast } = useToast();

  const handleCreateRide = () => {
    if (!startingPoint || !destination || !date || !time) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    showToast('Ride created successfully!', 'success');
    // In a real app, this would save the ride to a database
  };

  const handleSaveDraft = () => {
    showToast('Draft saved successfully!', 'success');
    // In a real app, this would save the ride as a draft
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rides</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Bell size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <User size={20} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'create' && styles.activeTabButton]}
          onPress={() => setActiveTab('create')}
        >
          <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
            Create Ride
          </Text>
          {activeTab === 'create' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'available' && styles.activeTabButton]}
          onPress={() => setActiveTab('available')}
        >
          <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
            Available Rides
          </Text>
          {activeTab === 'available' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'my' && styles.activeTabButton]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
            My Rides
          </Text>
          {activeTab === 'my' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'create' && (
          <Animated.View 
            style={styles.formContainer}
            entering={FadeInDown.delay(300).duration(500)}
          >
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <MapPin size={20} color={Colors.light.subtext} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Starting Point"
                  value={startingPoint}
                  onChangeText={setStartingPoint}
                  placeholderTextColor={Colors.light.subtext}
                />
                <MapPin size={20} color={Colors.light.subtext} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <MapPin size={20} color={Colors.light.subtext} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Destination"
                  value={destination}
                  onChangeText={setDestination}
                  placeholderTextColor={Colors.light.subtext}
                />
                <MapPin size={20} color={Colors.light.subtext} />
              </View>
            </View>

            <View style={styles.dateTimeContainer}>
              <View style={[styles.inputContainer, styles.dateInput]}>
                <TextInput
                  style={styles.input}
                  placeholder="mm/dd/yyyy"
                  value={date}
                  onChangeText={setDate}
                  placeholderTextColor={Colors.light.subtext}
                />
                <Calendar size={20} color={Colors.light.subtext} />
              </View>

              <View style={[styles.inputContainer, styles.timeInput]}>
                <TextInput
                  style={styles.input}
                  placeholder="--:-- --"
                  value={time}
                  onChangeText={setTime}
                  placeholderTextColor={Colors.light.subtext}
                />
                <Clock size={20} color={Colors.light.subtext} />
              </View>
            </View>

            <View style={styles.vehicleTypeContainer}>
              <TouchableOpacity 
                style={[styles.vehicleButton, vehicleType === 'car' && styles.selectedVehicleButton]}
                onPress={() => setVehicleType('car')}
              >
                <CarIcon 
                  size={24} 
                  color={vehicleType === 'car' ? Colors.light.primary : Colors.light.text} 
                />
                <Text style={[styles.vehicleText, vehicleType === 'car' && styles.selectedVehicleText]}>
                  Car
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.vehicleButton, vehicleType === 'cng' && styles.selectedVehicleButton]}
                onPress={() => setVehicleType('cng')}
              >
                <Truck 
                  size={24} 
                  color={vehicleType === 'cng' ? Colors.light.primary : Colors.light.text} 
                />
                <Text style={[styles.vehicleText, vehicleType === 'cng' && styles.selectedVehicleText]}>
                  CNG
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.vehicleButton, vehicleType === 'rickshaw' && styles.selectedVehicleButton]}
                onPress={() => setVehicleType('rickshaw')}
              >
                <Bike 
                  size={24} 
                  color={vehicleType === 'rickshaw' ? Colors.light.primary : Colors.light.text} 
                />
                <Text style={[styles.vehicleText, vehicleType === 'rickshaw' && styles.selectedVehicleText]}>
                  Rickshaw
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.genderContainer}>
              <View style={styles.genderOption}>
                <TouchableOpacity 
                  style={styles.radioButton}
                  onPress={() => setGender('male')}
                >
                  <View style={[styles.radioOuter, gender === 'male' && styles.radioOuterSelected]}>
                    {gender === 'male' && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
                <Text style={styles.genderText}>Male</Text>
              </View>

              <View style={styles.genderOption}>
                <TouchableOpacity 
                  style={styles.radioButton}
                  onPress={() => setGender('female')}
                >
                  <View style={[styles.radioOuter, gender === 'female' && styles.radioOuterSelected]}>
                    {gender === 'female' && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
                <Text style={styles.genderText}>Female</Text>
              </View>

              <View style={styles.genderOption}>
                <TouchableOpacity 
                  style={styles.radioButton}
                  onPress={() => setGender('any')}
                >
                  <View style={[styles.radioOuter, gender === 'any' && styles.radioOuterSelected]}>
                    {gender === 'any' && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
                <Text style={styles.genderText}>Any</Text>
              </View>
            </View>

            <View style={styles.ridersContainer}>
              <Text style={styles.ridersLabel}>Number of Co-Riders</Text>
              <TouchableOpacity style={styles.ridersSelector}>
                <Text style={styles.ridersText}>{riders}</Text>
                <ChevronDown size={20} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <View style={[styles.inputContainer, styles.notesInput]}>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder="Additional Notes (optional)"
                  value={notes}
                  onChangeText={setNotes}
                  placeholderTextColor={Colors.light.subtext}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleCreateRide}
              >
                <Text style={styles.createButtonText}>Create Ride</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.draftButton}
                onPress={handleSaveDraft}
              >
                <Text style={styles.draftButtonText}>Save Draft</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {activeTab === 'available' && (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No available rides at the moment</Text>
          </View>
        )}

        {activeTab === 'my' && (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>You haven't created any rides yet</Text>
          </View>
        )}
        
        {/* Add extra padding at the bottom for the tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* Bottom Tab Bar */}
      <View style={styles.customTabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <HomeIcon size={24} color={Colors.light.subtext} />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <Car size={24} color={Colors.light.primary} />
          <Text style={[styles.tabLabel, styles.activeTabLabel]}>Rides</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <AlertTriangle size={24} color={Colors.light.subtext} />
          <Text style={styles.tabLabel}>SOS</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <ClockIcon size={24} color={Colors.light.subtext} />
          <Text style={styles.tabLabel}>History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <User size={24} color={Colors.light.subtext} />
          <Text style={styles.tabLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 16,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  activeTabButton: {
    backgroundColor: Colors.light.card,
  },
  tabText: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Medium',
  },
  activeTabText: {
    color: Colors.light.primary,
    fontFamily: 'Inter-SemiBold',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: Colors.light.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateInput: {
    width: '48%',
  },
  timeInput: {
    width: '48%',
  },
  vehicleTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  vehicleButton: {
    width: '31%',
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  selectedVehicleButton: {
    borderColor: Colors.light.primary,
    backgroundColor: '#F0EFFE',
  },
  vehicleText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  selectedVehicleText: {
    color: Colors.light.primary,
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  radioButton: {
    marginRight: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.light.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary,
  },
  genderText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  ridersContainer: {
    marginBottom: 16,
  },
  ridersLabel: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  ridersSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  ridersText: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  notesInput: {
    paddingVertical: 8,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  createButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    width: '48%',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  draftButton: {
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    width: '48%',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  draftButtonText: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 80,
  },
  customTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 12,
    color: Colors.light.subtext,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  activeTabLabel: {
    color: Colors.light.primary,
    fontFamily: 'Inter-Medium',
  }
});