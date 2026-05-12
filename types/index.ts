export type SectionType = 'hero' | 'featureGrid' | 'testimonial' | 'cta'
export type Role = 'viewer' | 'editor' | 'publisher'

export interface Section {
  id: string
  type: SectionType
  props: Record<string, unknown>
}

export interface Page {
  pageId: string
  slug: string
  title: string
  sections: Section[]
}

export interface PublishedRelease {
  version: string
  slug: string
  page: Page
  publishedAt: string
  changelog: string
}
