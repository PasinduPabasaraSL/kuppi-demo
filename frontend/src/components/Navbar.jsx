import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Terminal, X } from 'lucide-react';

const links = [
  { to: '/', label: 'Home' },
  { to: '/demo', label: 'Live Demo' },
  { to: '/notes', label: 'Kuppi Notes' },
  { to: '/quiz', label: 'Quiz' },
];

function linkClasses({ isActive }) {
  const base = 'rounded-lg px-3 py-2 text-sm font-medium transition-colors';
  return isActive
    ? `${base} bg-ink-800 text-mist-100`
    : `${base} text-mist-400 hover:bg-ink-850 hover:text-mist-100`;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-700 bg-ink-950/85 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-600 bg-ink-850 text-brand-400 transition-colors group-hover:border-brand-500/60">
            <Terminal size={18} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-mist-100">SE Kuppi</span>
            <span className="text-[11px] text-mist-500">From Commit to Production</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClasses}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="rounded-lg border border-ink-600 p-2 text-mist-300 transition-colors hover:text-mist-100 md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink-700 bg-ink-900 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={linkClasses}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
