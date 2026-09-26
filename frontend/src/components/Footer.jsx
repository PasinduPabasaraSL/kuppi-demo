import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-ink-700 bg-ink-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-mist-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          SE Kuppi &mdash; Git, Docker, CI/CD, Kubernetes and AWS in one session.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/demo" className="transition-colors hover:text-mist-200">
            Live Demo
          </Link>
          <Link to="/notes" className="transition-colors hover:text-mist-200">
            Kuppi Notes
          </Link>
          <span className="hidden sm:inline">UoM FIT</span>
        </div>
      </div>
    </footer>
  );
}
