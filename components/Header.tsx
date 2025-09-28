import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-gray-900 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <header className="bg-gray-800 shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="font-bold text-xl text-white">
              Content Embedder
            </NavLink>
          </div>
          <div className="flex items-center space-x-4">
            <NavLink to="/" className={linkClass} end>
              Home
            </NavLink>
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
