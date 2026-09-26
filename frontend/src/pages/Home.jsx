import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Layers, MonitorPlay, Sparkles } from 'lucide-react';
import JourneyTimeline from '../components/JourneyTimeline.jsx';
import { Badge, SectionHeading } from '../components/ui.jsx';

const actions = [
  {
    to: '/demo',
    icon: MonitorPlay,
    title: 'Live Demo',
    description: 'See how a React frontend communicates with a Node.js backend.',
    meta: 'React -> REST API -> Express',
    primary: true,
  },
  {
    to: '/notes',
    icon: BookOpen,
    title: "Today's Kuppi Notes",
    description: 'Theory, commands, examples and exam-focused concepts.',
    meta: '5 topics + quick revision',
    primary: false,
  },
];

const facts = [
  { icon: Clock, label: '3 hours', detail: 'One session, one project' },
  { icon: Layers, label: '5 topics', detail: 'Git, Docker, CI/CD, K8s, AWS' },
  { icon: Sparkles, label: 'Hands on', detail: 'A running app, not slides' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      {/* this is hero section */}
      <section className="bg-grid relative overflow-hidden border-b border-ink-700">
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="animate-fade-up mx-auto max-w-3xl text-center">
            <Badge>
              <span className="h-1.5 w-1.5 rounded-full bg-flame-500" />
              UoM FIT &bull; SE Kuppi
            </Badge>

            <p className="mt-8 font-mono text-sm tracking-[0.35em] text-flame-400 uppercase">
              SE Kuppi
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-mist-100 sm:text-5xl lg:text-6xl">
              From Commit to Production
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-mist-400 sm:text-lg">
              An interactive Software Engineering Kuppi covering Git, Docker, CI/CD, Kubernetes and
              AWS.
            </p>

            <p className="mt-6 text-sm text-mist-300">
              Follow one project from a developer&rsquo;s laptop all the way to production.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-xs text-mist-400 sm:text-sm">
              {['Git', 'Docker', 'CI/CD', 'Kubernetes', 'AWS'].map((item, index) => (
                <span key={item} className="flex items-center gap-3">
                  {index > 0 && <span className="text-mist-500">&rarr;</span>}
                  <span className="rounded-md border border-ink-700 bg-ink-900 px-2.5 py-1">
                    {item}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Two primary actions */}
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.to}
                  to={action.to}
                  className={`group flex flex-col rounded-xl border p-6 transition-all hover:-translate-y-0.5 ${
                    action.primary
                      ? 'border-brand-500/35 bg-brand-500/[0.06] hover:border-brand-400/60 hover:bg-brand-500/10'
                      : 'border-ink-700 bg-ink-900 hover:border-ink-600 hover:bg-ink-850'
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-lg border ${
                      action.primary
                        ? 'border-brand-500/40 bg-ink-900 text-brand-300'
                        : 'border-ink-600 bg-ink-850 text-mist-300'
                    }`}
                  >
                    <Icon size={20} />
                  </span>

                  <h2 className="mt-4 text-lg font-semibold text-mist-100">{action.title}</h2>
                  <p className="mt-1.5 flex-1 text-sm text-mist-400">{action.description}</p>

                  <span className="mt-5 flex items-center justify-between border-t border-ink-700 pt-4 text-xs text-mist-500">
                    <span className="font-mono">{action.meta}</span>
                    <ArrowRight
                      size={16}
                      className="text-mist-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-400"
                    />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">
            {facts.map((fact) => {
              const Icon = fact.icon;
              return (
                <div
                  key={fact.label}
                  className="flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-3"
                >
                  <Icon size={16} className="shrink-0 text-brand-400" />
                  <span className="text-sm">
                    <span className="font-medium text-mist-200">{fact.label}</span>
                    <span className="block text-xs text-mist-500">{fact.detail}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionHeading
              eyebrow="The journey"
              title="One project, five technologies"
              description="Every stage below answers a single question: how does code written on a laptop end up serving real users? Click any stage to jump straight to its notes."
            />

            <div className="mt-6 rounded-xl border border-ink-700 bg-ink-900 p-5">
              <p className="text-xs font-semibold tracking-[0.18em] text-mist-500 uppercase">
                The one-line version
              </p>
              <p className="mt-3 text-sm leading-relaxed text-mist-300">
                Git records the change, GitHub shares it, CI/CD tests and builds it, Docker packages
                it, Kubernetes runs it, and AWS provides the machines underneath.
              </p>
            </div>

            <Link
              to="/notes"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-ink-600 bg-ink-850 px-4 py-2.5 text-sm font-medium text-mist-200 transition-colors hover:border-brand-500/50 hover:text-mist-100"
            >
              Open the full notes
              <ArrowRight size={16} />
            </Link>
          </div>

          <JourneyTimeline />
        </div>
      </section>
    </div>
  );
}
