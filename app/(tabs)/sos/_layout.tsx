import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell, User } from 'lucide-react-native';
import Colors from '../../../constants/Colors';

export default function SOSLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true, // Show a custom header
        header: () => (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>SOS</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.headerIcon}>
                <Bell size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton}>
                <User size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        ),
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // White background to match the screenshot
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB', // Light gray border
          elevation: 0,
          shadowOpacity: 0,
          height: 50,
          paddingTop: 5,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: '#3B82F6', // Blue color for active tab
        tabBarInactiveTintColor: '#6B7280', // Gray color for inactive tabs
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: 'Inter-Medium',
          paddingBottom: 8,
        },
        tabBarPosition: 'top',
      }}
      tabBar={({ state, descriptors, navigation }) => (
        <View style={styles.tabsContainer}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel || options.title || route.name;
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                style={[styles.tabButton, isFocused && styles.activeTabButton]}
                onPress={onPress}
              >
                <Text
                  style={[styles.tabText, isFocused && styles.activeTabText]}
                >
                  {label}
                </Text>
                {isFocused && <View style={styles.activeTabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'SOS',
          tabBarLabel: 'SOS',
        }}
      />
      <Tabs.Screen
        name="quick-search"
        options={{
          title: 'Quick Search',
          tabBarLabel: 'Quick Search',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'SOS Settings',
          tabBarLabel: 'Settings',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF', // White background to match the screenshot
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // Light gray border
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937', // Dark gray for text
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
    backgroundColor: '#FFFFFF', // White background to match the screenshot
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // Light gray border
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  activeTabButton: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280', // Gray color for inactive tabs
    fontFamily: 'Inter-Medium',
  },
  activeTabText: {
    color: '#3B82F6', // Blue color for active tab
    fontFamily: 'Inter-SemiBold',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: '#3B82F6', // Blue underline for active tab
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});