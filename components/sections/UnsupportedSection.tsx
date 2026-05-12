interface UnsupportedSectionProps {
  type?: string
}

export default function UnsupportedSection({ type }: UnsupportedSectionProps) {
  return (
    <section className="w-full border-t border-border bg-surface px-6 py-6">
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-amber-600"
        >
          <path
            d="M8 1.5L14.5 13H1.5L8 1.5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M8 6v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
        </svg>
        <p className="text-sm text-amber-800">
          Unsupported section type:{' '}
          <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">
            {type || 'unknown'}
          </code>
        </p>
      </div>
    </section>
  )
}
