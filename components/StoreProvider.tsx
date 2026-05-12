'use client'

import { Provider } from 'react-redux'

import { store } from '@/store/index'

interface StoreProviderProps {
  children: React.ReactNode
}

// PersistGate is intentionally omitted: rendering children as null during
// rehydration caused the Redux store to be empty when button click handlers
// first ran, so dispatches were silently dropped. redux-persist rehydrates the
// store automatically in the background — the only trade-off is a brief flash
// of the persisted-then-updated state, which is acceptable.
export default function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>
}
