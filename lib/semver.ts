import type { Page, Section } from '../types'

type BumpType = 'major' | 'minor' | 'patch' | 'none'

type ChangeSummary = {
  removed: string[]
  added: string[]
  typeChanged: string[]
  propsChanged: string[]
}

function buildSectionMap(sections: Section[]): Map<string, Section> {
  return new Map(sections.map((section) => [section.id, section]))
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function deepEqual(left: unknown, right: unknown): boolean {
  if (left === right) {
    return true
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) {
      return false
    }
    return left.every((value, index) => deepEqual(value, right[index]))
  }

  if (isObject(left) && isObject(right)) {
    const leftKeys = Object.keys(left).sort()
    const rightKeys = Object.keys(right).sort()

    if (leftKeys.length !== rightKeys.length) {
      return false
    }

    return leftKeys.every((key, index) => {
      if (key !== rightKeys[index]) {
        return false
      }
      return deepEqual(left[key], right[key])
    })
  }

  return false
}

function getChangeSummary(prev: Page, next: Page): ChangeSummary {
  const prevMap = buildSectionMap(prev.sections)
  const nextMap = buildSectionMap(next.sections)

  const removed: string[] = []
  const added: string[] = []
  const typeChanged: string[] = []
  const propsChanged: string[] = []

  prevMap.forEach((section, id) => {
    const nextSection = nextMap.get(id)
    if (!nextSection) {
      removed.push(id)
      return
    }

    if (section.type !== nextSection.type) {
      typeChanged.push(id)
      return
    }

    if (!deepEqual(section.props, nextSection.props)) {
      propsChanged.push(id)
    }
  })

  nextMap.forEach((_section, id) => {
    if (!prevMap.has(id)) {
      added.push(id)
    }
  })

  return { removed, added, typeChanged, propsChanged }
}

export function computeVersionBump(prev: Page, next: Page): BumpType {
  const changes = getChangeSummary(prev, next)

  if (changes.removed.length > 0 || changes.typeChanged.length > 0) {
    return 'major'
  }

  if (changes.added.length > 0) {
    return 'minor'
  }

  if (changes.propsChanged.length > 0) {
    return 'patch'
  }

  return 'none'
}

export function bumpVersion(
  current: string,
  bump: 'major' | 'minor' | 'patch',
): string {
  const [majorRaw, minorRaw, patchRaw] = current.split('.')
  const major = Number(majorRaw) || 0
  const minor = Number(minorRaw) || 0
  const patch = Number(patchRaw) || 0

  if (bump === 'major') {
    return `${major + 1}.0.0`
  }

  if (bump === 'minor') {
    return `${major}.${minor + 1}.0`
  }

  return `${major}.${minor}.${patch + 1}`
}

export function generateChangelog(
  prev: Page,
  next: Page,
  bump: string,
  version: string,
): string {
  const changes = getChangeSummary(prev, next)
  const parts: string[] = []

  if (changes.added.length > 0) {
    parts.push(`added ${changes.added.length} section(s)`) 
  }
  if (changes.removed.length > 0) {
    parts.push(`removed ${changes.removed.length} section(s)`) 
  }
  if (changes.typeChanged.length > 0) {
    parts.push(`changed ${changes.typeChanged.length} section type(s)`) 
  }
  if (changes.propsChanged.length > 0) {
    parts.push(`updated ${changes.propsChanged.length} section prop(s)`) 
  }

  const description = parts.length > 0 ? parts.join(', ') : 'no changes detected'

  return `v${version} (${bump}): ${description}`
}
