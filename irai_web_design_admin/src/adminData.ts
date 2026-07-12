// ── Types ──────────────────────────────────────────────────────────────────────

export type BookingType = 'yoga-1on1' | 'yoga-group' | 'doctor' | 'nutrition' | 'physio' | 'psych';
export type BookingStatus = 'requested' | 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'missed' | 'no-show';
export type TherapistStatus = 'pending' | 'verified' | 'rejected' | 'suspended';
export type PlanId = 'foundation' | 'balanced' | 'transform';
export type DisputeType = 'cancellation' | 'no-show' | 'quality' | 'billing';
export type DisputeStatus = 'open' | 'resolved' | 'escalated';
export type Priority = 'high' | 'medium' | 'low';
export type SessionStatus = 'draft' | 'published' | 'live' | 'completed' | 'cancelled';
export type ActivityType = 'booking' | 'join' | 'cancel' | 'signup' | 'complete' | 'login' | 'dispute' | 'payout';
export type UserRole = 'patient' | 'practitioner' | 'admin';
export type DisputeResolution = 'refund' | 'partial_refund' | 'credit' | 'dismissed';

export interface AdminBooking {
  id: string;
  bookingId: string;
  userName: string;
  therapistName: string;
  type: BookingType;
  date: string;
  time: string;
  status: BookingStatus;
  planId: PlanId;
  duration: number;
}

export interface AdminTherapist {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  bio: string;
  specialty: string;
  rating: number;
  totalSessions: number;
  activeClients: number;
  experienceYears: number;
  qualifications: string[];
  languages: string[];
  specializations: string[];
  consultationFee: number;
  status: TherapistStatus;
  isActive: boolean;
  isSuspended: boolean;
  joinedDate: string;
  loadPercent: number;
  rejectionReason?: string;
}

export interface PatientProfile {
  id: string;
  dateOfBirth?: string | null;
  gender: string;
  primaryConcern: string;
  yogaExperience: string;
  activityLevel: string;
  preferredDurationMinutes?: number | null;
  location: string;
  wellnessScore: number;
  streakDays: number;
  longestStreak: number;
  lastSessionDate?: string | null;
  tier: string;
  metadata: Record<string, string | number | boolean>;
}

export interface PractitionerProfile {
  id: string;
  specializations: string[];
  languages: string[];
  title: string;
  bio: string;
  qualifications: string[];
  experienceYears: number;
  rating: number;
  totalSessions: number;
  totalClients: number;
  status: TherapistStatus;
  rejectionReason: string;
  verifiedAt?: string | null;
  consultationFee: number;
  videoIntroUrl: string;
  isOnline: boolean;
  maxSessionsPerDay: number;
  maxSessionsPerWeek: number;
  bookingBufferDays: number;
  metadata: Record<string, string | number | boolean>;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isStaff: boolean;
  isActive: boolean;
  isDeleted: boolean;
  dateJoined: string;
  hasPatientProfile: boolean;
  hasPractitionerProfile: boolean;
  patientProfile?: PatientProfile | null;
  practitionerProfile?: PractitionerProfile | null;
}

export interface AdminGroupSession {
  id: string;
  title: string;
  category: string;
  instructor: string;
  days: string[];
  time: string;
  duration: number;
  capacity: number;
  enrolled: number;
  status: SessionStatus;
  level: string;
}

export interface AdminDispute {
  id: string;
  sessionId: string;
  bookingId?: string;
  userName: string;
  therapistName: string;
  raisedById: string;
  againstUserId: string;
  raisedByEmail: string;
  againstUserEmail: string;
  sessionDate: string;
  sessionTime: string;
  issueType: DisputeType;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  status: DisputeStatus;
  priority: Priority;
  resolution?: DisputeResolution;
  resolutionNotes?: string;
  refundAmount?: number;
  resolvedAt?: string | null;
  resolvedById?: string | null;
  resolvedByName?: string | null;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  description: string;
  createdAt: string;
  metadata?: Record<string, string | number>;
}

export type SettingInputType = 'toggle' | 'number' | 'percent' | 'email' | 'text' | 'tags';

export interface SystemSetting {
  key: string;
  label: string;
  value: SettingValue;
  description: string;
  group: string;
  inputType: SettingInputType;
  unit?: string;
  min?: number;
  max?: number;
  tagOptions?: string[];
  isEncrypted: boolean;
  isActive: boolean;
  updatedAt: string;
}

// ── Platform Stats ─────────────────────────────────────────────────────────────

