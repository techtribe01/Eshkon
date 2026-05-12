'use client'

import { addSection, reorderSections } from '../../store/slices/draftPageSlice'
import { selectSection } from '../../store/slices/uiSlice'
import { useAppDispatch, useAppSelector } from '../../store'

const SECTION_TYPE_LABELS: Record<string, string> = {
  hero: 'Hero',
  cta: 'CTA',
  featureGrid: 'Feature Grid',
  testimonial: 'Testimonial',
}

export default function SectionList() {
  const dispatch = useAppDispatch()
  const sections = useAppSelector(
    (state) => state.draftPage.page?.sections || [],
  )
  const selectedSectionId = useAppSelector(
    (state) => state.ui.selectedSectionId,
  )

  return (
    <div className="flex flex-col gap-1.5">
      {sections.length === 0 ? (
        <p className="px-1 py-4 text-center text-xs text-sidebar-text">
          No sections yet.
          <br />
          Add one below.
        </p>
      ) : (
        sections.map((section, index) => {
          const isSelected = section.id === selectedSectionId
          const isFirst = index === 0
          const isLast = index === sections.length - 1
          const typeLabel =
            SECTION_TYPE_LABELS[section.type] ?? section.type

          return (
            <div
              key={section.id}
              className={[
                'group rounded-md border transition-colors',
                isSelected
                  ? 'border-brand bg-sidebar-surface'
                  : 'border-sidebar-border hover:border-sidebar-text/30 hover:bg-sidebar-surface',
              ].join(' ')}
            >
              {/* Select row */}
              <button
                type="button"
                onClick={() => dispatch(selectSection(section.id))}
                aria-label={`Select ${typeLabel} section`}
                aria-pressed={isSelected}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
              >
                {/* Type color dot */}
                <span
                  className={[
                    'h-2 w-2 shrink-0 rounded-full',
                    section.type === 'hero'
                      ? 'bg-brand'
                      : section.type === 'cta'
                      ? 'bg-green-500'
                      : 'bg-sidebar-text',
                  ].join(' ')}
                  aria-hidden="true"
                />
                <span
                  className={`flex-1 truncate text-left text-xs font-medium ${
                    isSelected ? 'text-sidebar-text-active' : 'text-sidebar-text'
                  }`}
                >
                  {typeLabel}
                </span>
                <span className="font-mono text-[9px] text-sidebar-text/50">
                  {section.id.slice(0, 6)}
                </span>
              </button>

              {/* Reorder controls */}
              <div className="flex items-center gap-1 border-t border-sidebar-border px-2 py-1.5">
                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      reorderSections({ fromIndex: index, toIndex: index - 1 }),
                    )
                  }
                  disabled={isFirst}
                  aria-label="Move section up"
                  className="flex h-5 w-5 items-center justify-center rounded text-sidebar-text transition-colors hover:bg-sidebar-border hover:text-sidebar-text-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M2 6.5L5 3.5L8 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      reorderSections({ fromIndex: index, toIndex: index + 1 }),
                    )
                  }
                  disabled={isLast}
                  aria-label="Move section down"
                  className="flex h-5 w-5 items-center justify-center rounded text-sidebar-text transition-colors hover:bg-sidebar-border hover:text-sidebar-text-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          )
        })
      )}

      {/* Add section button */}
      <button
        type="button"
        onClick={() =>
          dispatch(
            addSection({
              id: crypto.randomUUID(),
              type: 'hero',
              props: { headline: 'New Section', subheading: '' },
            }),
          )
        }
        aria-label="Add new section"
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-sidebar-border py-2 text-xs font-medium text-sidebar-text transition-colors hover:border-sidebar-text/40 hover:text-sidebar-text-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Add Section
      </button>
    </div>
  )
}
