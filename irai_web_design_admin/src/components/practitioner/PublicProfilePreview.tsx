import { useState } from 'react';
import { Star, MapPin, Clock, Eye, EyeOff } from 'lucide-react';
import {
  MOCK_PRACTITIONER, MOCK_PERSONAL_PROFILE, MOCK_PROFESSIONAL_PROFILE,
  MOCK_PUBLIC_SERVICES, MOCK_PUBLIC_LOCATIONS, MOCK_PUBLIC_REVIEWS,
  LOOKUP_SPECIALIZATIONS,
} from '../../mockData';
import { cn } from '../../lib/utils';
import type { VerificationStatus } from '../../types';

function specName(slug: string) {
  return LOOKUP_SPECIALIZATIONS.find(s => s.slug === slug)?.name ?? slug;
}

export default function PublicProfilePreview({ verificationStatus }: { verificationStatus: VerificationStatus }) {
  const [tab, setTab] = useState<'listing' | 'detail'>('listing');
  const isVisible = verificationStatus === 'verified';
  const displayName = `${MOCK_PERSONAL_PROFILE.firstName} ${MOCK_PERSONAL_PROFILE.lastName}`;

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-brand-border flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="small-caps text-gray-400">Public Profile Preview</p>
          <p className="text-[11px] text-gray-300 mt-0.5">
            {tab === 'listing' ? 'GET /accounts/practitioners/' : 'GET /accounts/practitioners/:id/'}
          </p>
        </div>
        <div className="flex gap-1 bg-brand-50 rounded-xl p-1 border border-brand-border">
          {(['listing', 'detail'] as const).map(t => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={cn('px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-colors',
                tab === t ? 'bg-white text-slate shadow-sm' : 'text-gray-400')}>
              {t === 'listing' ? '3.1 Listing' : '3.2 Detail'}
            </button>
          ))}
        </div>
      </div>

      <div className="relative p-6">
        {!isVisible && (
          <div className="absolute inset-0 z-10 bg-white/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-8 text-center">
            <EyeOff size={28} className="text-gray-300 mb-3" />
            <p className="text-[14px] font-bold text-slate">Not visible in public listing</p>
            <p className="text-[13px] text-gray-500 mt-2 max-w-sm leading-relaxed">
              Status is <span className="font-semibold capitalize">{verificationStatus}</span>.
              Only <span className="font-semibold">verified</span> practitioners appear on{' '}
              <code className="text-[11px] bg-brand-50 px-1 rounded">GET /accounts/practitioners/</code>.
            </p>
          </div>
        )}

        {tab === 'listing' ? (
          <div className={cn('max-w-md mx-auto', !isVisible && 'opacity-40 pointer-events-none')}>
            <p className="small-caps text-[8px] text-gray-400 mb-3">Patient discovery card</p>
            <div className="border border-brand-border rounded-2xl p-5 shadow-sm">
              <div className="flex gap-4">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71f1536783?w=120&h=120&fit=crop"
                  alt={displayName}
                  className="w-16 h-16 rounded-xl object-cover border border-brand-border"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate">{displayName}</p>
                  <p className="text-[13px] text-gray-500">{MOCK_PROFESSIONAL_PROFILE.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="text-[12px] font-bold">{MOCK_PRACTITIONER.rating}</span>
                    <span className="text-[11px] text-gray-400">· {MOCK_PRACTITIONER.totalSessions} sessions</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {MOCK_PROFESSIONAL_PROFILE.specializations.map(s => (
                      <span key={s} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#f0f4ee] text-forest">
                        {specName(s)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[12px] text-gray-500 mt-3 line-clamp-2">{MOCK_PROFESSIONAL_PROFILE.bio}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-border">
                <span className="text-[14px] font-bold text-forest">₹{MOCK_PROFESSIONAL_PROFILE.consultationFee}</span>
                {MOCK_PROFESSIONAL_PROFILE.isOnline && (
                  <span className="text-[10px] font-bold uppercase text-forest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest" /> Online
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={cn('space-y-5', !isVisible && 'opacity-40 pointer-events-none')}>
            <div className="flex items-start gap-4">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71f1536783?w=120&h=120&fit=crop"
                alt={displayName}
                className="w-20 h-20 rounded-2xl object-cover border border-brand-border"
              />
              <div>
                <h3 className="serif text-2xl text-slate">{displayName}</h3>
                <p className="text-[13px] text-gray-500">{MOCK_PROFESSIONAL_PROFILE.title}</p>
                <p className="text-[12px] text-gray-400 mt-1">{MOCK_PERSONAL_PROFILE.timezone}</p>
              </div>
            </div>

            <section>
              <p className="small-caps text-[8px] text-gray-400 mb-2">Services</p>
              <div className="space-y-2">
                {MOCK_PUBLIC_SERVICES.map(s => (
                  <div key={s.id} className="flex justify-between items-start gap-4 p-3 bg-brand-50 rounded-xl border border-brand-border">
                    <div>
                      <p className="text-[13px] font-semibold text-slate">{s.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{s.description}</p>
                      <p className="text-[10px] text-gray-300 mt-1 flex items-center gap-1">
                        <Clock size={10} /> {s.durationMinutes} min · type {s.serviceType}
                      </p>
                    </div>
                    <span className="text-[13px] font-bold text-forest shrink-0">₹{s.price}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="small-caps text-[8px] text-gray-400 mb-2">Locations</p>
              <div className="space-y-2">
                {MOCK_PUBLIC_LOCATIONS.map(loc => (
                  <div key={loc.id} className="flex items-start gap-2 p-3 bg-brand-50 rounded-xl border border-brand-border text-[13px]">
                    <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate">{loc.name}</p>
                      <p className="text-[12px] text-gray-500">{loc.address}, {loc.city}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="small-caps text-[8px] text-gray-400 mb-2">Reviews</p>
              <div className="space-y-2">
                {MOCK_PUBLIC_REVIEWS.map(r => (
                  <div key={r.id} className="p-3 bg-brand-50 rounded-xl border border-brand-border">
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={11} className="text-amber-500 fill-amber-500" />
                      ))}
                      <span className="text-[10px] text-gray-400 ml-2">Session {r.session}</span>
                    </div>
                    <p className="text-[12px] text-gray-600 italic">&ldquo;{r.comment}&rdquo;</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {isVisible && (
          <p className="text-[11px] text-gray-400 mt-4 flex items-center gap-1.5 justify-center">
            <Eye size={12} /> This is how patients see your profile when verified
          </p>
        )}
      </div>
    </div>
  );
}