export const ADMIN_STATS = {
  id: 1,
  date: '2026-05-16',
  totalUsers: 284,
  totalPractitioners: 12,
  totalBookings: 1847,
  bookingsToday: 47,
  revenueToday: 15000,
  weeklyRevenue: 184000,
  monthlyRevenue: 380000,
  completionRate: 94,
  activeSubscriptions: 80,
  openDisputes: 3,
  pendingTherapists: 2,
  createdAt: '2026-05-16T00:00:00.000000Z',
  updatedAt: '2026-05-16T14:30:00.000000Z',
};

const MOCK_PATIENT_PROFILES: Record<string, PatientProfile> = {
  u1: { id: 'pp1', dateOfBirth: '1992-03-14', gender: 'female', primaryConcern: 'Lower back pain and stress management', yogaExperience: 'intermediate', activityLevel: 'moderate', preferredDurationMinutes: 45, location: 'Mumbai', wellnessScore: 72, streakDays: 12, longestStreak: 28, lastSessionDate: '2026-05-15', tier: 'silver', metadata: { plan: 'transform' } },
  u2: { id: 'pp2', dateOfBirth: '1988-07-22', gender: 'male', primaryConcern: 'Weight management and flexibility', yogaExperience: 'beginner', activityLevel: 'light', preferredDurationMinutes: 30, location: 'Bangalore', wellnessScore: 58, streakDays: 5, longestStreak: 14, lastSessionDate: '2026-05-14', tier: 'bronze', metadata: { plan: 'foundation' } },
  u3: { id: 'pp3', dateOfBirth: '1995-11-08', gender: 'female', primaryConcern: 'Anxiety and sleep quality', yogaExperience: 'some', activityLevel: 'sedentary', preferredDurationMinutes: 45, location: 'Kochi', wellnessScore: 65, streakDays: 8, longestStreak: 21, lastSessionDate: '2026-05-16', tier: 'bronze', metadata: { plan: 'balanced' } },
  u5: { id: 'pp5', dateOfBirth: '1990-01-30', gender: 'female', primaryConcern: 'Postpartum recovery', yogaExperience: 'beginner', activityLevel: 'light', preferredDurationMinutes: 60, location: 'Chennai', wellnessScore: 61, streakDays: 3, longestStreak: 10, lastSessionDate: '2026-05-12', tier: 'bronze', metadata: { plan: 'transform' } },
  u8: { id: 'pp8', dateOfBirth: '1985-09-17', gender: 'male', primaryConcern: 'Chronic knee pain', yogaExperience: 'intermediate', activityLevel: 'moderate', preferredDurationMinutes: 45, location: 'Hyderabad', wellnessScore: 48, streakDays: 0, longestStreak: 7, lastSessionDate: '2026-04-28', tier: 'bronze', metadata: { plan: 'balanced' } },
  u13: { id: 'pp13', dateOfBirth: '1993-06-05', gender: 'female', primaryConcern: 'General wellness', yogaExperience: 'beginner', activityLevel: 'sedentary', preferredDurationMinutes: 30, location: 'Pune', wellnessScore: 40, streakDays: 0, longestStreak: 3, lastSessionDate: null, tier: 'bronze', metadata: {} },
};

const MOCK_PRACTITIONER_PROFILE: PractitionerProfile = {
  id: 'pr1',
  specializations: ['Hatha Yoga', 'Therapeutic Yoga'],
  languages: ['en', 'hi'],
  title: 'Senior Yoga Therapist',
  bio: 'RYT-500 certified yoga therapist specializing in therapeutic movement and chronic pain management.',
  qualifications: ['RYT-500', 'MSc Yoga Therapy'],
  experienceYears: 12,
  rating: 4.9,
  totalSessions: 312,
  totalClients: 28,
  status: 'verified',
  rejectionReason: '',
  verifiedAt: '2024-01-20T10:00:00.000000Z',
  consultationFee: 800,
  videoIntroUrl: 'https://example.com/sarah-intro.mp4',
  isOnline: true,
  maxSessionsPerDay: 8,
  maxSessionsPerWeek: 40,
  bookingBufferDays: 1,
  metadata: { specialty: 'prenatal-yoga' },
};

// ── Bookings ───────────────────────────────────────────────────────────────────

