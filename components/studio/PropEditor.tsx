'use client'

import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { updateSectionProp } from '../../store/slices/draftPageSlice'
import { useAppDispatch, useAppSelector } from '../../store'

export default function PropEditor() {
  const dispatch = useAppDispatch()
  const selectedSectionId = useAppSelector(
    (state) => state.ui.selectedSectionId,
  )
  const sections = useAppSelector(
    (state) => state.draftPage.page?.sections || [],
  )
  const section = sections.find((item) => item.id === selectedSectionId)

  if (!section) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
        Select a section to edit
      </div>
    )
  }

  if (section.type === 'hero') {
    const headline = String(section.props.headline || '')
    const subheading = String(section.props.subheading || '')
    const headlineError = headline.trim() ? '' : 'Headline is required'

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hero-headline">Headline</Label>
          <Input
            id="hero-headline"
            value={headline}
            aria-invalid={Boolean(headlineError)}
            aria-describedby={headlineError ? 'hero-headline-error' : undefined}
            onChange={(event) =>
              dispatch(
                updateSectionProp({
                  sectionId: section.id,
                  key: 'headline',
                  value: event.target.value,
                }),
              )
            }
          />
          {headlineError ? (
            <p
              id="hero-headline-error"
              className="text-xs text-red-600"
              role="alert"
            >
              {headlineError}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="hero-subheading">Subheading</Label>
          <Input
            id="hero-subheading"
            value={subheading}
            onChange={(event) =>
              dispatch(
                updateSectionProp({
                  sectionId: section.id,
                  key: 'subheading',
                  value: event.target.value,
                }),
              )
            }
          />
        </div>
      </div>
    )
  }

  if (section.type === 'cta') {
    const label = String(section.props.label || '')
    const url = String(section.props.url || '')
    const labelError = label.trim() ? '' : 'Label is required'
    const urlError = url.trim() ? '' : 'URL is required'

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cta-label">Label</Label>
          <Input
            id="cta-label"
            value={label}
            aria-invalid={Boolean(labelError)}
            aria-describedby={labelError ? 'cta-label-error' : undefined}
            onChange={(event) =>
              dispatch(
                updateSectionProp({
                  sectionId: section.id,
                  key: 'label',
                  value: event.target.value,
                }),
              )
            }
          />
          {labelError ? (
            <p
              id="cta-label-error"
              className="text-xs text-red-600"
              role="alert"
            >
              {labelError}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cta-url">URL</Label>
          <Input
            id="cta-url"
            value={url}
            aria-invalid={Boolean(urlError)}
            aria-describedby={urlError ? 'cta-url-error' : undefined}
            onChange={(event) =>
              dispatch(
                updateSectionProp({
                  sectionId: section.id,
                  key: 'url',
                  value: event.target.value,
                }),
              )
            }
          />
          {urlError ? (
            <p
              id="cta-url-error"
              className="text-xs text-red-600"
              role="alert"
            >
              {urlError}
            </p>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
      Select a section to edit
    </div>
  )
}
