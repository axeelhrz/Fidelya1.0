import { Timestamp } from "firebase/firestore";

export type MessageType = 'text' | 'image' | 'pdf' | 'file' | 'deleted';

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  type: 'image' | 'text' | 'file' | 'pdf' | 'deleted';
  name: string;
  size: number;
  mimeType: string;
  path: string;
  url: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  read: boolean;
  delivered: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  chatId: string;
  status: 'sent' | 'received' | 'read';
  metadata?: {  [key: string]: string | number | boolean | null | undefined };
}

export interface MessageAttachment {
  id: string;
  type: string;
  url: string;
  name: string;
  size: number;
  mimeType: string;
  path: string;
}

export interface MessageStatus {
  id: string;
  chatId: string;
  userId: string;
  messageId: string;
  read: boolean;
  delivered: boolean;
  unreadCount: number;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
