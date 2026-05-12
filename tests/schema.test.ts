import { describe, expect, it } from 'vitest'
import { ZodError } from 'zod'

import { validatePage, validateSection } from '../lib/schemas'

const baseSection = {
  id: 'section-1',
  type: 'hero' as const,
  props: { headline: 'Hello', subheading: 'World' },
}

const basePage = {
  pageId: 'page-1',
  slug: 'home',
  title: 'Home',
  sections: [baseSection],
}

describe('validatePage', () => {
  it('valid Page object passes without throwing', () => {
    expect(() => validatePage(basePage)).not.toThrow()
  })

  it('missing pageId throws ZodError', () => {
    const invalid = { ...basePage }
    delete (invalid as { pageId?: string }).pageId
    expect(() => validatePage(invalid)).toThrow(ZodError)
  })

  it('missing slug throws ZodError', () => {
    const invalid = { ...basePage }
    delete (invalid as { slug?: string }).slug
    expect(() => validatePage(invalid)).toThrow(ZodError)
  })

  it('invalid section type throws ZodError', () => {
    const invalid = {
      ...basePage,
      sections: [{ ...baseSection, type: 'banner' }],
    }
    expect(() => validatePage(invalid)).toThrow(ZodError)
  })

  it('empty sections array is valid', () => {
    const valid = { ...basePage, sections: [] }
    expect(() => validatePage(valid)).not.toThrow()
  })

  it('unknown extra fields in props are allowed', () => {
    const valid = {
      ...basePage,
      sections: [
        {
          ...baseSection,
          props: { headline: 'Hi', customFlag: true, count: 2 },
        },
      ],
    }
    expect(() => validatePage(valid)).not.toThrow()
  })
})

describe('validateSection', () => {
  it('valid section passes', () => {
    expect(() => validateSection(baseSection)).not.toThrow()
  })

  it('missing id throws', () => {
    const invalid = { ...baseSection }
    delete (invalid as { id?: string }).id
    expect(() => validateSection(invalid)).toThrow(ZodError)
  })

  it('invalid type throws', () => {
    const invalid = { ...baseSection, type: 'banner' }
    expect(() => validateSection(invalid)).toThrow(ZodError)
  })

  it('props can be any key/value', () => {
    const valid = {
      ...baseSection,
      props: { any: 'value', nested: { ok: true }, list: [1, 2] },
    }
    expect(() => validateSection(valid)).not.toThrow()
  })
})
