import { Stack } from 'expo-router';

export default function RideFeaturesLayout() {  // Update the function name
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="chat" 
        options={{ 
          title: 'Ride Chat',
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
          },
          headerBackTitleVisible: false,
        }} 
      />
    </Stack>
  );
}