import { Braces, Server, Monitor } from 'lucide-react';

const layers = [
  {
    icon: Monitor,
    title: 'React',
    subtitle: 'Frontend (Vite dev server, port 5173)',
    points: ['Renders the UI', 'Calls fetch() on user actions', 'Holds no permanent data'],
  },
  {
    icon: Braces,
    title: 'REST API',
    subtitle: 'HTTP + JSON over /api/todos',
    points: ['GET, POST, PATCH, DELETE', 'JSON request and response bodies', 'CORS allows the browser'],
  },
  {
    icon: Server,
    title: 'Node.js + Express',
    subtitle: 'Backend (port 5000)',
    points: ['Owns the todo list', 'Validates the input', 'Answers with JSON'],
  },
];

export default function ArchitectureFlow() {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
      {layers.map((layer, index) => {
        const Icon = layer.icon;
        return (
          <div key={layer.title} className="flex flex-col gap-3 md:flex-1 md:flex-row md:items-center">
            <div className="w-full rounded-xl border border-ink-700 bg-ink-900 p-5 transition-colors hover:border-ink-600">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink-600 bg-ink-850 text-brand-400">
                  <Icon size={18} />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-mist-100">{layer.title}</h3>
                  <p className="text-[11px] text-mist-500">{layer.subtitle}</p>
                </div>
              </div>

              <ul className="mt-4 space-y-1.5">
                {layer.points.map((point) => (
                  <li key={point} className="flex gap-2 text-xs text-mist-400">
                    <span className="text-mist-500">&bull;</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {index < layers.length - 1 && (
              <span
                className="self-center font-mono text-lg text-mist-500 md:px-1"
                aria-hidden="true"
              >
                <span className="md:hidden">&darr;</span>
                <span className="hidden md:inline">&rarr;</span>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
