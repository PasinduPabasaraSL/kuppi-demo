import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import QuestionCard from '../components/quiz/QuestionCard.jsx';
import ScoreSummary from '../components/quiz/ScoreSummary.jsx';
import TopicPicker from '../components/quiz/TopicPicker.jsx';
import { Badge } from '../components/ui.jsx';
import { findTopic } from '../data/notes.js';
import { getQuiz, quizTopicIds } from '../data/quiz.js';
import { readJson, writeJson } from '../utils/storage.js';

const STORAGE_KEY = 'se-kuppi:quiz-best';

// Title, icon and number come from the notes topics so the two stay in sync.
const quizTopics = quizTopicIds.map((id) => {
  const topic = findTopic(id);
  return {
    id,
    title: topic.title,
    number: topic.number,
    icon: topic.icon,
    questionCount: getQuiz(id).length,
  };
});

export default function Quiz() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('topic');
  const activeId = quizTopicIds.includes(requested) ? requested : null;

  const [chosen, setChosen] = useState({});
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [bestScores, setBestScores] = useState(() => readJson(STORAGE_KEY, {}));

  const questions = activeId ? getQuiz(activeId) : [];
  const answeredCount = Object.keys(chosen).length;
  const correctCount = questions.filter((question, i) => chosen[i] === question.answer).length;

  const reset = useCallback(() => {
    setChosen({});
    setIndex(0);
    setFinished(false);
  }, []);

  const selectTopic = useCallback(
    (id) => {
      reset();
      setSearchParams(id ? { topic: id } : {});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [reset, setSearchParams]
  );

  function handleChoose(optionIndex) {
    if (chosen[index] !== undefined) return;
    setChosen((previous) => ({ ...previous, [index]: optionIndex }));
  }

  function handleNext() {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      return;
    }

    // Last question: record the score if it beats the stored best.
    const correct = questions.filter((question, i) => chosen[i] === question.answer).length;
    const previousBest = bestScores[activeId];

    if (!previousBest || correct > previousBest.correct) {
      const next = { ...bestScores, [activeId]: { correct, total: questions.length } };
      setBestScores(next);
      writeJson(STORAGE_KEY, next);
    }

    setFinished(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="animate-fade-up">
        <Badge>Check yourself &bull; MCQ</Badge>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-mist-100 sm:text-4xl">
          Topic Quiz
        </h1>
        <p className="mt-2 max-w-xl text-sm text-mist-400">
          {activeId
            ? 'Pick an answer to see straight away whether it was right, with a one-line explanation.'
            : 'Five separate quizzes, one per topic. Choose where to start.'}
        </p>
      </header>

      {!activeId ? (
        <div className="mt-8">
          <TopicPicker topics={quizTopics} bestScores={bestScores} onSelect={selectTopic} />
        </div>
      ) : (
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => selectTopic(null)}
              className="flex items-center gap-1.5 text-sm text-mist-400 transition-colors hover:text-brand-300"
            >
              <ChevronLeft size={15} />
              All topics
            </button>

            <span className="font-mono text-xs text-mist-500">
              {correctCount} correct of {answeredCount} answered
            </span>
          </div>

          {!finished && (
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-ink-800">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-500"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
          )}

          <div className="mt-5">
            {finished ? (
              <ScoreSummary
                topic={findTopic(activeId)}
                questions={questions}
                chosen={chosen}
                onRetry={reset}
                onChangeTopic={() => selectTopic(null)}
              />
            ) : (
              <QuestionCard
                key={questions[index].id}
                question={questions[index]}
                index={index}
                total={questions.length}
                chosen={chosen[index]}
                onChoose={handleChoose}
                onNext={handleNext}
                isLast={index === questions.length - 1}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
