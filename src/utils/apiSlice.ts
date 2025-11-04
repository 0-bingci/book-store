import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
  }),
  endpoints: (builder) => ({
    // 1. 获取所有书籍（支持分页、关键词搜索、分类筛选）
    getBooks: builder.query({
      query: ({ 
        page = 1, 
        limit = 8, 
        query = "", 
        category = "all" 
      }) => {
        const params = new URLSearchParams();
        // 1. 分页参数（必传）
        params.append("_page", page.toString());
        params.append("_limit", limit.toString());
        
        // 🌟 核心添加：稳定排序参数（按 id 升序，确保分页不重复）
        params.append("_sort", "id");
        params.append("_order", "asc");
        
        // 2. 搜索参数（可选）
        if (query.trim()) {
          params.append("q", query.trim());
        }
        
        // 3. 分类筛选参数（可选）
        if (category && category !== "all") {
          params.append("categories", category);
        }
        
        // 调试：打印最终参数（可选，确认参数生成正确）
        console.log("最终请求参数：", params.toString());
        
        return `/books?${params.toString()}`;
      },
      transformResponse: (response, meta) => {
        const totalCount = meta?.response?.headers.get("X-Total-Count");
        return {
          books: response,
          totalCount: Number(totalCount) || 2000,
        };
      },
    }),

    // 2. 新增：获取所有不重复的分类（从书籍数据中提取）
    getAllCategories: builder.query({
      query: () => "/books?_fields=categories", // 只请求categories字段，减少数据传输
      transformResponse: (response) => {
        // 从所有书籍中提取分类，去重后返回
        const allCategories = response.reduce((acc: Set<string>, book: { categories?: string[] }) => {
          if (book.categories && book.categories.length) {
            book.categories.forEach(cat => acc.add(cat));
          }
          return acc;
        }, new Set());
        // 转为数组并排序
        return Array.from(allCategories).sort();
      },
    }),

    // 3. 原有接口保留
    getBookById: builder.query({
      query: (id) => `/books/${id}`,
    }),
    updateBookById: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/books/${id}`,
        method: "PUT",
        body: patch,
      }),
    }),
  }),
});

// 导出新增的Hook
export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useUpdateBookByIdMutation,
  useGetAllCategoriesQuery  // 新增：获取所有分类的Hook
} = apiSlice;