export const ADMIN_BOOKINGS: AdminBooking[] = [
  { id: 'b1', bookingId: 'IY-2026-00047', userName: 'Priya Sharma', therapistName: 'Dr. Sarah Smith', type: 'yoga-1on1', date: '2026-05-16', time: '08:00 AM', status: 'confirmed', planId: 'transform', duration: 45 },
  { id: 'b2', bookingId: 'IY-2026-00048', userName: 'Rahul Mehta', therapistName: 'Dr. Arjun Mehta', type: 'yoga-group', date: '2026-05-16', time: '07:30 AM', status: 'scheduled', planId: 'foundation', duration: 45 },
  { id: 'b3', bookingId: 'IY-2026-00046', userName: 'Anita Nair', therapistName: 'Dr. Rajan Pillai', type: 'doctor', date: '2026-05-16', time: '10:00 AM', status: 'completed', planId: 'balanced', duration: 30 },
  { id: 'b4', bookingId: 'IY-2026-00045', userName: 'Suresh Kumar', therapistName: 'Nutritionist Emma', type: 'nutrition', date: '2026-05-15', time: '02:00 PM', status: 'completed', planId: 'balanced', duration: 30 },
  { id: 'b5', bookingId: 'IY-2026-00044', userName: 'Deepa Krishnan', therapistName: 'Dr. Sarah Smith', type: 'yoga-1on1', date: '2026-05-15', time: '04:30 PM', status: 'cancelled', planId: 'transform', duration: 45 },
  { id: 'b6', bookingId: 'IY-2026-00043', userName: 'Vikram Singh', therapistName: 'Dr. Leena Varma', type: 'psych', date: '2026-05-15', time: '03:00 PM', status: 'completed', planId: 'transform', duration: 45 },
  { id: 'b7', bookingId: 'IY-2026-00042', userName: 'Meera Patel', therapistName: 'Meera Suresh', type: 'physio', date: '2026-05-14', time: '11:00 AM', status: 'completed', planId: 'transform', duration: 45 },
  { id: 'b8', bookingId: 'IY-2026-00041', userName: 'Arun Das', therapistName: 'Dr. Michael Chen', type: 'yoga-1on1', date: '2026-05-14', time: '09:30 AM', status: 'no-show', planId: 'balanced', duration: 45 },
  { id: 'b9', bookingId: 'IY-2026-00049', userName: 'Lakshmi Iyer', therapistName: 'Dr. Arjun Mehta', type: 'yoga-group', date: '2026-05-17', time: '07:30 AM', status: 'confirmed', planId: 'foundation', duration: 45 },
  { id: 'b10', bookingId: 'IY-2026-00050', userName: 'Karthik Rao', therapistName: 'Dr. Rajan Pillai', type: 'doctor', date: '2026-05-17', time: '10:00 AM', status: 'requested', planId: 'balanced', duration: 30 },
  { id: 'b11', bookingId: 'IY-2026-00040', userName: 'Sneha Reddy', therapistName: 'Dr. Sarah Smith', type: 'yoga-1on1', date: '2026-05-13', time: '06:00 PM', status: 'missed', planId: 'balanced', duration: 45 },
];

// ── Therapists ─────────────────────────────────────────────────────────────────

