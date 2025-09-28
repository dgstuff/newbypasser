import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMappings } from '../contexts/MappingsContext';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-xl">Loading...</span>
    </div>
);

const NotFound: React.FC<{ slug?: string }> = ({ slug }) => (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white flex-col p-4 text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
        <p className="text-lg">No mapping found for path: <code className="bg-gray-700 p-1 rounded">/{slug}</code></p>
        <a href="#/admin" className="mt-6 text-blue-400 hover:underline">Go to Admin Page to create it</a>
    </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
     <div className="flex justify-center items-center h-screen bg-gray-900 text-white flex-col p-4 text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-500">Error</h1>
        <p className="text-lg">Could not embed content.</p>
        <code className="bg-gray-700 p-2 rounded mt-2 text-sm text-red-300">{message}</code>
    </div>
);


const EmbedPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { mappings, isLoading } = useMappings();
  const [pageContent, setPageContent] = useState<string | null>(null);
  const [fetchState, setFetchState] = useState<'idle' | 'fetching' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const mapping = mappings.find(m => m.path === slug);

  useEffect(() => {
    if (isLoading || !mapping) {
      return;
    }

    const fetchContent = async () => {
      setFetchState('fetching');
      try {
        // Use the new internal serverless function as a proxy
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(mapping.targetUrl)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch content via proxy: ${response.status} ${response.statusText}. Response: ${errorText}`);
        }
        let html = await response.text();

        // Inject a <base> tag to fix relative URLs for images, scripts, etc.
        const baseTag = `<base href="${new URL(mapping.targetUrl).origin}/">`;
        if (html.includes('<head>')) {
          html = html.replace('<head>', `<head>${baseTag}`);
        } else {
          html = `${baseTag}${html}`;
        }
        
        setPageContent(html);
        setFetchState('idle');
      } catch (error) {
        console.error("Failed to fetch and embed content:", error);
        setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
        setFetchState('error');
      }
    };

    fetchContent();
  }, [mapping, isLoading]);


  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!mapping) {
    return <NotFound slug={slug} />;
  }

  if (fetchState === 'fetching' || fetchState === 'idle' && !pageContent) {
     return <LoadingSpinner />;
  }

  if (fetchState === 'error') {
    return <ErrorDisplay message={errorMessage} />
  }

  return (
    <iframe
      srcDoc={pageContent || ''}
      title={`Embedded content for ${slug}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
      }}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    />
  );
};

export default EmbedPage;
