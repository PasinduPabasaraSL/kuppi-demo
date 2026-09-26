import { useEffect, useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyText } from '../../utils/clipboard.js';
import { highlight, tokenClassOnDark } from '../../utils/highlight.js';

export default function CodeBlock({ code, language = 'text', title, showLineNumbers = true }) {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => highlight(code, language), [code, language]);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    setCopied(await copyText(code));
  }

  return (
    <figure className="overflow-hidden rounded-xl border border-code-border bg-code-bg">
      <div className="flex items-center justify-between gap-3 border-b border-code-border bg-code-head px-4 py-2">
        <figcaption className="min-w-0 truncate text-xs text-code-text/80">
          {title || <span className="font-mono text-code-muted">{language}</span>}
        </figcaption>

        <div className="flex shrink-0 items-center gap-2">
          {title && (
            <span className="font-mono text-[10px] text-code-muted uppercase">{language}</span>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md border border-code-border px-2 py-1 text-[11px] text-code-muted transition-colors hover:border-code-sage/60 hover:text-code-text"
          >
            {copied ? <Check size={12} className="text-code-sage" /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <pre className="px-4 py-3.5 font-mono text-[12.5px] leading-relaxed sm:text-[13px]">
          <code>
            {lines.map((tokens, index) => (
              <span key={index} className="flex">
                {showLineNumbers && (
                  <span className="mr-4 w-6 shrink-0 text-right text-code-muted/60 select-none">
                    {index + 1}
                  </span>
                )}
                <span className="whitespace-pre">
                  {tokens.map((item, tokenIndex) => (
                    <span key={tokenIndex} className={tokenClassOnDark[item.type]}>
                      {item.text}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </figure>
  );
}
