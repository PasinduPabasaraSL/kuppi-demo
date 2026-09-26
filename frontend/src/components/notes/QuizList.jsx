import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function QuizItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="border-b border-ink-800 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-ink-850"
      >
        <ChevronDown
          size={15}
          className={`shrink-0 text-mist-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
        <span className="flex-1 text-sm font-medium text-mist-200">{question}</span>
      </button>

      {open && (
        <p className="animate-fade-in border-l-2 border-brand-500/40 px-4 pb-4 pl-9 text-sm leading-relaxed text-mist-400">
          {answer}
        </p>
      )}
    </li>
  );
}

export default function QuizList({ groups }) {
  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div
          key={group.title}
          className="overflow-hidden rounded-xl border border-ink-700 bg-ink-900"
        >
          <div className="flex items-center justify-between border-b border-ink-700 bg-ink-850 px-4 py-2.5">
            <p className="text-xs font-semibold tracking-[0.16em] text-mist-300 uppercase">
              {group.title}
            </p>
            <span className="font-mono text-[11px] text-mist-500">
              {group.items.length} questions
            </span>
          </div>

          <ul>
            {group.items.map((item) => (
              <QuizItem key={item.q} question={item.q} answer={item.a} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
