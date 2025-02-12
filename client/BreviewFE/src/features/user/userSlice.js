// // src/redux/userSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // Async Thunks for Login and Register
// export const registerUser = createAsyncThunk('user/register', async (userData, { rejectWithValue }) => {
//     try {
//         const { data } = await axios.post('/api/users/register', userData);
//         return data;
//     } catch (error) {
//         return rejectWithValue(error.response.data.message || 'Registration failed');
//     }
// });

// export const loginUser = createAsyncThunk('user/login', async (userData, { rejectWithValue }) => {
//     try {
//         const { data } = await axios.post('/api/users/login', userData);
//         return data;
//     } catch (error) {
//         return rejectWithValue(error.response.data.message || 'Login failed');
//     }
// });

// const userSlice = createSlice({
//     name: 'user',
//     initialState: {
//         userInfo: null,
//         loading: false,
//         error: null,
//     },
//     reducers: {
//         logout: (state) => {
//             state.userInfo = null;
//             localStorage.removeItem('userInfo');
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             // Register User
//             .addCase(registerUser.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(registerUser.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.userInfo = action.payload;
//                 localStorage.setItem('userInfo', JSON.stringify(action.payload));
//             })
//             .addCase(registerUser.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             })
//             // Login User
//             .addCase(loginUser.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(loginUser.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.userInfo = action.payload;
//                 localStorage.setItem('userInfo', JSON.stringify(action.payload));
//             })
//             .addCase(loginUser.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             });
//     },
// });

// export const { logout } = userSlice.actions;
// export default userSlice.reducer;




// src/features/user/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/users/register', userData);
      localStorage.setItem('user', JSON.stringify(response.data)); // Store in localStorage
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/users/login', userData);
      localStorage.setItem('user', JSON.stringify(response.data)); // Store in localStorage
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// export const getUserProfile = createAsyncThunk(
//   'user/getProfile',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get('/api/users/profile');
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );
export const getUserProfile = createAsyncThunk(
    'user/getProfile',
    async (_, { rejectWithValue }) => {
      try {
        const user = JSON.parse(localStorage.getItem('user')); // Retrieve user from localStorage
        if (!user || !user.token) {
          return rejectWithValue("User is not authenticated.");
        }
  
        const response = await api.get('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${user.token}`, // Include the JWT token in Authorization header
          },
        });
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch user profile");
      }
    }
  );
  
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('user');
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
