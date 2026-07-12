/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { BookablePractitioner, PractitionerCategory, PractitionerDayAvailability } from './types';

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  color: string;
}

export const PLANS: Plan[] = [
  {
    id: 'foundation',
    name: 'Foundation',
    price: 1999,
    color: '#8B9A46', // Olive green
    features: [
      'Group Yoga Sessions: Daily (Mon–Fri)',
      'AI Personalization: Limited',
      'Condition Programs: Basic',
      'No access to 1-on-1 or specialist services'
    ]
  },
  {
    id: 'balanced',
    name: 'Balanced',
    price: 4999,
    color: '#4B7399', // Professional blue
    features: [
      '1-on-1 Yoga Therapy: 4 sessions/month',
      'AI Personalization: Personalized recommendations + tracking',
      'Condition Programs: Advanced structured programs',
      'Group Yoga: Available',
      'Doctor Consultation: 2 sessions',
      'Nutrition Support: 2 sessions'
    ]
  },
  {
    id: 'transform',
    name: 'Transform',
    price: 11999,
    color: '#2A2A2A', // Premium dark
    features: [
      '1-on-1 Yoga Therapy: 12 sessions/month',
      'AI Personalization: Advanced predictive system',
      'Condition Programs: Clinical recovery programs',
      'Doctor Consultation: 2 sessions/month',
      'Nutrition Support: 4 sessions/month',
      'Physiotherapy: 4 sessions/month',
      'Psychologist Support: 2 sessions/month'
    ]
  }
];

export interface User {
  id: string;
  email: string;
  name: string;
  planId?: string;
  onboarded: boolean;
}

export interface Session {
  id: string;
  type: 'yoga-group' | 'yoga-1on1' | 'doctor' | 'nutrition' | 'physio' | 'psych';
  title: string;
  provider?: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'missed' | 'cancelled';
}

export const MOCK_SESSIONS: Session[] = [
  {
    id: '1',
    type: 'yoga-1on1',
    title: 'Therapeutic Yoga',
    provider: 'Dr. Sarah Smith',
    date: '2026-07-13',
    time: '08:00 AM',
    status: 'upcoming',
  },
  {
    id: '2',
    type: 'nutrition',
    title: 'Dietary Review',
    provider: 'Nutritionist Emma Brown',
    date: '2026-07-14',
    time: '02:00 PM',
    status: 'upcoming',
  },
  {
    id: '3',
    type: 'yoga-group',
    title: 'Morning Flow Yoga',
    date: '2026-07-13',
    time: '07:30 AM',
    status: 'upcoming',
  },
  {
    id: '4',
    type: 'doctor',
    title: 'Health Consultation',
    provider: 'Dr. Rajan Pillai',
    date: '2026-07-15',
    time: '10:00 AM',
    status: 'upcoming',
  },
  {
    id: '5',
    type: 'yoga-1on1',
    title: 'Spinal Therapy',
    provider: 'Dr. Sarah Smith',
    date: '2026-07-16',
    time: '08:00 AM',
    status: 'upcoming',
  },
  {
    id: '6',
    type: 'psych',
    title: 'Mindfulness Check-in',
    provider: 'Dr. Leena Varma',
    date: '2026-07-18',
    time: '03:00 PM',
    status: 'upcoming',
  },
  {
    id: '7',
    type: 'yoga-group',
    title: 'Community Flow',
    date: '2026-07-08',
    time: '07:30 AM',
    status: 'completed',
  },
  {
    id: '8',
    type: 'nutrition',
    title: 'Intake Assessment',
    provider: 'Nutritionist Emma Brown',
    date: '2026-07-05',
    time: '11:00 AM',
    status: 'completed',
  },
];

export interface HealthSummary {
  diagnoses: string[];
  medications: { name: string; dosage: string }[];
  labValues: { test: string; value: string; status: 'normal' | 'low' | 'high' }[];
  safePoses: string[];
  avoidPoses: string[];
  contraindications: string[];
  imagingFindings: string;
  recommendations: string[];
  extractedAt: string;
}

