export type PlanId = 'foundation' | 'balanced' | 'transform';
export type PractitionerCategory = 'yoga' | 'doctor' | 'nutrition' | 'psych' | 'physio' | 'breathwork';

export interface PractitionerSlot {
  time: string;
  available: boolean;
}

export interface PractitionerDayAvailability {
  date: string;
  slots: PractitionerSlot[];
}

export interface BookablePractitioner {
  id: string;
  firstName: string;
  lastName: string;
  category: PractitionerCategory;
  title: string;
  bio: string;
  rating: number;
  totalSessions: number;
  experienceYears: number;
  consultationFee: number;
  languages: string[];
  specializations: string[];
  isOnline: boolean;
  bookingBufferDays: number;
  durationMinutes: number;
  /** 0 = Sun … 6 = Sat */
  availableWeekdays: number[];
  baseSlots: string[];
  bookedByDate: Record<string, string[]>;
  offDates: string[];
}
export type SessionType = 'yoga-group' | 'yoga-1on1' | 'doctor' | 'nutrition' | 'physio' | 'psych';
export type SessionStatus = 'upcoming' | 'completed' | 'missed' | 'cancelled';
export type RelationshipStatus = 'requested' | 'active' | 'rejected' | 'ended';
export type BookingProfileRelationship = 'self' | 'spouse' | 'child' | 'parent' | 'other';

export interface PatientProfile {
  id: string;
  tier: string;
  gender?: string;
  dateOfBirth?: string;
  primaryConcern?: string;
  yogaExperience?: string;
  activityLevel?: string;
  preferredDurationMinutes?: number;
  location?: string;
  wellnessScore: number;
  streakDays: number;
  longestStreak: number;
  lastSessionDate?: string | null;
  metadata: Record<string, string | number | boolean>;
}

export interface BookingProfile {
  id: string;
  name: string;
  relationship: BookingProfileRelationship;
  dateOfBirth?: string;
  healthConditions: string[];
  isActive: boolean;
  emergencyName?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
  notes?: string;
  isDefault: boolean;
}

export interface PatientRelationship {
  id: number;
  practitionerId: number;
  practitionerName: string;
  serviceType: string;
  status: RelationshipStatus;
  requestedAt?: string;
  acceptedAt?: string | null;
  rejectionReason?: string;
}
