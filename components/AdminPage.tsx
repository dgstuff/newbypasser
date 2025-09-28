import React, { useState, useMemo } from 'react';
import { useMappings } from '../contexts/MappingsContext';

const AdminPage: React.FC = () => {
  const { mappings, addMapping, basePath } = useMappings();
  const [path, setPath] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const embedScript = useMemo(() => {
    // This script will run on the user's external site.
    // It finds all <lb-embed> tags and replaces them with an iframe
    // that points back to THIS application.
    return `(function() {
      const embedAppUrl = '${basePath}';
      class LbEmbed extends HTMLElement {
        connectedCallback() {
          const path = this.getAttribute('path');
          if (!path) {
            console.error('lb-embed: "path" attribute is required.');
            this.innerHTML = '<div style="padding:1rem;color:red;background:rgba(255,0,0,0.1);border:1px solid red;font-family:sans-serif;border-radius:8px;">Error: lb-embed requires a "path" attribute.</div>';
            return;
          }
          const iframe = document.createElement('iframe');
          const finalUrl = new URL(path.replace(/^\\/|\\/$/g, ''), embedAppUrl).href;
          iframe.setAttribute('src', finalUrl);
          iframe.setAttribute('frameborder', '0');
          iframe.style.position = 'fixed';
          iframe.style.top = '0';
          iframe.style.left = '0';
          iframe.style.width = '100vw';
          iframe.style.height = '100vh';
          iframe.style.zIndex = '999999';
          this.replaceWith(iframe);
        }
      }
      if (!customElements.get('lb-embed')) {
        customElements.define('lb-embed', LbEmbed);
      }
    })();`;
  }, [basePath]);

  const scriptTag = useMemo(() => {
    if (!embedScript) return '';
    const dataUrl = `data:application/javascript,${encodeURIComponent(embedScript)}`;
    return `<script src="${dataUrl}" defer></script>`;
  }, [embedScript]);


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

  const copyScriptToClipboard = () => {
    if (!scriptTag) return;
    navigator.clipboard.writeText(scriptTag).then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
        setCopySuccess('Failed to copy');
        setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Step 1: Create an Embeddable Page</h1>
        <p className="text-gray-400 mb-4">Define a path and the target URL you want to embed. This mapping is saved in your "backend" (this browser's local storage).</p>
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
                placeholder="e.g., my-game"
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
            Create or Update Page
          </button>
        </form>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Your Embeddable Pages</h2>
        {mappings.length > 0 ? (
          <ul className="space-y-3">
            {mappings.map((mapping, index) => (
              <li key={index} className="bg-gray-700 p-4 rounded-md flex flex-col sm:flex-row justify-between sm:items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">Path: <a href={`#/${mapping.path}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{`/${mapping.path}`}</a></p>
                  <p className="text-sm text-gray-400 truncate">Target: <a href={mapping.targetUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{mapping.targetUrl}</a></p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No pages created yet.</p>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-4">Step 2: Embed on Your Website</h2>
        <p className="text-gray-300 mb-4">
          Add this single script tag to any external website. This only needs to be done once per site.
        </p>
        <div className="relative bg-gray-900 rounded-md mb-4">
            <pre className="p-4 text-green-400 font-mono text-sm overflow-x-auto" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            <code>{scriptTag}</code>
            </pre>
            <button
                onClick={copyScriptToClipboard}
                className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded-md text-xs"
            >
                {copySuccess ? 'Copied!' : 'Copy'}
            </button>
        </div>
        
        <p className="text-gray-300 mt-4">
          Now, use the <code>&lt;lb-embed&gt;</code> tag with the path you created in Step 1 to embed the content.
        </p>
        <div className="bg-gray-900 rounded-md p-4 mt-2">
            <pre className="text-green-400 font-mono text-sm">
                <code>{`<lb-embed path="/my-game"></lb-embed>`}</code>
            </pre>
        </div>
      </div>

    </div>
  );
};

export default AdminPage;
