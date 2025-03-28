import axios, { InternalAxiosRequestConfig } from "axios";
import store from "@/redux/store";
import { clearAuthTokens } from "@/redux/slices/auth.slice";

const BASE_URL: string = import.meta.env.VITE_HTTP_API;

const publicRoutes = [
  "/",
  "/petunjuk",
  "/prosedur",
  "/profil-perpustakaan",
  "/berita-informasi",
  "/berita-informasi/:slug",
  "/repository",
  "/repository/:slug",
  "/katalog-buku",
  "/katalog-buku/:slug",
  "/auth",
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/sign-up/confirmation",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/visitor",
];

const instance = axios.create({
  baseURL: `${BASE_URL}`,
});

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { auth } = store.getState();
  const token: string | null = auth.token;

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      redirectIfNotPublic();
    }

    return Promise.reject(error);
  }
);

const redirectIfNotPublic = () => {
  const currentPath = window.location.pathname;
  if (!publicRoutes.includes(currentPath)) {
    store.dispatch(clearAuthTokens());
    window.location.href = "/auth";
  }
};

export default instance;
