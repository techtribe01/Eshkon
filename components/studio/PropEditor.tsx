'use client'

import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { updateSectionProp } from '../../store/slices/draftPageSlice'
import { useAppDispatch, useAppSelector } from '../../store'

function FieldGroup({
  id,
  label,
  value,
  placeholder,
  error,
  onChange,
}: {
  id: string
  label: string
  value: string
  placeholder?: string
  error?: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-xs font-medium text-foreground-muted">
          {label}
        </Label>
        {error ? (
          <span className="font-mono text-[10px] text-red-500">Required</span>
        ) : null}
      </div>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'border-red-400 focus-visible:outline-red-400' : ''}
      />
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default function PropEditor() {
  const dispatch = useAppDispatch()
  const selectedSectionId = useAppSelector(
    (state) => state.ui.selectedSectionId,
  )
  const sections = useAppSelector(
    (state) => state.draftPage.page?.sections || [],
  )
  const section = sections.find((item) => item.id === selectedSectionId)

  const updateProp = (key: string, value: string) =>
    section &&
    dispatch(updateSectionProp({ sectionId: section.id, key, value }))

  if (!section) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-dashed border-border px-4 py-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-muted">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v6M7 10v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-foreground-subtle" />
            <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-foreground-subtle" />
          </svg>
        </div>
        <p className="text-sm text-foreground-muted">
          Select a section to edit its properties.
        </p>
      </div>
    )
  }

  if (section.type === 'hero') {
    const headline = String(section.props.headline || '')
    const subheading = String(section.props.subheading || '')

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="rounded-sm bg-brand/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand">
            Hero
          </span>
        </div>
        <FieldGroup
          id="hero-headline"
          label="Headline"
          value={headline}
          placeholder="Enter a compelling headline…"
          error={headline.trim() ? undefined : 'Headline is required'}
          onChange={(v) => updateProp('headline', v)}
        />
        <FieldGroup
          id="hero-subheading"
          label="Subheading"
          value={subheading}
          placeholder="Optional supporting text…"
          onChange={(v) => updateProp('subheading', v)}
        />
      </div>
    )
  }

  if (section.type === 'cta') {
    const label = String(section.props.label || '')
    const url = String(section.props.url || '')

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="rounded-sm bg-green-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-green-700">
            CTA
          </span>
        </div>
        <FieldGroup
          id="cta-label"
          label="Button Label"
          value={label}
          placeholder="Get started"
          error={label.trim() ? undefined : 'Label is required'}
          onChange={(v) => updateProp('label', v)}
        />
        <FieldGroup
          id="cta-url"
          label="URL"
          value={url}
          placeholder="https://example.com"
          error={url.trim() ? undefined : 'URL is required'}
          onChange={(v) => updateProp('url', v)}
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-border px-4 py-5">
      <p className="text-sm text-foreground-muted">
        This section type has no editable properties.
      </p>
    </div>
  )
}