export const ADMIN_THERAPISTS: AdminTherapist[] = [
  { id: 't1', firstName: 'Sarah', lastName: 'Smith', email: 'sarah@irai.com', phone: '+91 98765 43210', title: 'Senior Yoga Therapist', bio: 'RYT-500 certified yoga therapist specializing in therapeutic movement and chronic pain management.', specialty: 'Yoga Therapist', rating: 4.9, totalSessions: 312, activeClients: 28, experienceYears: 12, qualifications: ['RYT-500', 'MSc Yoga Therapy'], languages: ['en', 'hi'], specializations: ['Hatha Yoga', 'Therapeutic Yoga'], consultationFee: 800, status: 'verified', isActive: true, isSuspended: false, joinedDate: '2024-01-15', loadPercent: 87 },
  { id: 't2', firstName: 'Michael', lastName: 'Chen', email: 'michael@irai.com', phone: '+91 98765 43211', title: 'Sports Physiotherapist', bio: 'Specializes in sports injury rehabilitation and post-operative recovery programs.', specialty: 'Physiotherapist', rating: 4.8, totalSessions: 245, activeClients: 22, experienceYears: 10, qualifications: ['BPT', 'MPT Sports Medicine'], languages: ['en'], specializations: ['Sports Rehab', 'Manual Therapy'], consultationFee: 900, status: 'verified', isActive: true, isSuspended: false, joinedDate: '2024-02-10', loadPercent: 72 },
  { id: 't3', firstName: 'Arjun', lastName: 'Mehta', email: 'arjun@irai.com', phone: '+91 98765 43212', title: 'Clinical Yoga Specialist', bio: 'Integrates clinical yoga with evidence-based protocols for spine and joint conditions.', specialty: 'Clinical Yoga Specialist', rating: 4.7, totalSessions: 189, activeClients: 18, experienceYears: 8, qualifications: ['RYT-500', 'Certified Clinical Yoga'], languages: ['en', 'hi', 'mr'], specializations: ['Clinical Yoga', 'Spine Health'], consultationFee: 750, status: 'verified', isActive: true, isSuspended: false, joinedDate: '2024-03-05', loadPercent: 65 },
  { id: 't4', firstName: 'Rajan', lastName: 'Pillai', email: 'rajan@irai.com', phone: '+91 98765 43213', title: 'General Physician', bio: 'General physician with focus on preventive care and wellness consultations.', specialty: 'General Physician', rating: 4.9, totalSessions: 421, activeClients: 35, experienceYears: 15, qualifications: ['MBBS', 'MD Internal Medicine'], languages: ['en', 'ml'], specializations: ['General Medicine', 'Preventive Care'], consultationFee: 600, status: 'verified', isActive: true, isSuspended: false, joinedDate: '2023-11-20', loadPercent: 92 },
  { id: 't5', firstName: 'Emma', lastName: 'Wilson', email: 'emma@irai.com', phone: '+91 98765 43214', title: 'Clinical Nutritionist', bio: 'Personalized nutrition plans for metabolic health, weight management, and chronic conditions.', specialty: 'Clinical Nutritionist', rating: 4.6, totalSessions: 156, activeClients: 14, experienceYears: 7, qualifications: ['MSc Clinical Nutrition'], languages: ['en'], specializations: ['Clinical Nutrition', 'Metabolic Health'], consultationFee: 700, status: 'verified', isActive: true, isSuspended: false, joinedDate: '2024-04-01', loadPercent: 53 },
  { id: 't6', firstName: 'Leena', lastName: 'Varma', email: 'leena@irai.com', phone: '+91 98765 43215', title: 'Clinical Psychologist', bio: 'CBT and mindfulness-based therapy for anxiety, stress, and lifestyle-related mental health concerns.', specialty: 'Psychologist', rating: 4.8, totalSessions: 203, activeClients: 19, experienceYears: 9, qualifications: ['MPhil Clinical Psychology'], languages: ['en', 'hi'], specializations: ['CBT', 'Mindfulness'], consultationFee: 850, status: 'verified', isActive: true, isSuspended: false, joinedDate: '2024-01-30', loadPercent: 78 },
  { id: 't7', firstName: 'Kavitha', lastName: 'Rao', email: 'kavitha@irai.com', phone: '+91 98765 43216', title: 'Breathwork Coach', bio: 'Pranayama and breathwork techniques for stress reduction and respiratory wellness.', specialty: 'Breathwork Coach', rating: 4.5, totalSessions: 98, activeClients: 12, experienceYears: 5, qualifications: ['Certified Breathwork Facilitator'], languages: ['en', 'kn'], specializations: ['Pranayama', 'Breathwork'], consultationFee: 500, status: 'verified', isActive: true, isSuspended: false, joinedDate: '2024-05-01', loadPercent: 45 },
  { id: 't8', firstName: 'Neha', lastName: 'Joshi', email: 'neha.j@example.com', phone: '+91 98765 43217', title: 'Sports Physiotherapist', bio: 'Recently certified sports physiotherapist applying for platform verification.', specialty: 'Sports Physiotherapist', rating: 0, totalSessions: 0, activeClients: 0, experienceYears: 3, qualifications: ['BPT'], languages: ['en', 'hi'], specializations: ['Sports Rehab'], consultationFee: 650, status: 'pending', isActive: true, isSuspended: false, joinedDate: '2026-05-10', loadPercent: 0 },
  { id: 't9', firstName: 'Ravi', lastName: 'Kumar', email: 'ravi.k@example.com', phone: '+91 98765 43218', title: 'Yoga Instructor', bio: 'Hatha and Vinyasa yoga instructor with 2 years teaching experience.', specialty: 'Yoga Instructor', rating: 0, totalSessions: 0, activeClients: 0, experienceYears: 2, qualifications: ['RYT-200'], languages: ['en', 'ta'], specializations: ['Hatha Yoga'], consultationFee: 400, status: 'pending', isActive: true, isSuspended: false, joinedDate: '2026-05-12', loadPercent: 0 },
  { id: 't10', firstName: 'Anita', lastName: 'Desai', email: 'anita.d@example.com', phone: '+91 98765 43219', title: 'Meditation Coach', bio: 'Guided meditation and mindfulness programs for corporate wellness.', specialty: 'Meditation Coach', rating: 4.2, totalSessions: 45, activeClients: 8, experienceYears: 4, qualifications: ['Certified Meditation Teacher'], languages: ['en', 'hi'], specializations: ['Meditation', 'Mindfulness'], consultationFee: 550, status: 'suspended', isActive: false, isSuspended: true, joinedDate: '2024-06-01', loadPercent: 0, rejectionReason: 'Violation of community guidelines' },
];

