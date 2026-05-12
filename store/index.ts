import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import draftPageReducer from './slices/draftPageSlice'
import publishReducer from './slices/publishSlice'
import uiReducer from './slices/uiSlice'

const draftPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['draftPage'],
}

export const store = configureStore({
  reducer: {
    draftPage: persistReducer(draftPersistConfig, draftPageReducer),
    ui: uiReducer,
    publish: publishReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector)
