export interface Alert {
  id: string;
  centerId: string;
  type: 'appointment' | 'medication' | 'follow-up' | 'emergency' | 'custom';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetType: 'patient' | 'psychologist' | 'center';
  targetId: string;
  scheduledFor: Date;
  status: 'pending' | 'sent' | 'read' | 'dismissed';
  channels: ('email' | 'whatsapp' | 'sms' | 'push')[];
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate?: Date;
  };
  createdAt: Date;
  createdBy: string;
}
