import { Patient, Appointment, Practitioner, AISessionNote, PractitionerGroupSession, PractitionerBreak, ClientRequest, AttentionNotification, PersonalProfileFields, PractitionerProfileFields, LookupSpecialization, LookupLanguage, PublicService, PublicLocation, PublicReview } from './types';

export const MOCK_PRACTITIONER: Practitioner = {
  id: 'p1',
  name: 'Dr. Sarah Mitchell',
  title: 'Clinical Nutritionist',
  specialty: 'Nutritionist',
  rating: 4.9,
  totalClients: 124,
  activeRelationships: 118,
  experience: '8 Years',
  about: 'Specializing in holistic nutrition and metabolic health. Helping clients lead a balanced life through mindful eating.',
};

export const MOCK_CLIENT_REQUESTS: ClientRequest[] = [
  { id: 'rel-1', name: 'Priya Sharma', serviceType: 'Nutrition Consultation', requestedAt: '2 hr ago' },
  { id: 'rel-2', name: 'Arjun Mehta', serviceType: 'Yoga Therapy', requestedAt: 'Yesterday' },
];

export const MOCK_ATTENTION_NOTIFICATIONS: AttentionNotification[] = [
  {
    id: 'n1',
    type: 'new_message',
    title: 'New message from Emma Watson',
    body: 'Can we reschedule tomorrow\'s session?',
    createdAt: '30 min ago',
  },
  {
    id: 'n2',
    type: 'session_reminder',
    title: 'Session in 1 hour',
    body: 'Follow-up with James Rodriguez at 11:30 AM',
    createdAt: '1 hour ago',
  },
];

export const MOCK_ADMIN_PERSONAL_PROFILE: PersonalProfileFields = {
  firstName: 'Admin',
  lastName: 'User',
  phone: '+91 90000 12345',
  timezone: 'Asia/Kolkata',
  emergencyName: 'Support Desk',
  emergencyPhone: '+91 90000 12346',
  emergencyRelation: 'colleague',
  onboardingCompleted: true,
  onboardingStep: 5,
};

export const MOCK_PERSONAL_PROFILE: PersonalProfileFields = {
  firstName: 'Sarah',
  lastName: 'Mitchell',
  phone: '+91 98765 43210',
  timezone: 'Asia/Kolkata',
  emergencyName: 'John Mitchell',
  emergencyPhone: '+91 98765 43211',
  emergencyRelation: 'spouse',
  onboardingCompleted: true,
  onboardingStep: 4,
};

export const MOCK_PROFESSIONAL_PROFILE: PractitionerProfileFields = {
  title: 'Clinical Nutritionist',
  bio: 'Specializing in holistic nutrition and metabolic health. RYT-500 certified with 8+ years of clinical practice.',
  specializations: ['hatha-yoga', 'nutrition'],
  languages: ['en', 'hi'],
  qualifications: ['MSc Clinical Nutrition', 'RYT-500'],
  experienceYears: 8,
  consultationFee: 500,
  isOnline: true,
  maxSessionsPerDay: 8,
  maxSessionsPerWeek: 40,
  bookingBufferDays: 1,
  videoIntroUrl: 'https://example.com/sarah-intro.mp4',
  verifiedAt: '2024-02-01T10:00:00.000000Z',
  metadata: { specialty: 'clinical-nutrition' },
};

/** Lookup catalog for specializations */
export const LOOKUP_SPECIALIZATIONS: LookupSpecialization[] = [
  { id: 1, name: 'Hatha Yoga', slug: 'hatha-yoga' },
  { id: 2, name: 'Vinyasa Flow', slug: 'vinyasa-flow' },
  { id: 3, name: 'Clinical Nutrition', slug: 'nutrition' },
  { id: 4, name: 'Ashtanga', slug: 'ashtanga' },
  { id: 5, name: 'Therapeutic Yoga', slug: 'therapeutic-yoga' },
];

/** Lookup catalog for languages */
export const LOOKUP_LANGUAGES: LookupLanguage[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'kn', name: 'Kannada' },
];

