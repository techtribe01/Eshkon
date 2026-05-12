import { describe, expect, it } from 'vitest'

import { bumpVersion, computeVersionBump } from '../lib/semver'

const basePage = {
  pageId: 'page-1',
  slug: 'home',
  title: 'Home',
  sections: [
    { id: 's1', type: 'hero' as const, props: { headline: 'Hello' } },
  ],
}

describe('computeVersionBump', () => {
  it('identical pages → none', () => {
    expect(computeVersionBump(basePage, basePage)).toBe('none')
  })

  it('only headline text changed → patch', () => {
    const next = {
      ...basePage,
      sections: [
        { id: 's1', type: 'hero' as const, props: { headline: 'Hi' } },
      ],
    }
    expect(computeVersionBump(basePage, next)).toBe('patch')
  })

  it('section added → minor', () => {
    const next = {
      ...basePage,
      sections: [
        ...basePage.sections,
        { id: 's2', type: 'cta' as const, props: { label: 'Go', url: '/' } },
      ],
    }
    expect(computeVersionBump(basePage, next)).toBe('minor')
  })

  it('section removed → major', () => {
    const next = { ...basePage, sections: [] }
    expect(computeVersionBump(basePage, next)).toBe('major')
  })

  it('section type changed (hero → cta, same id) → major', () => {
    const next = {
      ...basePage,
      sections: [
        { id: 's1', type: 'cta' as const, props: { label: 'Go', url: '/' } },
      ],
    }
    expect(computeVersionBump(basePage, next)).toBe('major')
  })

  it('multiple sections, only one prop changed → patch', () => {
    const prev = {
      ...basePage,
      sections: [
        { id: 's1', type: 'hero' as const, props: { headline: 'A' } },
        { id: 's2', type: 'cta' as const, props: { label: 'Go', url: '/' } },
      ],
    }
    const next = {
      ...prev,
      sections: [
        { id: 's1', type: 'hero' as const, props: { headline: 'B' } },
        { id: 's2', type: 'cta' as const, props: { label: 'Go', url: '/' } },
      ],
    }
    expect(computeVersionBump(prev, next)).toBe('patch')
  })
})

describe('bumpVersion', () => {
  it('1.0.0 + patch → 1.0.1', () => {
    expect(bumpVersion('1.0.0', 'patch')).toBe('1.0.1')
  })

  it('1.0.0 + minor → 1.1.0', () => {
    expect(bumpVersion('1.0.0', 'minor')).toBe('1.1.0')
  })

  it('1.0.0 + major → 2.0.0', () => {
    expect(bumpVersion('1.0.0', 'major')).toBe('2.0.0')
  })

  it('1.2.3 + patch → 1.2.4', () => {
    expect(bumpVersion('1.2.3', 'patch')).toBe('1.2.4')
  })

  it('1.2.3 + major → 2.0.0', () => {
    expect(bumpVersion('1.2.3', 'major')).toBe('2.0.0')
  })

  it('1.2.3 + minor → 1.3.0', () => {
    expect(bumpVersion('1.2.3', 'minor')).toBe('1.3.0')
  })
})