// ── Users ──────────────────────────────────────────────────────────────────────

export const ADMIN_USERS: AdminUser[] = [
  { id: 'u1', firstName: 'Priya', lastName: 'Sharma', email: 'priya@example.com', role: 'patient', isStaff: false, isActive: true, isDeleted: false, dateJoined: '2026-01-15', hasPatientProfile: true, hasPractitionerProfile: false, patientProfile: MOCK_PATIENT_PROFILES.u1, practitionerProfile: null },
  { id: 'u2', firstName: 'Rahul', lastName: 'Mehta', email: 'rahul@example.com', role: 'patient', isStaff: false, isActive: true, isDeleted: false, dateJoined: '2026-02-20', hasPatientProfile: true, hasPractitionerProfile: false, patientProfile: MOCK_PATIENT_PROFILES.u2, practitionerProfile: null },
  { id: 'u3', firstName: 'Anita', lastName: 'Nair', email: 'anita@example.com', role: 'patient', isStaff: false, isActive: true, isDeleted: false, dateJoined: '2026-03-05', hasPatientProfile: true, hasPractitionerProfile: false, patientProfile: MOCK_PATIENT_PROFILES.u3, practitionerProfile: null },
  { id: 'u4', firstName: 'Suresh', lastName: 'Kumar', email: 'suresh@example.com', role: 'patient', isStaff: false, isActive: true, isDeleted: false, dateJoined: '2026-03-12', hasPatientProfile: true, hasPractitionerProfile: false, patientProfile: { id: 'pp4', gender: 'male', primaryConcern: 'Diabetes management', yogaExperience: 'beginner', activityLevel: 'sedentary', location: 'Delhi', wellnessScore: 55, streakDays: 6, longestStreak: 12, tier: 'bronze', metadata: { plan: 'balanced' } }, practitionerProfile: null },
  { id: 'u5', firstName: 'Deepa', lastName: 'Krishnan', email: 'deepa@example.com', role: 'patient', isStaff: false, isActive: true, isDeleted: false, dateJoined: '2025-12-01', hasPatientProfile: true, hasPractitionerProfile: false, patientProfile: MOCK_PATIENT_PROFILES.u5, practitionerProfile: null },
  { id: 'u6', firstName: 'Vikram', lastName: 'Singh', email: 'vikram@example.com', role: 'patient', isStaff: false, isActive: true, isDeleted: false, dateJoined: '2026-01-08', hasPatientProfile: true, hasPractitionerProfile: false, patientProfile: { id: 'pp6', gender: 'male', primaryConcern: 'Work stress', yogaExperience: 'intermediate', activityLevel: 'active', location: 'Gurgaon', wellnessScore: 78, streakDays: 15, longestStreak: 30, tier: 'gold', metadata: { plan: 'transform' } }, practitionerProfile: null },
  { id: 'u7', firstName: 'Meera', lastName: 'Patel', email: 'meera@example.com', role: 'patient', isStaff: false, isActive: true, isDeleted: false, dateJoined: '2026-04-18', hasPatientProfile: true, hasPractitionerProfile: false, patientProfile: { id: 'pp7', gender: 'female', primaryConcern: 'Physiotherapy recovery', yogaExperience: 'some', activityLevel: 'light', location: 'Ahmedabad', wellnessScore: 62, streakDays: 4, longestStreak: 9, tier: 'bronze', metadata: {} }, practitionerProfile: null },
  { id: 'u8', firstName: 'Arun', lastName: 'Das', email: 'arun@example.com', role: 'patient', isStaff: false, isActive: false, isDeleted: false, dateJoined: '2026-05-01', hasPatientProfile: true, hasPractitionerProfile: false, patientProfile: MOCK_PATIENT_PROFILES.u8, practitionerProfile: null },
  { id: 'u9', firstName: 'Lakshmi', lastName: 'Iyer', email: 'lakshmi@example.com', role: 'patient', isStaff: false, isActive: true, isDeleted: false, dateJoined: '2026-05-10', hasPatientProfile: true, hasPractitionerProfile: false, patientProfile: { id: 'pp9', gender: 'female', primaryConcern: 'Group yoga fitness', yogaExperience: 'beginner', activityLevel: 'moderate', location: 'Coimbatore', wellnessScore: 50, streakDays: 2, longestStreak: 5, tier: 'bronze', metadata: {} }, practitionerProfile: null },
  { id: 'u10', firstName: 'Karthik', lastName: 'Rao', email: 'karthik@example.com', role: 'patient', isStaff: false, isActive: true, isDeleted: false, dateJoined: '2026-05-12', hasPatientProfile: false, hasPractitionerProfile: false, patientProfile: null, practitionerProfile: null },
  { id: 'u11', firstName: 'Sarah', lastName: 'Smith', email: 'sarah@irai.com', role: 'practitioner', isStaff: false, isActive: true, isDeleted: false, dateJoined: '2024-01-15', hasPatientProfile: false, hasPractitionerProfile: true, patientProfile: null, practitionerProfile: MOCK_PRACTITIONER_PROFILE },
  { id: 'u12', firstName: 'Platform', lastName: 'Admin', email: 'admin@irai.com', role: 'admin', isStaff: true, isActive: true, isDeleted: false, dateJoined: '2024-01-01', hasPatientProfile: false, hasPractitionerProfile: false, patientProfile: null, practitionerProfile: null },
  { id: 'u13', firstName: 'Deleted', lastName: 'User', email: 'deleted@example.com', role: 'patient', isStaff: false, isActive: false, isDeleted: true, dateJoined: '2025-06-01', hasPatientProfile: true, hasPractitionerProfile: false, patientProfile: MOCK_PATIENT_PROFILES.u13, practitionerProfile: null },
];

