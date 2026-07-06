import { useState, useMemo } from 'react';
import { Check } from 'lucide-react';
import { ADMIN_SETTINGS, type SystemSetting, type SettingValue } from '../../adminData';
import { cn } from '../../lib/utils';

const GROUP_ORDER = ['scheduling', 'payments', 'general', 'compliance'] as const;

const GROUP_LABEL: Record<string, string> = {
  scheduling: 'Scheduling',
  payments: 'Payments',
  general: 'General',
  compliance: 'Compliance',
};

export default function AdminSettings() {
  const [settings, setSettings] = useState(ADMIN_SETTINGS);
  const [saved, setSaved] = useState(false);

  const sections = useMemo(() => {
    const map = new Map<string, SystemSetting[]>();
    settings.forEach(s => {
      const list = map.get(s.group) ?? [];
      list.push(s);
      map.set(s.group, list);
    });
    return GROUP_ORDER
      .filter(g => map.has(g))
      .map(g => ({ id: g, label: GROUP_LABEL[g] ?? g, items: map.get(g)! }));
  }, [settings]);

  const updateSetting = (key: string, value: SettingValue) => {
    setSettings(prev => prev.map(s =>
      s.key === key ? { ...s, value, updatedAt: new Date().toISOString() } : s,
    ));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <p className="small-caps text-gray-400 mb-1">Admin</p>
          <h1 className="serif text-4xl text-slate leading-tight">Platform Settings</h1>
          <p className="text-[14px] text-gray-400 mt-2">Configure how the IRAI platform behaves for all users.</p>
        </div>

        <div className="space-y-8">
          {sections.map(section => (
            <section key={section.id}>
              <h2 className="small-caps text-[9px] text-gray-400 mb-2.5 px-1 tracking-widest">
                {section.label}
              </h2>
              <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
                {section.items.map((setting, i) => (
                  <SettingRow
                    key={setting.key}
                    setting={setting}
                    onChange={value => updateSetting(setting.key, value)}
                    isLast={i === section.items.length - 1}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-brand-border flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className={cn(
              'px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2',
              saved
                ? 'bg-[#f0f4ee] text-forest border border-forest/20'
                : 'bg-forest text-white hover:bg-[#3d5636]',
            )}
          >
            {saved ? <><Check size={14} /> Saved</> : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  setting,
  onChange,
  isLast,
}: {
  setting: SystemSetting;
  onChange: (value: SettingValue) => void;
  isLast: boolean;
}) {
  const isTags = setting.inputType === 'tags';

  if (isTags) {
    return (
      <div className={cn('px-5 py-4', !isLast && 'border-b border-brand-border')}>
        <p className="text-[14px] font-medium text-slate">{setting.label}</p>
        <p className="text-[12px] text-gray-400 mt-0.5 mb-3">{setting.description}</p>
        <TagControl setting={setting} onChange={onChange} />
      </div>
    );
  }

  return (
    <div className={cn(
      'px-5 py-4 flex items-center justify-between gap-6',
      !isLast && 'border-b border-brand-border',
    )}>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium text-slate">{setting.label}</p>
        <p className="text-[12px] text-gray-400 mt-0.5 leading-snug">{setting.description}</p>
      </div>
      <div className="shrink-0">
        <SettingControl setting={setting} onChange={onChange} />
      </div>
    </div>
  );
}

function SettingControl({
  setting,
  onChange,
}: {
  setting: SystemSetting;
  onChange: (value: SettingValue) => void;
}) {
  const inputClass = 'w-24 bg-brand-50 border border-brand-border rounded-lg py-2 px-3 text-[13px] text-slate text-right outline-none focus:border-forest/40 transition-colors';

  if (setting.inputType === 'toggle') {
    const on = Boolean(setting.value);
    return (
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        className={cn(
          'inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200',
          on ? 'bg-forest' : 'bg-gray-200',
        )}
      >
        <span
          className={cn(
            'block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
            on ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </button>
    );
  }

  if (setting.inputType === 'number' || setting.inputType === 'percent') {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={Number(setting.value)}
          min={setting.min}
          max={setting.max}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className={inputClass}
        />
        <span className="text-[11px] text-gray-400 w-14 text-right">
          {setting.inputType === 'percent' ? '%' : setting.unit}
        </span>
      </div>
    );
  }

  if (setting.inputType === 'email') {
    return (
      <input
        type="email"
        value={String(setting.value)}
        onChange={e => onChange(e.target.value)}
        className="w-52 bg-brand-50 border border-brand-border rounded-lg py-2 px-3 text-[13px] text-slate outline-none focus:border-forest/40 transition-colors"
      />
    );
  }

  return null;
}

function TagControl({
  setting,
  onChange,
}: {
  setting: SystemSetting;
  onChange: (value: SettingValue) => void;
}) {
  if (!Array.isArray(setting.value)) return null;
  const selected = setting.value as string[];
  const options = setting.tagOptions ?? [];

  const toggle = (tag: string) => {
    onChange(selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(tag => {
        const active = selected.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wide border transition-colors',
              active
                ? 'bg-forest text-white border-forest'
                : 'bg-brand-50 text-gray-500 border-brand-border hover:border-forest/30',
            )}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
