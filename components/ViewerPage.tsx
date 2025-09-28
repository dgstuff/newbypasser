
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMappings } from '../contexts/MappingContext';
import Card from './common/Card';
import CodeBlock from './common/CodeBlock';

const ViewerPage: React.FC = () => {
  const { '*': path } = useParams<{ '*': string }>();
  const { mappings } = useMappings();
  const fullPath = `/${path || ''}`;

  const mapping = mappings.find(m => m.path === fullPath);

  if (!mapping) {
    return (
      <Card>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-red-400">404 - Mapping Not Found</h2>
            <p className="mt-2 text-gray-400">No mapping found for path: <code className="bg-gray-700 text-red-300 px-2 py-1 rounded">{fullPath}</code></p>
            <Link to="/admin" className="mt-6 inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md">
                Go to Admin Panel
            </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-2xl font-semibold mb-2 text-white">Content Viewer Simulation</h2>
      <p className="text-gray-400 mb-6">This page simulates what a true backend server would do.</p>
      
      <div className="space-y-4 mb-6">
        <div>
            <span className="font-bold text-gray-300">Path Requested:</span>
            <CodeBlock text={mapping.path} />
        </div>
        <div>
            <span className="font-bold text-gray-300">Target URL:</span>
            <CodeBlock text={mapping.targetUrl} />
        </div>
      </div>

      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-xl font-semibold mb-4 text-cyan-400">Simulated Backend Process</h3>
        <ol className="list-decimal list-inside space-y-3 text-gray-300">
            <li>A backend server receives a request for <code className="text-cyan-300">{mapping.path}</code>.</li>
            <li>The server looks up its mappings and finds the target URL: <a href={mapping.targetUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline hover:text-cyan-200">{mapping.targetUrl}</a>.</li>
            <li>The server makes a server-to-server HTTP GET request to fetch the HTML content from the target URL. This bypasses browser CORS restrictions.</li>
            <li>The fetched HTML is then processed for security and compatibility:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-gray-400">
                    <li>All <code className="text-orange-400">&lt;script&gt;</code> tags are removed to prevent Cross-Site Scripting (XSS) attacks.</li>
                    <li>Relative URLs (e.g., <code className="text-lime-400">/img/logo.png</code>) are converted to absolute URLs (e.g., <code className="text-lime-400">{new URL(mapping.targetUrl).origin}/img/logo.png</code>) so images, styles, and links don't break.</li>
                </ul>
            </li>
            <li>The sanitized and processed HTML is embedded into a main layout and sent to your browser as the final response.</li>
        </ol>
        <p className="mt-6 p-4 bg-gray-800 border border-yellow-500/30 rounded-md text-yellow-300 text-sm">
          <span className="font-bold">Note:</span> This is a frontend-only simulation. A real implementation requires a Node.js/Express (or similar) backend to perform the steps described above.
        </p>
      </div>
    </Card>
  );
};

export default ViewerPage;
