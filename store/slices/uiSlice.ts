import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  selectedSectionId: string | null
  isPanelOpen: boolean
  isLoading: boolean
}

const initialState: UiState = {
  selectedSectionId: null,
  isPanelOpen: true,
  isLoading: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    selectSection(state, action: PayloadAction<string | null>) {
      state.selectedSectionId = action.payload
    },
    togglePanel(state) {
      state.isPanelOpen = !state.isPanelOpen
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
  },
})

export const { selectSection, togglePanel, setLoading } = uiSlice.actions

export default uiSlice.reducer
