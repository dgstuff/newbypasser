import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MappingsProvider } from './contexts/MappingsContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import AdminPage from './components/AdminPage';
import EmbedPage from './components/EmbedPage';

const App: React.FC = () => {
  return (
    <MappingsProvider>
      <HashRouter>
        <div className="bg-gray-900 text-gray-100 min-h-screen font-sans">
          <Header />
          <main className="p-4 sm:p-6 md:p-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/:slug" element={<EmbedPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </MappingsProvider>
  );
};

export default App;
