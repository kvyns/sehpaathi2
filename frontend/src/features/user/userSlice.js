import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { authService } from "../../auth/authService";

const COOKIE_EXPIRY = 30; // Days until cookie expires

// Helper function to format dates for display
export const formatCreatedAt = (timestamp) => {
  if (!timestamp) return null;
  return new Date(timestamp).toLocaleString();
};

// Load initial state from cookies if available
const loadInitialState = () => {
  const userCookie = Cookies.get("user");
  if (userCookie) {
    try {
      const userData = JSON.parse(userCookie);
      return {
        user: userData.user,
        profile: userData.profile,
        isAuthenticated: true,
      };
    } catch (e) {
      return { user: null, profile: null, isAuthenticated: false };
    }
  }
  return { user: null, profile: null, isAuthenticated: false };
};

// Async thunk for email sign in
export const signInWithEmail = createAsyncThunk(
  "user/signInWithEmail",
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await authService.signInWithEmail(email, password);
      if (rememberMe) {
        Cookies.set("user", JSON.stringify(response), {
          expires: COOKIE_EXPIRY,
        });
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for Google sign in
export const signInWithGoogle = createAsyncThunk(
  "user/signInWithGoogle",
  async () => {
    try {
      const response = await authService.signInWithGoogle();
      // console.log(response);
      Cookies.set("user", JSON.stringify(response), {
        expires: COOKIE_EXPIRY,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for sign out
export const signOut = createAsyncThunk(
  "user/signOut",
  async (_, { rejectWithValue }) => {
    try {
      await authService.signOut();
      Cookies.remove("user");
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: loadInitialState(),
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign in with email
      .addCase(signInWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sign in with Google
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sign out
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.profile = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectProfile = (state) => state.user.profile;
export const selectUserName = (state) => state.user.profile?.name;
export const selectUserRole = (state) => state.user.profile?.role;
export const selectCreatedAt = (state) => state.user.profile?.createdAt;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export default userSlice.reducer;
