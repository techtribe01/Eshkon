import { createClient } from 'contentful'
import type { EntrySkeletonType } from 'contentful'

import type { Page, Section } from '../types'

type ContentfulEntry<TFields> = {
  sys?: { id?: string }
  fields?: TFields
}

type ContentfulPageFields = {
  pageId?: string
  slug?: string
  title?: string
  sections?: Array<ContentfulEntry<ContentfulSectionFields>>
}

type ContentfulSectionFields = {
  type?: string
  props?: Record<string, unknown>
}

interface ContentfulPageSkeleton extends EntrySkeletonType {
  fields: ContentfulPageFields
  contentTypeId: 'page'
}

function getEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing ${name}. Set it in your environment to use Contentful.`,
    )
  }
  return value
}

// Clients are created lazily inside each function so that missing env vars
// only throw at call-time (e.g. during a real request) rather than at module
// evaluation time (which happens during Next.js static-path generation and
// would crash the build when Contentful env vars are not set).
function getDeliveryClient() {
  return createClient({
    space: getEnv('CONTENTFUL_SPACE_ID'),
    accessToken: getEnv('CONTENTFUL_ACCESS_TOKEN'),
  })
}

function getPreviewClient() {
  return createClient({
    space: getEnv('CONTENTFUL_SPACE_ID'),
    accessToken: getEnv('CONTENTFUL_PREVIEW_TOKEN'),
    host: 'preview.contentful.com',
  })
}

function mapSection(entry: ContentfulEntry<ContentfulSectionFields>): Section {
  const fields = entry.fields || {}

  return {
    id: entry.sys?.id || '',
    type: (fields.type || 'hero') as Section['type'],
    props: fields.props || {},
  }
}

function mapPage(entry: ContentfulEntry<ContentfulPageFields>): Page {
  const fields = entry.fields || {}
  const sections = (fields.sections || []).map(mapSection)

  return {
    pageId: fields.pageId || entry.sys?.id || '',
    slug: fields.slug || '',
    title: fields.title || '',
    sections,
  }
}

export async function getPage(slug: string, preview = false): Promise<Page> {
  const client = preview ? getPreviewClient() : getDeliveryClient()

  const entries = await client.getEntries<ContentfulPageSkeleton>({
    content_type: 'page',
    'fields.slug': slug,
    include: 2,
  } as Record<string, unknown>)

  const entry = entries.items[0]
  if (!entry) {
    throw new Error(`Page with slug "${slug}" not found.`)
  }

  return mapPage(entry)
}

export async function getAllSlugs(): Promise<string[]> {
  const entries = await getDeliveryClient().getEntries<ContentfulPageSkeleton>({
    content_type: 'page',
    select: ['fields.slug'],
  } as Record<string, unknown>)

  return entries.items
    .map((entry) => entry.fields?.slug)
    .filter((slug): slug is string => Boolean(slug))
}
