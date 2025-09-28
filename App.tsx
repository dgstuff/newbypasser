
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MappingProvider } from './contexts/MappingContext';
import AdminPage from './components/AdminPage';
import ViewerPage from './components/ViewerPage';

function App() {
  return (
    <MappingProvider>
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
        <header className="bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-3xl font-bold text-cyan-400">Content Embedding System</h1>
            <p className="text-gray-400 mt-1">A UI to configure and simulate server-side content embedding.</p>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <HashRouter>
            <Routes>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/view/*" element={<ViewerPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </HashRouter>
        </main>
        <footer className="text-center py-4 text-gray-500 text-sm">
            <p>Built by a world-class senior frontend React engineer.</p>
        </footer>
      </div>
    </MappingProvider>
  );
}

export default App;
