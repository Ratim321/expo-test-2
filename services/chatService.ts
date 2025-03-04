import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Timestamp,
  where,
  getDocs,
  getDoc,
  doc
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  createdAt: Timestamp;
}

export interface ChatRoom {
  id: string;
  rideId: string;
  rideName: string;
  createdAt: Timestamp;
  lastMessage?: string;
  lastMessageTime?: Timestamp;
}

// Get or create a chat room for a ride
export const getOrCreateChatRoom = async (rideId: string, rideName: string): Promise<string> => {
  try {
    // Check if chat room already exists
    const chatRoomsRef = collection(db, 'rideChats');
    const q = query(chatRoomsRef, where('rideId', '==', rideId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Return existing chat room ID
      return querySnapshot.docs[0].id;
    }
    
    // Create new chat room
    const newChatRoom = await addDoc(chatRoomsRef, {
      rideId,
      rideName,
      createdAt: serverTimestamp(),
    });
    
    return newChatRoom.id;
  } catch (error) {
    console.error('Error getting or creating chat room:', error);
    throw error;
  }
};

// Send a message to a chat room
export const sendMessage = async (
  chatRoomId: string,
  text: string,
  senderId: string,
  senderName: string,
  senderAvatar: string
): Promise<void> => {
  try {
    // Add message to the chat room
    await addDoc(collection(db, 'rideChats', chatRoomId, 'messages'), {
      text,
      senderId,
      senderName,
      senderAvatar,
      createdAt: serverTimestamp()
    });
    
    // Update the chat room with last message info
    // This is useful for showing previews in a chat list
    await addDoc(collection(db, 'rideChats'), {
      lastMessage: text,
      lastMessageTime: serverTimestamp()
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Subscribe to messages in a chat room
export const subscribeToMessages = (
  chatRoomId: string,
  callback: (messages: Message[]) => void
): (() => void) => {
  const q = query(
    collection(db, 'rideChats', chatRoomId, 'messages'),
    orderBy('createdAt', 'asc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data() as Omit<Message, 'id'>
      });
    });
    callback(messages);
  });
};

// Get chat rooms for a user
export const getUserChatRooms = async (userId: string): Promise<ChatRoom[]> => {
  try {
    // In a real app, you would have a user_chats collection to track which users are in which chats
    // For this example, we'll just return all chat rooms
    const chatRoomsRef = collection(db, 'rideChats');
    const q = query(chatRoomsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const chatRooms: ChatRoom[] = [];
    querySnapshot.forEach((doc) => {
      chatRooms.push({
        id: doc.id,
        ...doc.data() as Omit<ChatRoom, 'id'>
      });
    });
    
    return chatRooms;
  } catch (error) {
    console.error('Error getting user chat rooms:', error);
    throw error;
  }
};