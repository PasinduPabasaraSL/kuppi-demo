import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Callout from './Callout.jsx';
import CodeBlock from './CodeBlock.jsx';
import CommandList from './CommandList.jsx';
import ConceptGrid from './ConceptGrid.jsx';
import FlowDiagram from './FlowDiagram.jsx';
import QuizList from './QuizList.jsx';

function Block({ block }) {
  switch (block.type) {
    case 'text':
      return (
        <div className="space-y-3">
          {block.title && <h4 className="text-sm font-semibold text-mist-100">{block.title}</h4>}
          {block.body.map((paragraph) => (
            <p key={paragraph} className="text-[15px] leading-relaxed text-mist-300">
              {paragraph}
            </p>
          ))}
        </div>
      );
    case 'concepts':
      return <ConceptGrid title={block.title} items={block.items} />;
    case 'commands':
      return <CommandList title={block.title} items={block.items} />;
    case 'code':
      return <CodeBlock code={block.code} language={block.language} title={block.title} />;
    case 'diagram':
      return <FlowDiagram diagram={block} />;
    case 'callout':
      return <Callout variant={block.variant} title={block.title} body={block.body} />;
    case 'qa':
      return <QuizList groups={block.groups} />;
    default:
      return null;
  }
}

export default function Section({ section }) {
  const [open, setOpen] = useState(true);

  return (
    <section id={section.id} className="scroll-mt-24">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="group flex w-full items-center gap-2.5 border-b border-ink-700 pb-2.5 text-left"
      >
        <ChevronDown
          size={16}
          className={`shrink-0 text-mist-500 transition-transform group-hover:text-mist-300 ${
            open ? '' : '-rotate-90'
          }`}
        />
        <h3 className="text-lg font-semibold text-mist-100">{section.title}</h3>
        <span className="ml-auto text-[11px] text-mist-500">{open ? 'Collapse' : 'Expand'}</span>
      </button>

      {open && (
        <div className="animate-fade-in mt-5 space-y-5">
          {section.blocks.map((block, index) => (
            <Block key={`${block.type}-${index}`} block={block} />
          ))}
        </div>
      )}
    </section>
  );
}