export const MOCK_PRACTITIONER_EXPORT_DATA = {
  id: 1,
  email: 'dr.sarah@irai.com',
  first_name: 'Sarah',
  last_name: 'Mitchell',
  role: 'practitioner',
  phone: '+91 98765 43210',
  timezone: 'Asia/Kolkata',
  onboarding_completed: true,
  onboarding_step: 4,
  patient_profile: null,
  practitioner_profile: {
    title: 'Clinical Nutritionist',
    specializations: ['hatha-yoga', 'nutrition'],
    languages: ['en', 'hi'],
    status: 'verified',
    consultation_fee: '500.00',
  },
  date_joined: '2023-06-15T00:00:00.000000Z',
};

/** Public practitioner detail extras */
export const MOCK_PUBLIC_SERVICES: PublicService[] = [
  { id: 1, serviceType: 3, name: '1-on-1 Nutrition Consultation', durationMinutes: 45, price: '500.00', description: 'Personalized nutrition assessment and meal planning.', isActive: true },
  { id: 2, serviceType: 3, name: 'Follow-up Session', durationMinutes: 30, price: '350.00', description: 'Progress review and plan adjustments.', isActive: true },
];

export const MOCK_PUBLIC_LOCATIONS: PublicLocation[] = [
  { id: 1, name: 'IRAI Virtual Clinic', address: 'Online — video sessions', city: 'Remote', isActive: true },
  { id: 2, name: 'Mumbai Wellness Centre', address: '42 Health Park, Bandra West', city: 'Mumbai', isActive: true },
];

export const MOCK_PUBLIC_REVIEWS: PublicReview[] = [
  { id: 1, session: 42, rating: 5, comment: 'Excellent session! Very thorough and personalized advice.', createdAt: '2026-05-10T14:00:00.000000Z' },
  { id: 2, session: 38, rating: 5, comment: 'Helped me understand my PCOS diet plan clearly.', createdAt: '2026-04-26T10:30:00.000000Z' },
  { id: 3, session: 31, rating: 4, comment: 'Great follow-up, would recommend.', createdAt: '2026-04-12T09:00:00.000000Z' },
];

