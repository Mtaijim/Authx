import axios from "axios";
import useAuthStore from "@/auth/store.ts";
import { refreshToken } from "@/services/Authservice";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) delete config.headers["Content-Type"];
  return config;
});

let isRefreshing = false;
let pending: Array<(token: string) => void> = [];

function queueRequest(cb: (token: string) => void) {
  pending.push(cb);
}

function resolveQueue(newToken: string) {
  pending.forEach((cb) => cb(newToken));
  pending = [];
}

function rejectQueue() {
  pending.forEach((cb) => cb(""));
  pending = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const is401 = error.response?.status === 401;
    const original = error.config;

    if (error.response?.status === 403) {
      return Promise.reject(error);
    }

    if (!is401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queueRequest((newToken: string) => {
          if (!newToken) return reject(error);
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(apiClient(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const loginResponse = await refreshToken();
      const newToken = loginResponse.accessToken;

      if (!newToken) throw new Error("No new access token received");

      useAuthStore.getState().setAccessToken(newToken);
      resolveQueue(newToken);

      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(original);
    } catch (refreshError) {
      rejectQueue();
      useAuthStore.getState().clearAuth();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
