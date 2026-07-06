import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, FileText, CheckCircle2, UserMinus } from 'lucide-react';
import { useState } from 'react';
import { MOCK_PATIENTS } from '../../mockData';
import PatientPreview from '../../components/practitioner/PatientPreview';
import RelationshipDetail from '../../components/practitioner/RelationshipDetail';
import Modal from '../../components/ui/Modal';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(() => MOCK_PATIENTS.find(p => p.id === id) ?? MOCK_PATIENTS[0]);
  const [showEnd, setShowEnd] = useState(false);

  const endRelationship = () => {
    setPatient(p => ({ ...p, relationshipStatus: 'ended', endedAt: new Date().toISOString() }));
    setShowEnd(false);
  };

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
        <div className="xl:col-span-2 space-y-4">
          <RelationshipDetail patient={patient} />
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm">
            <PatientPreview patient={patient} hideRelationship />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-5">
            <p className="small-caps text-[8px] text-gray-400 mb-3">Health Documents</p>
            {patient.healthAccessGranted ? (
              <div className="space-y-2">
                <p className="text-[13px] text-forest font-medium flex items-center gap-2">
                  <CheckCircle2 size={14} /> Access granted
                </p>
                <p className="text-[12px] text-gray-400">Lab reports, prescriptions, and merged health summary available.</p>
                <button type="button" className="w-full py-2.5 mt-2 bg-[#f0f4ee] text-forest rounded-xl text-[12px] font-bold hover:bg-[#e4ebe0] transition-colors">
                  View Documents
                </button>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-[13px] font-semibold text-amber-800 mb-1">Access not granted</p>
                <p className="text-[12px] text-amber-700 leading-relaxed">
                  Patient must grant document access from their app before you can view medical records.
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-5">
            <p className="small-caps text-[8px] text-gray-400 mb-4">Actions</p>
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
              {patient.relationshipStatus === 'active' && (
                <button type="button" onClick={() => setShowEnd(true)}
                  className="w-full py-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl text-[12px] font-bold hover:bg-gray-50 flex items-center justify-center gap-2">
                  <UserMinus size={14} /> End Relationship
                </button>
              )}
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

      <Modal open={showEnd} onClose={() => setShowEnd(false)} title="End Relationship">
        <p className="text-[13px] text-gray-500 mb-4">
          End relationship #{patient.relationshipId} with {patient.name}?
        </p>
        <div className="flex gap-3">
          <button type="button" onClick={() => setShowEnd(false)}
            className="flex-1 py-2.5 rounded-xl border border-brand-border text-[13px] font-bold hover:bg-brand-50">
            Cancel
          </button>
          <button type="button" onClick={endRelationship}
            className="flex-1 py-2.5 rounded-xl bg-gray-600 text-white text-[13px] font-bold">
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
}
