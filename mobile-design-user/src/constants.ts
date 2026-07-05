/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
    date: '2026-05-14',
    time: '08:00 AM',
    status: 'upcoming',
  },
  {
    id: '2',
    type: 'nutrition',
    title: 'Dietary Review',
    provider: 'Nutritionist Emma Brown',
    date: '2026-05-15',
    time: '02:00 PM',
    status: 'upcoming',
  },
  {
    id: '3',
    type: 'yoga-group',
    title: 'Morning Flow Yoga',
    date: '2026-05-14',
    time: '07:30 AM',
    status: 'upcoming',
  },
  {
    id: '4',
    type: 'doctor',
    title: 'Health Consultation',
    provider: 'Dr. Rajan Pillai',
    date: '2026-05-20',
    time: '10:00 AM',
    status: 'upcoming',
  },
  {
    id: '5',
    type: 'yoga-1on1',
    title: 'Spinal Therapy',
    provider: 'Dr. Sarah Smith',
    date: '2026-05-21',
    time: '08:00 AM',
    status: 'upcoming',
  },
  {
    id: '6',
    type: 'psych',
    title: 'Mindfulness Check-in',
    provider: 'Dr. Leena Varma',
    date: '2026-05-28',
    time: '03:00 PM',
    status: 'upcoming',
  },
  {
    id: '7',
    type: 'yoga-group',
    title: 'Community Flow',
    date: '2026-05-07',
    time: '07:30 AM',
    status: 'completed',
  },
  {
    id: '8',
    type: 'nutrition',
    title: 'Intake Assessment',
    provider: 'Nutritionist Emma Brown',
    date: '2026-05-05',
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