export interface HealthDocument {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  status: 'processing' | 'done' | 'error';
  summary?: HealthSummary;
}

export interface GroupSession {
  id: string;
  title: string;
  category: 'yoga' | 'breathwork' | 'meditation' | 'mobility';
  instructor: string;
  instructorTitle: string;
  days: string[];
  time: string;
  duration: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  capacity: number;
  enrolled: number;
  description: string;
  planRequired: 'foundation' | 'balanced' | 'transform';
  tags: string[];
}

export const GROUP_SESSIONS: GroupSession[] = [
  {
    id: 'gs-1',
    title: 'Morning Flow Yoga',
    category: 'yoga',
    instructor: 'Priya Nair',
    instructorTitle: 'Yoga Therapist',
    days: ['Mon', 'Wed', 'Fri'],
    time: '07:30 AM',
    duration: 45,
    level: 'Beginner',
    capacity: 20,
    enrolled: 14,
    description: 'A gentle morning flow to awaken the body and calm the mind. Ideal for all levels, focusing on spinal mobility and breath awareness.',
    planRequired: 'foundation',
    tags: ['Spine', 'Breath', 'Morning'],
  },
  {
    id: 'gs-2',
    title: 'Spinal Recovery Yoga',
    category: 'yoga',
    instructor: 'Dr. Arjun Mehta',
    instructorTitle: 'Clinical Yoga Specialist',
    days: ['Tue', 'Thu'],
    time: '08:00 AM',
    duration: 60,
    level: 'Intermediate',
    capacity: 15,
    enrolled: 11,
    description: 'Therapeutic sequences targeting lower back pain and spinal alignment. Evidence-based postures designed for recovery and long-term resilience.',
    planRequired: 'foundation',
    tags: ['Back Pain', 'Therapeutic', 'Recovery'],
  },
  {
    id: 'gs-3',
    title: 'Pranayama & Breathwork',
    category: 'breathwork',
    instructor: 'Kavitha Rao',
    instructorTitle: 'Breath Coach',
    days: ['Mon', 'Wed', 'Fri'],
    time: '06:30 AM',
    duration: 30,
    level: 'Beginner',
    capacity: 25,
    enrolled: 19,
    description: 'Explore ancient pranayama techniques including Nadi Shodhana, Kapalbhati, and Bhramari. Reduce stress and build respiratory strength.',
    planRequired: 'foundation',
    tags: ['Stress', 'Breath', 'Calm'],
  },
  {
    id: 'gs-4',
    title: 'Guided Meditation',
    category: 'meditation',
    instructor: 'Siddharth Iyer',
    instructorTitle: 'Mindfulness Practitioner',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    time: '07:00 PM',
    duration: 20,
    level: 'Beginner',
    capacity: 30,
    enrolled: 22,
    description: 'End your day with a guided mindfulness session. Body scan, visualization, and breath anchoring techniques to improve sleep and mental clarity.',
    planRequired: 'foundation',
    tags: ['Sleep', 'Mindfulness', 'Evening'],
  },
  {
    id: 'gs-5',
    title: 'Hip & Joint Mobility',
    category: 'mobility',
    instructor: 'Meera Suresh',
    instructorTitle: 'Physiotherapy Specialist',
    days: ['Tue', 'Thu'],
    time: '09:30 AM',
    duration: 45,
    level: 'Intermediate',
    capacity: 12,
    enrolled: 8,
    description: 'Targeted joint mobilization for hips, knees, and ankles. Great for desk workers, athletes, and anyone managing chronic joint stiffness.',
    planRequired: 'balanced',
    tags: ['Joints', 'Mobility', 'Pain Relief'],
  },
];

