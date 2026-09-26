import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ArchitectureFlow from '../components/ArchitectureFlow.jsx';
import BackendStatus from '../components/BackendStatus.jsx';
import TodoApp from '../components/TodoApp.jsx';
import { Badge } from '../components/ui.jsx';

const endpoints = [
  { method: 'GET', path: '/api/todos', purpose: 'Load the list' },
  { method: 'POST', path: '/api/todos', purpose: 'Add a todo' },
  { method: 'PATCH', path: '/api/todos/:id', purpose: 'Toggle completed' },
  { method: 'DELETE', path: '/api/todos/:id', purpose: 'Remove a todo' },
  { method: 'GET', path: '/api/health', purpose: 'Status indicator' },
];

const methodColor = {
  GET: 'text-brand-300',
  POST: 'text-brand-200',
  PATCH: 'text-flame-300',
  DELETE: 'text-clay-300',
};

export default function Demo() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="animate-fade-up">
        <Badge>Step 0 &bull; The application</Badge>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-mist-100 sm:text-4xl">
          Live Application Demo
        </h1>
        <p className="mt-2 font-mono text-sm text-mist-400">
          React Frontend &rarr; Node.js Backend &rarr; REST API
        </p>
        <p className="mt-4 max-w-2xl text-sm text-mist-400">
          Two separate programs are running right now: a React app in your browser and an Express
          server on port 5000. They only know each other through HTTP.
        </p>
      </div>

      <div className="mt-8">
        <BackendStatus />
      </div>

      <section className="mt-10">
        <h2 className="text-xs font-semibold tracking-[0.18em] text-mist-500 uppercase">
          Architecture
        </h2>
        <div className="mt-4">
          <ArchitectureFlow />
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-mist-100">Todo application</h2>
            <p className="mt-1 text-sm text-mist-400">
              The backend owns the data. React just asks for it and re-renders.
            </p>
          </div>
          <Link
            to="/notes?topic=docker"
            className="flex items-center gap-2 text-sm text-mist-400 transition-colors hover:text-brand-300"
          >
            Next: package this with Docker
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-5">
          <TodoApp />
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-ink-700 bg-ink-900 p-5">
        <h2 className="text-base font-semibold text-mist-100">Endpoints used on this page</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-md text-left text-sm">
            <thead>
              <tr className="border-b border-ink-700 text-xs tracking-wider text-mist-500 uppercase">
                <th className="pb-2 pr-4 font-medium">Method</th>
                <th className="pb-2 pr-4 font-medium">Path</th>
                <th className="pb-2 font-medium">Used for</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {endpoints.map((endpoint) => (
                <tr key={`${endpoint.method}-${endpoint.path}`} className="border-b border-ink-800/80 last:border-0">
                  <td className={`py-2.5 pr-4 ${methodColor[endpoint.method]}`}>{endpoint.method}</td>
                  <td className="py-2.5 pr-4 text-mist-200">{endpoint.path}</td>
                  <td className="py-2.5 font-sans text-mist-400">{endpoint.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
