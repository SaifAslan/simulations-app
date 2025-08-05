// src/store/index.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage

import userReducer from './slices/userSlice';
import simulationReducer from './slices/simulationSlice';

const rootReducer = combineReducers({
  user: userReducer,
  simulations: simulationReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'simulations'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

export const persistor = persistStore(store);