// ── Group Sessions ─────────────────────────────────────────────────────────────

export const ADMIN_GROUP_SESSIONS: AdminGroupSession[] = [
  { id: 'gs1', title: 'Morning Flow Yoga', category: 'yoga', instructor: 'Priya Nair', days: ['Mon', 'Wed', 'Fri'], time: '07:30 AM', duration: 45, capacity: 20, enrolled: 14, status: 'published', level: 'Beginner' },
  { id: 'gs2', title: 'Spinal Recovery Yoga', category: 'yoga', instructor: 'Dr. Arjun Mehta', days: ['Tue', 'Thu'], time: '08:00 AM', duration: 60, capacity: 15, enrolled: 11, status: 'published', level: 'Intermediate' },
  { id: 'gs3', title: 'Pranayama & Breathwork', category: 'breathwork', instructor: 'Kavitha Rao', days: ['Mon', 'Wed', 'Fri'], time: '06:30 AM', duration: 30, capacity: 25, enrolled: 19, status: 'published', level: 'Beginner' },
  { id: 'gs4', title: 'Guided Meditation', category: 'meditation', instructor: 'Siddharth Iyer', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], time: '07:00 PM', duration: 20, capacity: 30, enrolled: 22, status: 'published', level: 'Beginner' },
  { id: 'gs5', title: 'Hip & Joint Mobility', category: 'mobility', instructor: 'Meera Suresh', days: ['Tue', 'Thu'], time: '09:30 AM', duration: 45, capacity: 12, enrolled: 8, status: 'published', level: 'Intermediate' },
  { id: 'gs6', title: 'Advanced Pranayama', category: 'breathwork', instructor: 'Kavitha Rao', days: ['Sat'], time: '08:00 AM', duration: 60, capacity: 15, enrolled: 0, status: 'draft', level: 'Advanced' },
];

// ── Disputes ───────────────────────────────────────────────────────────────────

