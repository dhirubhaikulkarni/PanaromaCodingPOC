// store.js
import { configureStore } from '@reduxjs/toolkit';
import postReducer from './postManagementSlice'; // Adjust the path
import userReducer from './userSlice'; // Adjust the path

const store = configureStore({
  reducer: {
    post: postReducer,
    user: userReducer
    // Add other reducers if you have them
  },
});

export default store;
