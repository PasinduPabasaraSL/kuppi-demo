import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyText } from '../../utils/clipboard.js';
import { highlight, tokenClass } from '../../utils/highlight.js';

function CommandRow({ command, detail }) {
  const [copied, setCopied] = useState(false);
  const [tokens] = highlight(command, 'bash');

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    setCopied(await copyText(command));
  }

  return (
    <li className="group flex flex-col gap-1.5 border-b border-ink-800 px-4 py-3 last:border-0 sm:flex-row sm:items-center sm:gap-4">
      <code className="min-w-0 font-mono text-[12.5px] break-words sm:w-2/5">
        {tokens.map((item, index) => (
          <span key={index} className={tokenClass[item.type]}>
            {item.text}
          </span>
        ))}
      </code>

      <p className="flex-1 text-sm text-mist-400">{detail}</p>

      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${command}`}
        className="shrink-0 self-start rounded-md border border-transparent p-1.5 text-mist-500 transition-colors hover:border-ink-600 hover:text-mist-100 sm:self-auto sm:opacity-0 sm:group-hover:opacity-100"
      >
        {copied ? <Check size={13} className="text-brand-300" /> : <Copy size={13} />}
      </button>
    </li>
  );
}

export default function CommandList({ title, items }) {
  return (
    <div className="overflow-hidden rounded-xl border border-ink-700 bg-ink-900">
      {title && (
        <p className="border-b border-ink-700 bg-ink-850 px-4 py-2.5 text-xs font-semibold tracking-[0.16em] text-mist-400 uppercase">
          {title}
        </p>
      )}
      <ul>
        {items.map((item) => (
          <CommandRow key={item.command} command={item.command} detail={item.detail} />
        ))}
      </ul>
    </div>
  );
}
