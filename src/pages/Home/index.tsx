import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetBooksQuery, useGetAllCategoriesQuery } from '../../utils/apiSlice';
import type { Book } from '../../types';
const BooksListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 8,
    query: '',
    category: 'all'  // 新增：当前选中的分类，默认"all"
  });

  // 调用分类接口（获取所有可用分类）
  const { data: allCategories = [], isLoading: isLoadingCategories } = useGetAllCategoriesQuery(undefined);

  // 调用书籍接口（带分类筛选参数）
  const { 
    data: { books = [], totalCount = 0 } = {},
    isLoading, 
    error 
  } = useGetBooksQuery(searchParams);
  console.log("current page:", searchParams.page);
  const totalPages = Math.ceil(totalCount / searchParams.limit);

  // 导航到详情页
  const handleNavClick = (page: string) => {
    navigate(`/${page}`);
  };

  // 搜索处理
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => ({
      ...prev,
      query: e.target.value,
      page: 1
    }));
  };

  // 分类筛选处理（核心新增）
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setSearchParams(prev => ({
      ...prev,
      category: selectedCategory,  // 更新分类参数
      page: 1  // 切换分类时重置到第1页
    }));
  };

  // 页码切换
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setSearchParams(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 加载状态
  if (isLoading || isLoadingCategories) {  // 同时判断书籍和分类的加载状态
    return (
      <section id="books-list-page" className="page-transition min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-neutral-700 mb-2">图书目录</h2>
            <p className="text-neutral-500">浏览和管理我们的图书集合</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 mb-6 card-shadow">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative grow">
                <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"></i>
                <input 
                  type="text" 
                  placeholder="Search by title, author or category..." 
                  className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg"
                  disabled 
                />
              </div>
              <div className="w-full md:w-auto">
                <select className="w-full md:w-auto px-4 py-2 border border-neutral-200 rounded-lg" disabled>
                  <option value="all">Loading categories...</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center py-16">
            <i className="fa fa-spinner fa-spin text-4xl text-primary mb-4"></i>
            <p className="text-neutral-600 text-lg">Loading books...</p>
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
          <div className="mb-8">
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-neutral-700 mb-2">图书目录</h2>
            <p className="text-neutral-500">浏览和管理我们的图书集合</p>
          </div>
          
          <div className="bg-white rounded-lg p-8 text-center card-shadow">
            <i className="fa fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
            <p className="text-red-600 text-lg mb-6">Failed to load books</p>
            <button 
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors"
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
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-neutral-700 mb-2">图书目录</h2>
          <p className="text-neutral-500">浏览和管理我们的图书集合</p>
        </div>
        
        {/* 搜索和筛选区（分类下拉框动态生成） */}
        <div className="bg-white rounded-lg p-4 mb-6 card-shadow">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative grow">
              <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"></i>
              <input 
                type="text" 
                placeholder="Search by title, author or category..." 
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                value={searchParams.query}
                onChange={handleSearch}
              />
            </div>
            <div className="w-full md:w-auto">
              <select 
                className="w-full md:w-auto px-4 py-2 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                value={searchParams.category}  // 绑定当前选中的分类
                onChange={handleCategoryChange}
              >
                <option value="all">All Categories</option>
                {/* 动态生成分类选项（从接口获取） */}
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
            <div id="books-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                      <h3 className="font-bold text-lg text-neutral-700 line-clamp-1">{book.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                        book.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {book.stock > 0 ? '在库' : '已售罄'}
                      </span>
                    </div>
                    
                    <p className="text-neutral-500 text-sm mb-2">by {book.author}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {book.categories?.map((category: string, index: number) => (
                        <span key={index} className="bg-neutral-100 text-neutral-600 text-xs px-2 py-0.5 rounded">
                          {category}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary">${book.price.toFixed(2)}</span>
                      <span className="text-sm text-neutral-500">{book.publishedYear}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 分页控制区 */}
            <div className="mt-10 flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(searchParams.page - 1)}
                disabled={searchParams.page === 1 || isLoading}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  searchParams.page === 1 
                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                    : 'bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700'
                }`}
              >
                <i className="fa fa-chevron-left mr-1"></i> 上一页
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    return (
                      page === 1 || 
                      page === totalPages || 
                      (page >= searchParams.page - 2 && page <= searchParams.page + 2)
                    );
                  })
                  .map((page, index, array) => {
                    if (index > 0 && array[index - 1] !== page - 1) {
                      return <span key={`ellipsis-${page}`} className="px-2">...</span>;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={isLoading}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                          searchParams.page === page
                            ? 'bg-white border text-black border-neutral-50'
                            : 'bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
              </div>
              
              <button
                onClick={() => handlePageChange(searchParams.page + 1)}
                disabled={searchParams.page === totalPages || totalPages === 0 || isLoading}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  searchParams.page === totalPages || totalPages === 0
                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                    : 'bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700'
                }`}
              >
                下一页 <i className="fa fa-chevron-right ml-1"></i>
              </button>
              
              <span className="text-neutral-500 text-sm ml-4">
                第 {searchParams.page} 页 / 共 {totalPages} 页（总 {totalCount} 本）
              </span>
            </div>
          </>
        ) : (
          // 无数据提示
          <div className="bg-white rounded-lg p-8 text-center card-shadow min-w-7xl">
            <i className="fa fa-book text-4xl text-neutral-300 mb-4"></i>
            <p className="text-neutral-600 text-lg">No books found</p>
            {searchParams.query && (
              <p className="text-neutral-500 mt-2">Try adjusting your search criteria</p>
            )}
            {searchParams.category !== 'all' && !searchParams.query && (
              <p className="text-neutral-500 mt-2">No books in this category</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BooksListPage;