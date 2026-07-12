export type RelationshipStatus = 'requested' | 'active' | 'rejected' | 'ended';

export type SessionStatus =
  | 'requested'
  | 'scheduled'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'missed'
  | 'no-show';

export interface Patient {
  id: string;
  name: string;
  avatar: string;
  condition: string;
  serviceType: string;
  relationshipStatus: RelationshipStatus;
  healthAccessGranted: boolean;
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
  title: string;
  specialty: 'Nutritionist' | 'Psychologist' | 'Doctor' | 'Physiotherapist';
  rating: number;
  totalClients: number;
  activeRelationships: number;
  experience: string;
  about: string;
}

export interface ClientRequest {
  id: string;
  name: string;
  serviceType: string;
  requestedAt: string;
}

export interface AttentionNotification {
  id: string;
  type: 'new_message' | 'session_reminder';
  title: string;
  body: string;
  createdAt: string;
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

export interface AdminStaffProfileFields {
  title: string;
  department: string;
  bio: string;
  languages: string[];
  accessScopes: string[];
  responsibilities: string[];
  phoneVerified: boolean;
  isStaff: boolean;
  dateJoined: string;
  googleId: string | null;
  appleId: string | null;
  isSuspended: boolean;
  suspensionReason: string;
  metadata: Record<string, string | number | boolean>;
}

export interface LookupAdminScope {
  slug: string;
  name: string;
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

/** Practitioner unavailability / leave request */
export type UnavailabilityKind = 'day_off' | 'partial';

export type BreakRequestStatus = 'pending' | 'approved' | 'rejected';

export interface PractitionerBreak {
  id: string;
  practitionerId: string;
  practitionerName: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  kind: UnavailabilityKind;
  status: BreakRequestStatus;
  isRecurring: boolean;
  recurringDay?: number | null;
  requestedAt: string;
  reviewedAt?: string | null;
  rejectionReason?: string;
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
