import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from '../../services/api';
const REVIEWS_STORAGE_KEY = "reviews";

// Load reviews from localStorage
const loadReviewsFromStorage = () => {
  const storedReviews = localStorage.getItem(REVIEWS_STORAGE_KEY);
  return storedReviews ? JSON.parse(storedReviews) : {};
};

// Save reviews to localStorage
const saveReviewsToStorage = (reviews) => {
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
};

// Fetch reviews for a book
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/reviews/${bookId}`);
      return { bookId, review: response.data.review };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add a comment
export const addComment = createAsyncThunk(
  "reviews/addComment",
  async ({ bookId, userId, comment }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/reviews/comment", { bookId, userId, comment });
      return { bookId, review: response.data.review };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Edit a comment
export const editComment = createAsyncThunk(
  "reviews/editComment",
  async ({ bookId, commentId, userId, newComment }, { rejectWithValue }) => {
    try {
      const response = await api.put("/api/reviews/comment/edit", { bookId, commentId, userId, newComment });
      return { bookId, review: response.data.review };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add a tweet
export const addTweet = createAsyncThunk(
  "reviews/addTweet",
  async ({ bookId, userId, tweet }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/reviews/tweet", { bookId, userId, tweet });
      return { bookId, review: response.data.review };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add a rating
export const addRating = createAsyncThunk(
  "reviews/addRating",
  async ({ bookId, userId, rating }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/reviews/rating", { bookId, userId, rating });
      return { bookId, review: response.data.review };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: loadReviewsFromStorage(),
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviews[action.payload.bookId] = action.payload.review;
        saveReviewsToStorage(state.reviews);
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.reviews[action.payload.bookId] = action.payload.review;
        saveReviewsToStorage(state.reviews);
      })
      .addCase(editComment.fulfilled, (state, action) => {
        state.reviews[action.payload.bookId] = action.payload.review;
        saveReviewsToStorage(state.reviews);
      })
      .addCase(addTweet.fulfilled, (state, action) => {
        state.reviews[action.payload.bookId] = action.payload.review;
        saveReviewsToStorage(state.reviews);
      })
      .addCase(addRating.fulfilled, (state, action) => {
        state.reviews[action.payload.bookId] = action.payload.review;
        saveReviewsToStorage(state.reviews);
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload || action.error.message;
        }
      );
  },
});

export default reviewSlice.reducer;
