import { configureStore } from '@reduxjs/toolkit';
import feedReducer from './feedSlice';

const store = configureStore({
  reducer: {
    feed: feedReducer,
  },
});

export default store;