export const MOCK_AI_DATA = {
  wellnessScore: 78,
  streak: 5,
  radarData: [
    { subject: 'Pain Reduction', A: 85, fullMark: 100 },
    { subject: 'Consistency', A: 90, fullMark: 100 },
    { subject: 'Flexibility', A: 65, fullMark: 100 },
    { subject: 'Strength', A: 70, fullMark: 100 },
    { subject: 'Breathing', A: 80, fullMark: 100 },
    { subject: 'Mental Focus', A: 75, fullMark: 100 },
  ],
  insights: [
    "Your flexibility in Forward Folds has improved by 15% this month.",
    "Morning sessions (7-9 AM) correlate with your highest energy levels.",
    "Increased breathing consistency noted during balance poses."
  ],
  recommendations: [
    { title: "Magnesium-Rich Diet", description: "Incorporate more spinach and pumpkin seeds to aid muscle recovery.", type: "nutrition" },
    { title: "Deep Breathing Ex", description: "Try 5 mins of Nadi Shodhana before bed to improve sleep quality.", type: "lifestyle" }
  ]
};

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

export interface PatientProfileFields {
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | '';
  dateOfBirth: string;
  primaryConcern: string;
  yogaExperience: 'beginner' | 'some' | 'intermediate' | 'advanced' | '';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | '';
  preferredDurationMinutes: number;
  location: string;
  tier: string;
  wellnessScore: number;
  streakDays: number;
  longestStreak: number;
  lastSessionDate: string;
  metadata: Record<string, string | number | boolean>;
}

export const MOCK_PERSONAL_PROFILE: PersonalProfileFields = {
  firstName: 'Priya',
  lastName: 'Sharma',
  phone: '+91 98765 43210',
  timezone: 'Asia/Kolkata',
  emergencyName: 'Raj Sharma',
  emergencyPhone: '+91 98765 43211',
  emergencyRelation: 'spouse',
  onboardingCompleted: true,
  onboardingStep: 3,
};

export const MOCK_PATIENT_PROFILE: PatientProfileFields = {
  gender: 'female',
  dateOfBirth: '1992-08-14',
  primaryConcern: 'Lower back pain & stress management',
  yogaExperience: 'some',
  activityLevel: 'light',
  preferredDurationMinutes: 45,
  location: 'Bengaluru, India',
  tier: 'silver',
  wellnessScore: MOCK_AI_DATA.wellnessScore,
  streakDays: MOCK_AI_DATA.streak,
  longestStreak: 12,
  lastSessionDate: '2026-07-10',
  metadata: { preferred_session_time: 'morning', ai_insights_enabled: true },
};

export const MOCK_BOOKING_PROFILES: import('./types').BookingProfile[] = [
  {
    id: 'bp-1',
    name: 'Priya Sharma',
    relationship: 'self',
    dateOfBirth: '1992-08-14',
    healthConditions: ['Lower back pain', 'Mild anxiety'],
    isActive: true,
    emergencyName: 'Raj Sharma',
    emergencyPhone: '+91 98765 43211',
    emergencyRelation: 'spouse',
    notes: 'Prefers morning sessions',
    isDefault: true,
  },
  {
    id: 'bp-2',
    name: 'Aarav Sharma',
    relationship: 'child',
    dateOfBirth: '2018-03-10',
    healthConditions: ['Asthma'],
    isActive: true,
    emergencyName: 'Priya Sharma',
    emergencyPhone: '+91 98765 43210',
    emergencyRelation: 'mother',
    notes: 'Allergic to pollen',
    isDefault: false,
  },
];

export const MOCK_PATIENT_EXPORT_DATA = {
  user: {
    email: 'priya@example.com',
    role: 'patient',
    ...MOCK_PERSONAL_PROFILE,
  },
  patient_profile: MOCK_PATIENT_PROFILE,
  booking_profiles: MOCK_BOOKING_PROFILES,
  sessions: MOCK_SESSIONS.filter(s => s.status === 'completed').length,
  consents: ['terms_of_service', 'privacy_policy', 'session_waiver'],
};

export const PRACTITIONER_CATEGORIES: { id: PractitionerCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'yoga', label: 'Yoga' },
  { id: 'doctor', label: 'Doctor' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'psych', label: 'Psychology' },
  { id: 'physio', label: 'Physiotherapy' },
  { id: 'breathwork', label: 'Breathwork' },
];

