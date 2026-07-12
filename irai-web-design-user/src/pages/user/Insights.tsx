import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
} from 'recharts';
import { MOCK_AI_DATA } from '../../userData';
import { Sparkles } from 'lucide-react';

const MONTHLY = [
  { month: 'Jan', score: 62 }, { month: 'Feb', score: 65 }, { month: 'Mar', score: 68 },
  { month: 'Apr', score: 71 }, { month: 'May', score: 74 }, { month: 'Jun', score: 78 },
];

const DIMENSIONS = [
  { label: 'Pain Reduction', value: 85 }, { label: 'Consistency', value: 90 },
  { label: 'Flexibility', value: 65 }, { label: 'Strength', value: 70 },
  { label: 'Breathing', value: 80 }, { label: 'Mental Focus', value: 75 },
];

export default function Insights() {
  const score = MOCK_AI_DATA.wellnessScore;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-brand-border p-6 flex flex-col items-center justify-center">
          <p className="small-caps text-gray-400 mb-2">Wellness Score</p>
          <p className="text-5xl font-bold text-forest">{score}</p>
          <p className="text-[12px] text-gray-400 mt-1">+6 from last month</p>
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-border p-6 h-64">
          <p className="small-caps text-gray-400 mb-4">6-month trend</p>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={MONTHLY}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#4a6741" fill="#4a674133" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-brand-border p-6 h-80">
          <p className="small-caps text-gray-400 mb-4">Dimension radar</p>
          <ResponsiveContainer width="100%" height="90%">
            <RadarChart data={MOCK_AI_DATA.radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
              <Radar dataKey="A" stroke="#4a6741" fill="#4a6741" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-brand-border p-6">
          <p className="small-caps text-gray-400 mb-4">Dimensions</p>
          <div className="space-y-3">
            {DIMENSIONS.map(d => (
              <div key={d.label}>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-gray-500">{d.label}</span>
                  <span className="font-bold text-slate">{d.value}%</span>
                </div>
                <div className="h-2 bg-brand-50 rounded-full overflow-hidden">
                  <div className="h-full bg-forest rounded-full" style={{ width: `${d.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_AI_DATA.insights.map((text, i) => (
          <div key={i} className="bg-[#f0f4ee] rounded-2xl border border-forest/20 p-5 flex gap-3">
            <Sparkles size={16} className="text-forest shrink-0 mt-0.5" />
            <p className="text-[13px] text-gray-600 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
