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
  /** API: patient-relationships/<id> */
  relationshipId: number;
  patientUserId: number;
  practitionerId: number;
  serviceTypeId: number;
  requestedAt?: string | null;
  acceptedAt?: string | null;
  rejectedAt?: string | null;
  endedAt?: string | null;
  rejectionReason?: string;
  lastConsultation: string;
  nextAppointment: string;
  email: string;
  phone: string;
}

export interface LookupSpecialization {
  id: number;
  name: string;
  slug: string;
}

export interface LookupLanguage {
  code: string;
  name: string;
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
  videoIntroUrl: string;
  verifiedAt?: string | null;
  metadata: Record<string, string | number | boolean>;
}

export interface PersonalProfileFields {
  firstName: string;
  lastName: string;
  phone: string;
  timezone: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  onboardingCompleted: boolean;
  onboardingStep: number;
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

export interface PublicService {
  id: number;
  serviceType: number;
  name: string;
  durationMinutes: number;
  price: string;
  description: string;
  isActive: boolean;
}

export interface PublicLocation {
  id: number;
  name: string;
  address: string;
  city: string;
  isActive: boolean;
}

export interface PublicReview {
  id: number;
  session: number;
  rating: number;
  comment: string;
  createdAt: string;
}
