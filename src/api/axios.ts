import axios, { InternalAxiosRequestConfig } from "axios";
import store from "@/redux/store";

const BASE_URL: string = import.meta.env.VITE_HTTP_API;

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

export default instance;
