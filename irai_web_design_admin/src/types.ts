export type RelationshipStatus = 'requested' | 'active' | 'rejected' | 'ended';

export type SessionStatus =
  | 'requested'
  | 'scheduled'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'missed'
  | 'no-show';

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export interface Patient {
  id: string;
  name: string;
  avatar: string;
  condition: string;
  serviceType: string;
  relationshipStatus: RelationshipStatus;
  healthAccessGranted: boolean;
  requestedAt?: string;
  rejectionReason?: string;
  lastConsultation: string;
  nextAppointment: string;
  email: string;
  phone: string;
}

export interface Appointment {
  id: string;
  bookingId?: string;
  patientId: string;
  patientName: string;
  time: string;
  date: string;
  type: 'initial' | 'follow-up' | 'consultation';
  status: SessionStatus;
}

export interface Practitioner {
  id: string;
  name: string;
  specialty: 'Nutritionist' | 'Psychologist' | 'Doctor' | 'Physiotherapist';
  title?: string;
  rating: number;
  totalClients: number;
  totalSessions: number;
  activeRelationships: number;
  experience: string;
  about: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
}

export interface PractitionerProfileFields {
  title: string;
  bio: string;
  specializations: string[];
  languages: string[];
  qualifications: string[];
  experienceYears: number;
  consultationFee: number;
  isOnline: boolean;
  maxSessionsPerDay: number;
  maxSessionsPerWeek: number;
  bookingBufferDays: number;
}

export interface PersonalProfileFields {
  firstName: string;
  lastName: string;
  phone: string;
  timezone: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
}

export interface AttentionNotification {
  id: string;
  type: 'new_message' | 'booking_requested' | 'session_reminder';
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
}

export interface AISessionNote {
  id: string;
  patientId: string;
  date: string;
  sessionNumber: number;
  sessionType: 'initial' | 'follow-up' | 'consultation';
  duration: number;
  soap: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  flags: { text: string; severity: 'info' | 'caution' | 'alert' }[];
  painBefore: number;
  painAfter: number;
  aiConfidence: number;
}

export interface PractitionerGroupSession {
  id: string;
  title: string;
  category: 'yoga' | 'breathwork' | 'meditation' | 'mobility';
  time: string;
  days: string[];
  duration: number;
  enrolled: number;
  capacity: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}
