import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Phone, Ambulance, Shield, Flame, Building2, ChevronFirst as FirstAid, Car } from 'lucide-react-native';
import Colors from '../../../constants/Colors';

const emergencyContacts = [
  {
    id: '1',
    name: 'Police',
    number: '999',
    icon: <Shield size={24} color="#FFFFFF" />,
    backgroundColor: '#3B82F6',
  },
  {
    id: '2',
    name: 'Ambulance',
    number: '998',
    icon: <Ambulance size={24} color="#FFFFFF" />,
    backgroundColor: '#EF4444',
  },
  {
    id: '3',
    name: 'Fire Service',
    number: '997',
    icon: <Flame size={24} color="#FFFFFF" />,
    backgroundColor: '#F59E0B',
  },
  {
    id: '4',
    name: 'Hospital',
    number: '996',
    icon: <FirstAid size={24} color="#FFFFFF" />,
    backgroundColor: '#10B981',
  },
  {
    id: '5',
    name: 'Police Station',
    number: '995',
    icon: <Building2 size={24} color="#FFFFFF" />,
    backgroundColor: '#6366F1',
  },
  {
    id: '6',
    name: 'Traffic Police',
    number: '994',
    icon: <Car size={24} color="#FFFFFF" />,
    backgroundColor: '#8B5CF6',
  },
];

export default function QuickSearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = emergencyContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quick Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.light.subtext} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search emergency services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.subtext}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contactsGrid}>
          {filteredContacts.map(contact => (
            <TouchableOpacity
              key={contact.id}
              style={[styles.contactCard, { backgroundColor: contact.backgroundColor }]}
              onPress={() => handleCall(contact.number)}
            >
              <View style={styles.contactIcon}>{contact.icon}</View>
              <Text style={styles.contactName}>{contact.name}</Text>
              <View style={styles.numberContainer}>
                <Phone size={14} color="#FFFFFF" />
                <Text style={styles.contactNumber}>{contact.number}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Important Information</Text>
          <Text style={styles.infoText}>
            • These are emergency contact numbers for immediate assistance{'\n'}
            • All numbers are available 24/7{'\n'}
            • Please only use these numbers in case of genuine emergencies{'\n'}
            • Keep these numbers saved in your phone
          </Text>
        </View>
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
  searchContainer: {
    padding: 16,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  scrollView: {
    flex: 1,
  },
  contactsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  contactCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  contactIcon: {
    marginBottom: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  contactNumber: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
    fontFamily: 'Inter-Medium',
  },
  infoSection: {
    padding: 16,
    backgroundColor: Colors.light.card,
    margin: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.subtext,
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
});