export const MOCK_SIGNUP_RESPONSE = {
  user: {
    id: 99,
    email: 'new.practitioner@example.com',
    first_name: 'New',
    last_name: 'Practitioner',
    role: 'practitioner',
    onboarding_completed: false,
    onboarding_step: 0,
    practitioner_profile: { status: 'pending', verified_at: null },
  },
  access: 'eyJhbGciOiJIUzI1NiIs...',
  refresh: 'eyJhbGciOiJIUzI1NiIs...',
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pt1',
    relationshipId: 1,
    patientUserId: 101,
    practitionerId: 1,
    serviceTypeId: 3,
    name: 'Emma Watson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    condition: 'PCOS Management',
    serviceType: 'Nutrition Consultation',
    relationshipStatus: 'active',
    healthAccessGranted: true,
    requestedAt: '2024-01-10T09:00:00.000000Z',
    acceptedAt: '2024-01-10T14:30:00.000000Z',
    rejectedAt: null,
    endedAt: null,
    lastConsultation: '2024-05-10',
    nextAppointment: '2024-05-15',
    email: 'emma.w@example.com',
    phone: '+1 234 567 8901',
  },
  {
    id: 'pt2',
    relationshipId: 2,
    patientUserId: 102,
    practitionerId: 1,
    serviceTypeId: 3,
    name: 'James Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    condition: 'Weight Loss',
    serviceType: 'Nutrition Consultation',
    relationshipStatus: 'active',
    healthAccessGranted: false,
    requestedAt: '2024-02-05T11:00:00.000000Z',
    acceptedAt: '2024-02-06T09:15:00.000000Z',
    rejectedAt: null,
    endedAt: null,
    lastConsultation: '2024-05-08',
    nextAppointment: '2024-05-20',
    email: 'james.r@example.com',
    phone: '+1 234 567 8902',
  },
  {
    id: 'pt3',
    relationshipId: 3,
    patientUserId: 103,
    practitionerId: 1,
    serviceTypeId: 3,
    name: 'Sophia Chen',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    condition: 'Ketogenic Diet',
    serviceType: 'Nutrition Consultation',
    relationshipStatus: 'active',
    healthAccessGranted: true,
    requestedAt: '2024-03-01T08:00:00.000000Z',
    acceptedAt: '2024-03-01T16:00:00.000000Z',
    rejectedAt: null,
    endedAt: null,
    lastConsultation: '2024-05-01',
    nextAppointment: '2024-05-18',
    email: 'sophia.c@example.com',
    phone: '+1 234 567 8903',
  },
  {
    id: 'rel-1',
    relationshipId: 4,
    patientUserId: 104,
    practitionerId: 1,
    serviceTypeId: 3,
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    condition: 'General wellness',
    serviceType: 'Nutrition Consultation',
    relationshipStatus: 'requested',
    healthAccessGranted: false,
    requestedAt: '2026-05-16T12:00:00.000000Z',
    acceptedAt: null,
    rejectedAt: null,
    endedAt: null,
    lastConsultation: '',
    nextAppointment: '',
    email: 'priya@example.com',
    phone: '+91 98765 11111',
  },
  {
    id: 'rel-2',
    relationshipId: 5,
    patientUserId: 105,
    practitionerId: 1,
    serviceTypeId: 2,
    name: 'Arjun Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    condition: 'Back pain recovery',
    serviceType: 'Yoga Therapy',
    relationshipStatus: 'requested',
    healthAccessGranted: false,
    requestedAt: '2026-05-15T10:30:00.000000Z',
    acceptedAt: null,
    rejectedAt: null,
    endedAt: null,
    lastConsultation: '',
    nextAppointment: '',
    email: 'arjun@example.com',
    phone: '+91 98765 22222',
  },
  {
    id: 'pt4',
    relationshipId: 6,
    patientUserId: 106,
    practitionerId: 1,
    serviceTypeId: 3,
    name: 'Lakshmi Iyer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop',
    condition: 'Diabetes management',
    serviceType: 'Nutrition Consultation',
    relationshipStatus: 'ended',
    healthAccessGranted: false,
    requestedAt: '2023-10-01T09:00:00.000000Z',
    acceptedAt: '2023-10-02T11:00:00.000000Z',
    rejectedAt: null,
    endedAt: '2024-01-20T16:00:00.000000Z',
    lastConsultation: '2024-01-15',
    nextAppointment: '',
    email: 'lakshmi@example.com',
    phone: '+91 98765 33333',
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    bookingId: 'IY-2026-00042',
    patientId: 'pt1',
    patientName: 'Emma Watson',
    time: '09:00 AM',
    date: '2024-05-15',
    type: 'follow-up',
    status: 'confirmed',
  },
  {
    id: 'a2',
    bookingId: 'IY-2026-00043',
    patientId: 'pt2',
    patientName: 'James Rodriguez',
    time: '11:30 AM',
    date: '2024-05-15',
    type: 'initial',
    status: 'confirmed',
  },
  {
    id: 'a3',
    bookingId: 'IY-2026-00038',
    patientId: 'pt1',
    patientName: 'Emma Watson',
    time: '02:00 PM',
    date: '2024-05-14',
    type: 'consultation',
    status: 'completed',
  },
];

// ── AI-Generated Session Notes ────────────────────────────────────────────────

