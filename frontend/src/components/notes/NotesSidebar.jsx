import { Check } from 'lucide-react';
import { topics } from '../../data/notes.js';

export default function NotesSidebar({ activeId, visited, onSelect }) {
  const progress = Math.round((visited.length / topics.length) * 100);

  return (
    <>
      {/* Desktop: vertical sidebar */}
      <nav className="hidden lg:sticky lg:top-24 lg:block lg:self-start" aria-label="Notes sections">
        <div className="rounded-xl border border-ink-700 bg-ink-900 p-4">
          <p className="text-xs font-semibold tracking-[0.16em] text-mist-500 uppercase">Progress</p>
          <div className="mt-2.5 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-800">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-[11px] text-mist-400">
              {visited.length}/{topics.length}
            </span>
          </div>
        </div>

        <ul className="mt-3 space-y-1">
          {topics.map((topic) => {
            const Icon = topic.icon;
            const isActive = topic.id === activeId;
            const isVisited = visited.includes(topic.id);

            return (
              <li key={topic.id}>
                <button
                  type="button"
                  onClick={() => onSelect(topic.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    isActive
                      ? 'border-brand-500/40 bg-brand-500/10 text-mist-100'
                      : 'border-transparent text-mist-400 hover:bg-ink-850 hover:text-mist-200'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-brand-300' : 'text-mist-500'} />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block font-mono text-[10px] ${
                        isActive ? 'text-flame-400' : 'text-mist-500'
                      }`}
                    >
                      {topic.number}
                    </span>
                    <span className="block text-sm leading-snug font-medium">{topic.title}</span>
                  </span>
                  {isVisited && <Check size={13} className="shrink-0 text-brand-400/80" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile / tablet: horizontal pill bar */}
      <nav
        className="sticky top-[57px] z-30 -mx-4 min-w-0 border-b border-ink-700 bg-ink-950/95 px-4 py-3 backdrop-blur lg:hidden"
        aria-label="Notes sections"
      >
        <div className="flex gap-2 overflow-x-auto pb-1">
          {topics.map((topic) => {
            const isActive = topic.id === activeId;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => onSelect(topic.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'border-brand-500/50 bg-brand-500/10 text-brand-200'
                    : 'border-ink-700 bg-ink-900 text-mist-400'
                }`}
              >
                <span className="font-mono text-[10px] text-mist-500">{topic.number}</span>
                {topic.title}
                {visited.includes(topic.id) && <Check size={11} className="text-brand-400/80" />}
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex items-center gap-3">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink-800">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-[10px] text-mist-500">
            {visited.length}/{topics.length} read
          </span>
        </div>
      </nav>
    </>
  );
}
