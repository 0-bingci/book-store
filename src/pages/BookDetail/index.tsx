import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetBookByIdQuery } from '../../utils/apiSlice';

const BookDetailPage = () => {
  const navigate = useNavigate();
  // 新增：控制对话框显示/隐藏的状态
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { id } = useParams();
  // 导航处理函数
  const handleNavClick = (page) => {
    navigate(`/${page}`);
  };
  const { data: book, isLoading, error } = useGetBookByIdQuery(id);
  console.log(book, id);

  // 新增：编辑表单的临时状态（用于存储用户输入）
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publishedYear: '',
    price: '',
    stock: '',
    categories: '',
    summary: ''
  });

  // 当书籍数据加载完成后，更新表单数据
  React.useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        publishedYear: book.publishedYear,
        price: book.price,
        stock: book.stock,
        categories: book.categories.join(', '),
        summary: book.summary
      });
    }
  }, [book]);

  // 新增：处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 新增：处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里可以添加保存逻辑（如API调用）
    console.log("保存修改:", formData);
    setIsDialogOpen(false); // 关闭对话框
  };

  // 处理加载状态
  if (isLoading) {
    return (
      <section id="book-detail-page" className="page-transition h-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <i className="fa fa-spinner fa-spin text-4xl text-primary mb-4"></i>
            <p className="text-neutral-600">Loading book details...</p>
          </div>
        </div>
      </section>
    );
  }

  // 处理错误状态
  if (error) {
    return (
      <section id="book-detail-page" className="page-transition h-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <i className="fa fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
            <p className="text-red-600 mb-4">Failed to load book details</p>
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

  // 如果没有找到书籍
  if (!book) {
    return (
      <section id="book-detail-page" className="page-transition h-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <i className="fa fa-book text-4xl text-neutral-400 mb-4"></i>
            <p className="text-neutral-600 mb-4">Book not found</p>
            <button 
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors"
              onClick={() => handleNavClick("")}
            >
              Back to Catalog
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="book-detail-page" className="page-transition h-auto">
      {/* 返回按钮与标题区 */}
      <div className="mb-6">
        <button
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-4"
          onClick={() => handleNavClick("")}
        >
          <i className="fa fa-arrow-left mr-1"></i> 返回目录
        </button>
        <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-neutral-700 mb-2">
          {book.title}
        </h2>
        <p className="text-neutral-500">by {book.author}</p>
      </div>

      {/* 书籍详情卡片 */}
      <div className="bg-white rounded-lg overflow-hidden card-shadow mb-6">
        {/* 省略中间内容（与原代码一致） */}
        <div className="md:flex">
          <div className="md:w-1/3 bg-primary/10 p-8 flex items-center justify-center">
            <i className="fa fa-book text-7xl text-primary/30"></i>
          </div>
          

          <div className="md:w-2/3 p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {book.categories.map((category, index) => (
                <span key={index} className="bg-neutral-100 text-neutral-600 text-sm px-3 py-1 rounded-full">
                  {category}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-neutral-500 text-sm mb-1">Published Year</p>
                <p className="font-medium">{book.publishedYear}</p>
              </div>
              <div>
                <p className="text-neutral-500 text-sm mb-1">Price</p>
                <p className="font-medium text-primary">${book.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-neutral-500 text-sm mb-1">Stock</p>
                <p className="font-medium">{book.stock} copies available</p>
              </div>
              <div>
                <p className="text-neutral-500 text-sm mb-1">ID</p>
                <p className="font-medium text-neutral-400">{book.id}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-neutral-700 mb-2">Summary</h3>
              <p className="text-neutral-600">{book.summary}</p>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-3">
              <button
                className="bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 px-6 py-2 rounded-lg flex items-center transition-colors"
                onClick={() => handleNavClick("book-reader")}
              >
                <i className="fa fa-eye mr-2"></i> Read Book
              </button>
              {/* 编辑按钮：点击显示对话框 */}
              <button
                className="bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 px-6 py-2 rounded-lg flex items-center transition-colors"
                onClick={() => setIsDialogOpen(true)} // 新增：打开对话框
              >
                <i className="fa fa-pencil mr-2"></i> Edit Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 新增：编辑对话框 */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 背景遮罩 */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsDialogOpen(false)} // 点击外部关闭
          ></div>

          {/* 对话框内容 */}
          <div className="bg-white rounded-lg card-shadow w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10">
            <div className="p-6">
              <h3 className="text-xl font-bold text-neutral-700 mb-4">Edit Book Details</h3>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="title" className="block text-neutral-700 font-medium mb-2">Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="author" className="block text-neutral-700 font-medium mb-2">Author *</label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="publishedYear" className="block text-neutral-700 font-medium mb-2">Published Year *</label>
                    <input
                      type="number"
                      id="publishedYear"
                      name="publishedYear"
                      value={formData.publishedYear}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-neutral-700 font-medium mb-2">Price (USD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="stock" className="block text-neutral-700 font-medium mb-2">Stock *</label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="categories" className="block text-neutral-700 font-medium mb-2">Categories (comma separated) *</label>
                    <input
                      type="text"
                      id="categories"
                      name="categories"
                      value={formData.categories}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="summary" className="block text-neutral-700 font-medium mb-2">Summary</label>
                  <textarea
                    id="summary"
                    name="summary"
                    rows="4"
                    value={formData.summary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 px-6 py-2 rounded-lg transition-colors"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BookDetailPage;