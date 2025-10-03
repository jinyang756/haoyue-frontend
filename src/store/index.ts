import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import stockReducer from './slices/stockSlice';
import analysisReducer from './slices/analysisSlice';
import uiReducer from './slices/uiSlice';
import apiServiceReducer from './slices/apiServiceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stocks: stockReducer,
    analysis: analysisReducer,
    ui: uiReducer,
    apiService: apiServiceReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;