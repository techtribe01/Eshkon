'use client'

import Image from 'next/image'

interface HeroSectionProps {
  headline: string
  subheading?: string
  imageUrl?: string
}

export default function HeroSection({
  headline,
  subheading,
  imageUrl,
}: HeroSectionProps) {
  return (
    <section className="w-full bg-sidebar px-6 py-20 text-center">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
        <span className="inline-block rounded-full border border-sidebar-border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-sidebar-text">
          Hero
        </span>
        <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-sidebar-text-active sm:text-5xl">
          {headline}
        </h1>
        {subheading ? (
          <p className="max-w-lg text-base leading-relaxed text-sidebar-text sm:text-lg">
            {subheading}
          </p>
        ) : null}
        {imageUrl ? (
          <div className="mt-4 w-full max-w-3xl overflow-hidden rounded-xl border border-sidebar-border">
            <Image
              src={imageUrl}
              alt=""
              width={1200}
              height={720}
              className="h-auto w-full"
              priority
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
