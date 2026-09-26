export default function ConceptGrid({ title, items }) {
  return (
    <div>
      {title && (
        <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-mist-500 uppercase">
          {title}
        </p>
      )}
      <dl className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.term}
            className="rounded-lg border border-ink-700 bg-ink-900 p-4 transition-colors hover:border-ink-600"
          >
            <dt className="text-sm font-semibold text-mist-100">{item.term}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-mist-400">{item.detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
