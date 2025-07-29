import { configureStore } from '@reduxjs/toolkit';

// Create a simple store for now
export const store = configureStore({
  reducer: {
    // Add reducers here as needed
    app: (state = { loading: false }, action) => {
      switch (action.type) {
        case 'SET_LOADING':
          return { ...state, loading: action.payload };
        default:
          return state;
      }
    }
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});