import Link from 'next/link'
import { cookies } from 'next/headers'

import type { Role } from '../types'

async function setRoleAction(formData: FormData) {
  'use server'

  const role = formData.get('role')

  if (role === 'viewer' || role === 'editor' || role === 'publisher') {
    cookies().set('role', role)
  }
}

const ROLES: { value: Role; label: string; description: string }[] = [
  {
    value: 'viewer',
    label: 'Viewer',
    description: 'Read-only access to published previews.',
  },
  {
    value: 'editor',
    label: 'Editor',
    description: 'Edit drafts and live preview sections.',
  },
  {
    value: 'publisher',
    label: 'Publisher',
    description: 'Publish pages and bump semantic versions.',
  },
]

export default function HomePage() {
  const role = cookies().get('role')?.value
  const currentRole: Role =
    role === 'editor' || role === 'publisher' ? role : 'viewer'

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top nav bar */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-sidebar">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <rect x="1" y="1" width="5" height="5" rx="1" fill="#a8a29e" />
                <rect x="8" y="1" width="5" height="5" rx="1" fill="#a8a29e" />
                <rect x="1" y="8" width="5" height="5" rx="1" fill="#a8a29e" />
                <rect x="8" y="8" width="5" height="5" rx="1" fill="#0f6fff" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-foreground">
              Page Studio
            </span>
          </div>
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            <Link
              href="/preview/home"
              className="rounded px-3 py-1.5 text-sm text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            >
              Preview
            </Link>
            <Link
              href="/studio/home"
              className="rounded bg-brand px-3 py-1.5 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            >
              Open Studio
            </Link>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        {/* Page title */}
        <div className="mb-10">
          <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-widest text-foreground-subtle">
            Access Control
          </p>
          <h1 className="text-2xl font-semibold text-balance text-foreground">
            Select your role
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
            Role is stored in a cookie and enforced server-side on all
            protected routes.
          </p>
        </div>

        {/* Role cards */}
        <div
          className="grid gap-3 sm:grid-cols-3"
          role="group"
          aria-label="Role selection"
        >
          {ROLES.map(({ value, label, description }) => {
            const isActive = currentRole === value
            return (
              <form action={setRoleAction} key={value}>
                <input type="hidden" name="role" value={value} />
                <button
                  type="submit"
                  aria-label={`Set role as ${label}`}
                  aria-pressed={isActive}
                  className={[
                    'w-full rounded-lg border px-5 py-4 text-left transition-colors',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand',
                    isActive
                      ? 'border-brand bg-surface shadow-sm'
                      : 'border-border bg-surface hover:border-border-strong hover:bg-surface-muted',
                  ].join(' ')}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {label}
                    </span>
                    {isActive && (
                      <span className="rounded-full bg-brand px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-brand-foreground">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-foreground-muted">
                    {description}
                  </p>
                </button>
              </form>
            )
          })}
        </div>

        {/* Divider + quick links */}
        <div className="mt-10 border-t border-border pt-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground-subtle">
            Quick Links
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/preview/home"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
              aria-label="Go to preview home"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Preview Home
            </Link>
            <Link
              href="/studio/home"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
              aria-label="Go to studio home"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Studio Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
