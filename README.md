## Architecture Overview
Page Studio uses a layered architecture that keeps CMS concerns isolated and UI logic predictable.

Data flow diagram:

Contentful
  -> contentfulClient adapter
  -> Next.js server components (preview)
  -> Redux draft state (studio)
  -> UI components

Contentful provides page and section entries. The adapter in [lib/contentfulClient.ts](lib/contentfulClient.ts) maps them into app-native types. Preview rendering is server-side, while studio editing uses Redux to keep client-side draft changes isolated from published content.

## Redux Slice Responsibilities
| Slice | State Shape | Actions |
| --- | --- | --- |
| draftPage | { page: Page \| null; isDirty: boolean } | setPage, updateSectionProp, addSection, removeSection, reorderSections, markClean |
| ui | { selectedSectionId: string \| null; isPanelOpen: boolean; isLoading: boolean } | selectSection, togglePanel, setLoading |
| publish | { status: 'idle'\|'publishing'\|'success'\|'error'; currentVersion: string; changelog: string; errorMessage: string } | setStatus, setVersion, setChangelog, setErrorMessage |

## Contentful Model and Adapter
Contentful uses two content types:
- page: the top-level page object (slug, title, section references)
- section: section entries with a type and props blob

The adapter in [lib/contentfulClient.ts](lib/contentfulClient.ts) encapsulates all Contentful SDK usage and maps entries to the internal Page and Section types. This prevents CMS SDK types from leaking into the app.

Preview pages read from Contentful directly. Add `?preview=true` to use draft content via the preview API, while published versions are stored as snapshots in releases/. Studio editing works from a draft copy loaded from the API and does not mutate published snapshots.

## Publish and SemVer Logic
Publish uses structural rules to determine a version bump:
- Major: a section is removed or a section changes type (example: hero -> cta)
- Minor: a new section is added
- Patch: only prop values change

If the draft matches the last release exactly, publishing is idempotent and returns "No changes to publish" without creating a new version.

Each publish writes JSON snapshots into releases/{slug}/, including a latest.json pointer for fast reads.

## Accessibility Approach
WCAG 2.2 practices included:
- Focus-visible outlines for keyboard users
- Proper heading hierarchy (h1 for hero)
- Skip-to-content link for preview pages
- Keyboard-accessible buttons and links
- Sufficient color contrast in primary CTAs

Playwright integrates axe via axe-playwright, and writes a11y-report.json on each run. The e2e suite also asserts keyboard focus on CTA links.

## What Is Incomplete and Why
- featureGrid and testimonial section types: UI shells exist, not fully implemented
- Screen recording: not included in repo
- Production auth: role is cookie-based for demo — replace with NextAuth for production

## Running Locally
1. Clone the repo
2. Install dependencies: pnpm install
3. Create .env.local from .env.example and fill in values
4. Configure Contentful with page and section types
5. Start the dev server: pnpm dev

## Environment Variables
| Variable | Description |
| --- | --- |
| CONTENTFUL_SPACE_ID | Contentful space identifier |
| CONTENTFUL_ACCESS_TOKEN | Contentful delivery API token |
| CONTENTFUL_PREVIEW_TOKEN | Contentful preview API token |
| NEXTAUTH_SECRET | Secret used by NextAuth (required for production auth) |
