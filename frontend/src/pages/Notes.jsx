import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ListChecks } from 'lucide-react';
import NotesSidebar from '../components/notes/NotesSidebar.jsx';
import Section from '../components/notes/Section.jsx';
import { Badge } from '../components/ui.jsx';
import { findTopic, topics } from '../data/notes.js';
import { hasQuiz } from '../data/quiz.js';
import { readJson, writeJson } from '../utils/storage.js';

const STORAGE_KEY = 'se-kuppi:visited-topics';

function readVisited() {
  const saved = readJson(STORAGE_KEY, []);
  return Array.isArray(saved) ? saved.filter((id) => findTopic(id)) : [];
}

export default function Notes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('topic');
  const activeId = findTopic(requested) ? requested : topics[0].id;
  const activeTopic = findTopic(activeId);
  const activeIndex = topics.findIndex((topic) => topic.id === activeId);

  const [visited, setVisited] = useState(readVisited);

  // Mark the open topic as read and remember it across reloads.
  useEffect(() => {
    setVisited((previous) => {
      if (previous.includes(activeId)) return previous;
      const next = [...previous, activeId];
      writeJson(STORAGE_KEY, next);
      return next;
    });
  }, [activeId]);

  const selectTopic = useCallback(
    (id) => {
      setSearchParams({ topic: id });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setSearchParams]
  );

  const previousTopic = activeIndex > 0 ? topics[activeIndex - 1] : null;
  const nextTopic = activeIndex < topics.length - 1 ? topics[activeIndex + 1] : null;
  const ActiveIcon = activeTopic.icon;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="animate-fade-up">
        <Badge>UoM FIT &bull; SE Kuppi</Badge>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-mist-100 sm:text-4xl">
          Today&rsquo;s Kuppi Notes
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-mist-400">
          Everything you need to understand the journey from Git commit to production.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
        <NotesSidebar activeId={activeId} visited={visited} onSelect={selectTopic} />

        <article key={activeId} className="animate-fade-in min-w-0">
          <div className="flex items-start gap-4 border-b border-ink-700 pb-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ink-600 bg-ink-850 text-brand-400">
              <ActiveIcon size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs text-flame-400">{activeTopic.number}</p>
              <h2 className="text-2xl font-semibold tracking-tight text-mist-100">
                {activeTopic.title}
              </h2>
              <p className="mt-1 text-sm text-mist-400">{activeTopic.tagline}</p>
            </div>

            {hasQuiz(activeId) && (
              <Link
                to={`/quiz?topic=${activeId}`}
                className="hidden shrink-0 items-center gap-2 rounded-lg border border-ink-600 bg-ink-850 px-3.5 py-2 text-sm font-medium text-mist-200 transition-colors hover:border-brand-500/50 hover:text-mist-100 sm:flex"
              >
                <ListChecks size={15} />
                Take the quiz
              </Link>
            )}
          </div>

          <div className="mt-8 space-y-10">
            {activeTopic.sections.map((section) => (
              <Section key={section.id} section={section} />
            ))}
          </div>

          <nav className="mt-12 flex flex-col gap-3 border-t border-ink-700 pt-6 sm:flex-row sm:justify-between">
            {previousTopic ? (
              <button
                type="button"
                onClick={() => selectTopic(previousTopic.id)}
                className="group flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 text-left transition-colors hover:border-ink-600"
              >
                <ArrowLeft size={16} className="text-mist-500 group-hover:text-brand-400" />
                <span>
                  <span className="block text-[11px] text-mist-500">Previous</span>
                  <span className="block text-sm font-medium text-mist-200">
                    {previousTopic.title}
                  </span>
                </span>
              </button>
            ) : (
              <span />
            )}

            {nextTopic && (
              <button
                type="button"
                onClick={() => selectTopic(nextTopic.id)}
                className="group flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 text-right transition-colors hover:border-ink-600 sm:ml-auto"
              >
                <span>
                  <span className="block text-[11px] text-mist-500">Next</span>
                  <span className="block text-sm font-medium text-mist-200">{nextTopic.title}</span>
                </span>
                <ArrowRight size={16} className="text-mist-500 group-hover:text-brand-400" />
              </button>
            )}
          </nav>
        </article>
      </div>
    </div>
  );
}