export const ADMIN_DISPUTES: AdminDispute[] = [
  {
    id: 'd1', sessionId: 's-1047', bookingId: 'IY-2026-00045', userName: 'Deepa Krishnan', therapistName: 'Dr. Sarah Smith',
    raisedById: 'u5', againstUserId: 'u11', raisedByEmail: 'deepa@example.com', againstUserEmail: 'sarah@irai.com',
    sessionDate: '2026-05-15', sessionTime: '04:30 PM', issueType: 'cancellation',
    description: 'Session cancelled 2 hours before start. User is requesting a full refund.',
    date: '2026-05-15', createdAt: '2026-05-15T18:30:00.000000Z', updatedAt: '2026-05-16T10:00:00.000000Z',
    status: 'open', priority: 'high',
  },
  {
    id: 'd2', sessionId: 's-1041', bookingId: 'IY-2026-00041', userName: 'Arun Das', therapistName: 'Dr. Michael Chen',
    raisedById: 'u8', againstUserId: 't2', raisedByEmail: 'arun@example.com', againstUserEmail: 'michael@irai.com',
    sessionDate: '2026-05-14', sessionTime: '09:30 AM', issueType: 'no-show',
    description: 'Therapist did not appear for the scheduled session at 09:30 AM.',
    date: '2026-05-14', createdAt: '2026-05-14T10:15:00.000000Z', updatedAt: '2026-05-15T09:00:00.000000Z',
    status: 'open', priority: 'high',
  },
  {
    id: 'd3', sessionId: 's-1038', bookingId: 'IY-2026-00044', userName: 'Suresh Kumar', therapistName: 'Nutritionist Emma',
    raisedById: 'u4', againstUserId: 't5', raisedByEmail: 'suresh@example.com', againstUserEmail: 'emma@irai.com',
    sessionDate: '2026-05-10', sessionTime: '02:00 PM', issueType: 'quality',
    description: 'Session quality was below expectations. Diet plan was not personalized.',
    date: '2026-05-10', createdAt: '2026-05-10T16:45:00.000000Z', updatedAt: '2026-05-12T11:30:00.000000Z',
    status: 'escalated', priority: 'medium',
  },
  {
    id: 'd4', sessionId: 's-1032', bookingId: 'IY-2026-00042', userName: 'Meera Patel', therapistName: 'Meera Suresh',
    raisedById: 'u7', againstUserId: 't7', raisedByEmail: 'meera@example.com', againstUserEmail: 'kavitha@irai.com',
    sessionDate: '2026-05-08', sessionTime: '11:00 AM', issueType: 'billing',
    description: 'User was charged twice for the same physiotherapy session.',
    date: '2026-05-08', createdAt: '2026-05-08T14:20:00.000000Z', updatedAt: '2026-05-09T16:00:00.000000Z',
    status: 'resolved', priority: 'low', resolution: 'refund',
    resolutionNotes: 'Duplicate charge identified. Full refund issued.', refundAmount: 500,
    resolvedAt: '2026-05-09T16:00:00.000000Z', resolvedById: 'u12', resolvedByName: 'Platform Admin',
  },
];

// ── Recent Activity ────────────────────────────────────────────────────────────

export const ADMIN_ACTIVITY: ActivityItem[] = [
  { id: 'ac1', type: 'booking', description: 'Priya Sharma booked 1-on-1 yoga with Dr. Sarah Smith', createdAt: '2026-05-16T14:28:00Z', metadata: { session_id: 's-1050' } },
  { id: 'ac2', type: 'signup', description: 'New user Karthik Rao signed up as patient', createdAt: '2026-05-16T14:15:00Z' },
  { id: 'ac3', type: 'complete', description: 'Anita Nair completed Doctor consultation with Dr. Rajan Pillai', createdAt: '2026-05-16T13:30:00Z', metadata: { session_id: 's-1046' } },
  { id: 'ac4', type: 'dispute', description: 'Deepa Krishnan raised a cancellation dispute against Dr. Sarah Smith', createdAt: '2026-05-16T12:00:00Z', metadata: { dispute_id: 'd1' } },
  { id: 'ac5', type: 'join', description: 'Lakshmi Iyer joined Morning Flow Yoga group session', createdAt: '2026-05-16T11:00:00Z' },
  { id: 'ac6', type: 'payout', description: 'Payout of ₹45,200 processed for Dr. Arjun Mehta', createdAt: '2026-05-16T09:00:00Z', metadata: { amount: 45200 } },
  { id: 'ac7', type: 'login', description: 'Admin admin@irai.com logged in', createdAt: '2026-05-16T08:45:00Z' },
  { id: 'ac8', type: 'cancel', description: 'Vikram Singh cancelled Psychology session with Dr. Leena Varma', createdAt: '2026-05-15T18:00:00Z' },
];

export function userFullName(u: AdminUser) {
  return `${u.firstName} ${u.lastName}`;
}

export function therapistFullName(t: AdminTherapist) {
  return `${t.firstName} ${t.lastName}`;
}

// ── System Settings ──────────────────────────────────────────────────────────

export type SettingValue = string | number | boolean | string[];

