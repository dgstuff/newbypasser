
import React, { useState } from 'react';
import { useMappings } from '../contexts/MappingContext';
import { Link } from 'react-router-dom';
import Card from './common/Card';

const AdminPage: React.FC = () => {
  const [path, setPath] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [error, setError] = useState('');
  const { mappings, addMapping, removeMapping } = useMappings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!path || !targetUrl) {
      setError('Both path and target URL are required.');
      return;
    }
    try {
        new URL(targetUrl);
    } catch (_) {
        setError('Please enter a valid target URL (e.g., https://example.com).');
        return;
    }
    
    const formattedPath = path.startsWith('/') ? path : `/${path}`;
    if (!/^\/[a-zA-Z0-9\-\/]*$/.test(formattedPath)) {
        setError('Path can only contain letters, numbers, hyphens, and slashes.');
        return;
    }

    setError('');
    addMapping(path, targetUrl);
    setPath('');
    setTargetUrl('');
  };

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="text-2xl font-semibold mb-4 text-white">Create New Mapping</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="path" className="block text-sm font-medium text-gray-300">Path</label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-400 sm:text-sm">{window.location.origin + window.location.pathname}#/view</span>
                <input
                    type="text"
                    id="path"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    placeholder="/my-cool-page"
                    className="flex-1 block w-full rounded-none rounded-r-md bg-gray-800 border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white p-2"
                />
            </div>
          </div>
          <div>
            <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-300">Target URL</label>
            <input
              type="url"
              id="targetUrl"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://example.com"
              className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition duration-150 ease-in-out">
            Create Mapping
          </button>
        </form>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold mb-4 text-white">Current Mappings</h2>
        {mappings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Path</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Target URL</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                    {mappings.map(mapping => (
                        <tr key={mapping.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-cyan-400">
                                <Link to={`/view${mapping.path}`} className="hover:underline">{`/view${mapping.path}`}</Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                <a href={mapping.targetUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{mapping.targetUrl}</a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => removeMapping(mapping.id)} className="text-red-500 hover:text-red-700">Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400">No mappings created yet. Add one above to get started.</p>
        )}
      </Card>
    </div>
  );
};

export default AdminPage;
