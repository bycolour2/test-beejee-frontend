import axios from 'axios'
import type { Store } from '@reduxjs/toolkit';


let reduxStore: Store | null = null;

export const setStore = (store: Store) => {
  reduxStore = store;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
})

axiosInstance.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      reduxStore?.dispatch({ type: "auth/logout" })
    }
    return Promise.reject(err);
  }
);

export const setAuthToken = (accessToken: string | null) => {
  if (accessToken) {
    axiosInstance.defaults.headers.common['Authorization'] =
      `Bearer ${accessToken}`
  } else {
    delete axiosInstance.defaults.headers.common['Authorization']
  }
}
