import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { BASE_URL, getHealth } from '../services/api.js';

const POLL_INTERVAL_MS = 15000;

export default function BackendStatus() {
  const [status, setStatus] = useState('checking');
  const [service, setService] = useState(null);

  const check = useCallback(async () => {
    try {
      const data = await getHealth();
      setStatus('online');
      setService(data?.service ?? null);
    } catch {
      setStatus('offline');
      setService(null);
    }
  }, []);

  useEffect(() => {
    check();
    const timer = setInterval(check, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [check]);

  const online = status === 'online';
  const checking = status === 'checking';

  const dotColor = checking ? 'bg-mist-400' : online ? 'bg-brand-400' : 'bg-clay-400';
  const label = checking ? 'Checking backend' : online ? 'Backend Connected' : 'Backend Offline';
  const textColor = checking ? 'text-mist-300' : online ? 'text-brand-300' : 'text-clay-300';
  const borderColor = checking
    ? 'border-ink-600'
    : online
      ? 'border-brand-500/30 bg-brand-500/[0.06]'
      : 'border-clay-500/30 bg-clay-500/[0.06]';

  return (
    <div className={`flex flex-wrap items-center gap-3 rounded-lg border px-4 py-2.5 ${borderColor}`}>
      <span className={`flex items-center gap-2 text-sm font-medium ${textColor}`}>
        <span className={`h-2 w-2 rounded-full ${dotColor} ${online ? 'animate-pulse-dot' : ''}`} />
        {label}
      </span>

      <span className="font-mono text-[11px] text-mist-500">
        GET {BASE_URL}/api/health
        {service ? ` -> ${service}` : ''}
      </span>

      <button
        type="button"
        onClick={check}
        className="ml-auto flex items-center gap-1.5 rounded-md border border-ink-600 px-2.5 py-1 text-xs text-mist-400 transition-colors hover:text-mist-100"
      >
        <RefreshCw size={12} className={checking ? 'animate-spin' : ''} />
        Retry
      </button>
    </div>
  );
}
