import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetBookByIdQuery, useUpdateBookByIdMutation } from '../../utils/apiSlice';

// 全局样式补充（确保Tailwind自定义类生效）
const GlobalStyles = () => (
  <style>
    {`
      .page-transition {
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      .card-shadow {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      }
      .card-shadow:hover {
        box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
      }
    `}
  </style>
);

const BookDetailPage = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { id } = useParams();
  const { data: book, isLoading, error, refetch } = useGetBookByIdQuery(id);
  // 初始化新的更新接口：返回[调用函数, 状态对象]
  const [updateBookById, { isLoading: isUpdating }] = useUpdateBookByIdMutation();

  // 面包屑数据：层级为「首页 > 书籍详情」
  const breadcrumbItems = [
    { label: "首页", path: "/", isCurrent: false },
    { label: "书籍详情", path: `/book-detail/${id}`, isCurrent: true }
  ];

  // 编辑表单临时状态
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publishedYear: '',
    price: '',
    stock: '',
    categories: '',
    summary: ''
  });

  // 加载书籍数据到表单
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        publishedYear: book.publishedYear || '',
        price: book.price ? book.price.toString() : '',
        stock: book.stock ? book.stock.toString() : '',
        categories: book.categories ? book.categories.join(', ') : '',
        summary: book.summary || ''
      });
    }
  }, [book]);

  // 关闭成功提示
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // 导航处理
  const handleNavClick = (page) => {
    navigate(`/${page}`);
  };

  // 面包屑导航跳转
  const handleBreadcrumbClick = (path) => {
    if (path) navigate(path);
  };

  // 表单输入变化处理
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 表单提交（更新书籍）- 核心修复
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. 处理分类数据（分割为数组，过滤空值）
    const updatedCategories = formData.categories
      .split(',')
      .map(cat => cat.trim())
      .filter(cat => cat);

    // 2. 构造更新数据（匹配接口要求：包含id和其他字段）
    const updatedBookData = {
      id: book.id, // 接口需要id用于URL拼接
      title: formData.title,
      author: formData.author,
      publishedYear: formData.publishedYear,
      price: Number(formData.price),
      stock: Number(formData.stock),
      categories: updatedCategories,
      summary: formData.summary,
      // 保留原书籍的其他字段（如封面图等，避免覆盖）
      ...(book.coverImage && { coverImage: book.coverImage })
    };

    try {
      // 3. 调用新接口：传递完整的更新数据（含id）
      await updateBookById(updatedBookData).unwrap();
      // 4. 刷新书籍详情数据（确保页面实时显示更新后内容）
      await refetch();
      // 5. 显示成功提示并关闭对话框
      setSuccessMessage('书籍详情更新成功！');
      setIsDialogOpen(false);
    } catch (err) {
      console.error('更新失败:', err);
      // 6. 错误提示（更友好的用户反馈）
      alert(`更新失败: ${err.message || '请稍后重试'}`);
    }
  };

  // 加载状态
  if (isLoading) {
    return (
      <section id="book-detail-page" className="page-transition h-auto">
        <GlobalStyles />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <i className="fa fa-spinner fa-spin text-4xl text-primary mb-4"></i>
            <p className="text-neutral-600 text-lg">加载书籍详情中...</p>
          </div>
        </div>
      </section>
    );
  }

  // 错误状态
  if (error) {
    return (
      <section id="book-detail-page" className="page-transition h-auto">
        <GlobalStyles />
        <div className="flex items-center justify-center min-h-[80vh] p-4">
          <div className="text-center max-w-md">
            <i className="fa fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
            <p className="text-red-600 text-lg mb-4">加载书籍详情失败</p>
            <button 
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors"
              onClick={() => window.location.reload()}
            >
              重试加载
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 书籍未找到
  if (!book) {
    return (
      <section id="book-detail-page" className="page-transition h-auto">
        <GlobalStyles />
        <div className="flex items-center justify-center min-h-[80vh] p-4">
          <div className="text-center max-w-md">
            <i className="fa fa-book text-4xl text-neutral-400 mb-4"></i>
            <p className="text-neutral-600 text-lg mb-4">书籍不存在</p>
            <button 
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors"
              onClick={() => handleNavClick("")}
            >
              返回目录
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="book-detail-page" className="page-transition h-auto bg-white min-h-screen py-8 px-4 md:px-6 card-shadow">
      <GlobalStyles />
      
      {/* 成功提示 */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <i className="fa fa-check-circle mr-2"></i>
          <span>{successMessage}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto ">
        {/* 面包屑导航区 - 放在最顶部 */}
        <div className="pb-3 mb-4">
          <nav className="flex items-center text-sm text-neutral-600">
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                {!item.isCurrent ? (
                  <button
                    onClick={() => handleBreadcrumbClick(item.path)}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span className="text-neutral-800 font-medium">{item.label}</span>
                )}
                {index !== breadcrumbItems.length - 1 && (
                  <span className="mx-2 text-neutral-400">/</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* 返回按钮与标题区 */}
        <div className="mb-8">
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-neutral-700 mb-2">
            {book.title}
          </h2>
          <p className="text-neutral-500 text-lg">by {book.author}</p>
        </div>

        {/* 书籍详情卡片 */}
        <div className="bg-white rounded-lg overflow-hidden  mb-8">
          <div className="md:flex">
            {/* 书籍封面 */}
            <div className="md:w-1/3 bg-primary/10 p-8 flex items-center justify-center overflow-hidden">
              <img 
                src={book.coverImage || `https://placebear.com/300/200`} 
                alt={`${book.title} cover`} 
                className="w-full h-auto max-h-[500px] object-cover rounded-md shadow-md"
              />
            </div>

            {/* 书籍详情 */}
            <div className="md:w-2/3 p-6 md:p-8">
              {/* 分类标签 */}
              <div className="flex flex-wrap gap-2 mb-6">
                {book.categories?.map((category, index) => (
                  <span key={index} className="bg-neutral-100 text-neutral-600 text-sm px-3 py-1 rounded-full">
                    {category}
                  </span>
                ))}
              </div>

              {/* 基础信息网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-neutral-500 text-sm mb-1">发行日期</p>
                  <p className="font-medium text-lg">{book.publishedYear}</p>
                </div>
                <div>
                  <p className="text-neutral-500 text-sm mb-1">价格</p>
                  <p className="font-medium text-primary text-xl">${book.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-neutral-500 text-sm mb-1">库存</p>
                  <p className="font-medium text-lg">
                    {book.stock > 0 ? (
                      <span className="text-neutral-500">{book.stock} 本</span>
                    ) : (
                      <span className="text-neutral-500">已售罄</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500 text-sm mb-1">ID</p>
                  <p className="font-medium text-neutral-400 text-lg">{book.id}</p>
                </div>
              </div>

              {/* 书籍摘要 */}
              <div className="mb-8">
                <h3 className="font-bold text-neutral-700 text-xl mb-3">书籍摘要</h3>
                <p className="text-neutral-600 leading-relaxed">
                  {book.summary || "No summary available for this book."}
                </p>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-wrap gap-4">
                <button
                  className="bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg"
                  onClick={() => handleNavClick(`book-reader/${book.id}`)}
                  disabled={book.stock === 0}
                >
                  阅读书籍
                </button>
                <button
                  className="bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 px-6 py-3 rounded-lg flex items-center transition-colors shadow-sm hover:shadow"
                  onClick={() => setIsDialogOpen(true)}
                >
                  编辑书籍详情
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 编辑对话框 */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 背景遮罩 */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsDialogOpen(false)}
          ></div>

          {/* 对话框内容 */}
          <div className="bg-white rounded-lg card-shadow w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-neutral-700">Edit Book Details</h3>
                <button
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <i className="fa fa-times text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* 标题 */}
                  <div>
                    <label htmlFor="title" className="block text-neutral-700 font-medium mb-2">书籍标题 *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>

                  {/* 作者 */}
                  <div>
                    <label htmlFor="author" className="block text-neutral-700 font-medium mb-2">书籍作者 *</label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>

                  {/* 出版年份 */}
                  <div>
                    <label htmlFor="publishedYear" className="block text-neutral-700 font-medium mb-2">发行日期 *</label>
                    <input
                      type="number"
                      id="publishedYear"
                      name="publishedYear"
                      value={formData.publishedYear}
                      onChange={handleInputChange}
                      min="1000"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>

                  {/* 价格 */}
                  <div>
                    <label htmlFor="price" className="block text-neutral-700 font-medium mb-2">书籍价格 (美元) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>

                  {/* 库存 */}
                  <div>
                    <label htmlFor="stock" className="block text-neutral-700 font-medium mb-2">书籍库存 *</label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>

                  {/* 分类 */}
                  <div>
                    <label htmlFor="categories" className="block text-neutral-700 font-medium mb-2">书籍分类 (逗号分隔) *</label>
                    <input
                      type="text"
                      id="categories"
                      name="categories"
                      value={formData.categories}
                      onChange={handleInputChange}
                      placeholder="e.g. Fiction, Adventure, Fantasy"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                {/* 摘要 */}
                <div className="mb-8">
                  <label htmlFor="summary" className="block text-neutral-700 font-medium mb-2">书籍摘要</label>
                  <textarea
                    id="summary"
                    name="summary"
                    rows="5"
                    value={formData.summary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="Enter book summary..."
                  ></textarea>
                </div>

                {/* 提交按钮 - 修复加载状态显示 */}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    className="bg-primary hover:bg-primary/90 bg-white px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 bg-white px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
                    disabled={isUpdating} // 提交中禁用按钮
                  >
                    {isUpdating ? (
                      <div className="flex items-center">
                        <i className="fa fa-spinner fa-spin mr-2"></i>
                        保存中...
                      </div>
                    ) : (
                      '保存更改'
                    )}
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