import { useCallback, useEffect, useState } from 'react';
import { Check, Loader2, Plus, Trash2, TriangleAlert } from 'lucide-react';
import * as api from '../services/api.js';

export default function TodoApp() {
  // This array is only a cache of what the backend returned.
  // Every change is sent to the API first, then we re-read the list from the server.
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [log, setLog] = useState([]);

  const record = useCallback((entry) => {
    setLog((previous) => [{ ...entry, at: new Date() }, ...previous].slice(0, 6));
  }, []);

  const refresh = useCallback(async () => {
    const data = await api.getTodos();
    setTodos(data);
    record({ method: 'GET', path: '/api/todos', note: `${data.length} todos` });
  }, [record]);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await api.getTodos();
        if (!active) return;
        setTodos(data);
        setError(null);
        record({ method: 'GET', path: '/api/todos', note: `${data.length} todos` });
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [record]);

  async function handleAdd(event) {
    event.preventDefault();
    const value = title.trim();
    if (!value || adding) return;

    setAdding(true);
    try {
      const created = await api.createTodo(value);
      record({ method: 'POST', path: '/api/todos', note: `created #${created.id}` });
      setTitle('');
      await refresh();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(todo) {
    setBusyId(todo.id);
    try {
      const updated = await api.toggleTodo(todo.id, !todo.completed);
      record({
        method: 'PATCH',
        path: `/api/todos/${todo.id}`,
        note: `completed = ${updated.completed}`,
      });
      await refresh();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(todo) {
    setBusyId(todo.id);
    try {
      await api.deleteTodo(todo.id);
      record({ method: 'DELETE', path: `/api/todos/${todo.id}`, note: '204 No Content' });
      await refresh();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  const done = todos.filter((todo) => todo.completed).length;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div className="rounded-xl border border-ink-700 bg-ink-900 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-base font-semibold text-mist-100">Todo list</h3>
          <span className="font-mono text-xs text-mist-500">
            {done}/{todos.length} completed
          </span>
        </div>

        <form onSubmit={handleAdd} className="mt-4 flex gap-2">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add a todo, e.g. Learn Kubernetes"
            aria-label="New todo title"
            className="min-w-0 flex-1 rounded-lg border border-ink-600 bg-ink-850 px-3 py-2.5 text-sm text-mist-100 placeholder:text-mist-500 focus:border-brand-500/60 focus:outline-none"
          />
          <button
            type="submit"
            disabled={adding || title.trim() === ''}
            className="flex items-center gap-1.5 rounded-lg border border-brand-500/35 bg-brand-500/10 px-3.5 py-2.5 text-sm font-medium text-brand-200 transition-colors hover:bg-brand-500/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {adding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Add
          </button>
        </form>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-clay-500/35 bg-clay-500/[0.06] px-3 py-2.5 text-sm text-clay-200">
            <TriangleAlert size={16} className="mt-0.5 shrink-0" />
            <span>
              {error}
              <span className="mt-1 block text-xs text-clay-300/80">
                Is the backend running on port 5000?
              </span>
            </span>
          </div>
        )}

        <div className="mt-4">
          {loading ? (
            <p className="flex items-center gap-2 py-6 text-sm text-mist-400">
              <Loader2 size={16} className="animate-spin" />
              Loading todos from the API...
            </p>
          ) : todos.length === 0 ? (
            <p className="rounded-lg border border-dashed border-ink-600 px-4 py-8 text-center text-sm text-mist-500">
              No todos yet. Add the first one above.
            </p>
          ) : (
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-850 px-3 py-2.5 transition-colors hover:border-ink-600"
                >
                  <button
                    type="button"
                    onClick={() => handleToggle(todo)}
                    disabled={busyId === todo.id}
                    aria-label={todo.completed ? 'Mark as not completed' : 'Mark as completed'}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                      todo.completed
                        ? 'border-brand-500/60 bg-brand-500/20 text-brand-200'
                        : 'border-ink-600 text-transparent hover:border-brand-500/60'
                    }`}
                  >
                    <Check size={13} />
                  </button>

                  <span
                    className={`min-w-0 flex-1 text-sm ${
                      todo.completed ? 'text-mist-500 line-through' : 'text-mist-200'
                    }`}
                  >
                    {todo.title}
                  </span>

                  <span className="font-mono text-[11px] text-mist-500">#{todo.id}</span>

                  <button
                    type="button"
                    onClick={() => handleDelete(todo)}
                    disabled={busyId === todo.id}
                    aria-label={`Delete ${todo.title}`}
                    className="rounded-md p-1.5 text-mist-500 transition-colors hover:bg-clay-500/10 hover:text-clay-300"
                  >
                    {busyId === todo.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-ink-700 bg-ink-900 p-5">
        <h3 className="text-base font-semibold text-mist-100">Request log</h3>
        <p className="mt-1 text-xs text-mist-500">
          Every action above is an HTTP request. Nothing is stored in the browser.
        </p>

        <ul className="mt-4 space-y-2 font-mono text-[11px]">
          {log.length === 0 ? (
            <li className="text-mist-500">Waiting for the first request...</li>
          ) : (
            log.map((entry, index) => (
              <li
                key={`${entry.at.getTime()}-${index}`}
                className="animate-fade-in rounded-md border border-ink-700 bg-ink-850 px-2.5 py-2"
              >
                <span className="text-brand-300">{entry.method}</span>{' '}
                <span className="text-mist-300">{entry.path}</span>
                <span className="mt-0.5 block text-mist-500">{entry.note}</span>
              </li>
            ))
          )}
        </ul>

        <div className="mt-5 border-t border-ink-700 pt-4">
          <p className="text-xs font-semibold tracking-[0.16em] text-mist-500 uppercase">
            Try this later
          </p>
          <p className="mt-2 text-xs leading-relaxed text-mist-400">
            Restart the backend and reload this page. The list resets to the seed data, because it
            lives in memory inside the process &mdash; the exact problem containers and databases
            force us to think about.
          </p>
        </div>
      </div>
    </div>
  );
}
