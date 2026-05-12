'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import ErrorBoundary from '../../../components/sections/ErrorBoundary'
import SectionList from '../../../components/studio/SectionList'
import PropEditor from '../../../components/studio/PropEditor'
import { getSection } from '../../../lib/sectionRegistry'
import {
  setChangelog,
  setErrorMessage,
  setStatus,
  setVersion,
} from '../../../store/slices/publishSlice'
import { setPage } from '../../../store/slices/draftPageSlice'
import { useAppDispatch, useAppSelector } from '../../../store'

interface StudioPageProps {
  params: { slug: string }
}

type Role = 'viewer' | 'editor' | 'publisher'

function readRoleFromCookie(): Role {
  if (typeof document === 'undefined') return 'viewer'
  const match = document.cookie.match(/(?:^|; )role=([^;]+)/)
  const role = match?.[1]
  if (role === 'editor' || role === 'publisher') return role
  return 'viewer'
}

const STATUS_STYLES: Record<
  string,
  { dot: string; badge: string; label: string }
> = {
  idle: {
    dot: 'bg-border-strong',
    badge: 'bg-surface-muted text-foreground-muted',
    label: 'Idle',
  },
  publishing: {
    dot: 'bg-amber-400 animate-pulse',
    badge: 'bg-amber-50 text-amber-700',
    label: 'Publishing…',
  },
  success: {
    dot: 'bg-green-500',
    badge: 'bg-green-50 text-green-700',
    label: 'Published',
  },
  error: {
    dot: 'bg-red-500',
    badge: 'bg-red-50 text-red-700',
    label: 'Failed',
  },
}

export default function StudioPage({ params }: StudioPageProps) {
  const dispatch = useAppDispatch()
  const page = useAppSelector((state) => state.draftPage.page)
  const isDirty = useAppSelector((state) => state.draftPage.isDirty)
  const sections = useAppSelector(
    (state) => state.draftPage.page?.sections || [],
  )
  const publishStatus = useAppSelector((state) => state.publish.status)
  const publishVersion = useAppSelector((state) => state.publish.currentVersion)
  const publishChangelog = useAppSelector((state) => state.publish.changelog)
  const publishError = useAppSelector((state) => state.publish.errorMessage)
  const [role, setRole] = useState<Role>('viewer')

  useEffect(() => {
    setRole(readRoleFromCookie())
  }, [])

  useEffect(() => {
    const loadPage = async () => {
      try {
        const res = await fetch(`/api/page?slug=${params.slug}`)
        if (!res.ok) return
        const data = (await res.json()) as { page: unknown }
        if (data.page) dispatch(setPage(data.page as never))
      } catch (err) {
        console.error(err)
      }
    }
    loadPage()
  }, [dispatch, params.slug])

  const canPublish = role === 'publisher'
  const isPublishing = publishStatus === 'publishing'

  const statusMeta = useMemo(() => {
    const meta = STATUS_STYLES[publishStatus] ?? STATUS_STYLES.idle
    if (publishStatus === 'success' && publishVersion) {
      return { ...meta, label: publishVersion }
    }
    return meta
  }, [publishStatus, publishVersion])

  const handlePublish = async () => {
    if (!page) return
    dispatch(setStatus('publishing'))
    dispatch(setErrorMessage(''))
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, slug: params.slug }),
      })
      if (!res.ok) {
        dispatch(setStatus('error'))
        dispatch(setErrorMessage('Publish failed. Please try again.'))
        return
      }
      const result = (await res.json()) as { version?: string; changelog?: string }
      dispatch(setStatus('success'))
      dispatch(setVersion(result.version || ''))
      dispatch(setChangelog(result.changelog || ''))
    } catch (err) {
      console.error(err)
      dispatch(setStatus('error'))
      dispatch(setErrorMessage('Network error. Please try again.'))
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Top bar */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded px-2 py-1 text-xs text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            aria-label="Back to home"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7.5 2L3.5 6L7.5 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Home
          </Link>
          <span className="text-border-strong" aria-hidden="true">/</span>
          <span className="text-xs font-medium text-foreground">
            {page?.title || params.slug}
          </span>
          {isDirty && (
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" title="Unsaved changes" aria-label="Unsaved changes" />
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Status badge */}
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusMeta.badge}`}
            aria-live="polite"
            aria-atomic="true"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`} aria-hidden="true" />
            {statusMeta.label}
          </div>

          {/* Publish */}
          {canPublish ? (
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              aria-label="Publish page"
              className="rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground transition-colors hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPublishing ? 'Publishing…' : 'Publish'}
            </button>
          ) : null}
        </div>
      </header>

      {/* Body: sidebar + main canvas */}
      <div className="flex flex-1 overflow-hidden">
        {/* Dark sidebar */}
        <aside
          className="flex w-64 shrink-0 flex-col overflow-y-auto bg-sidebar"
          aria-label="Page sections"
        >
          <div className="border-b border-sidebar-border px-4 py-3">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-sidebar-text">
              Sections
            </p>
          </div>
          <div className="flex-1 px-3 py-3">
            <SectionList />
          </div>
        </aside>

        {/* Main editor canvas */}
        <main className="flex flex-1 flex-col overflow-y-auto" id="main">
          {/* Properties panel */}
          <section
            className="border-b border-border bg-surface px-6 py-5"
            aria-labelledby="props-heading"
          >
            <h2
              id="props-heading"
              className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-widest text-foreground-subtle"
            >
              Properties
            </h2>
            <PropEditor />
          </section>

          {/* Changelog / error banners */}
          {publishStatus === 'success' && publishChangelog ? (
            <div
              className="mx-6 mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
              role="status"
            >
              <span className="font-semibold">Released:</span> {publishChangelog}
            </div>
          ) : null}
          {publishStatus === 'error' && publishError ? (
            <div
              className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {publishError}
            </div>
          ) : null}

          {/* Live preview */}
          <section
            className="flex-1 px-6 py-5"
            aria-labelledby="preview-heading"
          >
            <h2
              id="preview-heading"
              className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-widest text-foreground-subtle"
            >
              Live Preview
            </h2>
            <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
              {sections.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
                  <div className="rounded-lg border border-dashed border-border p-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" className="text-foreground-subtle" />
                      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" className="text-foreground-subtle" />
                      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" className="text-foreground-subtle" />
                      <path d="M14.5 11v7M11 14.5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-foreground-subtle" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-foreground-muted">
                    No sections yet
                  </p>
                  <p className="text-xs text-foreground-subtle">
                    Add a section from the sidebar to get started.
                  </p>
                </div>
              ) : (
                sections.map((section) => {
                  const SectionComponent = getSection(section.type)
                  return (
                    <ErrorBoundary key={section.id}>
                      <SectionComponent {...section.props} />
                    </ErrorBoundary>
                  )
                })
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
