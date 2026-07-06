import { Patient, Appointment, Practitioner, AISessionNote, PractitionerGroupSession, AttentionNotification, PersonalProfileFields, PractitionerProfileFields } from './types';

export const MOCK_PRACTITIONER: Practitioner = {
  id: 'p1',
  name: 'Dr. Sarah Mitchell',
  title: 'Clinical Nutritionist',
  specialty: 'Nutritionist',
  rating: 4.9,
  totalClients: 124,
  totalSessions: 312,
  activeRelationships: 118,
  experience: '8 Years',
  about: 'Specializing in holistic nutrition and metabolic health. Helping clients lead a balanced life through mindful eating.',
  verificationStatus: 'verified',
};

export const MOCK_ADMIN_PERSONAL_PROFILE: PersonalProfileFields = {
  firstName: 'Admin',
  lastName: 'User',
  phone: '+91 90000 12345',
  timezone: 'Asia/Kolkata',
  emergencyName: 'Support Desk',
  emergencyPhone: '+91 90000 12346',
  emergencyRelation: 'colleague',
};

export const MOCK_PERSONAL_PROFILE: PersonalProfileFields = {
  firstName: 'Sarah',
  lastName: 'Mitchell',
  phone: '+91 98765 43210',
  timezone: 'Asia/Kolkata',
  emergencyName: 'John Mitchell',
  emergencyPhone: '+91 98765 43211',
  emergencyRelation: 'spouse',
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
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pt1',
    name: 'Emma Watson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    condition: 'PCOS Management',
    serviceType: 'Nutrition Consultation',
    relationshipStatus: 'active',
    healthAccessGranted: true,
    lastConsultation: '2024-05-10',
    nextAppointment: '2024-05-15',
    email: 'emma.w@example.com',
    phone: '+1 234 567 8901',
  },
  {
    id: 'pt2',
    name: 'James Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    condition: 'Weight Loss',
    serviceType: 'Nutrition Consultation',
    relationshipStatus: 'active',
    healthAccessGranted: false,
    lastConsultation: '2024-05-08',
    nextAppointment: '2024-05-20',
    email: 'james.r@example.com',
    phone: '+1 234 567 8902',
  },
  {
    id: 'pt3',
    name: 'Sophia Chen',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    condition: 'Ketogenic Diet',
    serviceType: 'Nutrition Consultation',
    relationshipStatus: 'active',
    healthAccessGranted: true,
    lastConsultation: '2024-05-01',
    nextAppointment: '2024-05-18',
    email: 'sophia.c@example.com',
    phone: '+1 234 567 8903',
  },
  {
    id: 'rel-1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    condition: 'General wellness',
    serviceType: 'Nutrition Consultation',
    relationshipStatus: 'requested',
    healthAccessGranted: false,
    requestedAt: '2 hours ago',
    lastConsultation: '',
    nextAppointment: '',
    email: 'priya@example.com',
    phone: '+91 98765 11111',
  },
  {
    id: 'rel-2',
    name: 'Arjun Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    condition: 'Back pain recovery',
    serviceType: 'Yoga Therapy',
    relationshipStatus: 'requested',
    healthAccessGranted: false,
    requestedAt: 'Yesterday',
    lastConsultation: '',
    nextAppointment: '',
    email: 'arjun@example.com',
    phone: '+91 98765 22222',
  },
  {
    id: 'pt4',
    name: 'Lakshmi Iyer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop',
    condition: 'Diabetes management',
    serviceType: 'Nutrition Consultation',
    relationshipStatus: 'ended',
    healthAccessGranted: false,
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

export const MOCK_ATTENTION_NOTIFICATIONS: AttentionNotification[] = [
  {
    id: 'n1',
    type: 'new_message',
    title: 'New message from Emma Watson',
    body: 'Can we reschedule tomorrow\'s session?',
    createdAt: '30 min ago',
    isRead: false,
  },
  {
    id: 'n2',
    type: 'session_reminder',
    title: 'Session in 1 hour',
    body: 'Follow-up with James Rodriguez at 11:30 AM',
    createdAt: '1 hour ago',
    isRead: false,
  },
];

// ── Group Sessions (Practitioner's assigned sessions) ─────────────────────────

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
