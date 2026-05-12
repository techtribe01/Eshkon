'use client'

import { ArrowRight } from 'lucide-react'

interface CTASectionProps {
  label: string
  url: string
}

export default function CTASection({ label, url }: CTASectionProps) {
  return (
    <section className="w-full py-16">
      <div className="mx-auto flex max-w-4xl justify-center px-6">
        <a
          href={url}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          aria-label={label}
        >
          <span>{label}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
