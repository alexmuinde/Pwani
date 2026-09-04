import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import documentReducer from './document/documentSlice'
import { persistReducer, persistStore } from 'redux-persist'
import storageImport from 'redux-persist/lib/storage'
  
const rootReducer = combineReducers({
  user: userReducer,
  document: documentReducer,
})

const storage = storageImport.default || storageImport 
const persistConfig = {
  key: 'root',
  storage,
  version: 1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
})

export const persistor = persistStore(store)