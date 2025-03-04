






import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Platform,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, MapPin, Flag, Clock, ChevronRight, Bell, Chrome as HomeIcon, Car, TriangleAlert as AlertTriangle, Clock as ClockIcon, User } from 'lucide-react-native';
import { Link } from 'expo-router';
import Animated, { 
  FadeInDown
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';

import AnimatedPressable from '../../components/AnimatedPressable';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  
  const recentActivity = [
    {
      id: '1',
      title: 'Downtown',
      subtitle: 'Autumn Park',
      icon: '🏙️',
      time: '2 days ago'
    }
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Hello, John!</Text>
          <Text style={styles.readyText}>Ready to ride?</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={styles.searchContainer}
          entering={FadeInDown.delay(300).duration(500)}
        >
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.light.subtext} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search rides by destination name..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor={Colors.light.subtext}
            />
          </View>
        </Animated.View>

        <Animated.View 
          style={styles.quickActionsContainer}
          entering={FadeInDown.delay(400).duration(500)}
        >
          <AnimatedPressable style={styles.quickActionButton}>
            <View style={styles.quickActionIconContainer}>
              <Search size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.quickActionText}>Find a Ride</Text>
          </AnimatedPressable>
          
          <AnimatedPressable style={styles.quickActionButton}>
            <View style={styles.quickActionIconContainer}>
              <Plus size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.quickActionText}>Create a Ride</Text>
          </AnimatedPressable>
          
          <AnimatedPressable style={styles.quickActionButton}>
            <View style={styles.quickActionIconContainer}>
              <MapPin size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.quickActionText}>Saved</Text>
          </AnimatedPressable>
          
          <AnimatedPressable style={styles.quickActionButton}>
            <View style={styles.quickActionIconContainer}>
              <Flag size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.quickActionText}>Report Issue</Text>
          </AnimatedPressable>
        </Animated.View>

        <Animated.View 
          style={styles.sectionContainer}
          entering={FadeInDown.delay(500).duration(500)}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>Show All</Text>
            </TouchableOpacity>
          </View>
          
          {recentActivity.map((activity) => (
            <AnimatedPressable key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Text style={styles.activityIcon}>{activity.icon}</Text>
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
              </View>
              <View style={styles.activityTimeContainer}>
                <Clock size={14} color={Colors.light.subtext} />
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </AnimatedPressable>
          ))}
        </Animated.View>

        <Animated.View 
          style={styles.sectionContainer}
          entering={FadeInDown.delay(600).duration(500)}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Rides</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>Map View</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>Map View</Text>
          </View>
        </Animated.View>

        <Animated.View 
          style={styles.sectionContainer}
          entering={FadeInDown.delay(700).duration(500)}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>
          
          <AnimatedPressable style={styles.notificationItem}>
            <View style={styles.notificationIconContainer}>
              <Bell size={20} color="#FFFFFF" />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>New ride alerts found!</Text>
              <Text style={styles.notificationSubtitle}>Compare 3 routes to Downtown</Text>
            </View>
            <ChevronRight size={20} color={Colors.light.subtext} />
          </AnimatedPressable>
        </Animated.View>
        
        {/* Add extra padding at the bottom for the tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* Bottom Tab Bar */}
      <View style={styles.customTabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <HomeIcon size={24} color={Colors.light.primary} />
          <Text style={[styles.tabLabel, styles.activeTabLabel]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <Car size={24} color={Colors.light.subtext} />
          <Text style={styles.tabLabel}>Rides</Text>
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
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Inter-SemiBold',
  },
  readyText: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  quickActionButton: {
    width: (width - 40) / 2,
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    height: 90,
  },
  quickActionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0EFFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Inter-SemiBold',
  },
  sectionAction: {
    fontSize: 14,
    color: Colors.light.primary,
    fontFamily: 'Inter-Medium',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0EFFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIcon: {
    fontSize: 18,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  activitySubtitle: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  activityTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityTime: {
    fontSize: 12,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  mapPlaceholder: {
    height: 180,
    backgroundColor: '#E1E4E8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Medium',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  notificationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  notificationSubtitle: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
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