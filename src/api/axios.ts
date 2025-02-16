import axios, { InternalAxiosRequestConfig } from "axios";
import { requestRefreshToken } from "@/services/auth/http";
import store from "@/redux/store";
import { setAuthTokens, clearAuthTokens } from "@/redux/slices/auth.slice";

const BASE_URL: string = import.meta.env.VITE_HTTP_API;

const instance = axios.create({
  baseURL: `${BASE_URL}`,
});

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { auth } = store.getState();
  const token: string | null = auth.accessToken;

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { auth } = store.getState();
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      auth.refreshToken
    ) {
      originalRequest._retry = true;

      try {
        const { data: getRefreshToken } = await requestRefreshToken(
          auth.refreshToken,
        );
        const accessToken = getRefreshToken.accessToken;
        const refreshToken = getRefreshToken.refreshToken;

        store.dispatch(
          setAuthTokens({
            accessToken,
            refreshToken
          }),
        );
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        store.dispatch(clearAuthTokens());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
