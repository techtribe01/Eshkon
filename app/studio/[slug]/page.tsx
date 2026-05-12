'use client'

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
  if (typeof document === 'undefined') {
    return 'viewer'
  }

  const cookie = document.cookie
  const match = cookie.match(/(?:^|; )role=([^;]+)/)
  const role = match?.[1]

  if (role === 'editor' || role === 'publisher') {
    return role
  }

  return 'viewer'
}

export default function StudioPage({ params }: StudioPageProps) {
  const dispatch = useAppDispatch()
  const page = useAppSelector((state) => state.draftPage.page)
  const sections = useAppSelector((state) => state.draftPage.page?.sections || [])
  const publishStatus = useAppSelector((state) => state.publish.status)
  const publishVersion = useAppSelector((state) => state.publish.currentVersion)
  const [role, setRole] = useState<Role>('viewer')

  useEffect(() => {
    setRole(readRoleFromCookie())
  }, [])

  useEffect(() => {
    const loadPage = async () => {
      try {
        const response = await fetch(`/api/page?slug=${params.slug}`)
        if (!response.ok) {
          return
        }
        const data = (await response.json()) as { page: unknown }
        if (data.page) {
          dispatch(setPage(data.page as any))
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadPage()
  }, [dispatch, params.slug])

  const canPublish = role === 'publisher'
  const statusLabel = useMemo(() => {
    if (publishStatus === 'publishing') {
      return 'Publishing'
    }
    if (publishStatus === 'success') {
      return publishVersion ? `Published ${publishVersion}` : 'Published'
    }
    if (publishStatus === 'error') {
      return 'Publish failed'
    }
    return 'Idle'
  }, [publishStatus, publishVersion])

  const handlePublish = async () => {
    if (!page) {
      return
    }

    dispatch(setStatus('publishing'))
    dispatch(setErrorMessage(''))

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, slug: params.slug }),
      })

      if (!response.ok) {
        dispatch(setStatus('error'))
        dispatch(setErrorMessage('Publish failed'))
        return
      }

      const result = (await response.json()) as {
        version?: string
        changelog?: string
      }

      dispatch(setStatus('success'))
      dispatch(setVersion(result.version || ''))
      dispatch(setChangelog(result.changelog || ''))
    } catch (error) {
      console.error(error)
      dispatch(setStatus('error'))
      dispatch(setErrorMessage('Publish failed'))
    }
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-72 border-r border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-700">Sections</h2>
        <div className="mt-4">
          <SectionList />
        </div>
      </aside>

      <main className="flex-1 px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">
              Studio Editor
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              {page?.title || 'Untitled Page'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {statusLabel}
            </span>
            {canPublish ? (
              <button
                type="button"
                onClick={handlePublish}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                aria-label="Publish page"
              >
                Publish
              </button>
            ) : null}
          </div>
        </div>

        <section className="mt-6 rounded-lg border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-700">Properties</h2>
          <div className="mt-4">
            <PropEditor />
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-semibold text-slate-700">Live preview</h2>
          <div className="mt-4 rounded-lg border border-slate-200">
            {sections.length === 0 ? (
              <div className="px-4 py-6 text-sm text-slate-500">
                No sections yet
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
  )
}
