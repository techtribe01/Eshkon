'use client'

import { addSection, reorderSections } from '../../store/slices/draftPageSlice'
import { selectSection } from '../../store/slices/uiSlice'
import { useAppDispatch, useAppSelector } from '../../store'

export default function SectionList() {
  const dispatch = useAppDispatch()
  const sections = useAppSelector(
    (state) => state.draftPage.page?.sections || [],
  )
  const selectedSectionId = useAppSelector(
    (state) => state.ui.selectedSectionId,
  )

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        {sections.map((section, index) => {
          const isSelected = section.id === selectedSectionId
          const isFirst = index === 0
          const isLast = index === sections.length - 1

          return (
            <div
              key={section.id}
              className={`rounded-lg border px-3 py-2 text-sm ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200'
              }`}
            >
              <button
                type="button"
                className="w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                onClick={() => dispatch(selectSection(section.id))}
                aria-label={`Select section ${section.type}`}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    {section.type}
                  </span>
                  <span className="text-xs text-slate-500">
                    {section.id.slice(0, 8)}
                  </span>
                </div>
              </button>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className="rounded-md border px-2 py-1 text-xs text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() =>
                    dispatch(
                      reorderSections({
                        fromIndex: index,
                        toIndex: index - 1,
                      }),
                    )
                  }
                  disabled={isFirst}
                  aria-label="Move section up"
                >
                  Up
                </button>
                <button
                  type="button"
                  className="rounded-md border px-2 py-1 text-xs text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() =>
                    dispatch(
                      reorderSections({
                        fromIndex: index,
                        toIndex: index + 1,
                      }),
                    )
                  }
                  disabled={isLast}
                  aria-label="Move section down"
                >
                  Down
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        className="rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        onClick={() =>
          dispatch(
            addSection({
              id: crypto.randomUUID(),
              type: 'hero',
              props: { headline: 'New Section', subheading: '' },
            }),
          )
        }
        aria-label="Add section"
      >
        Add Section
      </button>
    </div>
  )
}
