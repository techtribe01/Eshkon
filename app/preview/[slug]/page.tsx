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
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-blue-600"
          aria-label="Skip to main content"
        >
          Skip to main content
        </a>
        <main id="main" className="min-h-screen">
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
      <main className="min-h-screen px-6 py-16">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        {message.includes('Invalid') ? (
          <p className="mt-2 text-sm text-red-600">Invalid page data</p>
        ) : null}
      </main>
    )
  }
}
