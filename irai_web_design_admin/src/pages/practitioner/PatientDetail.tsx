import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, FileText } from 'lucide-react';
import { MOCK_PATIENTS } from '../../mockData';
import PatientPreview from '../../components/practitioner/PatientPreview';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = MOCK_PATIENTS.find(p => p.id === id) ?? MOCK_PATIENTS[0];

  return (
    <div className="p-6 lg:p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] mb-6">
        <Link to="/practitioner/clients" className="text-gray-400 hover:text-forest transition-colors">
          Clients
        </Link>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="font-semibold text-slate">{patient.name}</span>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-brand-border shadow-sm">
          <PatientPreview patient={patient} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-5">
            <p className="small-caps text-[8px] text-gray-400 mb-4">Quick Actions</p>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/practitioner/chats')}
                className="w-full py-2.5 bg-forest text-white rounded-xl text-[13px] font-bold hover:bg-[#3d5636] transition-colors"
              >
                Send Message
              </button>
              <button
                onClick={() => navigate('/practitioner/schedule')}
                className="w-full py-2.5 bg-white border border-brand-border text-slate rounded-xl text-[13px] font-bold hover:bg-brand-50 transition-colors"
              >
                Book Appointment
              </button>
              <button className="w-full py-2.5 bg-white border border-brand-border text-slate rounded-xl text-[13px] font-bold hover:bg-brand-50 transition-colors flex items-center justify-center gap-2">
                <FileText size={15} /> View Care Plan
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-5">
            <p className="small-caps text-[8px] text-gray-400 mb-3">Session History</p>
            <div className="space-y-3">
              {[
                { date: 'May 10, 2024', type: 'Follow-up', dur: '45 min' },
                { date: 'Apr 26, 2024', type: 'Follow-up', dur: '40 min' },
                { date: 'Apr 12, 2024', type: 'Consultation', dur: '60 min' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-brand-border last:border-0">
                  <div>
                    <p className="text-[13px] font-medium text-slate">{s.date}</p>
                    <p className="text-[11px] text-gray-400 capitalize">{s.type}</p>
                  </div>
                  <span className="text-[11px] text-gray-400">{s.dur}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#263d23] to-[#192b16] rounded-2xl p-5 text-white">
            <p className="small-caps text-[8px] text-white/40 mb-2">Pain Progress</p>
            <p className="serif text-3xl leading-none mb-1">-3 pts</p>
            <p className="text-[12px] text-white/50">Average reduction over last 3 sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
