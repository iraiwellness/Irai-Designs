// ── Types ──────────────────────────────────────────────────────────────────────

export type BookingType = 'yoga-1on1' | 'yoga-group' | 'doctor' | 'nutrition' | 'physio' | 'psych';
export type BookingStatus = 'upcoming' | 'completed' | 'cancelled' | 'missed';
export type TherapistStatus = 'active' | 'pending' | 'inactive';
export type PlanId = 'foundation' | 'balanced' | 'transform';
export type DisputeType = 'cancellation' | 'no-show' | 'quality' | 'billing';
export type DisputeStatus = 'open' | 'resolved' | 'escalated';
export type Priority = 'high' | 'medium' | 'low';
export type SessionStatus = 'published' | 'draft';
export type ActivityType = 'booking' | 'join' | 'cancel' | 'signup' | 'complete';

export interface AdminBooking {
  id: string;
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
  name: string;
  specialty: string;
  rating: number;
  totalSessions: number;
  activeClients: number;
  status: TherapistStatus;
  joinedDate: string;
  loadPercent: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  planId: PlanId;
  joinedDate: string;
  totalSessions: number;
  status: 'active' | 'inactive';
  onboarded: boolean;
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
  userName: string;
  therapistName: string;
  issueType: DisputeType;
  description: string;
  date: string;
  status: DisputeStatus;
  priority: Priority;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  message: string;
  time: string;
}

// ── Platform Stats ─────────────────────────────────────────────────────────────

export const ADMIN_STATS = {
  totalUsers: 284,
  totalTherapists: 12,
  bookingsToday: 47,
  weeklyRevenue: 184000,
  completionRate: 94,
  activeSessions: 8,
  openDisputes: 3,
  pendingTherapists: 1,
};

// ── Bookings ───────────────────────────────────────────────────────────────────

export const ADMIN_BOOKINGS: AdminBooking[] = [
  { id: 'b1', userName: 'Priya Sharma', therapistName: 'Dr. Sarah Smith', type: 'yoga-1on1', date: '2026-05-16', time: '08:00 AM', status: 'upcoming', planId: 'transform', duration: 45 },
  { id: 'b2', userName: 'Rahul Mehta', therapistName: 'Dr. Arjun Mehta', type: 'yoga-group', date: '2026-05-16', time: '07:30 AM', status: 'upcoming', planId: 'foundation', duration: 45 },
  { id: 'b3', userName: 'Anita Nair', therapistName: 'Dr. Rajan Pillai', type: 'doctor', date: '2026-05-16', time: '10:00 AM', status: 'completed', planId: 'balanced', duration: 30 },
  { id: 'b4', userName: 'Suresh Kumar', therapistName: 'Nutritionist Emma', type: 'nutrition', date: '2026-05-15', time: '02:00 PM', status: 'completed', planId: 'balanced', duration: 30 },
  { id: 'b5', userName: 'Deepa Krishnan', therapistName: 'Dr. Sarah Smith', type: 'yoga-1on1', date: '2026-05-15', time: '04:30 PM', status: 'cancelled', planId: 'transform', duration: 45 },
  { id: 'b6', userName: 'Vikram Singh', therapistName: 'Dr. Leena Varma', type: 'psych', date: '2026-05-15', time: '03:00 PM', status: 'completed', planId: 'transform', duration: 45 },
  { id: 'b7', userName: 'Meera Patel', therapistName: 'Meera Suresh', type: 'physio', date: '2026-05-14', time: '11:00 AM', status: 'completed', planId: 'transform', duration: 45 },
  { id: 'b8', userName: 'Arun Das', therapistName: 'Dr. Michael Chen', type: 'yoga-1on1', date: '2026-05-14', time: '09:30 AM', status: 'missed', planId: 'balanced', duration: 45 },
  { id: 'b9', userName: 'Lakshmi Iyer', therapistName: 'Dr. Arjun Mehta', type: 'yoga-group', date: '2026-05-17', time: '07:30 AM', status: 'upcoming', planId: 'foundation', duration: 45 },
  { id: 'b10', userName: 'Karthik Rao', therapistName: 'Dr. Rajan Pillai', type: 'doctor', date: '2026-05-17', time: '10:00 AM', status: 'upcoming', planId: 'balanced', duration: 30 },
];

// ── Therapists ─────────────────────────────────────────────────────────────────

