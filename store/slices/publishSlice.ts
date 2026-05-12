import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface PublishState {
  status: 'idle' | 'publishing' | 'success' | 'error'
  currentVersion: string
  changelog: string
  errorMessage: string
}

const initialState: PublishState = {
  status: 'idle',
  currentVersion: '',
  changelog: '',
  errorMessage: '',
}

const publishSlice = createSlice({
  name: 'publish',
  initialState,
  reducers: {
    setStatus(
      state,
      action: PayloadAction<'idle' | 'publishing' | 'success' | 'error'>,
    ) {
      state.status = action.payload
    },
    setVersion(state, action: PayloadAction<string>) {
      state.currentVersion = action.payload
    },
    setChangelog(state, action: PayloadAction<string>) {
      state.changelog = action.payload
    },
    setErrorMessage(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload
    },
  },
})

export const { setStatus, setVersion, setChangelog, setErrorMessage } =
  publishSlice.actions

export default publishSlice.reducer
