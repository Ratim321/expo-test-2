import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Clock, Users, ChevronRight, Filter, Calendar, Car, DollarSign, ChevronDown } from 'lucide-react-native';
import { useToast } from '../../components/ToastProvider';
import Animated, { FadeInUp } from 'react-native-reanimated';
import AnimatedPressable from '../../components/AnimatedPressable';
import Colors from '../../constants/Colors';
import { router } from 'expo-router';

export default function RidesScreen() {
  const [activeTab, setActiveTab] = useState('available');
  const { showToast } = useToast();
  
  // Form state for offer ride
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState('4');
  const [price, setPrice] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [notes, setNotes] = useState('');
  
  const [availableRides, setAvailableRides] = useState([
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
      joined: false,
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
      joined: false,
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
      joined: false,
    },
  ]);

  const [myRides, setMyRides] = useState([
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
  ]);
  
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

  const handleJoinRide = (id: string) => {
    // Update the ride status
    setAvailableRides(prevRides => 
      prevRides.map(ride => {
        if (ride.id === id) {
          // If already joined, cancel the ride
          if (ride.joined) {
            showToast(`Cancelled ride to ${ride.to}`, 'info');
            return {
              ...ride,
              joined: false,
              seats: {
                ...ride.seats,
                available: ride.seats.available + 1
              }
            };
          } else {
            // If seats are available, join the ride
            if (ride.seats.available > 0) {
              // Add to my rides
              const newRide = {
                id: `joined-${ride.id}`,
                driver: ride.driver,
                from: ride.from,
                to: ride.to,
                time: ride.time,
                date: ride.date,
                price: ride.price,
                seats: {
                  total: 1,
                  available: 0,
                },
                vehicle: ride.vehicle,
                status: 'scheduled',
              };
              
              setMyRides(prev => [...prev, newRide]);
              
              showToast(`Successfully joined ride to ${ride.to}`, 'success');
              return {
                ...ride,
                joined: true,
                seats: {
                  ...ride.seats,
                  available: ride.seats.available - 1
                }
              };
            } else {
              // No seats available
              showToast('No seats available for this ride', 'error');
              return ride;
            }
          }
        }
        return ride;
      })
    );
  };
  
  const handleCreateRide = () => {
    // In a real app, this would save the ride to a database
    showToast('Ride created successfully!', 'success');
    setActiveTab('my');
    
    // Add the new ride to myRides
    const newRide = {
      id: `new-${Date.now()}`,
      driver: {
        name: 'You',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
      },
      from: from || 'Home',
      to: to || 'Office',
      time: time || '9:00 AM',
      date: date || 'Tomorrow',
      price: price || '$10.00',
      seats: {
        total: parseInt(seats) || 4,
        available: parseInt(seats) || 4,
      },
      vehicle: vehicle || 'Your Car',
      status: 'scheduled',
    };
    
    setMyRides(prev => [newRide, ...prev]);
    
    // Reset form
    setFrom('');
    setTo('');
    setDate('');
    setTime('');
    setSeats('4');
    setPrice('');
    setVehicle('');
    setNotes('');
  };

  const renderAvailableRideItem = ({ item, index }) => (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(400)}>
      <AnimatedPressable style={styles.rideCard}>
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
            <Clock size={16} color={Colors.light.subtext} />
            <Text style={styles.rideDetailText}>{item.time}, {item.date}</Text>
          </View>
          <View style={styles.rideDetailItem}>
            <Users size={16} color={Colors.light.subtext} />
            <Text style={styles.rideDetailText}>{item.seats.available} seats available</Text>
          </View>
        </View>

        <View style={styles.rideFooter}>
          <Text style={styles.vehicleText}>{item.vehicle}</Text>
          <TouchableOpacity 
            style={[
              styles.joinButton, 
              item.joined && styles.joinedButton,
              item.seats.available === 0 && !item.joined && styles.disabledButton
            ]}
            onPress={() => handleJoinRide(item.id)}
            disabled={item.seats.available === 0 && !item.joined}
          >
            <Text style={styles.joinButtonText}>
              {item.joined ? 'Cancel' : 'Join Ride'}
            </Text>
          </TouchableOpacity>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
  
  const renderMyRideItem = ({ item, index }) => (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(400)}>
      <AnimatedPressable style={styles.rideCard}>
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
            <Clock size={16} color={Colors.light.subtext} />
            <Text style={styles.rideDetailText}>{item.time}, {item.date}</Text>
          </View>
          <View style={styles.rideDetailItem}>
            <Users size={16} color={Colors.light.subtext} />
            <Text style={styles.rideDetailText}>{item.seats.available} seats available</Text>
          </View>
        </View>

        <View style={styles.rideFooter}>
          <Text style={styles.vehicleText}>{item.vehicle}</Text>
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: item.status === 'scheduled' ? Colors.light.primary : Colors.light.error }]}>
              {item.status === 'scheduled' ? 'Scheduled' : 'Cancelled'}
            </Text>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
  
  const renderHistoryItem = ({ item, index }) => (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(400)}>
      <AnimatedPressable style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <View style={styles.historyTypeContainer}>
            <Text style={styles.historyTypeText}>
              {item.type === 'driver' ? 'You drove' : 'You rode'}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: item.status === 'completed' ? '#E1F5E1' : '#FFE5E5' }]}>
              <Text style={[styles.statusText, { color: item.status === 'completed' ? Colors.light.success : Colors.light.error }]}>
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
            <Clock size={16} color={Colors.light.subtext} />
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
      </AnimatedPressable>
    </Animated.View>
  );
  
  const renderOfferRideForm = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Route Information</Text>
        
        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <MapPin size={20} color={Colors.light.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="From"
              value={from}
              onChangeText={setFrom}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <MapPin size={20} color="#FF3B30" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="To"
              value={to}
              onChangeText={setTo}
            />
          </View>
        </View>

        <View style={styles.rowInputs}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <View style={styles.inputContainer}>
              <Calendar size={20} color={Colors.light.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Date"
                value={date}
                onChangeText={setDate}
              />
            </View>
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <View style={styles.inputContainer}>
              <Clock size={20} color={Colors.light.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Time"
                value={time}
                onChangeText={setTime}
              />
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Ride Details</Text>

        <View style={styles.rowInputs}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <View style={styles.inputContainer}>
              <Users size={20} color={Colors.light.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Available Seats"
                value={seats}
                onChangeText={setSeats}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.dropdownButton}>
                <ChevronDown size={16} color="#8E8E93" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <View style={styles.inputContainer}>
              <DollarSign size={20} color={Colors.light.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Price per Seat"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <Car size={20} color={Colors.light.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Vehicle (e.g., Toyota Corolla)"
              value={vehicle}
              onChangeText={setVehicle}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <TextInput
              style={styles.textArea}
              placeholder="Additional Notes (Optional)"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.vehicleOptions}>
          <Text style={styles.sectionTitle}>Vehicle Type</Text>
          <View style={styles.vehicleTypesContainer}>
            <TouchableOpacity style={[styles.vehicleTypeButton, styles.activeVehicleType]}>
              <Car size={24} color={Colors.light.primary} />
              <Text style={styles.vehicleTypeText}>Car</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.vehicleTypeButton}>
              <Car size={24} color="#8E8E93" />
              <Text style={styles.vehicleTypeText}>SUV</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.vehicleTypeButton}>
              <Car size={24} color="#8E8E93" />
              <Text style={styles.vehicleTypeText}>Van</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreateRide}>
          <Text style={styles.createButtonText}>Create Ride</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'available':
        return (
          <FlatList
            data={availableRides}
            renderItem={renderAvailableRideItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.ridesList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No rides available</Text>
              </View>
            }
          />
        );
      case 'my':
        return (
          <FlatList
            data={myRides}
            renderItem={renderMyRideItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.ridesList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>You haven't joined any rides yet</Text>
              </View>
            }
          />
        );
      case 'history':
        return (
          <FlatList
            data={rideHistory}
            renderItem={renderHistoryItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.ridesList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No ride history available</Text>
              </View>
            }
          />
        );
      case 'offer':
        return renderOfferRideForm();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rides</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => showToast('Filters coming soon!', 'info')}
        >
          <Filter size={20} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'available' && styles.activeTabButton]}
            onPress={() => setActiveTab('available')}
          >
            <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>Available</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'my' && styles.activeTabButton]}
            onPress={() => setActiveTab('my')}
          >
            <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>My Rides</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'history' && styles.activeTabButton]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'offer' && styles.activeTabButton]}
            onPress={() => setActiveTab('offer')}
          >
            <Text style={[styles.tabText, activeTab === 'offer' && styles.activeTabText]}>Offer Ride</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {renderContent()}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Inter-SemiBold',
  },
  filterButton: {
    padding: 8,
  },
  tabContainer: {
    backgroundColor: Colors.light.card,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tabScrollContent: {
    paddingHorizontal: 10,
  },
  tabButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.subtext,
    fontFamily: 'Inter-Medium',
  },
  activeTabText: {
    color: Colors.light.primary,
  },
  ridesList: {
    padding: 20,
  },
  rideCard: {
    backgroundColor: Colors.light.card,
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
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginRight: 5,
    fontFamily: 'Inter-Regular',
  },
  ratingStars: {
    fontSize: 12,
    color: '#FFD700',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
    fontFamily: 'Inter-SemiBold',
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
    backgroundColor: Colors.light.primary,
  },
  routePointDotDestination: {
    backgroundColor: Colors.light.error,
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
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
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
    color: Colors.light.subtext,
    marginLeft: 5,
    fontFamily: 'Inter-Regular',
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 15,
  },
  vehicleText: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
  joinButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  joinedButton: {
    backgroundColor: Colors.light.error,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  statusContainer: {
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
  
  // History styles
  historyCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  historyDetails: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  historyDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  historyDetailText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginLeft: 5,
    fontFamily: 'Inter-Regular',
  },
  passengerInfo: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  passengerCount: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  
  // Offer ride form styles
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 15,
    fontFamily: 'Inter-SemiBold',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownButton: {
    padding: 5,
  },
  textAreaContainer: {
    paddingVertical: 10,
  },
  textArea: {
    flex: 1,
    height: 100,
    fontSize: 16,
    color: Colors.light.text,
    textAlignVertical: 'top',
    fontFamily: 'Inter-Regular',
  },
  vehicleOptions: {
    marginTop: 10,
    marginBottom: 20,
  },
  vehicleTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vehicleTypeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  activeVehicleType: {
    borderColor: Colors.light.primary,
    backgroundColor: '#F0EFFE',
  },
  vehicleTypeText: {
    marginTop: 5,
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  createButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});