export const ADMIN_THERAPISTS: AdminTherapist[] = [
  { id: 't1', name: 'Dr. Sarah Smith', specialty: 'Yoga Therapist', rating: 4.9, totalSessions: 312, activeClients: 28, status: 'active', joinedDate: '2024-01-15', loadPercent: 87 },
  { id: 't2', name: 'Dr. Michael Chen', specialty: 'Physiotherapist', rating: 4.8, totalSessions: 245, activeClients: 22, status: 'active', joinedDate: '2024-02-10', loadPercent: 72 },
  { id: 't3', name: 'Dr. Arjun Mehta', specialty: 'Clinical Yoga Specialist', rating: 4.7, totalSessions: 189, activeClients: 18, status: 'active', joinedDate: '2024-03-05', loadPercent: 65 },
  { id: 't4', name: 'Dr. Rajan Pillai', specialty: 'General Physician', rating: 4.9, totalSessions: 421, activeClients: 35, status: 'active', joinedDate: '2023-11-20', loadPercent: 92 },
  { id: 't5', name: 'Nutritionist Emma', specialty: 'Clinical Nutritionist', rating: 4.6, totalSessions: 156, activeClients: 14, status: 'active', joinedDate: '2024-04-01', loadPercent: 53 },
  { id: 't6', name: 'Dr. Leena Varma', specialty: 'Psychologist', rating: 4.8, totalSessions: 203, activeClients: 19, status: 'active', joinedDate: '2024-01-30', loadPercent: 78 },
  { id: 't7', name: 'Kavitha Rao', specialty: 'Breathwork Coach', rating: 4.5, totalSessions: 98, activeClients: 12, status: 'active', joinedDate: '2024-05-01', loadPercent: 45 },
  { id: 't8', name: 'Dr. Neha Joshi', specialty: 'Sports Physiotherapist', rating: 0, totalSessions: 0, activeClients: 0, status: 'pending', joinedDate: '2026-05-10', loadPercent: 0 },
];

// ── Users ──────────────────────────────────────────────────────────────────────

export const ADMIN_USERS: AdminUser[] = [
  { id: 'u1', name: 'Priya Sharma', email: 'priya@example.com', planId: 'transform', joinedDate: '2026-01-15', totalSessions: 48, status: 'active', onboarded: true },
  { id: 'u2', name: 'Rahul Mehta', email: 'rahul@example.com', planId: 'foundation', joinedDate: '2026-02-20', totalSessions: 32, status: 'active', onboarded: true },
  { id: 'u3', name: 'Anita Nair', email: 'anita@example.com', planId: 'balanced', joinedDate: '2026-03-05', totalSessions: 24, status: 'active', onboarded: true },
  { id: 'u4', name: 'Suresh Kumar', email: 'suresh@example.com', planId: 'balanced', joinedDate: '2026-03-12', totalSessions: 19, status: 'active', onboarded: true },
  { id: 'u5', name: 'Deepa Krishnan', email: 'deepa@example.com', planId: 'transform', joinedDate: '2025-12-01', totalSessions: 67, status: 'active', onboarded: true },
  { id: 'u6', name: 'Vikram Singh', email: 'vikram@example.com', planId: 'transform', joinedDate: '2026-01-08', totalSessions: 41, status: 'active', onboarded: true },
  { id: 'u7', name: 'Meera Patel', email: 'meera@example.com', planId: 'foundation', joinedDate: '2026-04-18', totalSessions: 8, status: 'active', onboarded: true },
  { id: 'u8', name: 'Arun Das', email: 'arun@example.com', planId: 'balanced', joinedDate: '2026-05-01', totalSessions: 3, status: 'active', onboarded: false },
  { id: 'u9', name: 'Lakshmi Iyer', email: 'lakshmi@example.com', planId: 'foundation', joinedDate: '2026-05-10', totalSessions: 1, status: 'active', onboarded: true },
  { id: 'u10', name: 'Karthik Rao', email: 'karthik@example.com', planId: 'balanced', joinedDate: '2026-05-12', totalSessions: 0, status: 'active', onboarded: false },
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
  { id: 'd1', userName: 'Deepa Krishnan', therapistName: 'Dr. Sarah Smith', issueType: 'cancellation', description: 'Session cancelled 2 hours before start. User is requesting a full refund.', date: '2026-05-15', status: 'open', priority: 'high' },
  { id: 'd2', userName: 'Arun Das', therapistName: 'Dr. Michael Chen', issueType: 'no-show', description: 'Therapist did not appear for the scheduled session at 09:30 AM.', date: '2026-05-14', status: 'open', priority: 'high' },
  { id: 'd3', userName: 'Suresh Kumar', therapistName: 'Nutritionist Emma', issueType: 'quality', description: 'Session quality was below expectations. Diet plan was not personalized.', date: '2026-05-10', status: 'escalated', priority: 'medium' },
  { id: 'd4', userName: 'Meera Patel', therapistName: 'Meera Suresh', issueType: 'billing', description: 'User was charged twice for the same physiotherapy session.', date: '2026-05-08', status: 'resolved', priority: 'low' },
];

// ── Recent Activity ────────────────────────────────────────────────────────────

export const ADMIN_ACTIVITY: ActivityItem[] = [
  { id: 'ac1', type: 'booking', message: 'Priya Sharma booked 1-on-1 yoga with Dr. Sarah Smith', time: '2 min ago' },
  { id: 'ac2', type: 'signup', message: 'New user Karthik Rao joined on Balanced plan', time: '15 min ago' },
  { id: 'ac3', type: 'complete', message: 'Anita Nair completed Doctor consultation with Dr. Rajan Pillai', time: '1 hr ago' },
  { id: 'ac4', type: 'cancel', message: 'Deepa Krishnan cancelled Yoga session — dispute raised', time: '2 hr ago' },
  { id: 'ac5', type: 'join', message: 'Lakshmi Iyer joined Morning Flow Yoga group session', time: '3 hr ago' },
  { id: 'ac6', type: 'booking', message: 'Vikram Singh booked Psychology session with Dr. Leena Varma', time: '5 hr ago' },
];
