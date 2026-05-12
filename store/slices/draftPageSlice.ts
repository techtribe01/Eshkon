import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { Page, Section } from '../../types'

interface DraftPageState {
  page: Page | null
  isDirty: boolean
}

const initialState: DraftPageState = {
  page: null,
  isDirty: false,
}

const draftPageSlice = createSlice({
  name: 'draftPage',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<Page>) {
      state.page = action.payload
      state.isDirty = false
    },
    updateSectionProp(
      state,
      action: PayloadAction<{ sectionId: string; key: string; value: unknown }>,
    ) {
      if (!state.page) {
        return
      }

      const section = state.page.sections.find(
        (item) => item.id === action.payload.sectionId,
      )
      if (!section) {
        return
      }

      section.props = {
        ...section.props,
        [action.payload.key]: action.payload.value,
      }
      state.isDirty = true
    },
    addSection(state, action: PayloadAction<Section>) {
      if (!state.page) {
        return
      }

      state.page.sections.push(action.payload)
      state.isDirty = true
    },
    removeSection(state, action: PayloadAction<string>) {
      if (!state.page) {
        return
      }

      state.page.sections = state.page.sections.filter(
        (section) => section.id !== action.payload,
      )
      state.isDirty = true
    },
    reorderSections(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>,
    ) {
      if (!state.page) {
        return
      }

      const { fromIndex, toIndex } = action.payload
      const sections = state.page.sections

      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= sections.length ||
        toIndex >= sections.length
      ) {
        return
      }

      const [moved] = sections.splice(fromIndex, 1)
      sections.splice(toIndex, 0, moved)
      state.isDirty = true
    },
    markClean(state) {
      state.isDirty = false
    },
  },
})

export const {
  setPage,
  updateSectionProp,
  addSection,
  removeSection,
  reorderSections,
  markClean,
} = draftPageSlice.actions

export default draftPageSlice.reducer
