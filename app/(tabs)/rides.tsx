import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Clock, Users, ChevronRight, Filter } from 'lucide-react-native';

export default function RidesScreen() {
  const [activeTab, setActiveTab] = useState('available');

  const availableRides = [
    {
      id: '1',
      driver: {
        name: 'John Doe',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
      },
      from: 'University Campus',
      to: 'Downtown',
      time: '10:30 AM',
      date: 'Today',
      price: '$5.50',
      seats: {
        total: 4,
        available: 2,
      },
      vehicle: 'Toyota Corolla',
    },
    {
      id: '2',
      driver: {
        name: 'Sarah Johnson',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
      },
      from: 'Shopping Mall',
      to: 'Residential Area',
      time: '2:15 PM',
      date: 'Today',
      price: '$4.25',
      seats: {
        total: 4,
        available: 3,
      },
      vehicle: 'Honda Civic',
    },
    {
      id: '3',
      driver: {
        name: 'Michael Brown',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
      },
      from: 'City Center',
      to: 'Airport',
      time: '5:45 PM',
      date: 'Tomorrow',
      price: '$12.00',
      seats: {
        total: 4,
        available: 1,
      },
      vehicle: 'Nissan Altima',
    },
  ];

  const myRides = [
    {
      id: '4',
      driver: {
        name: 'You',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
      },
      from: 'Home',
      to: 'Office',
      time: '8:30 AM',
      date: 'Tomorrow',
      price: '$6.00',
      seats: {
        total: 4,
        available: 3,
      },
      vehicle: 'Your Car',
      status: 'scheduled',
    },
  ];

  const renderRideItem = ({ item }) => (
    <TouchableOpacity style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <View style={styles.driverInfo}>
          <Image source={{ uri: item.driver.image }} style={styles.driverImage} />
          <View>
            <Text style={styles.driverName}>{item.driver.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{item.driver.rating}</Text>
              <Text style={styles.ratingStars}>★★★★★</Text>
            </View>
          </View>
        </View>
        <Text style={styles.priceText}>{item.price}</Text>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routePoints}>
          <View style={styles.routePointDot} />
          <View style={styles.routeLine} />
          <View style={[styles.routePointDot, styles.routePointDotDestination]} />
        </View>
        <View style={styles.routeDetails}>
          <View style={styles.routePoint}>
            <Text style={styles.routePointText}>{item.from}</Text>
          </View>
          <View style={styles.routePoint}>
            <Text style={styles.routePointText}>{item.to}</Text>
          </View>
        </View>
      </View>

      <View style={styles.rideDetails}>
        <View style={styles.rideDetailItem}>
          <Clock size={16} color="#8E8E93" />
          <Text style={styles.rideDetailText}>{item.time}, {item.date}</Text>
        </View>
        <View style={styles.rideDetailItem}>
          <Users size={16} color="#8E8E93" />
          <Text style={styles.rideDetailText}>{item.seats.available} seats available</Text>
        </View>
      </View>

      <View style={styles.rideFooter}>
        <Text style={styles.vehicleText}>{item.vehicle}</Text>
        {activeTab === 'available' ? (
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join Ride</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: item.status === 'scheduled' ? '#6C63FF' : '#FF3B30' }]}>
              {item.status === 'scheduled' ? 'Scheduled' : 'Cancelled'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Rides</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'available' && styles.activeTabButton]}
          onPress={() => setActiveTab('available')}
        >
          <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>Available Rides</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'my' && styles.activeTabButton]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>My Rides</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'available' ? availableRides : myRides}
        renderItem={renderRideItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ridesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No rides available</Text>
          </View>
        }
      />
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  filterButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#6C63FF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#6C63FF',
  },
  ridesList: {
    padding: 20,
  },
  rideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 5,
  },
  ratingStars: {
    fontSize: 12,
    color: '#FFD700',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6C63FF',
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  routePoints: {
    width: 20,
    alignItems: 'center',
    marginRight: 10,
  },
  routePointDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6C63FF',
  },
  routePointDotDestination: {
    backgroundColor: '#FF3B30',
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: '#E0E0E0',
    marginVertical: 5,
  },
  routeDetails: {
    flex: 1,
  },
  routePoint: {
    height: 25,
    justifyContent: 'center',
    marginBottom: 5,
  },
  routePointText: {
    fontSize: 15,
    color: '#333333',
  },
  rideDetails: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  rideDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  rideDetailText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 5,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 15,
  },
  vehicleText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  joinButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  statusContainer: {
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});