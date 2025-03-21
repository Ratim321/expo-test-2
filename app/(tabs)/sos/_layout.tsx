import { Tabs } from 'expo-router';
import { TriangleAlert as AlertTriangle, Search, Settings } from 'lucide-react-native';
import Colors from '../../../constants/Colors';

export default function SOSLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.light.card,
          borderBottomWidth: 1,
          borderBottomColor: Colors.light.border,
          elevation: 0,
          shadowOpacity: 0,
          height: 45,
        },
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.subtext,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Medium',
        },
        tabBarIconStyle: {
          display: 'none', // Hide icons to make it cleaner
        },
        tabBarPosition: 'top', // Move tabs to top
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'SOS',
        }}
      />
      <Tabs.Screen
        name="quick-search"
        options={{
          title: 'Quick Search',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'SOS Settings',
        }}
      />
    </Tabs>
  );
}