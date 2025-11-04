import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetBooksQuery,
  useGetAllCategoriesQuery,
} from "../../utils/apiSlice";
import type { Book } from "../../types";

const BooksListPage = () => {
  const navigate = useNavigate();
  // 1. 实时记录用户输入（输入框实时更新）
  const [searchInput, setSearchInput] = useState("");
  // 2. 基础参数（分页、分类）
  const [baseParams, setBaseParams] = useState({
    page: 1,
    limit: 8,
    category: "all",
  });
  // 3. 防抖后的最终请求参数（API请求基于此）
  const [debouncedParams, setDebouncedParams] = useState({
    ...baseParams,
    query: "",
  });

  // 防抖定时器ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 调用分类接口
  const { data: allCategories = [], isLoading: isLoadingCategories } =
    useGetAllCategoriesQuery(undefined);

  // 4. API请求基于防抖后的参数（debouncedParams）
  const {
    data: { books = [], totalCount = 0 } = {},
    isLoading,
    error,
  } = useGetBooksQuery(debouncedParams);
  
  const totalPages = Math.ceil(totalCount / debouncedParams.limit);

  // 导航到详情页
  const handleNavClick = (page: string) => {
    navigate(`/${page}`);
  };

  // 5. 实时更新输入框内容（不防抖）
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value); // 输入框实时响应
  };

  // 6. 对API请求参数进行防抖（用户停止输入500ms后才更新请求参数）
  useEffect(() => {
    // 清除上一次定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 延迟500ms更新请求参数（触发API请求）
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedParams({
        ...baseParams,
        query: searchInput, // 使用实时输入的最终值
        page: 1, // 重置到第1页
      });
    }, 100); // 防抖延迟时间

    // 组件卸载时清除定时器
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchInput, baseParams]); // 当输入内容或基础参数变化时触发防抖

  // 分类筛选处理（不防抖，立即触发请求）
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    const newBaseParams = {
      ...baseParams,
      category: selectedCategory,
      page: 1,
    };
    setBaseParams(newBaseParams);
    // 分类切换立即更新请求参数（不防抖）
    setDebouncedParams({
      ...newBaseParams,
      query: searchInput,
    });
  };

  // 页码切换（不防抖，立即触发请求）
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const newBaseParams = {
      ...baseParams,
      page: newPage,
    };
    setBaseParams(newBaseParams);
    // 页码切换立即更新请求参数（不防抖）
    setDebouncedParams({
      ...newBaseParams,
      query: searchInput,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 加载状态
  if (isLoading || isLoadingCategories) {
    return (
      <section id="books-list-page" className="page-transition min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-16">
            <i className="fa fa-spinner fa-spin text-4xl text-primary mb-4"></i>
            <p className="text-neutral-600 text-lg">加载数据中...</p>
          </div>
        </div>
      </section>
    );
  }

  // 错误状态
  if (error) {
    return (
      <section id="books-list-page" className="page-transition min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className=" rounded-lg p-8 text-center card-shadow">
            <i className="fa fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
            <p className="text-red-600 text-lg mb-6">加载书籍失败，请重试</p>
            <button
              className="bg-neutral-100 hover:bg-primary/90 text-black px-6 py-2 rounded-lg transition-colors"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="books-list-page" className="page-transition">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-neutral-700 mb-2">
            图书目录
          </h2>
          <p className="text-neutral-500">浏览和管理我们的图书集合</p>
        </div>

        {/* 搜索和筛选区 */}
        <div className="bg-white rounded-lg p-4 mb-6 card-shadow">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative grow">
              <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"></i>
              <input
                type="text"
                placeholder="Search by title, author or category..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                value={searchInput} // 绑定实时输入状态（实时显示）
                onChange={handleSearchInput} // 实时更新输入内容
              />
            </div>
            <div className="w-full md:w-auto">
              <select
                className="w-full md:w-auto px-4 py-2 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                value={baseParams.category}
                onChange={handleCategoryChange}
              >
                <option value="all">All Categories</option>
                {allCategories.map((category: unknown) => (
                  <option key={category as string} value={category as string}>
                    {category as string}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 书籍网格区 */}
        {books.length > 0 ? (
          <>
            <div
              id="books-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {books.map((book: Book) => (
                <div
                  key={book.id}
                  className="book-card bg-white rounded-lg overflow-hidden card-shadow hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleNavClick(`book-detail/${book.id}`)}
                >
                  {/* 书籍封面 */}
                  <div className="h-48 bg-primary/10 flex items-center justify-center">
                    <img
                      src={`https://placebear.com/300/200?random`}
                      alt={book.title}
                      className="max-w-full max-h-full object-cover"
                    />
                  </div>

                  {/* 书籍信息 */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-neutral-700 line-clamp-1">
                        {book.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                          book.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {book.stock > 0 ? "在库" : "已售罄"}
                      </span>
                    </div>

                    <p className="text-neutral-500 text-sm mb-2">
                      by {book.author}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {book.categories?.map(
                        (category: string, index: number) => (
                          <span
                            key={index}
                            className="bg-neutral-100 text-neutral-600 text-xs px-2 py-0.5 rounded"
                          >
                            {category}
                          </span>
                        )
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary">
                        ${book.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-neutral-500">
                        {book.publishedYear}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 分页控制区 */}
            <div className="mt-10 flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(debouncedParams.page - 1)}
                disabled={debouncedParams.page === 1 || isLoading}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  debouncedParams.page === 1
                    ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                    : "bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700"
                }`}
              >
                <i className="fa fa-chevron-left mr-1"></i> 上一页
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === totalPages ||
                      (page >= debouncedParams.page - 2 &&
                        page <= debouncedParams.page + 2)
                    );
                  })
                  .map((page, index, array) => {
                    if (index > 0 && array[index - 1] !== page - 1) {
                      return (
                        <span key={`ellipsis-${page}`} className="px-2">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={isLoading}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                          debouncedParams.page === page
                            ? "bg-white border text-black border-neutral-50"
                            : "bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
              </div>

              <button
                onClick={() => handlePageChange(debouncedParams.page + 1)}
                disabled={
                  debouncedParams.page === totalPages ||
                  totalPages === 0 ||
                  isLoading
                }
                className={`px-4 py-2 rounded-lg transition-colors ${
                  debouncedParams.page === totalPages || totalPages === 0
                    ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                    : "bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700"
                }`}
              >
                下一页 <i className="fa fa-chevron-right ml-1"></i>
              </button>

              <span className="text-neutral-500 text-sm ml-4">
                第 {debouncedParams.page} 页 / 共 {totalPages} 页（总 {totalCount}{" "}
                本）
              </span>
            </div>
          </>
        ) : (
          // 无数据提示
          <div className="bg-white rounded-lg p-8 text-center card-shadow min-w-7xl">
            <i className="fa fa-book text-4xl text-neutral-300 mb-4"></i>
            <p className="text-neutral-600 text-lg">No books found</p>
            {debouncedParams.query && (
              <p className="text-neutral-500 mt-2">
                Try adjusting your search criteria
              </p>
            )}
            {debouncedParams.category !== "all" && !debouncedParams.query && (
              <p className="text-neutral-500 mt-2">No books in this category</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BooksListPage;