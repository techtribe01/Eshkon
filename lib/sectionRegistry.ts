import type { ComponentType } from 'react'

import CTASection from '../components/sections/CTASection'
import HeroSection from '../components/sections/HeroSection'
import UnsupportedSection from '../components/sections/UnsupportedSection'
import type { SectionType } from '../types'

type SectionRegistry = Record<SectionType, ComponentType<any>>

export const sectionRegistry: SectionRegistry = {
  hero: HeroSection,
  featureGrid: UnsupportedSection,
  testimonial: UnsupportedSection,
  cta: CTASection,
}

export function getSection(type: string): ComponentType<any> {
  if (type in sectionRegistry) {
    return sectionRegistry[type as SectionType]
  }

  return UnsupportedSection
}
