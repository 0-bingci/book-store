import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// 最小化的 API Slice 配置
export const apiSlice = createApi({
  reducerPath: 'api', // 唯一标识，用于 Redux 状态树
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:3000' // 假设对接 json-server 的基础地址
  }),
  endpoints: (builder) => ({
    // 仅定义一个查询端点（获取所有用户）
    getBooks: builder.query({
      query: () => '/books' // 请求路径（基于 baseUrl）
    }),
    getBookById: builder.query({
      query: (id) => `/books/${id}` // 请求路径（基于 baseUrl）
    })
  })
});

// 自动生成对应的 React Hook（命名规则：use + 端点名 + Query）
export const { useGetBooksQuery, useGetBookByIdQuery } = apiSlice;
