import { Timestamp } from "firebase/firestore";

export type ContactStatus = 'pending' | 'received' | 'accepted' | 'blocked';

export interface Contact {
  id: string;
  lastSeen: Timestamp | null;
  uid: string;
  email: string;
  fullName: string;
  name: string;
  displayName: string;
  photoURL: string | null;
  status: ContactStatus;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  chatId: string;
  lastMessage: string | null;
  lastMessageTime: Timestamp | null;
  unreadCount: number;
  isFavorite: boolean;
  company?: string;
  city?: string;
  phone?: string;
  notes?: string;
}

export interface ContactRequest {
  id: string;
  fromUserId: string;
  fromUserEmail: string;
  fromUserName: string;
  fromUserPhoto: string;
  from: {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string | null;
  };
  to: {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string | null;
  };
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp | null;
}
