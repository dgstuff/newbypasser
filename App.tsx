import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MappingsProvider } from './contexts/MappingsContext';
import Header from './components/Header';
import AdminPage from './components/AdminPage';
import EmbedPage from './components/EmbedPage';
import HomePage from './components/HomePage';

const MainLayout: React.FC = () => (
  <>
    <Header />
    <main className="p-4 sm:p-6 md:p-8">
      <Outlet />
    </main>
  </>
);

const App: React.FC = () => {
  return (
    <MappingsProvider>
      <HashRouter>
        <div className="bg-gray-900 text-gray-100 min-h-screen font-sans">
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>
            <Route path="/:slug" element={<EmbedPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </HashRouter>
    </MappingsProvider>
  );
};

export default App;
