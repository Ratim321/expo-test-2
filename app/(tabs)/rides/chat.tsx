import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Send, ArrowLeft } from 'lucide-react-native';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import Colors from '../../../constants/Colors';
import { useToast } from '../../../components/ToastProvider';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  createdAt: Timestamp;
}

export default function RideChatScreen() {
  const { rideId, rideName, currentUserId, currentUserName, currentUserAvatar } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const { showToast } = useToast();

  // Mock user data (in a real app, this would come from authentication)
  const userId = currentUserId || 'user123';
  const userName = currentUserName || 'John Doe';
  const userAvatar = currentUserAvatar || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80';

  useEffect(() => {
    if (!rideId) {
      showToast('Ride ID is missing', 'error');
      return;
    }

    // Create a query to get messages for this ride, ordered by timestamp
    const q = query(
      collection(db, 'rideChats', String(rideId), 'messages'),
      orderBy('createdAt', 'asc')
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        fetchedMessages.push({
          id: doc.id,
          ...doc.data() as Omit<Message, 'id'>
        });
      });
      setMessages(fetchedMessages);
      setLoading(false);

      // Scroll to bottom when new messages arrive
      if (fetchedMessages.length > 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }, (error) => {
      console.error("Error fetching messages: ", error);
      showToast('Failed to load messages', 'error');
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [rideId]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    if (!rideId) {
      showToast('Cannot send message: Ride ID is missing', 'error');
      return;
    }

    try {
      // Add message to Firestore
      await addDoc(collection(db, 'rideChats', String(rideId), 'messages'), {
        text: message.trim(),
        senderId: userId,
        senderName: userName,
        senderAvatar: userAvatar,
        createdAt: serverTimestamp()
      });
      
      // Clear input
      setMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
      showToast('Failed to send message', 'error');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === userId;
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        {!isCurrentUser && (
          <Image source={{ uri: item.senderAvatar }} style={styles.avatar} />
        )}
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
        ]}>
          {!isCurrentUser && (
            <Text style={styles.senderName}>{item.senderName}</Text>
          )}
          <Text style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText
          ]}>
            {item.text}
          </Text>
          <Text style={styles.timestamp}>
            {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.chatInfo}>
          <Text style={styles.chatTitle}>{rideName || 'Ride Chat'}</Text>
          <Text style={styles.chatSubtitle}>
            Chat with other riders and the driver
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
            <Text style={styles.loadingText}>Loading messages...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
            placeholderTextColor={Colors.light.subtext}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  chatInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.card,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Inter-SemiBold',
  },
  chatSubtitle: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '100%',
  },
  currentUserBubble: {
    backgroundColor: Colors.light.primary,
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: Colors.light.card,
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.primary,
    marginBottom: 4,
    fontFamily: 'Inter-Medium',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  currentUserText: {
    color: '#FFFFFF',
  },
  otherUserText: {
    color: Colors.light.text,
  },
  timestamp: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.card,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.light.border,
  },
});