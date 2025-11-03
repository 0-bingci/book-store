import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 py-6">
      <div className="w-full px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <i className="fa fa-book text-primary"></i>
            <span className="font-bold text-neutral-700">图书仓库</span>
          </div>
          <div className="text-neutral-500 text-sm">
            &copy; 2023 BookWarehouse Management System. All rights reserved.
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
              <i className="fa fa-twitter"></i>
            </a>
            <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
              <i className="fa fa-facebook"></i>
            </a>
            <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
              <i className="fa fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;