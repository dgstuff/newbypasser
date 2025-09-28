import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 mt-8">
        <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
          Welcome to the Content Embedder
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          Your powerful solution for embedding and proxying content from any website, directly under your own domain.
        </p>
        <p className="text-gray-400 mb-8">
          Use the admin panel to create custom paths that map to external URLs. Our backend proxy will fetch the content for you, bypassing CORS and other restrictions, allowing for seamless integration.
        </p>
        <Link
          to="/admin"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
        >
          Go to Admin Panel
        </Link>
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-8 text-left">
        <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-2">How It Works</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-400">
                <li>Go to the <Link to="/admin" className="text-blue-400 hover:underline">Admin</Link> page.</li>
                <li>Create a simple path (e.g., <code className="bg-gray-700 p-1 rounded text-sm">/my-cool-game</code>).</li>
                <li>Enter the full URL of the content you want to embed.</li>
                <li>Use our embed script on your external site to display the content.</li>
            </ol>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-2">Key Features</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong>Backend Proxy:</strong> Uses a Vercel Serverless Function to fetch content reliably.</li>
                <li><strong>CORS Solved:</strong> No more cross-origin headaches.</li>
                <li><strong>Simple Custom Paths:</strong> Easy-to-remember URLs for your embedded content.</li>
                <li><strong>One-Liner Embed:</strong> A single script tag and a custom HTML element are all you need.</li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