export const MOCK_AI_NOTES: AISessionNote[] = [
  // Emma Watson - PCOS Management
  {
    id: 'note-1',
    patientId: 'pt1',
    date: '2024-05-10',
    sessionNumber: 12,
    sessionType: 'follow-up',
    duration: 45,
    soap: {
      subjective:
        'Patient reports noticeable reduction in bloating since adopting low-GI meal plan. Sleep quality improved from 5/10 to 7/10. Still experiencing mild fatigue in the afternoons. Stress levels moderate due to work deadlines.',
      objective:
        'Patient appears well-rested compared to last session. Body weight stable at previous measurement. Blood pressure 118/76 — within normal range. Range of motion in thoracic spine improved ~15% from baseline. Breathing pattern normalized during guided sequences.',
      assessment:
        'Positive trend consistent with PCOS management protocol. Low-GI diet compliance is high (patient self-reports 85% adherence). Fatigue likely related to stress rather than nutritional deficiency. Sleep improvements correlate with reduced evening carbohydrate intake.',
      plan:
        'Continue current low-GI meal plan. Introduce magnesium supplementation (200mg nightly) to address afternoon fatigue. Add 10-minute post-lunch walk to routine. Review cortisol management strategies next session. Follow-up in 2 weeks.',
    },
    flags: [
      { text: 'Afternoon fatigue persists — screen for iron deficiency', severity: 'caution' },
      { text: 'Stress elevation noted — may impact cortisol cycle', severity: 'info' },
    ],
    painBefore: 4,
    painAfter: 2,
    aiConfidence: 94,
  },
  {
    id: 'note-2',
    patientId: 'pt1',
    date: '2024-04-26',
    sessionNumber: 11,
    sessionType: 'follow-up',
    duration: 40,
    soap: {
      subjective:
        'Patient reports irregular menstrual cycle this month (delayed by 6 days). Increased sugar cravings noted mid-cycle. General mood stable. No new complaints. Continuing prescribed supplement stack.',
      objective:
        'Weight slightly elevated (+0.8 kg from last visit). Skin texture improved — less acne around jawline. Energy levels described as "better than before". Demonstrates good understanding of glycaemic load concepts.',
      assessment:
        'Irregular cycle likely stress-induced rather than nutritional. Jawline improvement suggests reduced androgen activity — positive indicator. Weight fluctuation within normal hormonal variation. Supplement adherence appears consistent.',
      plan:
        'Introduce seed cycling protocol aligned with menstrual phases. Reduce refined carbohydrate intake during luteal phase. Continue current supplements. Monitor cycle regularity over next 6 weeks.',
    },
    flags: [
      { text: 'Irregular cycle this month — monitor over 6 weeks', severity: 'caution' },
    ],
    painBefore: 5,
    painAfter: 3,
    aiConfidence: 91,
  },
  {
    id: 'note-3',
    patientId: 'pt1',
    date: '2024-04-12',
    sessionNumber: 10,
    sessionType: 'consultation',
    duration: 60,
    soap: {
      subjective:
        'Patient reports feeling significantly better overall since starting the plan 8 weeks ago. Mood more stable. No major dietary slip-ups in the last two weeks. Sleep still variable (5–7 hours nightly).',
      objective:
        'Weight down 2.1 kg from baseline. Waist circumference reduced by 3 cm. Patient demonstrates confident food label reading. Fasting glucose within healthy range (per home monitor).',
      assessment:
        'Excellent progress at 8-week mark. Metabolic markers trending positively. Consistent behaviour change indicates high long-term adherence likelihood. Sleep variability is the primary remaining concern.',
      plan:
        'Maintain current protocol. Begin introducing intermittent fasting window (14:10) if patient ready next visit. Refer to sleep hygiene guide. Book comprehensive blood panel for week 12.',
    },
    flags: [
      { text: 'Sleep variability 5–7 hrs — consider sleep hygiene referral', severity: 'info' },
      { text: 'Recommend blood panel at 12-week mark', severity: 'info' },
    ],
    painBefore: 6,
    painAfter: 3,
    aiConfidence: 97,
  },

  // James Rodriguez - Weight Loss
  {
    id: 'note-4',
    patientId: 'pt2',
    date: '2024-05-08',
    sessionNumber: 5,
    sessionType: 'follow-up',
    duration: 45,
    soap: {
      subjective:
        'Patient reports difficulty sticking to caloric targets on weekends due to social events. Gym sessions consistent at 4x/week. Notes significant strength improvement. Mild knee discomfort during squats.',
      objective:
        'Weight down 3.4 kg from baseline over 5 sessions (steady rate of ~0.7 kg/week — within healthy range). Muscle definition visibly improving. Patient appears motivated and engaged.',
      assessment:
        'Excellent weekly rate of loss. Weekend caloric surplus is partially offsetting weekday deficit — net progress still positive. Knee discomfort warrants monitoring to rule out overuse injury.',
      plan:
        'Introduce flexible dieting framework (80/20 approach) to accommodate social eating. Swap heavy squats for leg press temporarily pending knee review. Increase protein target to 160g/day to preserve lean mass.',
    },
    flags: [
      { text: 'Knee discomfort during squats — consider physio referral', severity: 'alert' },
    ],
    painBefore: 3,
    painAfter: 2,
    aiConfidence: 89,
  },
  {
    id: 'note-5',
    patientId: 'pt2',
    date: '2024-04-24',
    sessionNumber: 4,
    sessionType: 'follow-up',
    duration: 40,
    soap: {
      subjective:
        'Patient reports good energy levels throughout the day. No hunger issues since increasing fibre intake. Alcohol consumption reduced to 2 drinks/week (from 8). Sleeping better.',
      objective:
        'Weight down 2.6 kg from baseline. Resting heart rate improving (68 bpm vs 76 bpm at start). Patient reports no cravings in past week.',
      assessment:
        'Alcohol reduction has likely contributed significantly to caloric deficit and improved metabolic health. Fibre increase shows positive satiety effect. Trend is highly positive.',
      plan:
        'Maintain current plan. Introduce meal prep strategy for weekend. Add one additional protein source at breakfast. Set 6-week milestone goal.',
    },
    flags: [],
    painBefore: 2,
    painAfter: 1,
    aiConfidence: 96,
  },

  // Sophia Chen - Ketogenic Diet
  {
    id: 'note-6',
    patientId: 'pt3',
    date: '2024-05-01',
    sessionNumber: 8,
    sessionType: 'follow-up',
    duration: 45,
    soap: {
      subjective:
        'Patient reports sustained mental clarity and stable energy since achieving ketosis. Slight social difficulty eating out — feeling restricted. No headaches or "keto flu" this cycle. Sleep excellent.',
      objective:
        'Ketone readings consistent (1.8–2.4 mmol/L via home monitor). Weight stable after initial loss phase — entering body recomposition phase. Patient looks well-rested. Skin notably clearer.',
      assessment:
        'Well-adapted to ketogenic protocol. Plateau in weight is expected and healthy at this stage — focus shifting to body recomposition. Social eating anxiety is the main adherence risk factor.',
      plan:
        'Introduce targeted carbohydrate cycling (30g pre-workout on training days). Develop restaurant-ordering guide to reduce social anxiety. Reassess macros for recomposition phase. Monthly check-in moving forward.',
    },
    flags: [
      { text: 'Social eating difficulty — provide dining-out guide', severity: 'info' },
    ],
    painBefore: 1,
    painAfter: 1,
    aiConfidence: 93,
  },
];

