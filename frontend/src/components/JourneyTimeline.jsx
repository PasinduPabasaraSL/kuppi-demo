import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { journeyStages } from '../data/journey.js';

export default function JourneyTimeline() {
  return (
    <ol className="relative space-y-3">
      {/* The vertical spine behind the stage cards. */}
      <span
        className="absolute top-6 bottom-6 left-[43px] hidden w-px bg-ink-600 sm:block"
        aria-hidden="true"
      />

      {journeyStages.map((stage, index) => {
        const Icon = stage.icon;
        return (
          <li key={stage.id} className="relative">
            <Link
              to={`/notes?topic=${stage.topic}`}
              className="group flex items-start gap-4 rounded-xl border border-ink-700 bg-ink-900 p-4 transition-all hover:-translate-y-0.5 hover:border-brand-500/50 hover:bg-ink-850"
            >
              <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-ink-600 bg-ink-800 text-brand-400 transition-colors group-hover:border-brand-500/60 group-hover:text-brand-300">
                <Icon size={22} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-flame-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-base font-semibold text-mist-100">{stage.label}</h3>
                </div>
                <p className="mt-1 text-sm text-mist-400">{stage.summary}</p>
                <p className="mt-2 font-mono text-[11px] text-mist-500">{stage.detail}</p>
              </div>

              <ArrowRight
                size={18}
                className="mt-4 shrink-0 text-mist-500 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-brand-400 group-hover:opacity-100"
              />
            </Link>

            {index < journeyStages.length - 1 && (
              <ChevronDown
                size={14}
                className="absolute -bottom-2 left-[37px] z-10 hidden text-mist-500 sm:block"
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
