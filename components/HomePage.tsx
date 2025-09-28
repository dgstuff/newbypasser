import React from 'react';
import { useMappings } from '../contexts/MappingsContext';

const HomePage: React.FC = () => {
  const { basePath } = useMappings();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to the Content Embedding System</h1>
        <p className="text-lg text-gray-300 mb-6">
          This application simulates a server-side content embedding system. You can create mappings from a local path to a target URL. When you visit the local path, the application fetches the content from the target URL and displays it directly on the page.
        </p>
        <div className="bg-gray-900 p-4 rounded-md mb-6">
          <p className="text-gray-400">Your application's base URL is:</p>
          <code className="text-green-400 font-mono break-all">{basePath}</code>
        </div>
        <p className="text-gray-300">
          To get started, navigate to the <a href="#/admin" className="text-blue-400 hover:underline">Admin</a> page to create your first mapping. For example, you could map the path <code className="bg-gray-700 px-2 py-1 rounded-md text-sm">/example</code> to the URL <code className="bg-gray-700 px-2 py-1 rounded-md text-sm">https://example.com</code>.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