// ── AI-Generated Session Notes ────────────────────────────────────────────────

export const MOCK_GROUP_SESSIONS: PractitionerGroupSession[] = [
  {
    id: 'gs1',
    title: 'Morning Flow Yoga',
    category: 'yoga',
    time: '07:30 AM',
    days: ['Mon', 'Wed', 'Fri'],
    duration: 45,
    enrolled: 14,
    capacity: 20,
    level: 'Beginner',
  },
  {
    id: 'gs2',
    title: 'Breathwork & Stress Relief',
    category: 'breathwork',
    time: '08:30 AM',
    days: ['Tue', 'Thu'],
    duration: 30,
    enrolled: 9,
    capacity: 15,
    level: 'Beginner',
  },
  {
    id: 'gs3',
    title: 'Power Mobility Flow',
    category: 'mobility',
    time: '06:00 PM',
    days: ['Mon', 'Wed'],
    duration: 50,
    enrolled: 11,
    capacity: 12,
    level: 'Intermediate',
  },
];

/** Practitioner break / leave requests */
export const MOCK_PRACTITIONER_BREAKS: PractitionerBreak[] = [
  {
    id: 'br1',
    practitionerId: 't1',
    practitionerName: 'Dr. Sarah Mitchell',
    date: formatOffsetDate(2),
    startTime: '00:00',
    endTime: '23:59',
    reason: 'Personal leave',
    kind: 'day_off',
    status: 'pending',
    isRecurring: false,
    recurringDay: null,
    requestedAt: new Date().toISOString(),
    reviewedAt: null,
  },
  {
    id: 'br2',
    practitionerId: 't1',
    practitionerName: 'Dr. Sarah Mitchell',
    date: formatOffsetDate(4),
    startTime: '14:00',
    endTime: '16:00',
    reason: 'Doctor appointment',
    kind: 'partial',
    status: 'approved',
    isRecurring: false,
    recurringDay: null,
    requestedAt: new Date(Date.now() - 86400000).toISOString(),
    reviewedAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'br3',
    practitionerId: 't2',
    practitionerName: 'Dr. Michael Chen',
    date: formatOffsetDate(3),
    startTime: '00:00',
    endTime: '23:59',
    reason: 'Sick leave',
    kind: 'day_off',
    status: 'pending',
    isRecurring: false,
    recurringDay: null,
    requestedAt: new Date(Date.now() - 3600000).toISOString(),
    reviewedAt: null,
  },
];

function formatOffsetDate(daysFromToday: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().slice(0, 10);
}
