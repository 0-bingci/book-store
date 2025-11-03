import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookReaderPage = () => {
  const navigate = useNavigate();
  // 导航处理函数
  const handleNavClick = (page) => {
    navigate(`/${page}`);
  };
  
  // 静态阅读页面数据（仅用于展示样式）
  const book = {
    title: "The Great Adventure",
    author: "John Smith"
  };

  return (
    <section id="reading-page" className="page-transition">
      {/* 返回按钮与标题区 */}
      <div className="mb-6">
        <button className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-4" onClick={() => handleNavClick("book-detail")}>
          <i className="fa fa-arrow-left mr-1"></i> Back to Book Details
        </button>
        <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-neutral-700 mb-2">
          {book.title}
        </h2>
        <p className="text-neutral-500">by {book.author}</p>
      </div>
      
      {/* 阅读主容器 */}
      <div className="bg-white rounded-lg overflow-hidden card-shadow p-6 md:p-10 mb-6 max-w-3xl mx-auto">
        {/* 阅读控制栏 */}
        <div className="flex justify-between items-center mb-8 p-3 bg-neutral-100 rounded-lg">
          <div className="flex items-center gap-4">
            <button className="text-neutral-600 hover:text-primary transition-colors">
              <i className="fa fa-font"></i>
            </button>
            <button className="text-neutral-600 hover:text-primary transition-colors">
              <i className="fa fa-adjust"></i>
            </button>
          </div>
          <div>
            <span className="text-neutral-500 text-sm">Page 1 of 245</span>
          </div>
        </div>
        
        {/* 书籍内容区 */}
        <div className="prose max-w-none text-neutral-700 leading-relaxed">
          <p className="mb-4">Chapter 1: The Journey Begins</p>
          
          <p className="mb-4">
            The sun rose gently over the horizon, casting a warm golden glow across the small village. 
            Young Thomas stood at the edge of town, his backpack slung over one shoulder, gazing at the 
            distant mountains that had captivated his imagination since childhood.
          </p>
          
          <p className="mb-4">
            "Are you sure about this?" called his mother from the doorway of their cottage. Her voice was 
            tinged with concern, but Thomas detected a hint of pride beneath it.
          </p>
          
          <p className="mb-4">
            He turned and smiled. "I've never been more sure of anything, Mother. The stories aren't just 
            tales—there's something out there, waiting to be discovered."
          </p>
          
          <p className="mb-4">
            She walked toward him and placed a hand on his cheek. "Your father would be proud," she said 
            softly. "Just promise me you'll be careful. The world is bigger than you imagine, and not all 
            who wander are lost—but some do lose their way."
          </p>
          
          <p className="mb-4">
            Thomas hugged her tightly. "I promise. And I'll come back, with stories of my own to tell."
          </p>
          
          <p className="mb-4">
            With that, he shouldered his pack and set off down the path that led to the mountains. The 
            journey ahead would test his courage, his wits, and his determination. But as he took his first 
            steps into the unknown, he felt a sense of excitement unlike anything he had ever experienced.
          </p>
          
          <p className="mb-4">
            The road wound through green fields and past small farms, each one growing smaller as he 
            traveled farther from home. By midday, he reached the base of the mountains and paused to 
            catch his breath. The peaks loomed above him, their snow-capped summits glistening in the sun.
          </p>
          
          <p className="mb-4">
            "Well, here goes nothing," he muttered to himself, and began the steep ascent.
          </p>
        </div>
        
        {/* 分页控制 */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-neutral-200">
          <button className="text-primary hover:text-primary/80 transition-colors flex items-center opacity-50 cursor-not-allowed">
            <i className="fa fa-chevron-left mr-2"></i> Previous Page
          </button>
          <button className="text-primary hover:text-primary/80 transition-colors flex items-center">
            Next Page <i className="fa fa-chevron-right ml-2"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BookReaderPage;