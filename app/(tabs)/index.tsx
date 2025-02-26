import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Search, Navigation, ChevronRight, Car } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Link } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  Easing
} from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import Logo from '../../components/Logo';
import AnimatedPressable from '../../components/AnimatedPressable';

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [destination, setDestination] = useState('');
  
  // Animation values
  const searchBarScale = useSharedValue(1);
  const mapOpacity = useSharedValue(0.8);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
    })();
    
    // Start subtle animations
    mapOpacity.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const mapAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: mapOpacity.value
    };
  });

  const searchBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: searchBarScale.value }]
    };
  });

  const handleSearchFocus = () => {
    searchBarScale.value = withTiming(1.02, { duration: 200 });
  };

  const handleSearchBlur = () => {
    searchBarScale.value = withTiming(1, { duration: 200 });
  };

  const quickRides = [
    {
      id: '1',
      name: 'University Campus',
      area: 'North Campus',
      icon: '🏫',
    },
    {
      id: '2',
      name: 'Downtown',
      area: 'City Center',
      icon: '🏙️',
    },
    {
      id: '3',
      name: 'Shopping Mall',
      area: 'Commercial Area',
      icon: '🛍️',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.mapContainer}>
          {location ? (
            <Animated.View style={[styles.mapWrapper, mapAnimatedStyle]}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  title="Your Location"
                />
              </MapView>
            </Animated.View>
          ) : (
            <View style={[styles.map, styles.mapPlaceholder]}>
              {errorMsg ? (
                <Text style={styles.errorText}>{errorMsg}</Text>
              ) : (
                <Text style={styles.loadingText}>Loading map...</Text>
              )}
            </View>
          )}
        </View>

        <Animated.View 
          style={styles.searchContainer}
          entering={FadeInDown.delay(300).duration(500)}
        >
          <Animated.View style={[styles.searchBar, searchBarAnimatedStyle]}>
            <MapPin size={20} color={Colors.light.primary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Where to?"
              value={destination}
              onChangeText={setDestination}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              placeholderTextColor={Colors.light.subtext}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Navigation size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        <Animated.View 
          style={styles.quickRidesSection}
          entering={FadeInDown.delay(400).duration(500)}
        >
          <Text style={styles.sectionTitle}>Quick Rides</Text>
          {quickRides.map((ride, index) => (
            <Animated.View 
              key={ride.id}
              entering={FadeInRight.delay(500 + index * 100).duration(400)}
            >
              <Link href="/rides" asChild>
                <AnimatedPressable style={styles.quickRideItem}>
                  <View style={styles.quickRideIconContainer}>
                    <Text style={styles.quickRideIcon}>{ride.icon}</Text>
                  </View>
                  <View style={styles.quickRideInfo}>
                    <Text style={styles.quickRideName}>{ride.name}</Text>
                    <Text style={styles.quickRideArea}>{ride.area}</Text>
                  </View>
                  <ChevronRight size={20} color={Colors.light.subtext} />
                </AnimatedPressable>
              </Link>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(700).duration(500)}>
          <Link href="/offer-ride" asChild>
            <AnimatedPressable style={styles.offerRideButton}>
              <View style={styles.offerRideIconContainer}>
                <Car size={24} color={Colors.light.primary} />
              </View>
              <View style={styles.offerRideInfo}>
                <Text style={styles.offerRideName}>Offer a Ride</Text>
                <Text style={styles.offerRideDescription}>Share your trip with others</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.subtext} />
            </AnimatedPressable>
          </Link>
        </Animated.View>

        <Animated.View 
          style={styles.promoSection}
          entering={FadeInDown.delay(800).duration(500)}
        >
          <Text style={styles.sectionTitle}>Invite Friends & Get Discount</Text>
          <View style={styles.promoCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }}
              style={styles.promoImage}
            />
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>Invite on Ride</Text>
              <Text style={styles.promoDescription}>
                Share this code with friends & family members
              </Text>
              <View style={styles.promoCodeContainer}>
                <Text style={styles.promoCode}>RIDE2023</Text>
              </View>
              <AnimatedPressable style={styles.promoButton}>
                <Text style={styles.promoButtonText}>Invite</Text>
              </AnimatedPressable>
            </View>
          </View>
        </Animated.View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.primary,
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
  mapContainer: {
    height: 200,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mapWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    backgroundColor: '#E1E4E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.light.error,
    textAlign: 'center',
  },
  loadingText: {
    color: Colors.light.subtext,
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  searchButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    padding: 8,
  },
  quickRidesSection: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 15,
    fontFamily: 'Inter-SemiBold',
  },
  quickRideItem: {
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
    elevation: 1,
  },
  quickRideIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0EFFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  quickRideIcon: {
    fontSize: 20,
  },
  quickRideInfo: {
    flex: 1,
  },
  quickRideName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  quickRideArea: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  offerRideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  offerRideIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0EFFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  offerRideInfo: {
    flex: 1,
  },
  offerRideName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  offerRideDescription: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  promoSection: {
    marginTop: 25,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  promoCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  promoImage: {
    width: '100%',
    height: 120,
  },
  promoContent: {
    padding: 20,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 5,
    fontFamily: 'Inter-SemiBold',
  },
  promoDescription: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 15,
    fontFamily: 'Inter-Regular',
  },
  promoCodeContainer: {
    backgroundColor: '#F0EFFE',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  promoCode: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 1,
  },
  promoButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  promoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});