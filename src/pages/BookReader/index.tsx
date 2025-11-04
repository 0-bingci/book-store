import React, { useEffect, useState, useRef, type JSX } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetBookByIdQuery } from '../../utils/apiSlice';
import type { BreadcrumbItem } from '../../types/index';

const BookReaderPage: React.FC = () => {
  const navigate = useNavigate();
  // 为状态添加明确类型
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  // 明确ref引用的元素类型（option元素）
  const contentRef = useRef<HTMLOptionElement>(null);
  // 明确路由参数类型（id为string或undefined）
  const { id } = useParams<{ id: string }>();

  // 面包屑数据指定为BreadcrumbItem数组类型
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "首页", path: "/", isCurrent: false },
    { label: "书籍详情", path: `/book-detail/${id}`, isCurrent: false },
    { label: "阅读页面", path: `/book-reader/${id}`, isCurrent: true }
  ];

  // 明确book的类型为Book | undefined（API查询结果可能为undefined）
  const { data: book } = useGetBookByIdQuery(id);

  // 明确path参数类型为string
  const handleBreadcrumbClick = (path: string) => {
    if (path) navigate(path);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    // 只有id存在时才加载内容（避免无效请求）
    if (id) {
      fetchContent();
    }
  }, [id]); // 添加id作为依赖项（id变化时重新加载）

  // 明确参数类型为string，返回值类型为JSX元素数组或null
  const parseContent = (text: string): JSX.Element[] | null => {
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

  // 处理id不存在的边界情况
  if (!id) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-600">书籍ID不存在，请检查链接是否正确</p>
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