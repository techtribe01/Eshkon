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
    <section className="w-full bg-slate-900 py-16 text-center text-white">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {headline}
        </h1>
        {subheading ? (
          <p className="text-base text-slate-200 sm:text-lg">{subheading}</p>
        ) : null}
        {imageUrl ? (
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl">
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
