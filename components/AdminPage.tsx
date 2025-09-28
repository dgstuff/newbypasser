import React, { useState } from 'react';
import { useMappings } from '../contexts/MappingsContext';
import { Mapping } from '../types';

const AdminPage: React.FC = () => {
  const { mappings, addMapping, basePath } = useMappings();
  const [path, setPath] = useState('');
  const [targetUrl, setTargetUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!path || !targetUrl) {
      alert('Both path and target URL are required.');
      return;
    }
    try {
        new URL(targetUrl);
    } catch (_) {
        alert('Please enter a valid target URL.');
        return;
    }
    addMapping({ path, targetUrl });
    setPath('');
    setTargetUrl('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Create New Mapping</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="path" className="block text-sm font-medium text-gray-300 mb-1">Path</label>
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-300 sm:text-sm">
                {basePath}
              </span>
              <input
                type="text"
                id="path"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="e.g., hello"
                className="flex-1 block w-full rounded-none rounded-r-md bg-gray-900 border-gray-600 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white p-2.5"
              />
            </div>
          </div>
          <div>
            <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-300 mb-1">Target URL</label>
            <input
              type="url"
              id="targetUrl"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://example.com"
              className="block w-full rounded-md bg-gray-900 border-gray-600 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white p-2.5"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
          >
            Create or Update Mapping
          </button>
        </form>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Current Mappings</h2>
        {mappings.length > 0 ? (
          <ul className="space-y-3">
            {mappings.map((mapping, index) => (
              <li key={index} className="bg-gray-700 p-4 rounded-md flex flex-col sm:flex-row justify-between sm:items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">Path: <a href={`#/${mapping.path}`} className="text-blue-400 hover:underline">{`/${mapping.path}`}</a></p>
                  <p className="text-sm text-gray-400 truncate">Target: <a href={mapping.targetUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{mapping.targetUrl}</a></p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No mappings created yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