const LANG_LABELS: Record<string, string> = {
  en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu', ml: 'Malayalam', kn: 'Kannada', mr: 'Marathi',
};

export function languageLabel(code: string) {
  return LANG_LABELS[code] ?? code;
}

/** Verified practitioners available for booking */
export const MOCK_PRACTITIONERS: BookablePractitioner[] = [
  {
    id: 't1', firstName: 'Sarah', lastName: 'Smith', category: 'yoga',
    title: 'Senior Yoga Therapist',
    bio: 'RYT-500 certified yoga therapist specializing in therapeutic movement and chronic pain management.',
    rating: 4.9, totalSessions: 312, experienceYears: 12, consultationFee: 800,
    languages: ['en', 'hi'], specializations: ['Hatha Yoga', 'Therapeutic Yoga'],
    isOnline: true, bookingBufferDays: 1, durationMinutes: 45,
    availableWeekdays: [1, 2, 3, 4, 5],
    baseSlots: ['08:00 AM', '09:30 AM', '11:00 AM', '02:00 PM', '04:30 PM'],
    bookedByDate: { '2026-07-14': ['09:30 AM', '02:00 PM'], '2026-07-16': ['08:00 AM'] },
    offDates: [],
  },
  {
    id: 't3', firstName: 'Arjun', lastName: 'Mehta', category: 'yoga',
    title: 'Clinical Yoga Specialist',
    bio: 'Integrates clinical yoga with evidence-based protocols for spine and joint conditions.',
    rating: 4.7, totalSessions: 189, experienceYears: 8, consultationFee: 750,
    languages: ['en', 'hi', 'mr'], specializations: ['Clinical Yoga', 'Spine Health'],
    isOnline: true, bookingBufferDays: 1, durationMinutes: 60,
    availableWeekdays: [1, 3, 5],
    baseSlots: ['07:30 AM', '09:00 AM', '11:30 AM', '03:00 PM'],
    bookedByDate: { '2026-07-15': ['09:00 AM'] },
    offDates: ['2026-07-18'],
  },
  {
    id: 't4', firstName: 'Rajan', lastName: 'Pillai', category: 'doctor',
    title: 'General Physician',
    bio: 'General physician with focus on preventive care and holistic wellness consultations.',
    rating: 4.9, totalSessions: 421, experienceYears: 15, consultationFee: 600,
    languages: ['en', 'ml'], specializations: ['General Medicine', 'Preventive Care'],
    isOnline: true, bookingBufferDays: 2, durationMinutes: 30,
    availableWeekdays: [1, 2, 3, 4, 5],
    baseSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM'],
    bookedByDate: { '2026-07-14': ['10:00 AM', '11:30 AM'], '2026-07-17': ['02:00 PM'] },
    offDates: [],
  },
  {
    id: 't5', firstName: 'Emma', lastName: 'Wilson', category: 'nutrition',
    title: 'Clinical Nutritionist',
    bio: 'Personalized nutrition plans for metabolic health, weight management, and chronic conditions.',
    rating: 4.6, totalSessions: 156, experienceYears: 7, consultationFee: 700,
    languages: ['en'], specializations: ['Clinical Nutrition', 'Metabolic Health'],
    isOnline: true, bookingBufferDays: 1, durationMinutes: 30,
    availableWeekdays: [2, 4, 6],
    baseSlots: ['09:00 AM', '11:00 AM', '01:00 PM', '03:30 PM'],
    bookedByDate: { '2026-07-15': ['11:00 AM'] },
    offDates: [],
  },
  {
    id: 't6', firstName: 'Leena', lastName: 'Varma', category: 'psych',
    title: 'Clinical Psychologist',
    bio: 'CBT and mindfulness-based therapy for anxiety, stress, and lifestyle-related mental health concerns.',
    rating: 4.8, totalSessions: 203, experienceYears: 9, consultationFee: 850,
    languages: ['en', 'hi'], specializations: ['CBT', 'Mindfulness'],
    isOnline: true, bookingBufferDays: 2, durationMinutes: 45,
    availableWeekdays: [1, 2, 4, 5],
    baseSlots: ['10:30 AM', '12:00 PM', '03:00 PM', '05:00 PM'],
    bookedByDate: { '2026-07-14': ['03:00 PM'], '2026-07-16': ['10:30 AM', '12:00 PM'] },
    offDates: [],
  },
  {
    id: 't2', firstName: 'Michael', lastName: 'Chen', category: 'physio',
    title: 'Sports Physiotherapist',
    bio: 'Specializes in sports injury rehabilitation and post-operative recovery programs.',
    rating: 4.8, totalSessions: 245, experienceYears: 10, consultationFee: 900,
    languages: ['en'], specializations: ['Sports Rehab', 'Manual Therapy'],
    isOnline: false, bookingBufferDays: 1, durationMinutes: 45,
    availableWeekdays: [1, 2, 3, 4, 5],
    baseSlots: ['09:00 AM', '10:30 AM', '12:00 PM', '02:30 PM', '04:00 PM'],
    bookedByDate: { '2026-07-15': ['10:30 AM', '12:00 PM'] },
    offDates: ['2026-07-13'],
  },
  {
    id: 't7', firstName: 'Kavitha', lastName: 'Rao', category: 'breathwork',
    title: 'Breathwork Coach',
    bio: 'Pranayama and breathwork techniques for stress reduction and respiratory wellness.',
    rating: 4.5, totalSessions: 98, experienceYears: 5, consultationFee: 500,
    languages: ['en', 'kn'], specializations: ['Pranayama', 'Breathwork'],
    isOnline: true, bookingBufferDays: 0, durationMinutes: 30,
    availableWeekdays: [1, 3, 5, 6],
    baseSlots: ['06:30 AM', '08:00 AM', '05:30 PM', '07:00 PM'],
    bookedByDate: { '2026-07-14': ['06:30 AM'] },
    offDates: [],
  },
];

function toDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number) {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

/** Build availability calendar for a practitioner (next 14 days from today). */
export function getPractitionerAvailability(p: BookablePractitioner, from = new Date()): PractitionerDayAvailability[] {
  const days: PractitionerDayAvailability[] = [];
  const today = new Date(from);
  today.setHours(12, 0, 0, 0);

  for (let i = 0; i < 14; i++) {
    const date = addDays(today, i);
    const key = toDateKey(date);
    const weekday = date.getDay();
    const bufferOk = i >= p.bookingBufferDays;
    const weekdayOk = p.availableWeekdays.includes(weekday);
    const notOff = !p.offDates.includes(key);

    if (!bufferOk || !weekdayOk || !notOff) continue;

    const booked = p.bookedByDate[key] ?? [];
    const slots = p.baseSlots.map(time => ({
      time,
      available: !booked.includes(time),
    }));

    if (slots.some(s => s.available)) {
      days.push({ date: key, slots });
    }
  }
  return days;
}

export function nextAvailableSlot(p: BookablePractitioner): { date: string; time: string } | null {
  const days = getPractitionerAvailability(p);
  for (const day of days) {
    const slot = day.slots.find(s => s.available);
    if (slot) return { date: day.date, time: slot.time };
  }
  return null;
}

export function formatAvailDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const tomorrow = addDays(today, 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export const CATEGORY_STYLE: Record<PractitionerCategory, { bg: string; text: string; label: string }> = {
  yoga: { bg: 'bg-[#f0f4ee]', text: 'text-forest', label: 'Yoga' },
  doctor: { bg: 'bg-[#eef3f9]', text: 'text-[#4B7399]', label: 'Doctor' },
  nutrition: { bg: 'bg-[#fdf3ec]', text: 'text-terracotta', label: 'Nutrition' },
  psych: { bg: 'bg-[#f3f0f9]', text: 'text-[#7B5EA7]', label: 'Psychology' },
  physio: { bg: 'bg-[#eef8f4]', text: 'text-[#2d6a4f]', label: 'Physiotherapy' },
  breathwork: { bg: 'bg-[#f0f7fa]', text: 'text-[#3d7a9a]', label: 'Breathwork' },
};
