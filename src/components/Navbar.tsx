import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 导航处理函数
  const handleNavClick = (page: string) => {
    navigate(`/${page}`);
    setMobileMenuOpen(false); // 关闭移动端菜单
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="w-full px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <i className="fa fa-book text-primary text-2xl"></i>
          <h1 className="text-xl font-bold text-neutral-700">图书仓库</h1>
        </div>
        
        {/* 桌面端导航 */}
        <nav className="hidden md:flex items-center space-x-6">
          <button 
            onClick={() => handleNavClick('')}
            className="text-primary font-medium flex items-center"
          >
            <i className="fa fa-list-ul mr-1"></i> 图书列表
          </button>
          <button 
            disabled={true}
            onClick={() => handleNavClick('')}
            className="text-neutral-500 hover:text-primary transition-colors"
          >
            <i className="fa fa-info-circle mr-1"></i> 关于
          </button>
        </nav>
        
        {/* 移动端菜单按钮 */}
        <div className="flex items-center">
          <button 
            className="md:hidden text-neutral-700 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className="fa fa-bars text-xl"></i>
          </button>
        </div>
      </div>
      
      {/* 移动端菜单 */}
      <div 
        id="mobile-menu" 
        className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-neutral-200 px-4 py-2`}
      >
        <button 
          onClick={() => handleNavClick('list')}
          className="block w-full text-left py-2 text-primary font-medium"
        >
          <i className="fa fa-list-ul mr-1"></i> Books
        </button>
        <button 
          onClick={() => handleNavClick('')}
          className="block w-full text-left py-2 text-neutral-500 hover:text-primary transition-colors"
        >
          <i className="fa fa-info-circle mr-1"></i> About
        </button>
      </div>
    </header>
  );
};

export default Navbar;