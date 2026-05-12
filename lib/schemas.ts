import { z } from 'zod'

import type { Page, Section } from '../types'

export const SectionSchema = z.object({
  id: z.string(),
  type: z.enum(['hero', 'featureGrid', 'testimonial', 'cta']),
  props: z.record(z.unknown()),
})

export const PageSchema = z.object({
  pageId: z.string(),
  slug: z.string(),
  title: z.string(),
  sections: z.array(SectionSchema),
})

export function validatePage(data: unknown): Page {
  return PageSchema.parse(data)
}

export function validateSection(data: unknown): Section {
  return SectionSchema.parse(data)
}
