import { ArrowDown } from 'lucide-react';

export function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-850 px-3 py-1 text-xs font-medium text-mist-300 ${className}`}
    >
      {children}
    </span>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-xl border border-ink-700 bg-ink-900 p-5 ${className}`}>{children}</div>
  );
}

export function SectionHeading({ eyebrow, title, description, className = '' }) {
  return (
    <div className={className}>
      {eyebrow && (
        <p className="text-xs font-semibold tracking-[0.18em] text-flame-400 uppercase">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-mist-100 sm:text-3xl">
        {title}
      </h2>
      {description && <p className="mt-2 max-w-2xl text-sm text-mist-400">{description}</p>}
    </div>
  );
}

export function Connector({ label }) {
  return (
    <div className="flex flex-col items-center py-1 text-mist-500" aria-hidden="true">
      <ArrowDown size={16} />
      {label && <span className="mt-1 font-mono text-[11px]">{label}</span>}
    </div>
  );
}
