import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Clock, DollarSign, ChevronRight } from 'lucide-react-native';

export default function HistoryScreen() {
  const rideHistory = [
    {
      id: '1',
      type: 'passenger',
      from: 'University Campus',
      to: 'Downtown',
      date: 'May 15, 2025',
      time: '10:30 AM',
      price: '$5.50',
      driver: {
        name: 'John Doe',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
      },
      status: 'completed',
    },
    {
      id: '2',
      type: 'driver',
      from: 'Shopping Mall',
      to: 'Residential Area',
      date: 'May 12, 2025',
      time: '2:15 PM',
      price: '$12.75',
      passengers: 3,
      status: 'completed',
    },
    {
      id: '3',
      type: 'passenger',
      from: 'Airport',
      to: 'Hotel Zone',
      date: 'May 10, 2025',
      time: '8:45 PM',
      price: '$15.00',
      driver: {
        name: 'Sarah Johnson',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
      },
      status: 'cancelled',
    },
    {
      id: '4',
      type: 'driver',
      from: 'Home',
      to: 'Office',
      date: 'May 8, 2025',
      time: '8:30 AM',
      price: '$18.00',
      passengers: 2,
      status: 'completed',
    },
  ];

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <View style={styles.historyTypeContainer}>
          <Text style={styles.historyTypeText}>
            {item.type === 'driver' ? 'You drove' : 'You rode'}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'completed' ? '#E1F5E1' : '#FFE5E5' }]}>
            <Text style={[styles.statusText, { color: item.status === 'completed' ? '#34C759' : '#FF3B30' }]}>
              {item.status === 'completed' ? 'Completed' : 'Cancelled'}
            </Text>
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

      <View style={styles.historyDetails}>
        <View style={styles.historyDetailItem}>
          <Clock size={16} color="#8E8E93" />
          <Text style={styles.historyDetailText}>{item.time}, {item.date}</Text>
        </View>
      </View>

      {item.type === 'passenger' && item.driver && (
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
      )}

      {item.type === 'driver' && (
        <View style={styles.passengerInfo}>
          <Text style={styles.passengerCount}>{item.passengers} passengers</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={rideHistory}
        renderItem={renderHistoryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}