import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  refresh: string | null;
  user: {
    user_id: string | null;
    nama: string | null;
    fakultas: string | null;
    prodi: string | null;
    jeniskelamin: string | null;
    no_telpon: string | null;
    email: string | null;
    email_kampus: string | null;
    status: string | null;
  } | null;
  role: string | null;
}

const initialState: AuthState = {
  token: null,
  refresh: null,
  role: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthTokens: (
      state,
      action: PayloadAction<{
        token: string;
        refresh: string;
        role: string;
        user: {
          user_id:string | null;
          nama:string | null;
          fakultas:string | null;
          prodi:string | null;
          jeniskelamin:string | null;
          no_telpon:string | null;
          email:string | null;
          email_kampus:string | null;
          status:string | null;
        };
      }>,
    ) => {
      state.token = action.payload.token;
      state.refresh = action.payload.refresh;
      state.role = action.payload.role;
      state.user = action.payload.user;
    },
    clearAuthTokens: (state) => {
      state.token = null;
      state.refresh = null;
      state.role = null;
      state.user = null;
    },
  },
});

export const { setAuthTokens, clearAuthTokens } = authSlice.actions;

export default authSlice.reducer;
