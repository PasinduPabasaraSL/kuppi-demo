import { ArrowRight, Check, X } from 'lucide-react';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

// Once an option is picked the answer is locked, so the styling below only has
// two states to worry about: unanswered, and revealed.
function optionClasses({ answered, isCorrect, isChosen }) {
  const base =
    'flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors';

  if (!answered) {
    return `${base} border-ink-700 bg-ink-900 text-mist-200 hover:border-brand-500/50 hover:bg-ink-850`;
  }
  if (isCorrect) {
    return `${base} border-brand-500/50 bg-brand-500/[0.09] text-mist-100`;
  }
  if (isChosen) {
    return `${base} border-clay-500/50 bg-clay-500/[0.09] text-mist-100`;
  }
  return `${base} border-ink-700 bg-ink-900 text-mist-400`;
}

export default function QuestionCard({ question, index, total, chosen, onChoose, onNext, isLast }) {
  const answered = chosen !== undefined;
  const wasRight = chosen === question.answer;

  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900 p-5 sm:p-6">
      <p className="font-mono text-[11px] text-flame-400">
        Question {index + 1} of {total}
      </p>
      <h2 className="mt-2 text-lg font-semibold text-mist-100 sm:text-xl">{question.question}</h2>

      <div className="mt-5 space-y-2">
        {question.options.map((option, optionIndex) => {
          const isCorrect = optionIndex === question.answer;
          const isChosen = optionIndex === chosen;

          return (
            <button
              key={option}
              type="button"
              disabled={answered}
              onClick={() => onChoose(optionIndex)}
              className={optionClasses({ answered, isCorrect, isChosen })}
            >
              <span
                className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[11px] ${
                  answered && isCorrect
                    ? 'bg-brand-500/25 text-brand-200'
                    : answered && isChosen
                      ? 'bg-clay-500/25 text-clay-200'
                      : 'bg-ink-800 text-mist-500'
                }`}
              >
                {answered && isCorrect ? (
                  <Check size={12} />
                ) : answered && isChosen ? (
                  <X size={12} />
                ) : (
                  LETTERS[optionIndex]
                )}
              </span>
              <span className="flex-1">{option}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={`animate-fade-in mt-5 rounded-lg border p-4 ${
            wasRight
              ? 'border-brand-500/35 bg-brand-500/[0.06]'
              : 'border-clay-500/35 bg-clay-500/[0.06]'
          }`}
        >
          <p
            className={`flex items-center gap-2 text-xs font-semibold tracking-wide uppercase ${
              wasRight ? 'text-brand-300' : 'text-clay-300'
            }`}
          >
            {wasRight ? <Check size={14} /> : <X size={14} />}
            {wasRight ? 'Correct' : 'Not quite'}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-mist-300">{question.explanation}</p>
        </div>
      )}

      {answered && (
        <button
          type="button"
          onClick={onNext}
          className="animate-fade-in mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-brand-500/40 bg-brand-500/10 px-4 py-2.5 text-sm font-medium text-brand-200 transition-colors hover:bg-brand-500/15 sm:w-auto"
        >
          {isLast ? 'See results' : 'Next question'}
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
