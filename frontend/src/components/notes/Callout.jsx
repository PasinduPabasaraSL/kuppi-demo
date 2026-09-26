import { GraduationCap, Key, TriangleAlert } from 'lucide-react';

const variants = {
  key: {
    icon: Key,
    label: 'Key Point',
    shell: 'border-brand-500/30 bg-brand-500/[0.06]',
    accent: 'text-brand-300',
  },
  exam: {
    icon: GraduationCap,
    label: 'Exam Tip',
    shell: 'border-flame-500/35 bg-flame-500/[0.07]',
    accent: 'text-flame-300',
  },
  mistake: {
    icon: TriangleAlert,
    label: 'Common Mistake',
    shell: 'border-clay-500/30 bg-clay-500/[0.06]',
    accent: 'text-clay-300',
  },
};

export default function Callout({ variant = 'key', title, body }) {
  const config = variants[variant] ?? variants.key;
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border p-4 ${config.shell}`}>
      <div className={`flex items-center gap-2 text-xs font-semibold tracking-wide uppercase ${config.accent}`}>
        <Icon size={14} />
        {config.label}
      </div>
      {title && <p className="mt-2 text-sm font-semibold text-mist-100">{title}</p>}
      <p className="mt-1.5 text-sm leading-relaxed text-mist-300">{body}</p>
    </div>
  );
}
