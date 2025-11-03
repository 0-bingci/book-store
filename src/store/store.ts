// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../utils/apiSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer // 注册 API Slice 的 reducer
  },
  middleware: (getDefault) => getDefault().concat(apiSlice.middleware) // 添加必要的中间件
});