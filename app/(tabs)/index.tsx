import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Search, Navigation, ChevronRight, Car } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [destination, setDestination] = useState('');

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
  }, []);

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
          <Text style={styles.logoText}>RideShare</Text>
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

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MapPin size={20} color="#6C63FF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Where to?"
              value={destination}
              onChangeText={setDestination}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Navigation size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quickRidesSection}>
          <Text style={styles.sectionTitle}>Quick Rides</Text>
          {quickRides.map((ride) => (
            <Link href="/rides" key={ride.id} asChild>
              <TouchableOpacity style={styles.quickRideItem}>
                <View style={styles.quickRideIconContainer}>
                  <Text style={styles.quickRideIcon}>{ride.icon}</Text>
                </View>
                <View style={styles.quickRideInfo}>
                  <Text style={styles.quickRideName}>{ride.name}</Text>
                  <Text style={styles.quickRideArea}>{ride.area}</Text>
                </View>
                <ChevronRight size={20} color="#8E8E93" />
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        <Link href="/offer-ride" asChild>
          <TouchableOpacity style={styles.offerRideButton}>
            <View style={styles.offerRideIconContainer}>
              <Car size={24} color="#6C63FF" />
            </View>
            <View style={styles.offerRideInfo}>
              <Text style={styles.offerRideName}>Offer a Ride</Text>
              <Text style={styles.offerRideDescription}>Share your trip with others</Text>
            </View>
            <ChevronRight size={20} color="#8E8E93" />
          </TouchableOpacity>
        </Link>

        <View style={styles.promoSection}>
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
              <TouchableOpacity style={styles.promoButton}>
                <Text style={styles.promoButtonText}>Invite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#6C63FF',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
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
    borderRadius: 12,
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
    color: '#FF3B30',
    textAlign: 'center',
  },
  loadingText: {
    color: '#8E8E93',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
    color: '#333333',
  },
  searchButton: {
    backgroundColor: '#6C63FF',
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
    color: '#333333',
    marginBottom: 15,
  },
  quickRideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
    color: '#333333',
  },
  quickRideArea: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  offerRideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
    color: '#333333',
  },
  offerRideDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  promoSection: {
    marginTop: 25,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  promoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
    padding: 15,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  promoDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 10,
  },
  promoCodeContainer: {
    backgroundColor: '#F0EFFE',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  promoCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6C63FF',
  },
  promoButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  promoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});