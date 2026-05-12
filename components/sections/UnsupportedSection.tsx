interface UnsupportedSectionProps {
  type?: string
}

export default function UnsupportedSection({
  type,
}: UnsupportedSectionProps) {
  return (
    <section className="w-full bg-yellow-100 px-6 py-6 text-sm text-yellow-900">
      Unsupported section type: {type || 'unknown'}
    </section>
  )
}