export const ADMIN_SETTINGS: SystemSetting[] = [
  {
    key: 'max_bookings_per_day',
    label: 'Max bookings per day',
    value: 10,
    description: 'How many sessions a practitioner can take in one day.',
    group: 'scheduling',
    inputType: 'number',
    unit: 'bookings',
    min: 1,
    max: 50,
    isEncrypted: false,
    isActive: true,
    updatedAt: '2026-05-16T08:00:00Z',
  },
  {
    key: 'booking_buffer_hours',
    label: 'Booking buffer',
    value: 2,
    description: 'Minimum notice required before a patient can book a session.',
    group: 'scheduling',
    inputType: 'number',
    unit: 'hours',
    min: 0,
    max: 72,
    isEncrypted: false,
    isActive: true,
    updatedAt: '2026-05-10T12:00:00Z',
  },
  {
    key: 'platform_commission_rate',
    label: 'Platform commission',
    value: 15,
    description: 'Percentage taken from each completed session.',
    group: 'payments',
    inputType: 'percent',
    min: 0,
    max: 50,
    isEncrypted: false,
    isActive: true,
    updatedAt: '2026-04-01T09:00:00Z',
  },
  {
    key: 'razorpay_enabled',
    label: 'Razorpay payments',
    value: true,
    description: 'Allow patients to pay through Razorpay at checkout.',
    group: 'payments',
    inputType: 'toggle',
    isEncrypted: false,
    isActive: true,
    updatedAt: '2026-03-15T10:00:00Z',
  },
  {
    key: 'maintenance_mode',
    label: 'Maintenance mode',
    value: false,
    description: 'Show a maintenance page and block new bookings for all users.',
    group: 'general',
    inputType: 'toggle',
    isEncrypted: false,
    isActive: true,
    updatedAt: '2026-05-01T14:00:00Z',
  },
  {
    key: 'support_email',
    label: 'Support email',
    value: 'support@iraiwellness.com',
    description: 'Displayed to users when they need help.',
    group: 'general',
    inputType: 'email',
    isEncrypted: false,
    isActive: true,
    updatedAt: '2026-01-20T11:00:00Z',
  },
  {
    key: 'allowed_file_types',
    label: 'Allowed file types',
    value: ['pdf', 'jpg', 'png', 'jpeg'],
    description: 'File extensions patients can upload for health documents.',
    group: 'compliance',
    inputType: 'tags',
    tagOptions: ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'doc', 'docx'],
    isEncrypted: false,
    isActive: true,
    updatedAt: '2026-02-05T16:00:00Z',
  },
];

export const LOOKUP_ADMIN_SCOPES = [
  { slug: 'users', name: 'User Management' },
  { slug: 'therapists', name: 'Therapist Verification' },
  { slug: 'bookings', name: 'Bookings & Sessions' },
  { slug: 'disputes', name: 'Dispute Resolution' },
  { slug: 'settings', name: 'Platform Settings' },
  { slug: 'activity', name: 'Activity & Audit' },
  { slug: 'leave', name: 'Leave Requests' },
] as const;

export const MOCK_ADMIN_STAFF_PROFILE = {
  title: 'Platform Administrator',
  department: 'Operations',
  bio: 'Oversees practitioner verification, user support escalations, and platform compliance for the Irai wellness network.',
  languages: ['en', 'hi'],
  accessScopes: ['users', 'therapists', 'disputes', 'settings', 'activity'],
  responsibilities: ['Therapist verification', 'Dispute escalation', 'Platform settings'],
  phoneVerified: true,
  isStaff: true,
  dateJoined: '2024-01-01T00:00:00.000000Z',
  googleId: null,
  appleId: null,
  isSuspended: false,
  suspensionReason: '',
  metadata: { access_level: 'full', region: 'IN' },
};

export const MOCK_ADMIN_ACCOUNT_STATS = {
  usersManaged: 284,
  verificationsProcessed: 48,
  disputesResolved: 12,
};

export const MOCK_ADMIN_EXPORT_DATA = {
  id: 1,
  email: 'admin@irai.com',
  first_name: 'Admin',
  last_name: 'User',
  role: 'admin',
  phone: '+91 90000 12345',
  phone_verified: true,
  timezone: 'Asia/Kolkata',
  is_deleted: false,
  is_suspended: false,
  suspension_reason: '',
  deactivated_at: null,
  google_id: null,
  apple_id: null,
  patient_profile: null,
  practitioner_profile: null,
  date_joined: '2024-01-01T00:00:00.000000Z',
  created_at: '2024-01-01T00:00:00.000000Z',
  updated_at: '2026-05-16T10:00:00.000000Z',
};
