import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetBookByIdQuery } from '../../utils/apiSlice';

// 接收从书籍详情页传递的书籍信息（支持props传递或默认值）
const BookReaderPage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef(null);
  const { id } = useParams();
  // 面包屑数据
  const breadcrumbItems = [
    { label: "首页", path: "/", isCurrent: false },
    { label: "书籍详情", path: `/book-detail/${id}`, isCurrent: false },
    { label: "阅读页面", path: `/book-reader/${id}`, isCurrent: true }
  ];


  // 获取书籍名称和作者
  const { data: book } = useGetBookByIdQuery(id);
  // 面包屑导航跳转
  const handleBreadcrumbClick = (path) => {
    if (path) navigate(path);
  };

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 监听滚动显示返回顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 加载书籍内容
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/src/assets/book_content.txt");
        if (!res.ok) throw new Error("内容加载失败");
        const text = await res.text();
        setContent(text);
      } catch (err) {
        console.error("加载失败:", err);
        setContent("抱歉，无法加载书籍内容，请稍后重试");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  // 解析文本内容
  const parseContent = (text) => {
    if (!text) return null;
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return lines.map((line, idx) => {
      if (line.startsWith('# ')) return <h2 key={idx} className="text-xl md:text-2xl font-bold text-neutral-800 mt-8 mb-4">{line.slice(2)}</h2>;
      if (line.startsWith('## ')) return <h3 key={idx} className="text-lg md:text-xl font-semibold text-neutral-700 mt-6 mb-3">{line.slice(3)}</h3>;
      return <p key={idx} className="mb-4">{line}</p>;
    });
  };

  if (isLoading) {
    return (
      <section id="reading-page" className="page-transition min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <i className="fa fa-book text-4xl text-primary mb-4"></i>
          <p className="text-neutral-600">Loading book content...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="reading-page" className="page-transition px-4 md:px-30 bg-white min-h-screen " ref={contentRef}>
      {/* 面包屑导航区 */}
      <div className="pt-6 pb-3">
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

      {/* 书籍名称与作者区 */}
      <div className="mb-8 pb-4 border-b border-neutral-200">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">{book?.title || "默认书籍名称"}</h1>
        <p className="text-neutral-500 text-base">作者：{book?.author || "未知作者"}</p>
      </div>

      {/* 书籍内容区 */}
      <div className="prose max-w-none text-neutral-700 leading-relaxed">
        {parseContent(content)}
      </div>

      {/* 返回顶部按钮 - 侧边悬浮 */}
      <button
        onClick={scrollToTop}
        className={`fixed right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black text-white shadow-lg transition-all duration-300 hover:bg-primary/90 focus:outline-none z-20 ${
          showScrollTop ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'
        }`}
        aria-label="回到顶部"
      >
        <i className="fa fa-arrow-up mr-1"></i>
        <span>返回顶部</span>
      </button>
    </section>
  );
};

export default BookReaderPage;