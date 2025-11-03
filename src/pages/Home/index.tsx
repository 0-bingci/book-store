// BooksListPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetBooksQuery } from '../../utils/apiSlice';

const BooksListPage = () => {
  const navigate = useNavigate();
  // 导航处理函数
  const handleNavClick = (page) => {
    navigate(`/${page}`);
  };
  const { data: books = [], isLoading, error } = useGetBooksQuery();

  return (
    <section id="books-list-page" className="page-transition">
      {/* 页面标题区 */}
      <div className="mb-8">
        <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-neutral-700 mb-2">图书目录</h2>
        <p className="text-neutral-500">浏览和管理我们的图书集合</p>
      </div>
      
      {/* 搜索和筛选区 */}
      <div className="bg-white rounded-lg p-4 mb-6 card-shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"></i>
            <input 
              type="text" 
              placeholder="Search by title, author or category..." 
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            >
            </input>
          </div>
          <div className="w-full md:w-auto">
            <select className="w-full md:w-auto px-4 py-2 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
              <option value="all">All Categories</option>
              <option value="fiction">Fiction</option>
              <option value="non-fiction">Non-Fiction</option>
              <option value="science">Science</option>
              <option value="technology">Technology</option>
              <option value="history">History</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* 书籍网格区 */}
      <div id="books-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map(book => (
          <div key={book.id} className="book-card bg-white rounded-lg overflow-hidden card-shadow hover-lift" data-id={book.id} onClick={() => handleNavClick(`book-detail/${book.id}`)}>
            {/* 书籍封面占位区 */}
            <div className="h-48 bg-primary/10 flex items-center justify-center">
              <i className="fa fa-book text-5xl text-primary/30"></i>
            </div>
            
            {/* 书籍信息区 */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-neutral-700 line-clamp-1">{book.title}</h3>
                <span className={`${book.stockClass} text-xs px-2 py-1 rounded-full`}>
                  {book.stockStatus}
                </span>
              </div>
              
              <p className="text-neutral-500 text-sm mb-2">by {book.author}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {book.categories.map((category, index) => (
                  <span key={index} className="bg-neutral-100 text-neutral-600 text-xs px-2 py-0.5 rounded">
                    {category}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-bold text-primary">${book.price}</span>
                <span className="text-sm text-neutral-500">{book.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BooksListPage;