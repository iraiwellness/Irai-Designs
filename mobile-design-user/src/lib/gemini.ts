/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { HealthSummary } from '../constants';

function demoSummary(): HealthSummary {
  return {
    diagnoses: ['L4-L5 Disc Herniation with sciatica', 'Mild Anxiety Disorder'],
    medications: [
      { name: 'Pregabalin', dosage: '75 mg twice daily' },
      { name: 'Pantoprazole', dosage: '40 mg once daily' },
    ],
    labValues: [
      { test: 'Vitamin D (25-OH)', value: '18 ng/mL', status: 'low' },
      { test: 'Haemoglobin', value: '13.2 g/dL', status: 'normal' },
      { test: 'Fasting Blood Glucose', value: '102 mg/dL', status: 'normal' },
      { test: 'CRP (Inflammation)', value: '8.4 mg/L', status: 'high' },
    ],
    safePoses: ['Shavasana', 'Cat-Cow', 'Supported Bridge', 'Legs-Up-The-Wall', "Child's Pose"],
    avoidPoses: ['Forward Folds', 'Spinal Twists', 'Inversions', 'Deep Backbends', 'Boat Pose'],
    contraindications: [
      'Avoid forward bending beyond 30°',
      'No loaded spinal rotation',
      'No inversions until acute phase resolves',
      'Limit seated postures to 20-minute intervals',
    ],
    imagingFindings:
      'MRI lumbar spine: L4-L5 posterior disc protrusion with mild right-sided neural foraminal narrowing. No cord compression. Facet hypertrophy noted at L5-S1.',
    recommendations: [
      'Continue physiotherapy 2× per week',
      'Avoid prolonged sitting beyond 30 minutes without breaks',
      'Apply ice 15 min followed by heat 15 min for pain episodes',
      'Supplement Vitamin D 2000 IU daily',
    ],
    extractedAt: new Date().toISOString(),
  };
}

export async function analyzeDocument(_file: File): Promise<HealthSummary> {
  await new Promise(r => setTimeout(r, 2200));
  return demoSummary();
}

export const isDemoMode = true;
