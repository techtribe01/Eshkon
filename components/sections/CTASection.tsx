'use client'

import { ArrowRight } from 'lucide-react'

interface CTASectionProps {
  label: string
  url: string
}

export default function CTASection({ label, url }: CTASectionProps) {
  return (
    <section className="w-full border-t border-border bg-surface-muted px-6 py-14 text-center">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5">
        <span className="inline-block rounded-full border border-border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-foreground-subtle">
          Call to Action
        </span>
        <p className="text-lg font-semibold text-balance text-foreground">
          Ready to get started?
        </p>
        <a
          href={url}
          className={[
            'inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3',
            'text-sm font-semibold text-brand-foreground',
            'transition-colors hover:bg-brand-hover',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
          ].join(' ')}
          aria-label={label}
        >
          <span>{label}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
