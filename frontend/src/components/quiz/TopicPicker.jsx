import { ArrowRight, Trophy } from 'lucide-react';

export default function TopicPicker({ topics, bestScores, onSelect }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {topics.map((topic) => {
        const Icon = topic.icon;
        const best = bestScores[topic.id];

        return (
          <button
            key={topic.id}
            type="button"
            onClick={() => onSelect(topic.id)}
            className="group flex items-start gap-4 rounded-xl border border-ink-700 bg-ink-900 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-brand-500/50"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-ink-600 bg-ink-850 text-brand-400">
              <Icon size={19} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="font-mono text-[10px] text-flame-400">{topic.number}</span>
              <span className="block text-base font-semibold text-mist-100">{topic.title}</span>
              <span className="mt-1 block text-sm text-mist-400">
                {topic.questionCount} questions
              </span>

              {best && (
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-brand-500/35 bg-brand-500/[0.08] px-2 py-0.5 text-[11px] font-medium text-brand-200">
                  <Trophy size={11} />
                  Best {best.correct}/{best.total}
                </span>
              )}
            </span>

            <ArrowRight
              size={17}
              className="mt-2 shrink-0 text-mist-500 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-400"
            />
          </button>
        );
      })}
    </div>
  );
}
