import ErrorBoundary from '../../../components/sections/ErrorBoundary'
import { getPage } from '../../../lib/contentfulClient'
import { getSection } from '../../../lib/sectionRegistry'
import { validatePage } from '../../../lib/schemas'

interface PreviewPageProps {
  params: { slug: string }
  searchParams?: { preview?: string }
}

export default async function PreviewPage({
  params,
  searchParams,
}: PreviewPageProps) {
  try {
    const previewFlag = searchParams?.preview
    const isPreview = previewFlag === 'true' || previewFlag === '1'
    const page = await getPage(params.slug, isPreview)
    const validated = validatePage(page)

    return (
      <>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:border focus:border-brand focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand"
          aria-label="Skip to main content"
        >
          Skip to main content
        </a>
        <main id="main" className="min-h-screen bg-background">
          {validated.sections.map((section) => {
            const SectionComponent = getSection(section.type)
            return (
              <ErrorBoundary key={section.id}>
                <SectionComponent {...section.props} />
              </ErrorBoundary>
            )
          })}
        </main>
      </>
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : ''

    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" className="text-foreground-subtle" />
            <path d="M10 6.5v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-foreground-subtle" />
            <circle cx="10" cy="13.5" r="0.75" fill="currentColor" className="text-foreground-subtle" />
          </svg>
        </div>
        <h1 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h1>
        {message.includes('Invalid') ? (
          <p className="mt-2 text-sm text-foreground-muted">
            The page data is invalid and could not be rendered.
          </p>
        ) : (
          <p className="mt-2 text-sm text-foreground-muted">
            This page does not exist or has not been published yet.
          </p>
        )}
      </main>
    )
  }
}
