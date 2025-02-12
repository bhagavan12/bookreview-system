// /redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import booksReducer from '../features/books/booksSlice';
import reviewReducer from '../features/reviews/reviewsSlice';
import tweetReducer from '../features/tweets/tweetsSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    books: booksReducer,
    review: reviewReducer,
    tweets:tweetReducer
  },
});
