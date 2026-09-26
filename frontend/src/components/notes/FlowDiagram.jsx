import { ArrowDown, ArrowRight } from 'lucide-react';

function FlowSteps({ steps }) {
  return (
    <div className="flex flex-col items-center">
      {steps.map((step, index) => (
        <div key={`${step.label}-${index}`} className="flex w-full flex-col items-center">
          {step.kind === 'command' ? (
            <code className="rounded-md border border-ink-600 bg-ink-950 px-2.5 py-1 font-mono text-[12px] text-brand-300">
              {step.label}
            </code>
          ) : (
            <div className="w-full max-w-xs rounded-lg border border-ink-600 bg-ink-850 px-4 py-2.5 text-center">
              <p className="text-sm font-medium text-mist-100">{step.label}</p>
              {step.sub && <p className="mt-0.5 text-[11px] text-mist-500">{step.sub}</p>}
            </div>
          )}

          {index < steps.length - 1 && (
            <ArrowDown size={14} className="my-1.5 text-mist-500" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}

function TreeNode({ node, depth = 0, isLast = true }) {
  return (
    <li className="relative pl-5">
      {depth > 0 && (
        <>
          <span
            className={`absolute top-0 left-0 w-px bg-ink-600 ${isLast ? 'h-[18px]' : 'h-full'}`}
            aria-hidden="true"
          />
          <span className="absolute top-[18px] left-0 h-px w-3.5 bg-ink-600" aria-hidden="true" />
        </>
      )}

      <div className="inline-flex items-center gap-2 rounded-md border border-ink-700 bg-ink-850 px-3 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-400/70" aria-hidden="true" />
        <span className="font-mono text-[12.5px] text-mist-200">{node.label}</span>
      </div>

      {node.children?.length > 0 && (
        <ul className="mt-2 space-y-2">
          {node.children.map((child, index) => (
            <TreeNode
              key={`${child.label}-${index}`}
              node={child}
              depth={depth + 1}
              isLast={index === node.children.length - 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function Tree({ root }) {
  return (
    <ul>
      <TreeNode node={root} />
    </ul>
  );
}

function Map({ pairs }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {pairs.map((pair) => (
        <div
          key={pair.from}
          className="flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-850 px-4 py-3"
        >
          <span className="min-w-0 flex-1 text-sm text-mist-300">{pair.from}</span>
          <ArrowRight size={14} className="shrink-0 text-mist-500" aria-hidden="true" />
          <span className="shrink-0 rounded-md border border-brand-500/30 bg-brand-500/10 px-2 py-0.5 font-mono text-xs text-brand-200">
            {pair.to}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function FlowDiagram({ diagram }) {
  const { variant, title } = diagram;

  return (
    <figure className="rounded-xl border border-ink-700 bg-ink-900/60 p-5">
      {title && (
        <figcaption className="mb-4 text-xs font-semibold tracking-[0.16em] text-mist-500 uppercase">
          {title}
        </figcaption>
      )}

      {variant === 'flow' && <FlowSteps steps={diagram.steps} />}
      {variant === 'tree' && <Tree root={diagram.root} />}
      {variant === 'map' && <Map pairs={diagram.pairs} />}
    </figure>
  );
}
