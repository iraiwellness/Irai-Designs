export interface Patient {
  id: string;
  name: string;
  avatar: string;
  condition: string;
  lastConsultation: string;
  nextAppointment: string;
  email: string;
  phone: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  time: string;
  date: string;
  type: 'initial' | 'follow-up' | 'consultation';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Practitioner {
  id: string;
  name: string;
  specialty: 'Nutritionist' | 'Psychologist' | 'Doctor' | 'Physiotherapist';
  rating: number;
  totalClients: number;
  experience: string;
  about: string;
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
