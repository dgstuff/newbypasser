import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center">
            <span className="font-bold text-xl text-white">Content Embedder</span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
