import { Link } from 'react-router-dom';
import { BookOpen, Check, LayoutGrid, RotateCcw, X } from 'lucide-react';

function verdict(percentage) {
  if (percentage === 100) return 'Full marks. Move on to the next topic.';
  if (percentage >= 75) return 'Solid. Skim the explanations you missed and you are done.';
  if (percentage >= 50) return 'Half way there. Re-read the notes for this topic, then try again.';
  return 'Worth another pass through the notes before the exam.';
}

export default function ScoreSummary({ topic, questions, chosen, onRetry, onChangeTopic }) {
  const correct = questions.filter((question, index) => chosen[index] === question.answer).length;
  const total = questions.length;
  const percentage = Math.round((correct / total) * 100);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-ink-700 bg-ink-900 p-6 text-center">
        <p className="text-xs font-semibold tracking-[0.18em] text-flame-400 uppercase">
          {topic.title}
        </p>

        <p className="mt-4 text-4xl font-semibold text-mist-100">
          {correct}
          <span className="text-mist-400">/{total}</span>
        </p>

        <div className="mx-auto mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-ink-800">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="mt-4 text-sm text-mist-300">{verdict(percentage)}</p>

        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center justify-center gap-2 rounded-lg border border-brand-500/40 bg-brand-500/10 px-4 py-2.5 text-sm font-medium text-brand-200 transition-colors hover:bg-brand-500/15"
          >
            <RotateCcw size={15} />
            Try again
          </button>

          <Link
            to={`/notes?topic=${topic.id}`}
            className="flex items-center justify-center gap-2 rounded-lg border border-ink-600 bg-ink-850 px-4 py-2.5 text-sm font-medium text-mist-200 transition-colors hover:border-brand-500/50"
          >
            <BookOpen size={15} />
            Read the notes
          </Link>

          <button
            type="button"
            onClick={onChangeTopic}
            className="flex items-center justify-center gap-2 rounded-lg border border-ink-600 bg-ink-850 px-4 py-2.5 text-sm font-medium text-mist-200 transition-colors hover:border-brand-500/50"
          >
            <LayoutGrid size={15} />
            Another topic
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-700 bg-ink-900">
        <p className="border-b border-ink-700 bg-ink-850 px-4 py-2.5 text-xs font-semibold tracking-[0.16em] text-mist-400 uppercase">
          Review
        </p>

        <ul>
          {questions.map((question, index) => {
            const picked = chosen[index];
            const wasRight = picked === question.answer;

            return (
              <li key={question.id} className="border-b border-ink-800 px-4 py-3.5 last:border-0">
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded ${
                      wasRight
                        ? 'bg-brand-500/20 text-brand-200'
                        : 'bg-clay-500/20 text-clay-200'
                    }`}
                  >
                    {wasRight ? <Check size={12} /> : <X size={12} />}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-mist-200">{question.question}</p>

                    {!wasRight && (
                      <p className="mt-1.5 text-xs text-clay-300">
                        You chose: {question.options[picked]}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-brand-300">
                      Correct: {question.options[question.answer]}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
